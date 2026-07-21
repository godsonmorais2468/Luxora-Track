import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, title, subtitle, onClose, children, width = 480 }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            padding: "1rem",
          }}
          onClick={onClose}
        >
          <motion.div
            className="glass-panel"
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ width, maxWidth: "94vw", maxHeight: "88vh", overflowY: "auto", padding: "1.4rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-start mb-3" style={{ gap: 12 }}>
              <div>
                <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", color: "var(--white)" }}>{title}</h4>
                {subtitle && <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>{subtitle}</p>}
              </div>
              <button className="icon-btn" onClick={onClose} aria-label="Close" style={{ flexShrink: 0 }}>
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
