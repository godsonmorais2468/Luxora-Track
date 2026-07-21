import { useEffect, useRef, useState } from "react";
import { Save, PackageCheck, Plus, X, Gem, ChevronDown, Lock } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import SectionHeader from "../../../components/common/SectionHeader";
import Button from "../../../components/buttons/Button";
import MpinDialog from "../../../components/common/MpinDialog";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";

// Same custom dropdown design used on Opening Stock — sourced from Categories / Item Groups records.
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

export default function ClosingStock() {
  const { categories, itemGroups } = useData();
  const toast = useToast();
  const { user } = useAuth();

  const todayKey = new Date().toISOString().slice(0, 10);
  const storageKey = `luxora_closing_stock_data_${todayKey}`;

  const [showMpin, setShowMpin] = useState(false);
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw).saved : false;
    } catch {
      return false;
    }
  });
  const [showEntryRow, setShowEntryRow] = useState(false);
  const [entries, setEntries] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw).entries : [];
    } catch {
      return [];
    }
  });

  const [draftCategory, setDraftCategory] = useState("");
  const [draftGroup, setDraftGroup] = useState("");
  const [draftQty, setDraftQty] = useState("");
  const [draftWeight, setDraftWeight] = useState("");

  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const branchName = user?.branch && user.branch !== "All Branches" ? user.branch : "Dubai Marina Atelier";

  // Gate: Closing Stock only usable once Opening Stock is saved for today.
  // Frontend-only check — no backend change. Opening Stock sets this flag on save.
  const [openingStockDone, setOpeningStockDone] = useState(
    () => localStorage.getItem("luxora_opening_stock_date") === todayKey
  );

  useEffect(() => {
    const check = () => setOpeningStockDone(localStorage.getItem("luxora_opening_stock_date") === todayKey);
    window.addEventListener("storage", check);
    window.addEventListener("openingStockUpdated", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("openingStockUpdated", check);
    };
  }, [todayKey]);

  const categoryOptions = (categories || [])
    .filter((c) => (c.status || "Active") === "Active")
    .map((c) => ({ value: c.name, label: c.name }));

  const groupOptions = (itemGroups || []).map((g) => ({ value: g.name, label: g.name }));

  // keep entries + saved state alive across navigation (same day)
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ entries, saved }));
  }, [entries, saved, storageKey]);

  const resetDraft = () => {
    setDraftCategory("");
    setDraftGroup("");
    setDraftQty("");
    setDraftWeight("");
  };

  const handleAddEntry = () => {
    if (!draftCategory || !draftGroup || !draftQty || !draftWeight) {
      toast("Select category, group and enter quantity & weight");
      return;
    }
    setEntries((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length}`,
        category: draftCategory,
        group: draftGroup,
        qty: draftQty,
        weight: draftWeight,
      },
    ]);
    resetDraft();
    setShowEntryRow(false);
  };

  const handleRemoveEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const completeSave = () => {
    setShowMpin(false);
    setSaved(true);
    toast("Closing Stock Saved Successfully");
  };

  return (
    <div className="lux-container closing-stock-page">
      <PageHero
        eyebrow="Inventory"
        title="Closing Stock"
        subtitle="Record the closing stock for today"
      />

      <GlassCard>
        <SectionHeader
          title="Closing Stock Items"
          subtitle={`${dateStr} · ${branchName} — MPIN is asked once, on save`}
          action={<PackageCheck size={16} color="var(--gold)" />}
        />

        {!openingStockDone ? (
          <div className="closing-locked">
            <div className="closing-locked__icon">
              <Lock size={18} color="var(--gold)" strokeWidth={1.5} />
            </div>
            <div className="closing-locked__text">Opening Stock must be completed before Closing Stock.</div>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button
                variant="gold"
                size="sm"
                icon={<Plus size={15} />}
                onClick={() => setShowEntryRow((v) => !v)}
              >
                Add
              </Button>
            </div>

            {showEntryRow && (
              <div className="stock-entry-row">
                <FieldDropdown
                  value={draftCategory}
                  onChange={setDraftCategory}
                  options={categoryOptions}
                  placeholder="Select Category"
                />
                <FieldDropdown
                  value={draftGroup}
                  onChange={setDraftGroup}
                  options={groupOptions}
                  placeholder="Select Group"
                />
                <input
                  className="glass-input"
                  type="number"
                  min="0"
                  placeholder="Quantity (Nos)"
                  value={draftQty}
                  onChange={(e) => setDraftQty(e.target.value)}
                />
                <input
                  className="glass-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Weight"
                  value={draftWeight}
                  onChange={(e) => setDraftWeight(e.target.value)}
                />
                <Button variant="gold" size="sm" onClick={handleAddEntry}>
                  Add
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X size={14} />}
                  onClick={() => {
                    resetDraft();
                    setShowEntryRow(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            <div className="stock-table-wrap">
              {entries.length > 0 && (
                <div className="data-table-head stock-grid-cols">
                  <span>Category</span>
                  <span>Group</span>
                  <span>Quantity</span>
                  <span>Weight</span>
                </div>
              )}
              {entries.map((entry) => (
                <div key={entry.id} className="inventory-row stock-grid-cols stock-row-readonly">
                  <div className="inventory-row__group" data-label="Category">
                    <div
                      className="inventory-row__thumb"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gold-soft)" }}
                    >
                      <Gem size={15} color="var(--gold)" strokeWidth={1.5} />
                    </div>
                    <div className="inventory-row__name">{entry.category}</div>
                  </div>
                  <div className="inventory-row__value" data-label="Group">{entry.group}</div>
                  <div className="inventory-row__value" data-label="Quantity">{entry.qty}</div>
                  <div className="inventory-row__value text-gold" data-label="Weight">{entry.weight}</div>
                </div>
              ))}
              {entries.length === 0 && !showEntryRow && (
                <div className="stock-empty">No items added yet. Click "+ Add" to begin.</div>
              )}
            </div>

            <div className="d-flex gap-2 mt-3 closing-actions align-items-center">
              <Button
                variant="gold"
                size="sm"
                icon={<Save size={15} />}
                onClick={() => setShowMpin(true)}
                disabled={entries.length === 0}
              >
                Save Closing Stock
              </Button>
              {saved && <span className="badge-lux badge-lux--success">Saved</span>}
            </div>
          </>
        )}
      </GlassCard>

      <MpinDialog
        open={showMpin}
        title="Authorize Closing Stock"
        subtitle="Enter your MPIN to save today's closing stock."
        onClose={() => setShowMpin(false)}
        onSuccess={completeSave}
      />

      <style>{`
        .stock-table-wrap {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        .closing-locked {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem;
          border: 1px dashed var(--gold-soft, rgba(212,175,55,0.35));
          border-radius: 10px;
        }

        .closing-locked__icon {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gold-soft);
        }

        .closing-locked__text {
          font-size: 0.9rem;
          font-weight: 600;
          opacity: 0.9;
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

        .stock-entry-row {
          display: grid;
          grid-template-columns: 1.4fr 1.4fr 1fr 1fr auto auto;
          gap: 0.6rem;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.75rem;
          border: 1px solid var(--gold-soft, rgba(212,175,55,0.25));
          border-radius: 10px;
        }

        .stock-empty {
          padding: 1.25rem 0.5rem;
          opacity: 0.6;
          font-size: 0.85rem;
          text-align: center;
        }

        .stock-row-readonly {
          opacity: 0.95;
        }

        .closing-stock-page .stock-grid-cols {
          display: grid !important;
          grid-template-columns: 2fr 1.4fr 1fr 1fr;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .stock-entry-row {
            grid-template-columns: 1fr 1fr;
          }

          .closing-stock-page .stock-grid-cols {
            grid-template-columns: 1.8fr 1.2fr 0.8fr 0.8fr !important;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 768px) {
          .stock-entry-row {
            grid-template-columns: 1fr;
          }

          .closing-stock-page .data-table-head {
            display: none !important;
          }

          .closing-stock-page .inventory-row.stock-grid-cols {
            display: flex !important;
            flex-direction: column;
            grid-template-columns: none !important;
            gap: 0.45rem;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            width: 100%;
          }

          .closing-stock-page .inventory-row__group {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            width: 100%;
          }

          .closing-stock-page .inventory-row > [data-label] {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .closing-stock-page .inventory-row > [data-label]::before {
            content: attr(data-label);
            font-size: 0.66rem;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            opacity: 0.55;
            font-weight: 600;
            flex-shrink: 0;
            margin-right: 0.75rem;
          }

          .closing-stock-page .inventory-row__group[data-label]::before {
            display: none;
          }

          .closing-actions {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}