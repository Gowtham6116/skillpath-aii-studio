import React from 'react';

export type NotificationType =
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'achievement';

export interface ToastAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface ToastItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // In milliseconds, default varies by type
  action?: ToastAction;
  createdAt: number;
}

export interface ConfirmationModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface CourseCompletionModalConfig {
  courseTitle: string;
  credits: number;
  certId: string;
  onViewCertificate: () => void;
  onContinueLearning?: () => void;
}

export interface NotificationContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id' | 'createdAt'>) => string;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
  // Shortcut helpers
  success: (title: string, message: string, action?: ToastAction, duration?: number) => string;
  info: (title: string, message: string, action?: ToastAction, duration?: number) => string;
  warning: (title: string, message: string, action?: ToastAction, duration?: number) => string;
  error: (title: string, message: string, action?: ToastAction, duration?: number) => string;
  achievement: (title: string, message: string, action?: ToastAction, duration?: number) => string;
  // Modal handlers
  confirm: (config: ConfirmationModalConfig) => void;
  closeConfirmation: () => void;
  showCourseCompletion: (config: CourseCompletionModalConfig) => void;
  closeCourseCompletion: () => void;
}
