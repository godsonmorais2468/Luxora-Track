import { useState } from "react";
import { Save, SlidersHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import SectionHeader from "../../../components/common/SectionHeader";
import Button from "../../../components/buttons/Button";
import MpinDialog from "../../../components/common/MpinDialog";
import { formatCurrency } from "../../../data/mockData";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";

const initialHistory = [
  { id: "a1", item: "Eternity Diamond Ring", type: "Increase", qty: 2, weight: 9.64, value: 60200, reason: "New stock arrival", date: "16 Jul 09:42" },
  { id: "a2", item: "Emerald Drop Earrings", type: "Decrease", qty: -1, weight: -3.6, value: -18600, reason: "Damaged in display", date: "15 Jul 16:18" },
  { id: "a3", item: "Royal Gold Chain", type: "Increase", qty: 1, weight: 22.4, value: 139940, reason: "Transfer from Mumbai", date: "14 Jul 11:03" },
  { id: "a4", item: "Antique Gold Bangle", type: "Decrease", qty: -1, weight: -18.6, value: -116200, reason: "Quality issue", date: "13 Jul 14:27" },
];

export default function Adjustments() {
  const { items } = useData();
  const toast = useToast();
  const emptyForm = { itemName: items[0]?.name || "", type: "Increase", qty: "", weight: "", reason: "" };
  const [history, setHistory] = useState(initialHistory);
  const [form, setForm] = useState(emptyForm);
  const [showMpin, setShowMpin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.qty || !form.reason.trim()) {
      toast("Quantity and reason are required", "error");
      return;
    }
    setShowMpin(true);
  };

  const completeAdjustment = () => {
    const sign = form.type === "Increase" ? 1 : -1;
    const qty = Math.abs(Number(form.qty)) * sign;
    const weight = Math.abs(Number(form.weight) || 0) * sign;
    const selected = items.find((i) => i.name === form.itemName);
    setHistory((prev) => [
      {
        id: `a${Date.now()}`,
        item: form.itemName,
        type: form.type,
        qty,
        weight,
        value: Math.round(weight * (selected?.value && selected?.weight ? selected.value / selected.weight : 6000)),
        reason: form.reason,
        date: "Just now",
      },
      ...prev,
    ]);
    setShowMpin(false);
    setForm(emptyForm);
    toast("Adjustment Recorded Successfully");
  };

  return (
    <div className="lux-container adjustments-page">
      <PageHero
        eyebrow="Inventory"
        title="Adjustments"
        subtitle="Record stock adjustments with authorization"
      />

      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <GlassCard>
            <SectionHeader title="New Adjustment" subtitle="Record a stock adjustment" action={<SlidersHorizontal size={18} color="var(--gold)" />} />
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2 adj-form-grid mb-3">
                <div>
                  <label className="form-label-lux">Select Item</label>
                  <select className="glass-input glass-select" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })}>
                    {items.map((i) => (
                      <option key={i.id}>{i.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label-lux">Adjustment Type</label>
                  <select className="glass-input glass-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="Increase">Increase (+)</option>
                    <option value="Decrease">Decrease (-)</option>
                  </select>
                </div>
              </div>
              <div className="form-grid-2 adj-form-grid mb-3">
                <div>
                  <label className="form-label-lux">Quantity Change</label>
                  <input className="glass-input" type="number" min="0" placeholder="0" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label-lux">Weight Change (g)</label>
                  <input className="glass-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label-lux">Reason</label>
                <textarea
                  className="glass-input"
                  rows={2}
                  placeholder="Explain the adjustment reason..."
                  style={{ resize: "none" }}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  required
                />
              </div>
              <Button variant="gold" type="submit" icon={<Save size={18} />}>
                Submit Adjustment
              </Button>
            </form>
          </GlassCard>
        </div>

        <div className="col-lg-5">
          <GlassCard>
            <SectionHeader title="Adjustment Summary" subtitle="This month" />
            <div className="d-flex flex-column gap-3">
              <div className="glass-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="kpi-card__icon" style={{ width: 36, height: 36, marginBottom: 0 }}>
                    <ArrowUp size={16} color="var(--success)" />
                  </div>
                  <div>
                    <div className="branch-stat__label">Total Increases</div>
                    <div className="font-number" style={{ fontSize: "1.3rem", color: "var(--success)" }}>
                      {history.filter((a) => a.type === "Increase").length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="kpi-card__icon" style={{ width: 36, height: 36, marginBottom: 0, background: "rgba(231,76,60,0.12)" }}>
                    <ArrowDown size={16} color="var(--danger)" />
                  </div>
                  <div>
                    <div className="branch-stat__label">Total Decreases</div>
                    <div className="font-number" style={{ fontSize: "1.3rem", color: "var(--danger)" }}>
                      {history.filter((a) => a.type === "Decrease").length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="kpi-card__icon" style={{ width: 36, height: 36, marginBottom: 0 }}>
                    <SlidersHorizontal size={16} color="var(--gold)" />
                  </div>
                  <div>
                    <div className="branch-stat__label">Net Adjustment</div>
                    <div className="font-number text-gold" style={{ fontSize: "1.3rem" }}>
                      {formatCurrency(history.reduce((sum, a) => sum + a.value, 0))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard>
        <SectionHeader title="Adjustment History" subtitle="Recent stock adjustments" />
        <div className="adj-table-wrap">
          <div className="data-table-head adj-grid-cols">
            <span>Item</span>
            <span>Type</span>
            <span>Qty</span>
            <span>Value</span>
            <span>Reason</span>
            <span>Date</span>
          </div>
          {history.map((a) => (
            <div
              key={a.id}
              className="inventory-row adj-grid-cols"
            >
              <div className="inventory-row__name" data-label="Item">{a.item}</div>
              <div data-label="Type">
                <span className={`badge-lux ${a.type === "Increase" ? "badge-lux--success" : "badge-lux--danger"}`}>
                  {a.type}
                </span>
              </div>
              <div className="inventory-row__value" data-label="Qty" style={{ color: a.qty >= 0 ? "var(--success)" : "var(--danger)" }}>
                {a.qty > 0 ? "+" : ""}{a.qty}
              </div>
              <div className="inventory-row__value" data-label="Value" style={{ color: a.value >= 0 ? "var(--gold)" : "var(--danger)" }}>
                {formatCurrency(Math.abs(a.value))}
              </div>
              <div className="inventory-row__value adj-reason" data-label="Reason">{a.reason}</div>
              <div className="inventory-row__value adj-date" data-label="Date">{a.date}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <MpinDialog
        open={showMpin}
        title="Authorize Adjustment"
        subtitle="Enter your MPIN to authorize this stock adjustment."
        onClose={() => setShowMpin(false)}
        onSuccess={completeAdjustment}
      />

      <style>{`
        .adjustments-page,
        .adjustments-page * {
          box-sizing: border-box;
        }

        .adj-table-wrap {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        .adjustments-page .adj-grid-cols {
          display: grid !important;
          grid-template-columns: 2fr 1fr 1fr 1fr 2fr 1.5fr;
          width: 100%;
        }

        .adj-reason {
          font-size: 0.82rem;
        }

        .adj-date {
          font-size: 0.78rem;
          color: var(--muted);
        }

        /* Form fields: stack below 700px, well before the Bootstrap col-lg break */
        @media (max-width: 700px) {
          .adj-form-grid {
            display: flex !important;
            flex-direction: column;
            gap: 0.75rem;
          }
        }

        @media (max-width: 1024px) {
          .adjustments-page .adj-grid-cols {
            grid-template-columns: 1.8fr 0.9fr 0.7fr 0.9fr 1.6fr 1.1fr !important;
            font-size: 0.88rem;
          }
        }

        @media (max-width: 768px) {
          .adjustments-page .data-table-head {
            display: none !important;
          }

          .adjustments-page .inventory-row.adj-grid-cols {
            display: flex !important;
            flex-direction: column;
            grid-template-columns: none !important;
            gap: 0.6rem;
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 0.75rem;
            border: 1px solid rgba(255, 255, 255, 0.08);
            width: 100%;
          }

          .adjustments-page .inventory-row > [data-label] {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            gap: 0.75rem;
          }

          .adjustments-page .inventory-row > [data-label]::before {
            content: attr(data-label);
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            opacity: 0.55;
            font-weight: 600;
            flex-shrink: 0;
          }

          .adjustments-page .inventory-row__name[data-label] {
            font-weight: 600;
          }

          .adj-reason,
          .adj-date {
            text-align: right;
            word-break: break-word;
          }
        }
      `}</style>
    </div>
  );
}