"use client";

import { createContext, useCallback, useContext, useState, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type ToastType = "info" | "success" | "error" | "processing";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  /** Auto-dismiss delay in ms. 0 = persistent (must dismiss manually). */
  duration: number;
  /** Whether the toast is currently exiting (for fade-out animation). */
  exiting: boolean;
}

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  show: (message: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  update: (id: string, message: string, options?: ToastOptions) => void;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="toast-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4" />
      <path d="M12 18v4" opacity="0.3" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" opacity="0.3" />
      <path d="M2 12h4" />
      <path d="M18 12h4" opacity="0.3" />
      <path d="M4.93 19.07l2.83-2.83" opacity="0.5" />
      <path d="M16.24 7.76l2.83-2.83" opacity="0.5" />
    </svg>
  );
}

const iconMap: Record<ToastType, React.ReactNode> = {
  info: <IconInfo />,
  success: <IconCheck />,
  error: <IconAlert />,
  processing: <Spinner />,
};

const colorMap: Record<ToastType, string> = {
  info: "var(--color-accent-light)",
  success: "var(--color-positive)",
  error: "var(--color-negative)",
  processing: "var(--color-accent-light)",
};

/* ------------------------------------------------------------------ */
/*  Single toast item                                                  */
/* ------------------------------------------------------------------ */
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  return (
    <div
      className={`toast-item ${toast.exiting ? "toast-exit" : "toast-enter"}`}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="toast-icon" style={{ color: colorMap[toast.type] }}>
        {iconMap[toast.type]}
      </div>

      {/* Message */}
      <span className="toast-message">{toast.message}</span>

      {/* Dismiss button (only for persistent / processing toasts, and non-auto) */}
      {toast.duration === 0 && (
        <button
          className="toast-close"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */
let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));

    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);

    // Clear any existing timer
    const existing = timersRef.current.get(id);
    if (existing) {
      clearTimeout(existing);
      timersRef.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message: string, options?: ToastOptions): string => {
      const id = `toast-${++idCounter}`;
      const type = options?.type ?? "info";
      const duration = options?.duration ?? (type === "processing" ? 0 : 4000);

      const toast: Toast = { id, type, message, duration, exiting: false };
      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss],
  );

  const update = useCallback(
    (id: string, message: string, options?: ToastOptions) => {
      setToasts((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const type = options?.type ?? t.type;
          const duration = options?.duration ?? (type === "processing" ? 0 : 4000);

          // If switching from persistent to auto-dismiss, schedule removal
          if (duration > 0) {
            const existing = timersRef.current.get(id);
            if (existing) clearTimeout(existing);
            const timer = setTimeout(() => dismiss(id), duration);
            timersRef.current.set(id, timer);
          }

          return { ...t, message, type, duration };
        }),
      );
    },
    [dismiss],
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss, update }}>
      {children}

      {/* Toast container — fixed top-right, above everything */}
      {toasts.length > 0 && (
        <div className="toast-container" aria-label="Notifications">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
