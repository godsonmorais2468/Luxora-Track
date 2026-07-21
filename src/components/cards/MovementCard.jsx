import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatCurrency, formatWeight } from "../../data/mockData";

/**
 * Compact horizontal card for a single metal's daily movement,
 * e.g. "Today's Gold Inward" — Weight / Qty / Value.
 */
export default function MovementCard({ label, direction, data }) {
  const inward = direction === "in";
  const Icon = inward ? ArrowDownLeft : ArrowUpRight;
  const color = inward ? "var(--success)" : "var(--danger)";

  return (
    <div className="metal-row" style={{ height: "100%" }}>
      <div className="metal-row__name">
        <Icon size={14} color={color} /> {label}
      </div>
      <div className="metal-row__stats">
        <div className="metal-row__stat">
          <span className="metal-row__stat-label">Weight</span>
          <span className="metal-row__stat-value">{formatWeight(data.weight)}</span>
        </div>
        <div className="metal-row__stat">
          <span className="metal-row__stat-label">Qty</span>
          <span className="metal-row__stat-value">{data.quantity}</span>
        </div>
        <div className="metal-row__stat">
          <span className="metal-row__stat-label">Value</span>
          <span className="metal-row__stat-value" style={{ color }}>{formatCurrency(data.value)}</span>
        </div>
      </div>
    </div>
  );
}
