import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="lux-bg" aria-hidden="true" style={{ overflow: "hidden" }}>
      <style>{`
        @media (max-width: 768px) {
          .glow-orb {
            width: 260px !important;
            height: 260px !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .glow-orb {
            width: 360px !important;
            height: 360px !important;
          }
        }
      `}</style>
      <div className="lux-bg__image" />
      <div className="lux-bg__overlay" />
      <div className="lux-bg__vignette" />
      <motion.div
        className="glow-orb"
        style={{
          width: 500,
          height: 500,
          background: "rgba(212,175,55,0.15)",
          top: "-10%",
          left: "-5%",
        }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="glow-orb"
        style={{
          width: 400,
          height: 400,
          background: "rgba(212,175,55,0.1)",
          bottom: "-15%",
          right: "-8%",
        }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
