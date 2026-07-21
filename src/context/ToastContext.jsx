import { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";

const ToastContext = createContext(undefined);
let nextId = 1;

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };
const COLORS = { success: "var(--success)", error: "var(--danger)", info: "var(--gold)" };
const BORDERS = {
  success: "rgba(46, 204, 113, 0.35)",
  error: "rgba(231, 76, 60, 0.35)",
  info: "rgba(212, 175, 55, 0.35)",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success") => {
    const id = nextId++;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(
        <div
          style={{
            position: "fixed",
            top: 14,
            right: 14,
            zIndex: 4000,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            pointerEvents: "none",
            maxWidth: "min(340px, calc(100vw - 28px))",
          }}
        >
          <AnimatePresence>
            {toasts.map((t) => {
              const Icon = ICONS[t.type] || Info;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: -14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "0.6rem 0.9rem",
                    borderRadius: 12,
                    background: "rgba(16, 16, 16, 0.92)",
                    border: `1px solid ${BORDERS[t.type] || BORDERS.info}`,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <Icon size={16} color={COLORS[t.type] || COLORS.info} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.82rem", color: "var(--white)", lineHeight: 1.35 }}>{t.message}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
