import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import CountUp from "../common/CountUp";

export default function KpiCard({
  icon: Icon, label, value, prefix = "", suffix = "", decimals = 0, trend, trendLabel, index = 0, }) {
  const trendUp = (trend ?? 0) >= 0;

  return (
    <motion.div
      className = "kpi-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className = "kpi-card__icon">
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div className = "kpi-card__value">
        <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      <div className = "kpi-card__label">{label}</div>
      {trend !== undefined && (
        <div
          className = "kpi-card__trend"
          style={{ color: trendUp ? "var(--success)" : "var(--danger)" }}
        >
          {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(trend)}% {trendLabel}
        </div>
      )}
    </motion.div>
  );
}
