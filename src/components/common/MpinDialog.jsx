import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Delete, Check, X } from "lucide-react";

const CORRECT_MPIN = "2468";

export default function MpinDialog({
  open, title, subtitle = "Enter your 4-digit secure MPIN to authorize this action.", onSuccess, onClose, }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // Keep the latest onSuccess without making it a dependency of the timer
  // effect below — an inline arrow function from the parent gets a new
  // identity every render, which would otherwise cancel and never fire it.
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  // All entry paths (keypad taps, keyboard typing, paste) mutate `input` via
  // functional updates, so rapid successive keys can never clobber each other.
  const handleKey = useCallback(
    (key) => {
      if (success) return;
      setError(false);
      if (key === "del") {
        setInput((p) => p.slice(0, -1));
        return;
      }
      setInput((p) => (p.length >= 4 ? p : p + key));
    },
    [success]
  );

  // Checks the code once the 4th digit lands. Deliberately does NOT depend
  // on `success` — setting it here would re-run this same effect and its
  // cleanup would cancel the success timer before it ever fires.
  useEffect(() => {
    if (input.length !== 4) return;
    if (input === CORRECT_MPIN) {
      setSuccess(true);
      return;
    }
    setError(true);
    const t = setTimeout(() => {
      setInput("");
      setError(false);
    }, 700);
    return () => clearTimeout(t);
  }, [input]);

  // Runs exactly once when `success` flips true.
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => {
      onSuccessRef.current();
      setInput("");
      setSuccess(false);
    }, 900);
    return () => clearTimeout(t);
  }, [success]);

  // Natural keyboard entry: digits type, Backspace deletes, Escape closes,
  // and pasting a 4-digit code fills everything at once.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleKey(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleKey("del");
      } else if (e.key === "Escape") {
        onClose?.();
      }
    };
    const onPaste = (e) => {
      const digits = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 4);
      if (digits) {
        e.preventDefault();
        setError(false);
        setInput(digits);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("paste", onPaste);
    };
  }, [open, handleKey, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
          }}
          onClick={onClose}
        >
          <motion.div
            className = "glass-panel"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 380, maxWidth: "92vw", padding: "1.6rem", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className = "d-flex justify-content-between align-items-start mb-3">
              <div className = "text-start">
                <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }}>
                  {title}
                </h4>
                <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{subtitle}</p>
              </div>
              <button className = "icon-btn" onClick={onClose} aria-label = "Close">
                <X size={16} />
              </button>
            </div>

            <AnimatePresence mode = "wait">
              {success ? (
                <motion.div
                  key = "success"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{ padding: "1.5rem 0" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "rgba(46,204,113,0.15)",
                      border: "2px solid var(--success)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                    }}
                  >
                    <Check size={28} color = "var(--success)" />
                  </motion.div>
                  <p style={{ marginTop: 14, color: "var(--success)", fontWeight: 500 }}>
                    Authorized
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key = "keypad"
                  className={error ? "animate-shake" : ""}
                >
                  <div className = "mpin-dots">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`mpin-dot ${input.length > i ? "filled" : ""}`}
                      />
                    ))}
                  </div>
                  {error && (
                    <p style={{ color: "var(--danger)", fontSize: "0.8rem", marginBottom: 12 }}>
                      Invalid MPIN. Try again.
                    </p>
                  )}
                  <div className = "mpin-keypad">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((k) => (
                      <button
                        key={k}
                        className = "mpin-key"
                        onClick={() => handleKey(k)}
                      >
                        {k}
                      </button>
                    ))}
                    <div />
                    <button className = "mpin-key" onClick={() => handleKey("0")}>
                      0
                    </button>
                    <button
                      className = "mpin-key"
                      onClick={() => handleKey("del")}
                      aria-label = "Delete"
                    >
                      <Delete size={20} color = "var(--muted)" />
                    </button>
                  </div>
                  <p style={{ marginTop: 14, fontSize: "0.7rem", color: "var(--muted-dark)" }}>
                    Type, paste, or tap the keypad · Demo MPIN: 2468
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
