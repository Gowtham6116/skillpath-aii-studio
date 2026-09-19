import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  ToastItem,
  ToastAction,
  NotificationContextType,
  ConfirmationModalConfig,
  CourseCompletionModalConfig,
} from '../types/notifications';
import { ToastContainer } from '../components/notifications/ToastContainer';
import { ConfirmationModal } from '../components/notifications/ConfirmationModal';
import { CourseCompletionModal } from '../components/notifications/CourseCompletionModal';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalConfig | null>(null);
  const [courseCompletionModal, setCourseCompletionModal] = useState<CourseCompletionModalConfig | null>(null);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id' | 'createdAt'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const newToast: ToastItem = {
        ...toast,
        id,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        // Prevent duplicate spam if exact same title and message already exists
        const exists = prev.some(
          (t) => t.title === toast.title && t.message === toast.message
        );
        if (exists) return prev;
        return [...prev, newToast];
      });

      return id;
    },
    []
  );

  const success = useCallback(
    (title: string, message: string, action?: ToastAction, duration: number = 3500) => {
      return showToast({ type: 'success', title, message, action, duration });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message: string, action?: ToastAction, duration: number = 3500) => {
      return showToast({ type: 'info', title, message, action, duration });
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, message: string, action?: ToastAction, duration: number = 4500) => {
      return showToast({ type: 'warning', title, message, action, duration });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message: string, action?: ToastAction, duration: number = 5500) => {
      return showToast({ type: 'error', title, message, action, duration });
    },
    [showToast]
  );

  const achievement = useCallback(
    (title: string, message: string, action?: ToastAction, duration: number = 6500) => {
      return showToast({ type: 'achievement', title, message, action, duration });
    },
    [showToast]
  );

  const confirm = useCallback((config: ConfirmationModalConfig) => {
    setConfirmationModal(config);
  }, []);

  const closeConfirmation = useCallback(() => {
    setConfirmationModal(null);
  }, []);

  const showCourseCompletion = useCallback((config: CourseCompletionModalConfig) => {
    setCourseCompletionModal(config);
  }, []);

  const closeCourseCompletion = useCallback(() => {
    setCourseCompletionModal(null);
  }, []);

  const value: NotificationContextType = {
    toasts,
    showToast,
    dismissToast,
    clearAllToasts,
    success,
    info,
    warning,
    error,
    achievement,
    confirm,
    closeConfirmation,
    showCourseCompletion,
    closeCourseCompletion,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Global Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Confirmation Modal */}
      <ConfirmationModal
        config={confirmationModal}
        onClose={closeConfirmation}
      />

      {/* Course Completion Achievement Modal */}
      <CourseCompletionModal
        config={courseCompletionModal}
        onClose={closeCourseCompletion}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
