import toast, { Toaster } from "react-hot-toast";

// Types de notifications
export type ToastType = "success" | "error" | "warning" | "info" | "loading";

// Configuration globale du toast
export const toastConfig = {
  duration: 4000,
  position: "top-right" as const,
  style: {
    background: "var(--toast-bg)",
    color: "var(--toast-color)",
    borderRadius: "0.75rem",
    padding: "1rem",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
};

// Helper pour afficher des notifications stylées
export const notify = {
  success: (message: string, options?: { duration?: number }) => {
    return toast.success(message, {
      ...toastConfig,
      icon: "✅",
      duration: options?.duration || toastConfig.duration,
    });
  },

  error: (message: string, options?: { duration?: number }) => {
    return toast.error(message, {
      ...toastConfig,
      icon: "❌",
      duration: options?.duration || 6000,
    });
  },

  warning: (message: string, options?: { duration?: number }) => {
    return toast(message, {
      ...toastConfig,
      icon: "⚠️",
      duration: options?.duration || toastConfig.duration,
    });
  },

  info: (message: string, options?: { duration?: number }) => {
    return toast(message, {
      ...toastConfig,
      icon: "ℹ️",
      duration: options?.duration || toastConfig.duration,
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      ...toastConfig,
      icon: "⏳",
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      toastConfig
    );
  },
};

// Export du composant Toaster pour l'ajouter dans App
export { Toaster };

