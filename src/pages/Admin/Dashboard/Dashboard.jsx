import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, ArrowRight } from "lucide-react";
import SectionHeader from "../../../components/common/SectionHeader";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import Button from "../../../components/buttons/Button";
import MovementCard from "../../../components/cards/MovementCard";
import ChartWrapper, { goldLineOptions, donutOptions } from "../../../components/charts/ChartOptions";
import {
  sumGroupTotals,
  sumMovement,
  todayInward,
  todayOutward,
  formatCurrency,
  formatWeight,
  goldRate,
  silverRate,
} from "../../../data/mockData";
import { useData } from "../../../context/DataContext";

// Today's movements are static mock data, so the per-metal splits can be
// computed once at module load instead of on every render.
const inwardGold = sumMovement(todayInward.entries.filter((e) => e.group === "Gold"));
const inwardSilver = sumMovement(todayInward.entries.filter((e) => e.group === "Silver"));
const outwardGold = sumMovement(todayOutward.entries.filter((e) => e.group === "Gold"));
const outwardSilver = sumMovement(todayOutward.entries.filter((e) => e.group === "Silver"));

const timelineOptions = {
  ...goldLineOptions,
  chart: { ...goldLineOptions.chart, id: "timeline" },
  xaxis: {
    ...goldLineOptions.xaxis,
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
};

const donutData = { ...donutOptions, labels: ["Gold", "Silver"], colors: ["#d4af37", "#cfcfcf"] };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { branches } = useData();

  const { gold, silver } = useMemo(() => {
    const goldTotals = sumGroupTotals(branches, "Gold");
    const silverTotals = sumGroupTotals(branches, "Silver");
    return {
      gold: { ...goldTotals, value: Math.round(goldTotals.weight * (goldRate / 10)) },
      silver: { ...silverTotals, value: Math.round(silverTotals.weight * silverRate) },
    };
  }, [branches]);

  const netStockValue = gold.value + silver.value;
  const totalNetWeight = gold.weight + silver.weight;

  return (
    <div className="lux-container">
      <PageHero eyebrow="Command Overview" title="Dashboard" subtitle="Good Morning, Marcus" />

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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.64rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
              Current Gold Rate
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--gold)" }}>
              ₹{Math.round(goldRate / 10).toLocaleString()} / gram
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.64rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
              Current Silver Rate
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--white)" }}>
              ₹{silverRate.toLocaleString()} / gram
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 — Net Stock Value (compact) */}
      <GlassCard className="mb-2">
        <SectionHeader title="Net Stock Value" subtitle="Combined valuation across all branches" />
        <div className="stat-strip">
          <div className="stat-chip">
            <span className="stat-chip__label">Gold</span>
            <span className="stat-chip__value text-gold">{formatCurrency(gold.value)}</span>
          </div>
          <div className="stat-chip">
            <span className="stat-chip__label">Silver</span>
            <span className="stat-chip__value">{formatCurrency(silver.value)}</span>
          </div>
          <div className="stat-chip" style={{ borderColor: "rgba(212,175,55,0.35)", background: "rgba(212,175,55,0.05)" }}>
            <span className="stat-chip__label">Total</span>
            <span className="stat-chip__value text-gold">{formatCurrency(netStockValue)}</span>
          </div>
        </div>
      </GlassCard>

      {/* Section 3 — Gold / Silver summary + Total Net Weight */}
      <GlassCard className="mb-2">
        <SectionHeader title="Group -wise Stock Summary" />
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

          <div className="metal-row" style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.3)" }}>
            <div className="metal-row__name">Total Net Weight</div>
            <div className="metal-row__stats">
              <div className="metal-row__stat">
                <span className="metal-row__stat-value" style={{ fontSize: "0.95rem", color: "var(--gold)" }}>
                  {formatWeight(totalNetWeight)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Section 4 — Today's movements, split by metal */}
      <div className="row g-2 mb-2">
        <div className="col-md-6">
          <MovementCard label="Today's Gold Inward" direction="in" data={inwardGold} />
        </div>
        <div className="col-md-6">
          <MovementCard label="Today's Silver Inward" direction="in" data={inwardSilver} />
        </div>
        <div className="col-md-6">
          <MovementCard label="Today's Gold Outward" direction="out" data={outwardGold} />
        </div>
        <div className="col-md-6">
          <MovementCard label="Today's Silver Outward" direction="out" data={outwardSilver} />
        </div>
      </div>

      {/* Section 5 — Show Branch-wise Details (right-aligned) */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="glass" size="sm" icon={<ArrowRight size={15} />} onClick={() => navigate("/admin/branches")}>
          Show Branch-wise Details
        </Button>
      </div>

      {/* Graphs — placed below Show Branch-wise Details, per spec */}
      <div className="row g-3">
        <div className="col-lg-8">
          <GlassCard>
            <SectionHeader title="Inventory Timeline" subtitle="Stock value movement across the week" />
            <ChartWrapper
              options={timelineOptions}
              series={[{ name: "Stock Value (₹L)", data: [32.4, 32.9, 33.1, 32.8, 33.5, 34.1, 34.8] }]}
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
