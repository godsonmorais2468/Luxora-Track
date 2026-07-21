import { useMemo } from "react";
import { Coins } from "lucide-react";
import SectionHeader from "../../../components/common/SectionHeader";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import MovementCard from "../../../components/cards/MovementCard";
import ChartWrapper, { goldLineOptions, donutOptions } from "../../../components/charts/ChartOptions";
import { sumMovement, todayInward, todayOutward, formatCurrency, formatWeight, goldRate, silverRate } from "../../../data/mockData";
import { useData } from "../../../context/DataContext";
import { useAuth } from "../../../context/AuthContext";

const timelineOptions = {
  ...goldLineOptions,
  xaxis: { ...goldLineOptions.xaxis, categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
};
const donutData = { ...donutOptions, labels: ["Gold", "Silver"], colors: ["#d4af37", "#cfcfcf"] };

export default function StaffDashboard() {
  const { user } = useAuth();
  const { branches } = useData();
  const branchName = user?.branch && user.branch !== "All Branches" ? user.branch : "Dubai Marina Atelier";
  const branch = branches.find((b) => b.name === branchName) || branches[0];

  const { gold, silver, movements } = useMemo(() => {
    const g = branch?.groups.find((x) => x.group === "Gold") || { weight: 0, quantity: 0 };
    const s = branch?.groups.find((x) => x.group === "Silver") || { weight: 0, quantity: 0 };
    const byBranch = (entries, group) =>
      sumMovement(entries.filter((e) => e.branch === branch?.name && e.group === group));
    return {
      gold: { ...g, value: Math.round(g.weight * (goldRate / 10)) },
      silver: { ...s, value: Math.round(s.weight * silverRate) },
      movements: {
        inGold: byBranch(todayInward.entries, "Gold"),
        inSilver: byBranch(todayInward.entries, "Silver"),
        outGold: byBranch(todayOutward.entries, "Gold"),
        outSilver: byBranch(todayOutward.entries, "Silver"),
      },
    };
  }, [branch]);

  if (!branch) return <div className="empty-state">No branch assigned.</div>;

  const netStockValue = gold.value + silver.value;
  const totalNetWeight = gold.weight + silver.weight;
  const totalNetQuantity = gold.quantity + silver.quantity;

  return (
    <div className="lux-container">
      <PageHero eyebrow={`${branch.name} · ${branch.code}`} title="Dashboard" subtitle={`Welcome, ${user?.full_name?.split(" ")[0] || "there"}`} />

      {/* Section 1 — Current Rate (compact) */}
      <div
        className="glass-panel rate-bar fade-in-up"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "0.75rem",
          padding: "0.75rem 1.1rem",
          marginBottom: "0.75rem",
          border: "1px solid rgba(212,175,55,0.4)",
          background: "linear-gradient(120deg, rgba(212,175,55,0.14), rgba(212,175,55,0.03))",
        }}
      >
        <div className="rate-bar__group">
          <div className="rate-bar__item">
            <div style={{ fontSize: "0.64rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
              Current Gold Rate
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--gold)" }}>
              ₹{Math.round(goldRate / 10).toLocaleString()} / gram
            </div>
          </div>
          <div className="rate-bar__item">
            <div style={{ fontSize: "0.64rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
              Current Silver Rate
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--white)" }}>
              ₹{silverRate.toLocaleString()} / gram
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 — Gold / Silver summary + Totals */}
      <GlassCard className="mb-2">
        <SectionHeader title="Metal-wise Stock Summary" />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div className="metal-row">
            <div className="metal-row__name">
              <Coins size={14} color="var(--gold)" /> Gold
            </div>
            <div className="metal-row__stats">
              <div className="metal-row__stat">
                <span className="metal-row__stat-label">Weight</span>
                <span className="metal-row__stat-value">{formatWeight(gold.weight)}</span>
              </div>
              <div className="metal-row__stat">
                <span className="metal-row__stat-label">Quantity (Nos)</span>
                <span className="metal-row__stat-value">{gold.quantity}</span>
              </div>
              <div className="metal-row__stat">
                <span className="metal-row__stat-label">Stock Value</span>
                <span className="metal-row__stat-value" style={{ color: "var(--gold)" }}>{formatCurrency(gold.value)}</span>
              </div>
            </div>
          </div>

          <div className="metal-row">
            <div className="metal-row__name">
              <Coins size={14} color="var(--secondary)" /> Silver
            </div>
            <div className="metal-row__stats">
              <div className="metal-row__stat">
                <span className="metal-row__stat-label">Weight</span>
                <span className="metal-row__stat-value">{formatWeight(silver.weight)}</span>
              </div>
              <div className="metal-row__stat">
                <span className="metal-row__stat-label">Quantity (Nos)</span>
                <span className="metal-row__stat-value">{silver.quantity}</span>
              </div>
              <div className="metal-row__stat">
                <span className="metal-row__stat-label">Stock Value</span>
                <span className="metal-row__stat-value">{formatCurrency(silver.value)}</span>
              </div>
            </div>
          </div>

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
                <span className="metal-row__stat-value" style={{ color: "var(--gold)" }}>
                  {formatWeight(totalNetWeight)}
                </span>
              </div>
              <div className="metal-row__stat">
                <span className="metal-row__stat-label" style={{ color: "rgba(245,230,190,0.8)" }}>Quantity (Nos)</span>
                <span className="metal-row__stat-value" style={{ color: "var(--gold)" }}>
                  {totalNetQuantity}
                </span>
              </div>
              <div className="metal-row__stat">
                <span className="metal-row__stat-label" style={{ color: "rgba(245,230,190,0.8)" }}>Stock Value</span>
                <span className="metal-row__stat-value" style={{ color: "var(--gold)", fontSize: "0.95rem" }}>
                  {formatCurrency(netStockValue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Section 4 — Today's movements, split by metal (only shown when data exists) */}
      <div className="row g-2 mb-2">
        {movements.inGold?.quantity > 0 && (
          <div className="col-md-6">
            <MovementCard label="Today's Gold Inward" direction="in" data={movements.inGold} />
          </div>
        )}
        {movements.inSilver?.quantity > 0 && (
          <div className="col-md-6">
            <MovementCard label="Today's Silver Inward" direction="in" data={movements.inSilver} />
          </div>
        )}
        {movements.outGold?.quantity > 0 && (
          <div className="col-md-6">
            <MovementCard label="Today's Gold Outward" direction="out" data={movements.outGold} />
          </div>
        )}
        {movements.outSilver?.quantity > 0 && (
          <div className="col-md-6">
            <MovementCard label="Today's Silver Outward" direction="out" data={movements.outSilver} />
          </div>
        )}
      </div>

      {/* Compact charts */}
      <div className="row g-3">
        <div className="col-lg-8">
          <GlassCard>
            <SectionHeader title="Inventory Timeline" subtitle="Your branch stock value this week" />
            <ChartWrapper
              options={timelineOptions}
              series={[{ name: "Value (₹L)", data: [28.5, 28.8, 29.1, 28.9, 29.4, 29.8, 30.2] }]}
              type="area"
              height={220}
            />
          </GlassCard>
        </div>
        <div className="col-lg-4">
          <GlassCard>
            <SectionHeader title="Gold vs Silver" subtitle="By net weight" />
            <ChartWrapper options={donutData} series={[gold.weight, silver.weight]} type="donut" height={220} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}