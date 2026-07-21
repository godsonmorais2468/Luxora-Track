import { useState } from "react";
import { Plus, Layers, Pencil, Trash2, Save, X, Check } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import Button from "../../../components/buttons/Button";
import Modal from "../../../components/common/Modal";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";

const emptyForm = { name: "", code: "" };

export default function ItemGroups() {
  const { itemGroups, setItemGroups } = useData();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (g) => {
    setEditingId(g.id);
    setForm({ name: g.name, code: g.code });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast("Group name and code are required", "error");
      return;
    }
    if (editingId) {
      setItemGroups((prev) => prev.map((g) => (g.id === editingId ? { ...g, ...form } : g)));
      toast("Group Updated Successfully");
    } else {
      setItemGroups((prev) => [...prev, { id: `ig${Date.now()}`, ...form }]);
      toast("Group Added Successfully");
    }
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id) => {
    setItemGroups((prev) => prev.filter((g) => g.id !== id));
    setConfirmDeleteId(null);
    toast("Group Deleted Successfully");
  };

  return (
    <div className="lux-container">
      {/* Scoped responsive fix for the data table on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .data-table-head {
            display: none;
          }
          .inventory-row {
            display: flex !important;
            flex-direction: column;
            align-items: flex-start !important;
            gap: 8px;
            padding: 0.8rem !important;
          }
          .inventory-row > * {
            width: 100%;
          }
          .inventory-row__value {
            display: flex;
            justify-content: space-between;
            width: 100%;
            font-size: 0.82rem;
          }
          .inventory-row__value[data-label]::before {
            content: attr(data-label);
            color: var(--muted);
            font-size: 0.68rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .row-action {
            justify-content: flex-start;
            gap: 8px;
          }
        }
      `}</style>

      <PageHero
        eyebrow="Catalogue"
        title="Item Groups"
        subtitle="Gold and Silver groupings used across the inventory"
      >
        <Button variant="gold" size="sm" icon={<Plus size={16} />} onClick={openAdd}>
          Add Group
        </Button>
      </PageHero>

      <GlassCard>
        <div className="data-table-head" style={{ gridTemplateColumns: "2fr 2fr 1fr" }}>
          <span>Group</span>
          <span>Group Code</span>
          <span>Actions</span>
        </div>
        {itemGroups.map((g) => (
          <div
            key={g.id}
            className="inventory-row"
            style={{ gridTemplateColumns: "2fr 2fr 1fr" }}
          >
            <div className="inventory-row__group">
              <div className="kpi-card__icon" style={{ width: 28, height: 28, margin: 0 }}>
                <Layers size={14} strokeWidth={1.5} />
              </div>
              <div className="inventory-row__name">{g.name}</div>
            </div>
            <div className="inventory-row__value" data-label="Group Code">{g.code}</div>
            <div className="row-action">
              {confirmDeleteId === g.id ? (
                <>
                  <button className="icon-btn" style={{ color: "var(--danger)" }} onClick={() => handleDelete(g.id)} aria-label="Confirm delete">
                    <Check size={15} />
                  </button>
                  <button className="icon-btn" onClick={() => setConfirmDeleteId(null)} aria-label="Cancel delete">
                    <X size={15} />
                  </button>
                </>
              ) : (
                <>
                  <button className="icon-btn" onClick={() => openEdit(g)} aria-label="Edit">
                    <Pencil size={15} />
                  </button>
                  <button className="icon-btn" style={{ color: "var(--danger)" }} onClick={() => setConfirmDeleteId(g.id)} aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {itemGroups.length === 0 && <div className="empty-state">No item groups yet.</div>}
      </GlassCard>

      {/* Add / Edit — centered modal popup */}
      <Modal
        open={modalOpen}
        title={editingId ? "Edit Group" : "New Item Group"}
        subtitle={editingId ? "Update group details" : "Create a new metal group"}
        onClose={() => setModalOpen(false)}
      >
        <div className="form-grid-2 mb-3">
          <div>
            <label className="form-label-lux">Group Name</label>
            <input className="glass-input" placeholder="e.g. Gold" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="form-label-lux">Group Code</label>
            <input className="glass-input" placeholder="e.g. GLD" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="glass" size="sm" icon={<X size={15} />} onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="gold" size="sm" icon={<Save size={15} />} onClick={handleSave}>{editingId ? "Save Changes" : "Add Group"}</Button>
        </div>
      </Modal>
    </div>
  );
}
