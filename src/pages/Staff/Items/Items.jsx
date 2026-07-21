import { useState } from "react";
import { Plus, Pencil, Trash2, Gem, Check, X, Save } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import Button from "../../../components/buttons/Button";
import Modal from "../../../components/common/Modal";
import { formatCurrency, formatWeight, goldRate, silverRate } from "../../../data/mockData";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";

const statusBadge = (status) => {
  const map = {
    "In Stock": "badge-lux--success",
    Reserved: "badge-lux--warning",
    Sold: "badge-lux--danger",
  };
  return map[status] || "badge-lux--neutral";
};

// Approximate valuation for newly added pieces: weight × current rate.
const computeValue = (group, weight) =>
  Math.round((Number(weight) || 0) * (group === "Silver" ? silverRate : goldRate / 10));

export default function StaffItems() {
  const { items, setItems, itemGroups, categories, branches } = useData();
  const toast = useToast();
  const { user } = useAuth();
  const defaultBranch = user?.branch && user.branch !== "All Branches" ? user.branch : branches[0]?.name || "";

  const emptyForm = {
    name: "",
    group: itemGroups[0]?.name || "Gold",
    category: categories[0]?.name || "Ring",
    quantity: 1,
    weight: "",
    branch: defaultBranch,
    purity: "22K",
    status: "In Stock",
  };

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      i.code.toLowerCase().includes(query.toLowerCase()) ||
      i.category.toLowerCase().includes(query.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      group: item.group,
      category: item.category,
      quantity: item.quantity ?? 1,
      weight: item.weight,
      branch: item.branch,
      purity: item.purity,
      status: item.status,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.weight || !form.branch) {
      toast("Item name, weight, and branch are required", "error");
      return;
    }
    const payload = {
      ...form,
      quantity: Math.max(1, Number(form.quantity) || 1),
      weight: Number(form.weight),
      value: computeValue(form.group, form.weight),
    };
    if (editingId) {
      setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...payload } : i)));
      toast("Item Updated Successfully");
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: `i${Date.now()}`,
          code: `LX-NEW-${String(prev.length + 1).padStart(3, "0")}`,
          barcode: `89012345${Date.now() % 100000}`,
          ...payload,
        },
      ]);
      toast("Item Added Successfully");
    }
    setModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setConfirmDeleteId(null);
    toast("Item Deleted Successfully");
  };

  return (
    <div className="lux-container items-page">
      <PageHero
        eyebrow="Inventory"
        title="Items"
        subtitle="Jewellery pieces at your branch"
      >
        <Button variant="gold" size="sm" icon={<Plus size={16} />} onClick={openAdd}>
          Add Item
        </Button>
      </PageHero>

      <GlassCard className="mb-3">
        <input
          className="glass-input items-search-input"
          placeholder="Search by name, code, or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </GlassCard>

      <GlassCard>
        <div className="items-table-wrap">
          <div className="data-table-head items-grid-cols">
            <span>Item</span>
            <span>Qty</span>
            <span>Weight</span>
            <span>Purity</span>
            <span>Value</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filtered.map((item) => (
            <div
              key={item.id}
              className="inventory-row items-grid-cols"
            >
              <div className="inventory-row__group" data-label="Item">
                <div className="inventory-row__thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gold-soft)" }}>
                  <Gem size={15} color="var(--gold)" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="inventory-row__name">{item.name}</div>
                  <div className="inventory-row__sub">{item.group} · {item.category} · {item.code}</div>
                </div>
              </div>

              <div className="inventory-row__value" data-label="Qty">{item.quantity ?? 1}</div>
              <div className="inventory-row__value" data-label="Weight">{formatWeight(item.weight)}</div>
              <div className="inventory-row__value" data-label="Purity">{item.purity}</div>
              <div className="inventory-row__value text-gold" data-label="Value">{formatCurrency(item.value)}</div>

              <div data-label="Status">
                <span className={`badge-lux ${statusBadge(item.status)}`}>{item.status}</span>
              </div>

              <div className="row-action" data-label="Actions">
                {confirmDeleteId === item.id ? (
                  <>
                    <button className="icon-btn" style={{ color: "var(--danger)" }} onClick={() => handleDelete(item.id)} aria-label="Confirm delete">
                      <Check size={15} />
                    </button>
                    <button className="icon-btn" onClick={() => setConfirmDeleteId(null)} aria-label="Cancel delete">
                      <X size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="icon-btn" onClick={() => openEdit(item)} aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button className="icon-btn" style={{ color: "var(--danger)" }} onClick={() => setConfirmDeleteId(item.id)} aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="items-empty-state">No items match your search.</div>
          )}
        </div>
      </GlassCard>

      {/* Add / Edit — centered modal popup */}
      <Modal
        open={modalOpen}
        title={editingId ? "Edit Item" : "Add New Item"}
        subtitle={editingId ? "Update the piece details" : "Register a new jewellery piece"}
        onClose={() => setModalOpen(false)}
        width={560}
      >
        <div className="form-grid-2 mb-3">
          <div>
            <label className="form-label-lux">Item Name</label>
            <input className="glass-input" placeholder="e.g. Sapphire Royal Ring" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="form-label-lux">Group</label>
            <select className="glass-input glass-select" value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}>
              {itemGroups.map((g) => (
                <option key={g.id} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label-lux">Category</label>
            <select className="glass-input glass-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label-lux">Branch</label>
            <select className="glass-input glass-select" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}>
              {branches.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label-lux">Quantity</label>
            <input className="glass-input" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
          <div>
            <label className="form-label-lux">Weight (grams)</label>
            <input className="glass-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div>
            <label className="form-label-lux">Purity</label>
            <select className="glass-input glass-select" value={form.purity} onChange={(e) => setForm({ ...form, purity: e.target.value })}>
              <option>24K</option>
              <option>22K</option>
              <option>18K</option>
              <option>14K</option>
              <option>PT950</option>
              <option>925</option>
            </select>
          </div>
          <div>
            <label className="form-label-lux">Status</label>
            <select className="glass-input glass-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>In Stock</option>
              <option>Reserved</option>
              <option>Sold</option>
            </select>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="glass" size="sm" icon={<X size={15} />} onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="gold" size="sm" icon={<Save size={15} />} onClick={handleSave}>{editingId ? "Save Changes" : "Add Item"}</Button>
        </div>
      </Modal>

      {/* Scoped responsive styles — self-contained, no external CSS dependency */}
      <style>{`
        .items-table-wrap {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        .items-search-input {
          max-width: 400px;
          width: 100%;
        }

        .items-empty-state {
          padding: 1.5rem 1rem;
          text-align: center;
          opacity: 0.6;
          font-size: 0.85rem;
        }

        .items-page .items-grid-cols {
          display: grid !important;
          grid-template-columns: 2.4fr 0.7fr 1fr 0.9fr 1.1fr 1fr 1fr;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .items-page .items-grid-cols {
            grid-template-columns: 2fr 0.7fr 0.9fr 0.8fr 1fr 1fr 0.9fr !important;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 768px) {
          .items-search-input {
            max-width: 100%;
          }

          .items-page .data-table-head {
            display: none !important;
          }

          .items-page .inventory-row.items-grid-cols {
            display: flex !important;
            flex-direction: column;
            grid-template-columns: none !important;
            gap: 0.45rem;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            width: 100%;
          }

          .items-page .inventory-row__group {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            width: 100%;
          }

          .items-page .inventory-row > [data-label] {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .items-page .inventory-row > [data-label]::before {
            content: attr(data-label);
            font-size: 0.66rem;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            opacity: 0.55;
            font-weight: 600;
            flex-shrink: 0;
            margin-right: 0.75rem;
          }

          .items-page .inventory-row__group[data-label]::before {
            display: none;
          }

          .items-page .row-action {
            justify-content: flex-end;
            gap: 0.5rem;
          }

          .items-page .row-action::before {
            content: none;
          }
        }
      `}</style>
    </div>
  );
}
