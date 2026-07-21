import { useEffect, useRef, useState } from "react";
import { Save, SlidersHorizontal, ArrowUp, ArrowDown, ChevronDown } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import SectionHeader from "../../../components/common/SectionHeader";
import Button from "../../../components/buttons/Button";
import MpinDialog from "../../../components/common/MpinDialog";
import { formatCurrency } from "../../../data/mockData";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";

// Same custom dropdown design used on Opening Stock / Closing Stock.
function FieldDropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="custom-select" ref={ref}>
      <button
        type="button"
        className={`custom-select__trigger glass-input ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={selectedLabel ? "" : "custom-select__placeholder"}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown size={16} className="custom-select__chevron" />
      </button>
      {open && (
        <div className="custom-select__panel">
          {options.length === 0 && <div className="custom-select__empty">No options available</div>}
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`custom-select__option ${opt.value === value ? "is-selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const initialHistory = [
  { id: "a1", category: "Ring", group: "Diamond", type: "Increase", qty: 2, weight: 9.64, value: 60200, reason: "New stock arrival", date: "16 Jul 09:42" },
  { id: "a2", category: "Earrings", group: "Emerald", type: "Decrease", qty: -1, weight: -3.6, value: -18600, reason: "Damaged in display", date: "15 Jul 16:18" },
  { id: "a3", category: "Chain", group: "Gold", type: "Increase", qty: 1, weight: 22.4, value: 139940, reason: "Transfer from Mumbai", date: "14 Jul 11:03" },
  { id: "a4", category: "Bangle", group: "Gold", type: "Decrease", qty: -1, weight: -18.6, value: -116200, reason: "Quality issue", date: "13 Jul 14:27" },
];

// Flat rate per gram used only when no item-level value/weight exists (category/group has no fixed value like an item did).
const FALLBACK_RATE_PER_GRAM = 6000;

export default function Adjustments() {
  const { categories, itemGroups, rates, goldRate, silverRate } = useData();
  const toast = useToast();

  const categoryOptions = (categories || [])
    .filter((c) => (c.status || "Active") === "Active")
    .map((c) => ({ value: c.name, label: c.name }));

  const groupOptions = (itemGroups || []).map((g) => ({ value: g.name, label: g.name }));

  // Look up today's per-gram rate for the selected group, same source Dashboard reads.
  // Tries a few common shapes since the exact rates field name wasn't given — adjust the
  // lookups below to match your actual DataContext field if none of these hit.
  const getRatePerGram = (groupName) => {
    const groupObj = (itemGroups || []).find((g) => g.name === groupName);
    const code = groupObj?.code?.toLowerCase();
    const name = groupName?.toLowerCase();

    if (rates) {
      if (code && rates[code] != null) return Number(rates[code]);
      if (name && rates[name] != null) return Number(rates[name]);
    }
    if (name === "gold" && goldRate != null) return Number(goldRate);
    if (name === "silver" && silverRate != null) return Number(silverRate);

    return FALLBACK_RATE_PER_GRAM;
  };

  const emptyForm = { category: "", group: "", type: "Increase", qty: "", weight: "", reason: "" };
  const [history, setHistory] = useState(initialHistory);
  const [form, setForm] = useState(emptyForm);
  const [showMpin, setShowMpin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.group) {
      toast("Please select category and group", "error");
      return;
    }
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
    const ratePerGram = getRatePerGram(form.group);
    setHistory((prev) => [
      {
        id: `a${Date.now()}`,
        category: form.category,
        group: form.group,
        type: form.type,
        qty,
        weight,
        value: Math.round(weight * ratePerGram),
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
                  <label className="form-label-lux">Category</label>
                  <FieldDropdown
                    value={form.category}
                    onChange={(v) => setForm({ ...form, category: v })}
                    options={categoryOptions}
                    placeholder="Select Category"
                  />
                </div>
                <div>
                  <label className="form-label-lux">Group</label>
                  <FieldDropdown
                    value={form.group}
                    onChange={(v) => setForm({ ...form, group: v })}
                    options={groupOptions}
                    placeholder="Select Group"
                  />
                </div>
              </div>
              <div className="form-grid-2 adj-form-grid mb-3">
                <div>
                  <label className="form-label-lux">Adjustment Type</label>
                  <select className="glass-input glass-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="Increase">Increase (+)</option>
                    <option value="Decrease">Decrease (-)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label-lux">Quantity Change</label>
                  <input className="glass-input" type="number" min="0" placeholder="0" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} required />
                </div>
              </div>
              <div className="form-grid-2 adj-form-grid mb-3">
                <div>
                  <label className="form-label-lux">Weight Change (g)</label>
                  <input className="glass-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                </div>
                <div />
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
            <span>Category</span>
            <span>Group</span>
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
              <div className="inventory-row__name" data-label="Category">{a.category}</div>
              <div className="inventory-row__value" data-label="Group">{a.group}</div>
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
          grid-template-columns: 1.4fr 1.2fr 1fr 0.8fr 1fr 1.8fr 1.3fr;
          width: 100%;
        }

        .adj-reason {
          font-size: 0.82rem;
        }

        .adj-date {
          font-size: 0.78rem;
          color: var(--muted);
        }

        .custom-select {
          position: relative;
        }

        .custom-select__trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          text-align: left;
          font-weight: 600;
        }

        .custom-select__trigger.is-open {
          border-color: var(--gold);
        }

        .custom-select__placeholder {
          opacity: 0.5;
          font-weight: 400;
        }

        .custom-select__chevron {
          opacity: 0.7;
          flex-shrink: 0;
          margin-left: 0.5rem;
        }

        .custom-select__panel {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          z-index: 40;
          background: #14120d;
          border: 1px solid var(--gold-soft, rgba(212,175,55,0.3));
          border-radius: 10px;
          overflow: hidden;
          max-height: 260px;
          overflow-y: auto;
          box-shadow: 0 12px 32px rgba(0,0,0,0.45);
        }

        .custom-select__option {
          padding: 0.6rem 0.9rem;
          font-weight: 600;
          font-size: 0.9rem;
          color: #f2ede3;
          cursor: pointer;
        }

        .custom-select__option:hover {
          background: rgba(255,255,255,0.06);
        }

        .custom-select__option.is-selected {
          background: #2563eb;
          color: #fff;
        }

        .custom-select__empty {
          padding: 0.6rem 0.9rem;
          font-size: 0.85rem;
          opacity: 0.5;
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
            grid-template-columns: 1.3fr 1fr 0.9fr 0.6fr 0.9fr 1.5fr 1.1fr !important;
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