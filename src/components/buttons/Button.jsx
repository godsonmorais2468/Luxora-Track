import { motion } from "framer-motion";

export default function Button({
  children, variant = "gold", onClick, type = "button", disabled = false, className = "", icon, size = "md", }) {
  const handleClick = (e) => {
    const btn = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const rect = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
    circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
    circle.classList.add("ripple__effect");
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
    onClick?.();
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`btn-lux btn-lux--${variant} ${size === "sm" ? "btn-sm" : ""} ${className}`}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
    >
      {icon}
      {children}
    </motion.button>
  );
}
