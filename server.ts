import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { CAREERS_DATA } from './src/data/careers.ts';
import { MASTER_SKILLS_LIST } from './src/data/skills.ts';
import { DEMO_STUDENT, COLLEGE_ADMIN_DATA } from './src/data/demoData.ts';
import { analyzeSkills } from './src/services/skillAnalysis.ts';
import { generateDeterministicRoadmap } from './src/services/roadmapGenerator.ts';

dotenv.config();

const PORT = 3000;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // ================= API ROUTES =================

  // Health check
  app.get('/api/health', (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({ status: 'ok', geminiConfigured: hasKey });
  });

  // Careers list
  app.get('/api/careers', (req, res) => {
    res.json(CAREERS_DATA);
  });

  // Career by ID with skills
  app.get('/api/careers/:id', (req, res) => {
    const career = CAREERS_DATA.find((c) => c.id === req.params.id);
    if (!career) {
      return res.status(404).json({ error: 'Career not found' });
    }
    res.json(career);
  });

  // Master skills list
  app.get('/api/skills', (req, res) => {
    res.json(MASTER_SKILLS_LIST);
  });

  // Demo student profile
  app.get('/api/demo-profile', (req, res) => {
    res.json(DEMO_STUDENT);
  });

  // College Admin view metrics
  app.get('/api/admin/metrics', (req, res) => {
    res.json(COLLEGE_ADMIN_DATA);
  });

  // Analyze skills & readiness score
  app.post('/api/analyze-skills', (req, res) => {
    try {
      const { profile } = req.body;
      if (!profile) {
        return res.status(400).json({ error: 'Profile is required' });
      }
      const result = analyzeSkills(profile);
      res.json(result);
    } catch (err: any) {
      console.error('Error analyzing skills:', err);
      res.status(500).json({ error: 'Failed to analyze skills', details: err.message });
    }
  });

  // Generate Personalized Roadmap (Gemini AI with deterministic fallback)
  app.post('/api/generate-roadmap', async (req, res) => {
    try {
      const { profile } = req.body;
      if (!profile) {
        return res.status(400).json({ error: 'Profile is required' });
      }

      const analysis = analyzeSkills(profile);
      const fallbackRoadmap = generateDeterministicRoadmap(profile, analysis);

      const ai = getGeminiClient();
      if (!ai) {
        // Return deterministic fallback smoothly
        return res.json({ ...fallbackRoadmap, isAI: false, note: 'Generated using deterministic career rules engine (Demo mode)' });
      }

      try {
        const prompt = `
You are an expert technical career mentor and curriculum engineer at SkillPath AI.
Analyze this student profile and generate a realistic, prioritized weekly learning roadmap.

Student Profile:
- Name: ${profile.fullName}
- Department: ${profile.department} (Year: ${profile.academicYear}, CGPA: ${profile.cgpa})
- Target Career: ${analysis.targetCareer.name}
- Current Career Readiness: ${analysis.careerReadinessScore}%
- Verified Completed Skills: ${analysis.matchedSkills.map((s) => s.name).join(', ') || 'None'}
- Missing Skill Gaps: ${analysis.skillGaps.map((g) => `${g.skill} (Priority: ${g.priority}, Reason: ${g.reason})`).join('; ')}
- Current Projects: ${profile.projects.join(', ') || 'None'}
- Certifications: ${profile.certifications.join(', ') || 'None'}

Target Career Description: ${analysis.targetCareer.shortDescription}

Return a structured roadmap adhering strictly to the JSON schema.
Sequence the weeks starting from the highest-priority missing skills. Provide concrete practical tasks, actionable milestones, and realistic applied projects.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are SkillPath AI, an authoritative career roadmap generator. You always return valid JSON conforming to the requested schema. Be realistic, encouraging, and academically rigorous.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: 'A 2-3 sentence personalized executive summary of the student skill gap and strategy.',
                },
                roadmap: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      weekNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      focusSkill: { type: Type.STRING },
                      objective: { type: Type.STRING },
                      tasks: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      milestone: { type: Type.STRING },
                    },
                    required: ['weekNumber', 'title', 'focusSkill', 'tasks', 'milestone'],
                  },
                },
                projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      skills: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      difficulty: { type: Type.STRING },
                      estimatedHours: { type: Type.INTEGER },
                      whyRecommended: { type: Type.STRING },
                    },
                    required: ['title', 'description', 'skills', 'difficulty'],
                  },
                },
              },
              required: ['summary', 'roadmap', 'projects'],
            },
          },
        });

        const rawText = response.text?.trim();
        if (!rawText) {
          throw new Error('Empty AI response');
        }

        const parsed = JSON.parse(rawText);

        // Merge AI generation with our typed Roadmap structure
        const aiWeeks = (parsed.roadmap || []).map((w: any, idx: number) => ({
          weekNumber: w.weekNumber || idx + 1,
          title: w.title || `Week ${idx + 1}: ${w.focusSkill || 'Skill Development'}`,
          focusSkill: w.focusSkill || 'Core Skill',
          objective: w.objective || `Master ${w.focusSkill || 'core competencies'}`,
          tasks: (w.tasks || []).map((t: string, tIdx: number) => ({
            id: `ai-t-${idx + 1}-${tIdx + 1}`,
            title: t,
            completed: false,
          })),
          milestone: w.milestone || 'Complete weekly exercises and practice projects.',
          resources: [
            { title: `${w.focusSkill} Documentation & Reference`, type: 'Documentation' as const },
            { title: `${w.focusSkill} Applied Exercises`, type: 'Practice' as const },
          ],
          isCompleted: false,
        }));

        const aiProjects = (parsed.projects || []).map((p: any, idx: number) => ({
          id: `ai-proj-${idx + 1}`,
          title: p.title,
          description: p.description,
          skills: p.skills || [],
          difficulty: p.difficulty || 'Intermediate',
          estimatedHours: p.estimatedHours || 20,
          addedToRoadmap: idx === 0,
          whyRecommended: p.whyRecommended || `Targets missing skills: ${(p.skills || []).join(', ')}`,
        }));

        return res.json({
          summary: parsed.summary || fallbackRoadmap.summary,
          weeks: aiWeeks.length > 0 ? aiWeeks : fallbackRoadmap.weeks,
          recommendedProjects: aiProjects.length > 0 ? aiProjects : fallbackRoadmap.recommendedProjects,
          generatedAt: new Date().toISOString(),
          isAI: true,
        });
      } catch (aiErr: any) {
        console.warn('Gemini API call failed, using deterministic fallback roadmap:', aiErr.message);
        return res.json({
          ...fallbackRoadmap,
          isAI: false,
          note: 'Used deterministic fallback curriculum engine',
        });
      }
    } catch (err: any) {
      console.error('Error generating roadmap:', err);
      res.status(500).json({ error: 'Failed to generate roadmap', details: err.message });
    }
  });

  // AI Career Assistant Endpoint
  app.post('/api/ai-assistant', async (req, res) => {
    try {
      const { message, profile, activeSkill } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const student = profile || DEMO_STUDENT;
      const analysis = analyzeSkills(student);
      const topGap = analysis.skillGaps[0]?.skill || 'Core Technical Foundations';
      const userQuery = message.toLowerCase();

      const ai = getGeminiClient();
      if (ai) {
        try {
          const systemPrompt = `
You are the SkillPath AI Career Assistant.
You are helping ${student.fullName}, an engineering student (${student.department}, Year ${student.academicYear}, CGPA: ${student.cgpa}).
Target Career: ${analysis.targetCareer.name}
Current Career Readiness Estimate: ${analysis.careerReadinessScore}%
Matched Verified Skills: ${analysis.matchedSkills.map((s) => s.name).join(', ') || 'None'}
Identified Skill Gaps (in priority order): ${analysis.skillGaps.map((g) => `${g.skill} (${g.priority})`).join(', ')}

IMPORTANT RULES:
1. Ground your advice strictly on ${student.fullName}'s verified skills, missing gaps, and target career.
2. Never invent student details or claim guaranteed employment.
3. Be clear, inspiring, practical, and provide concise action steps.
`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: message,
            config: {
              systemInstruction: systemPrompt,
            },
          });

          return res.json({
            reply: response.text?.trim(),
            isAI: true,
          });
        } catch (aiErr: any) {
          console.warn('Gemini assistant query failed, using smart fallback response:', aiErr.message);
        }
      }

      // Smart deterministic responses grounded in actual student state
      let reply = '';
      if (userQuery.includes('what should i learn next') || userQuery.includes('next skill') || userQuery.includes('learn next')) {
        reply = `Based on your target of becoming a **${analysis.targetCareer.name}** and your current readiness score of **${analysis.careerReadinessScore}%**, your highest-priority missing skill is **${topGap}**.\n\n**Why?** ${analysis.skillGaps[0]?.reason || 'It is an essential requirement.'}\n\nWe recommend dedicating 5–7 hours this week to complete the foundational exercises in your Career Roadmap tab.`;
      } else if (userQuery.includes('power bi') || userQuery.includes('bi important')) {
        reply = `**Power BI** is vital for the **${analysis.targetCareer.name}** role because modern enterprises require data professionals who can deliver self-serve interactive dashboards to executive teams. It allows you to transform raw SQL queries into Star Schema models and write DAX measures that track crucial business KPIs.`;
      } else if (userQuery.includes('which project') || userQuery.includes('project should i build') || userQuery.includes('project')) {
        const proj = analysis.targetCareer.typicalProjects[0];
        reply = `We recommend building **"${proj.title}"**.\n\n**Description:** ${proj.description}\n**Skills targeted:** ${proj.skills.join(', ')}\n**Estimated time:** ~${proj.estimatedHours} hours.\n\nThis will directly address your top missing gaps and serve as portfolio evidence for recruiters.`;
      } else if (userQuery.includes('improve') || userQuery.includes('profile')) {
        reply = `To improve your **${analysis.targetCareer.name}** profile:\n1. **Close High-Priority Gaps**: Focus on ${analysis.priorityGaps.map((g) => g.skill).join(' and ')}.\n2. **Publish Applied Projects**: Move beyond toy tutorials. Deploy a complete project with clean documentation.\n3. **Quantify Achievements**: On your resume, specify measurable impacts (e.g., "Cleaned 50K transactional records, reducing query latency by 35%").`;
      } else {
        reply = `Hello ${student.fullName}! As your SkillPath AI coach, I see you are aiming for **${analysis.targetCareer.name}** with a Career Readiness of **${analysis.careerReadinessScore}%**. You currently have ${analysis.matchedSkills.length} of ${analysis.targetCareer.requiredSkills.length} required competencies verified. Your most urgent missing skill to tackle next is **${topGap}**. Let me know if you need specific exercise recommendations, resource links, or project ideas!`;
      }

      return res.json({
        reply,
        isAI: false,
      });
    } catch (err: any) {
      console.error('AI assistant error:', err);
      res.status(500).json({ error: 'Failed to process assistant request' });
    }
  });

  // ================= VITE / STATIC SERVING =================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillPath AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
