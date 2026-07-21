import { useState } from "react";
import { Save, PackageCheck, Gem } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import SectionHeader from "../../../components/common/SectionHeader";
import Button from "../../../components/buttons/Button";
import MpinDialog from "../../../components/common/MpinDialog";
import { formatCurrency, formatWeight } from "../../../data/mockData";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";

export default function ClosingStock() {
  const { items } = useData();
  const toast = useToast();
  const { user } = useAuth();
  const [showMpin, setShowMpin] = useState(false);
  const [saved, setSaved] = useState(false);

  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const branchName = user?.branch && user.branch !== "All Branches" ? user.branch : "Dubai Marina Atelier";

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
        <div className="stock-table-wrap">
          <div className="data-table-head stock-grid-cols">
            <span>Item</span>
            <span>Code</span>
            <span>Weight</span>
            <span>Value</span>
            <span>Closing Qty</span>
            <span>Confirmed</span>
          </div>
          {items.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="inventory-row stock-grid-cols"
            >
              <div className="inventory-row__group" data-label="Item">
                <div className="inventory-row__thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gold-soft)" }}>
                  <Gem size={15} color="var(--gold)" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="inventory-row__name">{item.name}</div>
                  <div className="inventory-row__sub">{item.category}</div>
                </div>
              </div>
              <div className="inventory-row__value stock-code" data-label="Code">{item.code}</div>
              <div className="inventory-row__value" data-label="Weight">{formatWeight(item.weight)}</div>
              <div className="inventory-row__value text-gold" data-label="Value">{formatCurrency(item.value)}</div>
              <div data-label="Closing Qty">
                <input className="glass-input stock-qty-input" type="number" min="0" defaultValue={item.quantity ?? 1} />
              </div>
              <div data-label="Confirmed">
                <input type="checkbox" defaultChecked style={{ accentColor: "var(--gold)" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex gap-2 mt-3 closing-actions align-items-center">
          <Button variant="gold" size="sm" icon={<Save size={15} />} onClick={() => setShowMpin(true)}>
            Save Closing Stock
          </Button>
          {saved && <span className="badge-lux badge-lux--success">Saved</span>}
        </div>
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

        .closing-stock-page .stock-grid-cols {
          display: grid !important;
          grid-template-columns: 2.4fr 1fr 1fr 1.2fr 1fr 1fr;
          width: 100%;
        }

        .stock-code {
          font-size: 0.78rem;
        }

        .stock-qty-input {
          width: 68px;
          padding: 0.35rem 0.5rem;
        }

        @media (max-width: 1024px) {
          .closing-stock-page .stock-grid-cols {
            grid-template-columns: 2fr 1fr 0.8fr 1fr 0.8fr 0.8fr !important;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 768px) {
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

          .closing-stock-page .stock-qty-input {
            width: 84px;
          }

          .closing-actions {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}
