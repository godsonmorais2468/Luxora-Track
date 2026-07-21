import { motion } from "framer-motion";

export default function GlassCard({
  children,
  hover = false,
  className = "",
  ...rest
}) {
  return (
    <motion.div
      className={`glass-card ${hover ? "glass-hover" : ""} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
