import { useState, useMemo } from "react";
import { FileText, FileSpreadsheet, Printer, Filter } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import SectionHeader from "../../../components/common/SectionHeader";
import Button from "../../../components/buttons/Button";
import MovementCard from "../../../components/cards/MovementCard";
import ChartWrapper, { donutOptions } from "../../../components/charts/ChartOptions";
import { todayInward, todayOutward, sumMovement, formatWeight } from "../../../data/mockData";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";

const emptyFilters = { group: "All", category: "All" };

const donutData = {
  ...donutOptions,
  labels: ["Gold Inward", "Silver Inward", "Gold Outward", "Silver Outward"],
  colors: ["#2ecc71", "#8fe3b4", "#e74c3c", "#f1948a"],
};

export default function StaffReports() {
  const { user } = useAuth();
  const { branches, itemGroups, categories } = useData();
  const toast = useToast();
  const branchName = user?.branch && user.branch !== "All Branches" ? user.branch : "Dubai Marina Atelier";
  const branch = branches.find((b) => b.name === branchName) || branches[0];

  const [draft, setDraft] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);

  const { inwardEntries, outwardEntries, inGold, inSilver, outGold, outSilver } = useMemo(() => {
    const matches = (e) =>
      e.branch === branch?.name &&
      (applied.group === "All" || e.group === applied.group) &&
      (applied.category === "All" || e.category === applied.category);
    const inward = todayInward.entries.filter(matches);
    const outward = todayOutward.entries.filter(matches);
    const byGroup = (entries, group) => sumMovement(entries.filter((e) => e.group === group));
    return {
      inwardEntries: inward,
      outwardEntries: outward,
      inGold: byGroup(inward, "Gold"),
      inSilver: byGroup(inward, "Silver"),
      outGold: byGroup(outward, "Gold"),
      outSilver: byGroup(outward, "Silver"),
    };
  }, [applied, branch]);

  const handleGenerate = () => {
    setApplied(draft);
    toast("Report generated", "info");
  };
  const handleExport = (label) => toast(`${label} export generated (demo)`, "info");

  return (
    <div className="lux-container">
      {/* Scoped responsive fix for the movement tables on small screens */}
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

      <PageHero
        eyebrow="Insights"
        title="Reports"
        subtitle={`Today's Gold & Silver movements — ${branch?.name}`}
      />

      <GlassCard className="mb-3">
        <SectionHeader title="Filters" subtitle="Refine report parameters" action={<Filter size={16} color="var(--gold)" />} />
        <div className="filter-panel mb-3" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          <div>
            <label className="form-label-lux">Group</label>
            <select className="glass-input glass-select" value={draft.group} onChange={(e) => setDraft({ ...draft, group: e.target.value })}>
              <option>All</option>
              {itemGroups.map((g) => (
                <option key={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label-lux">Category</label>
            <select className="glass-input glass-select" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
              <option>All</option>
              {categories.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <Button variant="gold" size="sm" icon={<Filter size={15} />} onClick={handleGenerate}>Generate Report</Button>
          <Button variant="glass" size="sm" icon={<FileText size={15} />} onClick={() => handleExport("PDF")}>Export PDF</Button>
          <Button variant="glass" size="sm" icon={<FileSpreadsheet size={15} />} onClick={() => handleExport("Excel")}>Export Excel</Button>
          <Button variant="glass" size="sm" icon={<Printer size={15} />} onClick={() => window.print()}>Print</Button>
        </div>
      </GlassCard>

      {/* Today's movements — split by metal */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <MovementCard label="Today's Gold Inward" direction="in" data={inGold} />
        </div>
        <div className="col-md-6">
          <MovementCard label="Today's Silver Inward" direction="in" data={inSilver} />
        </div>
        <div className="col-md-6">
          <MovementCard label="Today's Gold Outward" direction="out" data={outGold} />
        </div>
        <div className="col-md-6">
          <MovementCard label="Today's Silver Outward" direction="out" data={outSilver} />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-lg-7">
          <GlassCard>
            <SectionHeader title="Today's Inward — Gold & Silver" subtitle="Line-item movements" />
            <div className="data-table-head" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 0.8fr" }}>
              <span>Group</span>
              <span>Category</span>
              <span>Qty</span>
              <span>Weight</span>
              <span>Time</span>
            </div>
            {inwardEntries.map((e) => (
              <div key={e.id} className="inventory-row" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 0.8fr" }}>
                <div className="inventory-row__value" data-label="Group">
                  <span className={`badge-lux ${e.group === "Gold" ? "badge-lux--gold" : "badge-lux--neutral"}`}>{e.group}</span>
                </div>
                <div className="inventory-row__value" data-label="Category">{e.category}</div>
                <div className="inventory-row__value" data-label="Qty">{e.quantity}</div>
                <div className="inventory-row__value" data-label="Weight">{formatWeight(e.weight)}</div>
                <div className="inventory-row__value" data-label="Time" style={{ color: "var(--muted)" }}>{e.time}</div>
              </div>
            ))}
            {inwardEntries.length === 0 && <div className="empty-state">No inward movements today.</div>}
          </GlassCard>
        </div>
        <div className="col-lg-5">
          <GlassCard>
            <SectionHeader title="Movement Mix" subtitle="Gold & Silver, Inward vs Outward — by value" />
            <ChartWrapper
              options={donutData}
              series={[inGold.value || 0.01, inSilver.value || 0.01, outGold.value || 0.01, outSilver.value || 0.01]}
              type="donut"
              height={220}
            />
          </GlassCard>
        </div>
      </div>

      <GlassCard>
        <SectionHeader title="Today's Outward — Gold & Silver" subtitle="Line-item movements" />
        <div className="data-table-head" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 0.8fr" }}>
          <span>Group</span>
          <span>Category</span>
          <span>Qty</span>
          <span>Weight</span>
          <span>Time</span>
        </div>
        {outwardEntries.map((e) => (
          <div key={e.id} className="inventory-row" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 0.8fr" }}>
            <div className="inventory-row__value" data-label="Group">
              <span className={`badge-lux ${e.group === "Gold" ? "badge-lux--gold" : "badge-lux--neutral"}`}>{e.group}</span>
            </div>
            <div className="inventory-row__value" data-label="Category">{e.category}</div>
            <div className="inventory-row__value" data-label="Qty">{e.quantity}</div>
            <div className="inventory-row__value" data-label="Weight">{formatWeight(e.weight)}</div>
            <div className="inventory-row__value" data-label="Time" style={{ color: "var(--muted)" }}>{e.time}</div>
          </div>
        ))}
        {outwardEntries.length === 0 && <div className="empty-state">No outward movements today.</div>}
      </GlassCard>
    </div>
  );
}
