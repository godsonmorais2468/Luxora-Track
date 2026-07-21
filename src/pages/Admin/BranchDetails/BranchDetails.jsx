import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Coins } from "lucide-react";
import GlassCard from "../../../components/common/GlassCard";
import SectionHeader from "../../../components/common/SectionHeader";
import ChartWrapper, { goldLineOptions, donutOptions } from "../../../components/charts/ChartOptions";
import { formatWeight, formatCurrency, goldRate, silverRate } from "../../../data/mockData";
import { useData } from "../../../context/DataContext";

const timelineOptions = {
  ...goldLineOptions,
  xaxis: { ...goldLineOptions.xaxis, categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
};
const donutData = { ...donutOptions, labels: ["Gold", "Silver"], colors: ["#d4af37", "#cfcfcf"] };

export default function BranchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { branches } = useData();
  const branch = branches.find((b) => b.id === id) || branches[0];

  if (!branch) {
    return (
      <div className="lux-container">
        <div className="empty-state">Branch not found.</div>
      </div>
    );
  }

  const gold = branch.groups.find((g) => g.group === "Gold") || { weight: 0, quantity: 0, categories: [] };
  const silver = branch.groups.find((g) => g.group === "Silver") || { weight: 0, quantity: 0, categories: [] };
  const trendSeries = [1, 1.02, 0.99, 1.03, 1.05, 1.02, 1.06].map((mult) =>
    Math.round(((gold.weight + silver.weight) / 10) * mult * 10) / 10
  );

  // Same valuation formula as the Dashboard's Group-wise Stock Summary —
  // gold priced per 10g, silver priced per gram — so figures match exactly.
  const goldValue = Math.round(gold.weight * (goldRate / 10));
  const silverValue = Math.round(silver.weight * silverRate);
  const totalWeight = gold.weight + silver.weight;
  const totalQuantity = gold.quantity + silver.quantity;
  const totalValue = goldValue + silverValue;

  return (
    <div className="lux-container">
      {/* Scoped responsive fix for the breakdown table on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .data-table-head {
            display: none;
          }
          .inventory-row {
            display: flex !important;
            flex-direction: column;
            align-items: flex-start !important;
            gap: 6px;
            padding: 0.7rem !important;
          }
          .inventory-row > * {
            width: 100%;
          }
          .inventory-row__value {
            display: flex;
            justify-content: space-between;
            width: 100%;
            font-size: 0.8rem;
          }
          .inventory-row__value[data-label]::before {
            content: attr(data-label);
            color: var(--muted);
            font-size: 0.66rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
        }
      `}</style>

      <button
        className="btn-lux btn-lux--ghost mb-2"
        onClick={() => navigate("/admin/branches")}
      >
        <ArrowLeft size={15} /> Back to Branches
      </button>

      {/* Single branch container — identity + grouped breakdown */}
      <GlassCard className="mb-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3" style={{ gap: 8 }}>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--white)" }}>{branch.name}</div>
            <div style={{ fontSize: "0.76rem", color: "var(--muted)" }}>
              Branch Code: <span style={{ color: "var(--gold)" }}>{branch.code}</span> · {branch.manager}
            </div>
          </div>
          <div className="d-flex gap-2 align-items-center" style={{ fontSize: "0.76rem", color: "var(--muted)" }}>
            <Phone size={13} /> {branch.phone}
          </div>
        </div>

        {[gold, silver].map((group, gi) => {
          const name = gi === 0 ? "Gold" : "Silver";
          const value = gi === 0 ? goldValue : silverValue;
          return (
            <div key={name} style={{ marginBottom: gi === 0 ? "1rem" : 0 }}>
              {/* Group header with totals */}
              <div
                className="metal-row"
                style={{
                  marginBottom: "0.45rem",
                  background: name === "Gold" ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.04)",
                  borderColor: name === "Gold" ? "rgba(212,175,55,0.3)" : "var(--card-border)",
                }}
              >
                <div className="metal-row__name">
                  <Coins size={13} color={name === "Gold" ? "var(--gold)" : "var(--secondary)"} /> {name}
                </div>
                <div className="metal-row__stats">
                  <div className="metal-row__stat">
                    <span className="metal-row__stat-label">Weight</span>
                    <span className="metal-row__stat-value">{formatWeight(group.weight)}</span>
                  </div>
                  <div className="metal-row__stat">
                    <span className="metal-row__stat-label">Quantity (Nos)</span>
                    <span className="metal-row__stat-value">{group.quantity}</span>
                  </div>
                  <div className="metal-row__stat">
                    <span className="metal-row__stat-label">Stock Value</span>
                    <span className="metal-row__stat-value" style={{ color: name === "Gold" ? "var(--gold)" : "var(--white)" }}>
                      {formatCurrency(value)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category rows for this group */}
              <div className="data-table-head" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
                <span>Category</span>
                <span>Quantity</span>
                <span>Weight</span>
              </div>
              {group.categories.map((c) => (
                <div key={c.category} className="inventory-row" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
                  <div className="inventory-row__value" data-label="Category" style={{ color: "var(--white)" }}>{c.category}</div>
                  <div className="inventory-row__value" data-label="Quantity">{c.quantity}</div>
                  <div className="inventory-row__value" data-label="Weight">{formatWeight(c.weight)}</div>
                </div>
              ))}
              {group.categories.length === 0 && (
                <div className="empty-state" style={{ padding: "0.75rem" }}>No {name.toLowerCase()} stock recorded yet.</div>
              )}
            </div>
          );
        })}

        {/* Total — combined Gold + Silver, same layout as the Dashboard's
            Group-wise Stock Summary total row */}
        <div
          className="metal-row"
          style={{
            borderColor: "rgba(212,175,55,0.4)",
            background: "linear-gradient(120deg, rgba(212,175,55,0.12), rgba(212,175,55,0.03))",
          }}
        >
          <div className="metal-row__name" style={{ color: "var(--gold)", fontWeight: 700 }}>
            Total
          </div>
          <div className="metal-row__stats">
            <div className="metal-row__stat">
              <span className="metal-row__stat-label" style={{ color: "rgba(245,230,190,0.8)" }}>Weight</span>
              <span className="metal-row__stat-value" style={{ color: "var(--gold)" }}>{formatWeight(totalWeight)}</span>
            </div>
            <div className="metal-row__stat">
              <span className="metal-row__stat-label" style={{ color: "rgba(245,230,190,0.8)" }}>Quantity (Nos)</span>
              <span className="metal-row__stat-value" style={{ color: "var(--gold)" }}>{totalQuantity}</span>
            </div>
            <div className="metal-row__stat">
              <span className="metal-row__stat-label" style={{ color: "rgba(245,230,190,0.8)" }}>Stock Value</span>
              <span className="metal-row__stat-value" style={{ color: "var(--gold)", fontSize: "0.95rem" }}>
                {formatCurrency(totalValue)}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Charts — below the stock breakdown */}
      <div className="row g-3">
        <div className="col-lg-8">
          <GlassCard>
            <SectionHeader title="Stock Value Trend" subtitle="This branch, past 7 days" />
            <ChartWrapper
              options={timelineOptions}
              series={[{ name: "Weight (10g units)", data: trendSeries }]}
              type="area"
              height={220}
            />
          </GlassCard>
        </div>
        <div className="col-lg-4">
          <GlassCard>
            <SectionHeader title="Gold vs Silver" subtitle="By net weight" />
            <ChartWrapper options={donutData} series={[gold.weight || 0.01, silver.weight || 0.01]} type="donut" height={220} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
