import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Circle,
  Briefcase,
  Layers,
  ArrowRight,
  Filter,
  Search,
  Eye,
  Info,
  X,
  Compass,
  Link2,
} from 'lucide-react';
import {
  buildGraphElements,
  GraphNodeData,
  GraphLinkData,
  SKILL_DEPENDENCIES,
} from '../data/skillGraphData';
import { CAREERS_DATA } from '../data/careers';
import { CareerRequirement, SkillStatus, StudentProfile } from '../types';

interface SkillForceGraphProps {
  profile: StudentProfile;
  activeCareer: CareerRequirement;
  onToggleSkillStatus: (skillName: string, newStatus: SkillStatus) => void;
  onSelectCareer?: (careerId: string) => void;
}

interface SimNode extends d3.SimulationNodeDatum, GraphNodeData {
  radius: number;
  status: SkillStatus | 'Career';
  isRequiredForTarget: boolean;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  type: 'prerequisite' | 'career-pathway';
  label?: string;
}

interface HoverTooltipState {
  node: SimNode;
  x: number;
  y: number;
  incomingPrereqs: number;
  outgoingUnlocks: number;
  connectedCareers: number;
  relationToSelected?: 'selected' | 'prereq' | 'unlock' | 'career' | 'none';
}

export const SkillForceGraph: React.FC<SkillForceGraphProps> = ({
  profile,
  activeCareer,
  onToggleSkillStatus,
  onSelectCareer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // References to active D3 selections for dynamic smooth transitions
  const nodeContentSelectionRef = useRef<d3.Selection<SVGGElement, SimNode, SVGGElement, unknown> | null>(null);
  const linkSelectionRef = useRef<d3.Selection<SVGLineElement, SimLink, SVGGElement, unknown> | null>(null);
  const currentLinksRef = useRef<SimLink[]>([]);
  const selectedNodeRef = useRef<SimNode | null>(null);

  // User Interactive Filters
  const [selectedPathway, setSelectedPathway] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'completed' | 'learning' | 'gaps'>('all');
  const [showCareerLinks, setShowCareerLinks] = useState<boolean>(true);
  const [showPrereqLinks, setShowPrereqLinks] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<SimNode | null>(null);
  const [hoveredTooltip, setHoveredTooltip] = useState<HoverTooltipState | null>(null);

  // Keep selectedNodeRef in sync
  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  // Status mapping from student profile
  const studentSkillMap = useMemo(() => {
    const map = new Map<string, SkillStatus>();
    profile.skills.forEach((s) => {
      map.set(s.name.toLowerCase().trim(), s.status);
    });
    return map;
  }, [profile.skills]);

  // Target career required skill names set
  const requiredSkillNames = useMemo(() => {
    return new Set(activeCareer.requiredSkills.map((r) => r.name.toLowerCase().trim()));
  }, [activeCareer]);

  // Raw graph elements
  const { rawNodes, rawLinks } = useMemo(() => {
    const data = buildGraphElements();
    return { rawNodes: data.nodes, rawLinks: data.links };
  }, []);

  // Filtered nodes and links based on UI controls
  const { graphNodes, graphLinks } = useMemo(() => {
    let filteredNodes = rawNodes.map((node) => {
      const isCareer = node.type === 'career';
      const nodeStatus: SkillStatus | 'Career' = isCareer
        ? 'Career'
        : studentSkillMap.get(node.id) || 'Not Started';
      const isReq = !isCareer && requiredSkillNames.has(node.id);

      const radius = isCareer ? 26 : isReq ? 18 : 15;

      return {
        ...node,
        radius,
        status: nodeStatus,
        isRequiredForTarget: isReq,
      } as SimNode;
    });

    // Filter by Career Pathway if selected
    if (selectedPathway !== 'all') {
      const targetCareerObj = CAREERS_DATA.find((c) => c.id === selectedPathway);
      if (targetCareerObj) {
        const careerReqSkills = new Set(targetCareerObj.requiredSkills.map((s) => s.name.toLowerCase().trim()));
        const relevantSkillIds = new Set<string>(careerReqSkills);
        SKILL_DEPENDENCIES.forEach((dep) => {
          if (relevantSkillIds.has(dep.unlocks.toLowerCase().trim())) {
            relevantSkillIds.add(dep.prerequisite.toLowerCase().trim());
          }
        });

        filteredNodes = filteredNodes.filter(
          (n) => n.id === `career-${selectedPathway}` || relevantSkillIds.has(n.id)
        );
      }
    }

    // Filter by Status if chosen
    if (selectedStatusFilter !== 'all') {
      filteredNodes = filteredNodes.filter((n) => {
        if (n.type === 'career') return true;
        if (selectedStatusFilter === 'completed') return n.status === 'Completed';
        if (selectedStatusFilter === 'learning') return n.status === 'Learning';
        if (selectedStatusFilter === 'gaps') return n.status === 'Not Started';
        return true;
      });
    }

    // Filter links: only keep links whose source and target exist in filteredNodes
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredLinks = rawLinks
      .filter((l) => {
        if (l.type === 'career-pathway' && !showCareerLinks) return false;
        if (l.type === 'prerequisite' && !showPrereqLinks) return false;
        return nodeIds.has(l.source) && nodeIds.has(l.target);
      })
      .map((l) => ({
        source: l.source,
        target: l.target,
        type: l.type,
        label: l.label,
      })) as SimLink[];

    return { graphNodes: filteredNodes, graphLinks: filteredLinks };
  }, [
    rawNodes,
    rawLinks,
    studentSkillMap,
    requiredSkillNames,
    selectedPathway,
    selectedStatusFilter,
    showCareerLinks,
    showPrereqLinks,
  ]);

  // Keep selected node updated if status changes in parent
  useEffect(() => {
    if (selectedNode && selectedNode.type === 'skill') {
      const currentStatus = studentSkillMap.get(selectedNode.id) || 'Not Started';
      if (selectedNode.status !== currentStatus) {
        setSelectedNode((prev) => (prev ? { ...prev, status: currentStatus } : null));
      }
    }
  }, [studentSkillMap, selectedNode]);

  // Helper to compute incoming prerequisites, outgoing unlocks, and career links for any node
  const getNeighborSets = useCallback((nodeId: string, links: SimLink[]) => {
    const incomingPrereqIds = new Set<string>();
    const outgoingUnlockIds = new Set<string>();
    const careerLinkIds = new Set<string>();

    links.forEach((l) => {
      const sId = typeof l.source === 'object' ? (l.source as SimNode).id : String(l.source);
      const tId = typeof l.target === 'object' ? (l.target as SimNode).id : String(l.target);

      if (l.type === 'prerequisite') {
        if (tId === nodeId) incomingPrereqIds.add(sId);
        if (sId === nodeId) outgoingUnlockIds.add(tId);
      } else if (l.type === 'career-pathway') {
        if (sId === nodeId) careerLinkIds.add(tId);
        if (tId === nodeId) careerLinkIds.add(sId);
      }
    });

    const allNeighborIds = new Set<string>([
      nodeId,
      ...incomingPrereqIds,
      ...outgoingUnlockIds,
      ...careerLinkIds,
    ]);

    return {
      incomingPrereqIds,
      outgoingUnlockIds,
      careerLinkIds,
      allNeighborIds,
    };
  }, []);

  // Smooth visual transition applicator for selection & hover
  const applyVisualHighlight = useCallback((activeNodeId: string | null, isHoverOnly = false) => {
    const nodeContentSel = nodeContentSelectionRef.current;
    const linkSel = linkSelectionRef.current;
    const links = currentLinksRef.current;

    if (!nodeContentSel || !linkSel) return;

    const duration = isHoverOnly ? 200 : 320;
    const ease = d3.easeCubicOut;

    if (!activeNodeId) {
      // RESET ALL NODES & LINKS SMOOTHLY
      nodeContentSel
        .transition()
        .duration(duration)
        .ease(ease)
        .attr('transform', 'scale(1)')
        .attr('opacity', 1);

      nodeContentSel.selectAll('.node-main-circle')
        .transition()
        .duration(duration)
        .ease(ease)
        .attr('stroke-width', (d: any) => (d.type === 'career' ? 3 : 2))
        .attr('stroke', (d: any) => {
          if (d.type === 'career') return '#3730a3';
          if (d.status === 'Completed') return '#059669';
          if (d.status === 'Learning') return '#d97706';
          return '#94a3b8';
        });

      nodeContentSel.selectAll('.selection-halo-ring')
        .transition()
        .duration(duration)
        .ease(ease)
        .attr('opacity', 0)
        .attr('r', (d: any) => d.radius + 6);

      nodeContentSel.selectAll('.neighbor-tag-badge')
        .transition()
        .duration(duration)
        .ease(ease)
        .attr('opacity', 0);

      linkSel
        .transition()
        .duration(duration)
        .ease(ease)
        .attr('stroke', (d) => (d.type === 'prerequisite' ? '#818cf8' : '#cbd5e1'))
        .attr('stroke-width', (d) => (d.type === 'prerequisite' ? 1.8 : 1.2))
        .attr('stroke-opacity', (d) => (d.type === 'prerequisite' ? 0.8 : 0.6));

      return;
    }

    // ACTIVE HIGHLIGHT FOR SPECIFIED NODE & ITS NEIGHBORS
    const { incomingPrereqIds, outgoingUnlockIds, careerLinkIds, allNeighborIds } = getNeighborSets(
      activeNodeId,
      links
    );

    // Transition Nodes
    nodeContentSel
      .transition()
      .duration(duration)
      .ease(ease)
      .attr('transform', (d) => {
        if (d.id === activeNodeId) return 'scale(1.22)';
        if (allNeighborIds.has(d.id)) return 'scale(1.08)';
        return 'scale(0.92)';
      })
      .attr('opacity', (d) => (allNeighborIds.has(d.id) ? 1 : 0.16));

    // Update Node Circle Borders
    nodeContentSel.selectAll('.node-main-circle')
      .transition()
      .duration(duration)
      .ease(ease)
      .attr('stroke-width', (d: any) => {
        if (d.id === activeNodeId) return 4;
        if (allNeighborIds.has(d.id)) return 3.5;
        return 1.5;
      })
      .attr('stroke', (d: any) => {
        if (d.id === activeNodeId) return '#6366f1';
        if (incomingPrereqIds.has(d.id)) return '#38bdf8'; // Sky blue for prerequisites
        if (outgoingUnlockIds.has(d.id)) return '#10b981'; // Emerald for unlocked skills
        if (careerLinkIds.has(d.id)) return '#c084fc'; // Purple for career hubs
        return '#64748b';
      });

    // Update Pulsing Selection Halo on Center Node
    nodeContentSel.selectAll('.selection-halo-ring')
      .transition()
      .duration(duration)
      .ease(ease)
      .attr('opacity', (d: any) => (d.id === activeNodeId ? 0.9 : 0))
      .attr('r', (d: any) => (d.id === activeNodeId ? d.radius + 9 : d.radius + 6));

    // Show Neighbor Tag Badges ("PREREQ" / "UNLOCKS")
    nodeContentSel.selectAll('.neighbor-tag-badge')
      .transition()
      .duration(duration)
      .ease(ease)
      .attr('opacity', (d: any) => {
        if (incomingPrereqIds.has(d.id) || outgoingUnlockIds.has(d.id)) return 1;
        return 0;
      });

    // Update Tag Badge text and colors
    nodeContentSel.selectAll('.neighbor-tag-rect')
      .attr('fill', (d: any) => (incomingPrereqIds.has(d.id) ? '#0284c7' : '#059669'));

    nodeContentSel.selectAll('.neighbor-tag-text')
      .text((d: any) => (incomingPrereqIds.has(d.id) ? 'PREREQ' : 'UNLOCKS'));

    // Transition Links
    linkSel
      .transition()
      .duration(duration)
      .ease(ease)
      .attr('stroke', (l) => {
        const sId = typeof l.source === 'object' ? (l.source as SimNode).id : String(l.source);
        const tId = typeof l.target === 'object' ? (l.target as SimNode).id : String(l.target);

        if (l.type === 'prerequisite') {
          if (tId === activeNodeId) return '#38bdf8'; // Prerequisite pointing into active
          if (sId === activeNodeId) return '#10b981'; // Active unlocking target
        } else if (l.type === 'career-pathway') {
          if (sId === activeNodeId || tId === activeNodeId) return '#c084fc'; // Connected career
        }
        return '#cbd5e1';
      })
      .attr('stroke-width', (l) => {
        const sId = typeof l.source === 'object' ? (l.source as SimNode).id : String(l.source);
        const tId = typeof l.target === 'object' ? (l.target as SimNode).id : String(l.target);
        return sId === activeNodeId || tId === activeNodeId ? 3.2 : 1;
      })
      .attr('stroke-opacity', (l) => {
        const sId = typeof l.source === 'object' ? (l.source as SimNode).id : String(l.source);
        const tId = typeof l.target === 'object' ? (l.target as SimNode).id : String(l.target);
        return sId === activeNodeId || tId === activeNodeId ? 1 : 0.05;
      });
  }, [getNeighborSets]);

  // Trigger smooth visual transition whenever selectedNode changes in state
  useEffect(() => {
    applyVisualHighlight(selectedNode ? selectedNode.id : null);
  }, [selectedNode, applyVisualHighlight]);

  // Render & Update D3 Force Simulation
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth || 900;
    const height = Math.max(520, window.innerHeight * 0.62);

    svg.attr('width', width).attr('height', height).attr('viewBox', [0, 0, width, height]);

    // Clear previous elements
    svg.selectAll('*').remove();

    // Create defs for markers and filters
    const defs = svg.append('defs');

    // Add inline CSS animation for pulse effects
    defs.append('style').text(`
      @keyframes pulse-ring {
        0% { transform: scale(0.96); opacity: 0.85; }
        50% { transform: scale(1.18); opacity: 0.25; }
        100% { transform: scale(0.96); opacity: 0.85; }
      }
      .pulse-halo-anim {
        transform-box: fill-box;
        transform-origin: center;
        animation: pulse-ring 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    `);

    // Arrow marker for prerequisite links
    defs
      .append('marker')
      .attr('id', 'arrow-prereq')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L10,0L0,4')
      .attr('fill', '#6366f1');

    // Arrow marker for career pathway links
    defs
      .append('marker')
      .attr('id', 'arrow-pathway')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L10,0L0,4')
      .attr('fill', '#94a3b8');

    // Subtle drop shadow filter for nodes
    const filter = defs
      .append('filter')
      .attr('id', 'node-shadow')
      .attr('height', '130%');
    filter
      .append('feDropShadow')
      .attr('dx', '0')
      .attr('dy', '2')
      .attr('stdDeviation', '3')
      .attr('flood-color', '#0f172a')
      .attr('flood-opacity', '0.08');

    // Background rect for click-to-deselect & zoom dragging
    const g = svg.append('g').attr('class', 'graph-main-group');

    // Setup Zoom Behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.35, 2.8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Deselect on empty canvas click
    svg.on('click', (event) => {
      const target = event.target as Element | null;
      if (target && (target.tagName === 'svg' || target.classList?.contains('canvas-backdrop'))) {
        setSelectedNode(null);
      }
    });

    // Deep clone nodes and links for D3 mutation
    const nodes: SimNode[] = graphNodes.map((d) => ({ ...d }));
    const links: SimLink[] = graphLinks.map((d) => ({ ...d }));
    currentLinksRef.current = links;

    // Create D3 Force Simulation
    const simulation = d3
      .forceSimulation<SimNode, SimLink>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance((d) => (d.type === 'career-pathway' ? 95 : 75))
          .strength((d) => (d.type === 'career-pathway' ? 0.35 : 0.6))
      )
      .force('charge', d3.forceManyBody().strength(-240))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collide',
        d3.forceCollide<SimNode>().radius((d) => d.radius + 14).iterations(2)
      )
      .alphaDecay(0.028);

    simulationRef.current = simulation;

    // Render Links Group
    const linkGroup = g.append('g').attr('class', 'links');
    const linkElements = linkGroup
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'graph-link')
      .attr('stroke', (d) => (d.type === 'prerequisite' ? '#818cf8' : '#cbd5e1'))
      .attr('stroke-width', (d) => (d.type === 'prerequisite' ? 1.8 : 1.2))
      .attr('stroke-dasharray', (d) => (d.type === 'career-pathway' ? '4,3' : 'none'))
      .attr('stroke-opacity', (d) => (d.type === 'prerequisite' ? 0.8 : 0.6))
      .attr('marker-end', (d) => (d.type === 'prerequisite' ? 'url(#arrow-prereq)' : 'url(#arrow-pathway)'));

    linkSelectionRef.current = linkElements;

    // Render Nodes Group
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeElements = nodeGroup
      .selectAll('g.node-item')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-item')
      .attr('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, SimNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Inner content group for clean scaling without conflicting with translation
    const nodeContent = nodeElements
      .append('g')
      .attr('class', 'node-content')
      .attr('transform', 'scale(1)');

    nodeContentSelectionRef.current = nodeContent;

    // Selection Pulsing Halo Ring (shown when node is selected)
    nodeContent
      .append('circle')
      .attr('class', 'selection-halo-ring pulse-halo-anim')
      .attr('r', (d) => d.radius + 8)
      .attr('fill', 'none')
      .attr('stroke', '#818cf8')
      .attr('stroke-width', 3)
      .attr('opacity', 0);

    // Target career goal dashed ring
    nodeContent
      .filter((d) => d.isRequiredForTarget)
      .append('circle')
      .attr('class', 'target-goal-ring')
      .attr('r', (d) => d.radius + 5)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,2')
      .attr('stroke-opacity', 0.85);

    // Main circle for each node
    nodeContent
      .append('circle')
      .attr('class', 'node-main-circle')
      .attr('r', (d) => d.radius)
      .attr('filter', 'url(#node-shadow)')
      .attr('fill', (d) => {
        if (d.type === 'career') return '#4f46e5'; // Deep Indigo
        if (d.status === 'Completed') return '#10b981'; // Emerald
        if (d.status === 'Learning') return '#f59e0b'; // Amber
        return '#f1f5f9'; // Clean Slate
      })
      .attr('stroke', (d) => {
        if (d.type === 'career') return '#3730a3';
        if (d.status === 'Completed') return '#059669';
        if (d.status === 'Learning') return '#d97706';
        return '#94a3b8';
      })
      .attr('stroke-width', (d) => (d.type === 'career' ? 3 : 2));

    // Glyphs / Icons inside node circles
    nodeContent.each(function (d) {
      const el = d3.select(this);
      if (d.type === 'career') {
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', '#ffffff')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .text('★');
      } else if (d.status === 'Completed') {
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', '#ffffff')
          .attr('font-size', '11px')
          .attr('font-weight', 'bold')
          .text('✓');
      } else if (d.status === 'Learning') {
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', '#ffffff')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .text('⋯');
      }
    });

    // Neighbor Tag Badge Pill (displays "PREREQ" or "UNLOCKS" when neighbor of selected)
    const neighborBadge = nodeContent
      .append('g')
      .attr('class', 'neighbor-tag-badge')
      .attr('transform', (d) => `translate(0, ${-d.radius - 8})`)
      .attr('opacity', 0);

    neighborBadge
      .append('rect')
      .attr('class', 'neighbor-tag-rect')
      .attr('x', -24)
      .attr('y', -7)
      .attr('width', 48)
      .attr('height', 14)
      .attr('rx', 7)
      .attr('fill', '#0284c7');

    neighborBadge
      .append('text')
      .attr('class', 'neighbor-tag-text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#ffffff')
      .attr('font-size', '8px')
      .attr('font-weight', '800')
      .text('PREREQ');

    // Text Labels below nodes
    nodeContent
      .append('text')
      .attr('class', 'node-text-label')
      .attr('dy', (d) => d.radius + 13)
      .attr('text-anchor', 'middle')
      .attr('font-size', (d) => (d.type === 'career' ? '12px' : '10.5px'))
      .attr('font-weight', (d) => (d.type === 'career' ? '700' : '600'))
      .attr('fill', (d) => (d.type === 'career' ? '#312e81' : '#1e293b'))
      .text((d) => d.name)
      .clone(true)
      .lower()
      .attr('fill', 'none')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round');

    // Click handler for node selection
    nodeElements.on('click', (event, d) => {
      event.stopPropagation();
      setSelectedNode(d);
    });

    // Interactive Hover Handlers with Smooth Transitions & Dynamic Tooltip
    nodeElements
      .on('mouseenter', (event, hovered) => {
        // Compute tooltip metrics
        const neighborSets = getNeighborSets(hovered.id, links);
        const containerRect = container.getBoundingClientRect();
        const mouseX = event.clientX - containerRect.left;
        const mouseY = event.clientY - containerRect.top;

        let relation: 'selected' | 'prereq' | 'unlock' | 'career' | 'none' = 'none';
        const currentSel = selectedNodeRef.current;
        if (currentSel) {
          if (hovered.id === currentSel.id) {
            relation = 'selected';
          } else {
            const selNeighbors = getNeighborSets(currentSel.id, links);
            if (selNeighbors.incomingPrereqIds.has(hovered.id)) relation = 'prereq';
            else if (selNeighbors.outgoingUnlockIds.has(hovered.id)) relation = 'unlock';
            else if (selNeighbors.careerLinkIds.has(hovered.id)) relation = 'career';
          }
        }

        setHoveredTooltip({
          node: hovered,
          x: mouseX,
          y: mouseY,
          incomingPrereqs: neighborSets.incomingPrereqIds.size,
          outgoingUnlocks: neighborSets.outgoingUnlockIds.size,
          connectedCareers: neighborSets.careerLinkIds.size,
          relationToSelected: relation,
        });

        // If no node is permanently selected, preview hover highlight smoothly
        if (!selectedNodeRef.current) {
          applyVisualHighlight(hovered.id, true);
        }
      })
      .on('mousemove', (event) => {
        const containerRect = container.getBoundingClientRect();
        const mouseX = event.clientX - containerRect.left;
        const mouseY = event.clientY - containerRect.top;
        setHoveredTooltip((prev) => (prev ? { ...prev, x: mouseX, y: mouseY } : null));
      })
      .on('mouseleave', () => {
        setHoveredTooltip(null);
        // Restore active selection highlight, or full reset if nothing selected
        const currentSel = selectedNodeRef.current;
        applyVisualHighlight(currentSel ? currentSel.id : null, true);
      });

    // Tick function to update coordinates
    simulation.on('tick', () => {
      linkElements
        .attr('x1', (d) => (d.source as SimNode).x || 0)
        .attr('y1', (d) => (d.source as SimNode).y || 0)
        .attr('x2', (d) => (d.target as SimNode).x || 0)
        .attr('y2', (d) => (d.target as SimNode).y || 0);

      nodeElements.attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // If a node was already selected, reapply visual highlight
    if (selectedNodeRef.current) {
      applyVisualHighlight(selectedNodeRef.current.id);
    }

    return () => {
      simulation.stop();
    };
  }, [graphNodes, graphLinks, getNeighborSets, applyVisualHighlight]);

  // Zoom control handlers
  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, 0.77);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(350).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  // Center on a searched or clicked node
  const handleSearchSelect = (skillId: string) => {
    const found = graphNodes.find(
      (n) => n.id === skillId.toLowerCase().trim() || n.name.toLowerCase() === skillId.toLowerCase().trim()
    );
    if (found) {
      setSelectedNode(found);
      if (svgRef.current && zoomBehaviorRef.current) {
        const svg = d3.select(svgRef.current);
        const container = containerRef.current;
        const width = container?.clientWidth || 900;
        const height = 520;
        const x = (found as any).x || width / 2;
        const y = (found as any).y || height / 2;
        svg
          .transition()
          .duration(500)
          .call(
            zoomBehaviorRef.current.transform,
            d3.zoomIdentity.translate(width / 2 - x * 1.5, height / 2 - y * 1.5).scale(1.5)
          );
      }
    }
  };

  // Compute prerequisites and unlocks for the selected node
  const selectedDetails = useMemo(() => {
    if (!selectedNode) return null;

    if (selectedNode.type === 'career') {
      const careerObj = CAREERS_DATA.find((c) => c.id === selectedNode.careerId);
      if (!careerObj) return null;

      let matchedCount = 0;
      careerObj.requiredSkills.forEach((req) => {
        if (studentSkillMap.get(req.name.toLowerCase().trim()) === 'Completed') {
          matchedCount++;
        }
      });
      const matchPercent = Math.round((matchedCount / careerObj.requiredSkills.length) * 100);

      return {
        isCareer: true,
        career: careerObj,
        matchedCount,
        totalRequired: careerObj.requiredSkills.length,
        matchPercent,
      };
    }

    // It's a skill
    const skillId = selectedNode.id;
    const prerequisites = SKILL_DEPENDENCIES.filter((d) => d.unlocks.toLowerCase().trim() === skillId).map(
      (d) => ({ name: d.prerequisite, reason: d.reason })
    );

    const unlocks = SKILL_DEPENDENCIES.filter((d) => d.prerequisite.toLowerCase().trim() === skillId).map(
      (d) => ({ name: d.unlocks, reason: d.reason })
    );

    const neededByCareers = CAREERS_DATA.filter((c) =>
      c.requiredSkills.some((s) => s.name.toLowerCase().trim() === skillId)
    );

    return {
      isCareer: false,
      prerequisites,
      unlocks,
      neededByCareers,
    };
  }, [selectedNode, studentSkillMap]);

  return (
    <div className="space-y-4">
      {/* Interactive Controls & Filters Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Pathway Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              Pathway:
            </span>
            <select
              value={selectedPathway}
              onChange={(e) => setSelectedPathway(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Career Pathways</option>
              {CAREERS_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              Status:
            </span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Skills</option>
              <option value="completed">✓ Completed Only</option>
              <option value="learning">⋯ In Progress Only</option>
              <option value="gaps">Gaps / Not Started</option>
            </select>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Find skill node (e.g. SQL)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim().length > 1) {
                  handleSearchSelect(e.target.value.trim());
                }
              }}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 w-44 focus:w-56 transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Link visibility toggles & Zoom Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrereqLinks(!showPrereqLinks)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
              showPrereqLinks
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
            title="Toggle prerequisite dependency arrows"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Prerequisites</span>
          </button>

          <button
            onClick={() => setShowCareerLinks(!showCareerLinks)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
              showCareerLinks
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
            title="Toggle career pathway connection lines"
          >
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Careers</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 mx-1" />

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas & Inspector View */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Force Directed Graph Canvas */}
        <div
          ref={containerRef}
          className={`relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-sm transition-all ${
            selectedNode ? 'lg:col-span-8' : 'lg:col-span-12'
          }`}
          style={{ minHeight: '540px' }}
        >
          {/* Subtle Grid Backdrop */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 canvas-backdrop"
            style={{
              backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Canvas HUD Legend */}
          <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-2 text-[11px] bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-slate-300 pointer-events-none">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-indigo-600 border border-indigo-400" /> Career Hub
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> In Progress
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Not Started
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-sky-400 inline-block" /> Prereq Flow
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Unlocks
            </span>
          </div>

          {/* Active Selection HUD Banner with quick Clear */}
          {selectedNode && (
            <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2 bg-indigo-950/90 border border-indigo-500/50 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs text-indigo-100 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>
                Inspecting Neighbors for: <strong className="text-white font-bold">{selectedNode.name}</strong>
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="ml-1 p-1 hover:bg-indigo-850 rounded-lg text-indigo-300 hover:text-white transition cursor-pointer"
                title="Clear selection and reset graph focus"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Helper Hint */}
          <div className="absolute bottom-3 left-3.5 z-10 text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 pointer-events-none">
            💡 Hover to preview • Click node to highlight all prerequisites & unlocked skills • Drag to rearrange
          </div>

          {/* D3 SVG Canvas */}
          <svg ref={svgRef} className="w-full h-full block" />

          {/* Dynamic Interactive Hover Tooltip */}
          {hoveredTooltip && (
            <div
              className="absolute z-30 pointer-events-none transition-all duration-75 ease-out shadow-xl rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/90 p-3.5 text-white max-w-xs space-y-2 animate-in fade-in zoom-in-95 duration-150"
              style={{
                left: `${Math.min(hoveredTooltip.x + 16, (containerRef.current?.clientWidth || 700) - 270)}px`,
                top: `${Math.max(16, hoveredTooltip.y - 50)}px`,
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  {hoveredTooltip.node.type === 'career'
                    ? 'Career Hub'
                    : hoveredTooltip.node.category || 'Skill Competency'}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    hoveredTooltip.node.type === 'career'
                      ? 'bg-indigo-900/80 text-indigo-300'
                      : hoveredTooltip.node.status === 'Completed'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : hoveredTooltip.node.status === 'Learning'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {hoveredTooltip.node.status}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  {hoveredTooltip.node.name}
                  {hoveredTooltip.node.isRequiredForTarget && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-indigo-600 text-white font-bold">
                      TARGET
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                  {hoveredTooltip.node.description || 'Core technical capability.'}
                </p>
              </div>

              {/* Relationship to currently selected node */}
              {hoveredTooltip.relationToSelected && hoveredTooltip.relationToSelected !== 'none' && (
                <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 text-[10px] font-semibold text-indigo-200 flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-indigo-400" />
                  {hoveredTooltip.relationToSelected === 'selected' && <span>Currently Selected Node</span>}
                  {hoveredTooltip.relationToSelected === 'prereq' && (
                    <span className="text-sky-300">Prerequisite for {selectedNode?.name}</span>
                  )}
                  {hoveredTooltip.relationToSelected === 'unlock' && (
                    <span className="text-emerald-300">Unlocked once you finish {selectedNode?.name}</span>
                  )}
                  {hoveredTooltip.relationToSelected === 'career' && (
                    <span className="text-purple-300">Career goal requiring this skill</span>
                  )}
                </div>
              )}

              {/* Counts Breakdown */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-[10px]">
                <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60">
                  <span className="text-sky-400 font-bold block">{hoveredTooltip.incomingPrereqs}</span>
                  <span className="text-slate-400 text-[9px]">Prereqs</span>
                </div>
                <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60">
                  <span className="text-emerald-400 font-bold block">{hoveredTooltip.outgoingUnlocks}</span>
                  <span className="text-slate-400 text-[9px]">Unlocks</span>
                </div>
                <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60">
                  <span className="text-purple-400 font-bold block">{hoveredTooltip.connectedCareers}</span>
                  <span className="text-slate-400 text-[9px]">Careers</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Node Detail Inspector Drawer */}
        {selectedNode && selectedDetails && (
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4 flex flex-col justify-between animate-in fade-in slide-in-from-right-3 duration-300">
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        selectedNode.type === 'career'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {selectedNode.type === 'career' ? 'Career Pathway Hub' : selectedNode.category || 'Skill Node'}
                    </span>
                    {selectedNode.isRequiredForTarget && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold">
                        Target Goal
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedNode.name}</h3>
                </div>

                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  title="Close Inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status / Quick Action for Skill */}
              {selectedNode.type === 'skill' && (
                <div className="my-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">Your Status:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${
                        selectedNode.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedNode.status === 'Learning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {selectedNode.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                      {selectedNode.status === 'Learning' && <Clock className="w-3 h-3" />}
                      {selectedNode.status === 'Not Started' && <Circle className="w-3 h-3" />}
                      {selectedNode.status}
                    </span>
                  </div>

                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={() => onToggleSkillStatus(selectedNode.name, 'Completed')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        selectedNode.status === 'Completed'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 hover:bg-emerald-50 text-slate-700'
                      }`}
                    >
                      ✓ Completed
                    </button>
                    <button
                      onClick={() => onToggleSkillStatus(selectedNode.name, 'Learning')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        selectedNode.status === 'Learning'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 hover:bg-amber-50 text-slate-700'
                      }`}
                    >
                      ⋯ Learning
                    </button>
                    <button
                      onClick={() => onToggleSkillStatus(selectedNode.name, 'Not Started')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        selectedNode.status === 'Not Started'
                          ? 'bg-slate-700 text-white shadow-xs'
                          : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed my-3">
                {selectedNode.description || 'Core technical foundation.'}
              </p>

              {/* Career Specific Details */}
              {selectedDetails.isCareer && selectedDetails.career && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 block font-semibold">Average Salary</span>
                      <strong className="text-slate-800 text-xs">{selectedDetails.career.averageSalaryRange}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] text-slate-400 block font-semibold">Hiring Demand</span>
                      <strong className="text-emerald-700 text-xs">{selectedDetails.career.jobDemand}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <div className="flex items-center justify-between font-bold text-indigo-900 mb-1">
                      <span>Your Career Match</span>
                      <span>{selectedDetails.matchPercent}%</span>
                    </div>
                    <p className="text-[11px] text-indigo-700">
                      You have verified {selectedDetails.matchedCount} of {selectedDetails.totalRequired} required skills for this role.
                    </p>
                  </div>

                  {onSelectCareer && selectedNode.careerId && activeCareer.id !== selectedNode.careerId && (
                    <button
                      onClick={() => onSelectCareer(selectedNode.careerId!)}
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Set as My Target Career</span>
                    </button>
                  )}
                </div>
              )}

              {/* Skill Prerequisites & Unlocks */}
              {!selectedDetails.isCareer && (
                <div className="space-y-3 pt-2 text-xs">
                  {/* Prerequisites */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-sky-500" />
                        Prerequisites (Learn First):
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {selectedDetails.prerequisites?.length || 0} skills
                      </span>
                    </div>

                    {selectedDetails.prerequisites && selectedDetails.prerequisites.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDetails.prerequisites.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSearchSelect(p.name)}
                            className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold border border-sky-200 text-[11px] flex items-center gap-1 transition cursor-pointer"
                            title={`Focus prerequisite: ${p.name}`}
                          >
                            <span>{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-sky-400" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-[11px]">No formal prerequisites. Great entry foundation!</p>
                    )}
                  </div>

                  {/* Unlocks */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Unlocks Capabilities:
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {selectedDetails.unlocks?.length || 0} skills
                      </span>
                    </div>

                    {selectedDetails.unlocks && selectedDetails.unlocks.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDetails.unlocks.map((u, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSearchSelect(u.name)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 text-[11px] flex items-center gap-1 transition cursor-pointer"
                            title={`Focus unlocked skill: ${u.name}`}
                          >
                            <span>{u.name}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-[11px]">Advanced capstone skill.</p>
                    )}
                  </div>

                  {/* Careers Requiring This */}
                  <div>
                    <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                      Target Pathways:
                    </span>
                    {selectedDetails.neededByCareers && selectedDetails.neededByCareers.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedDetails.neededByCareers.map((c) => (
                          <span
                            key={c.id}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                              c.id === activeCareer.id
                                ? 'bg-indigo-600 text-white border-indigo-700'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>SKILLGAP COMPASS Graph Engine</span>
              <span>Smooth D3 Transitions</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
