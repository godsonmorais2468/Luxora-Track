import { useState } from "react";
import { Plus, Tags, Pencil, Trash2, Save, X, Check } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import Button from "../../../components/buttons/Button";
import Modal from "../../../components/common/Modal";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";

const emptyForm = { name: "", group: "" };

// A category may not yet have a status field (older records) — normalize once here.
const getStatus = (c) => c?.status || "Active";

export default function Categories() {
  const { categories, setCategories, itemGroups } = useData();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [statusChangeTarget, setStatusChangeTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, group: c.group || "" });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast("Category name is required", "error");
      return;
    }
    if (!form.group) {
      toast("Please select a group", "error");
      return;
    }
    if (editingId) {
      setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form } : c)));
      toast("Category Updated Successfully");
    } else {
      setCategories((prev) => [{ id: `c${Date.now()}`, status: "Active", ...form }, ...prev]);
      toast("Category Added Successfully");
    }
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setConfirmDeleteId(null);
    toast("Category Deleted Successfully");
  };

  // Status change requires confirmation before it takes effect.
  const requestStatusChange = (c) => {
    setStatusChangeTarget(c);
  };

  const confirmStatusChange = () => {
    if (!statusChangeTarget) return;
    const next = getStatus(statusChangeTarget) === "Active" ? "Inactive" : "Active";
    setCategories((prev) => prev.map((c) => (c.id === statusChangeTarget.id ? { ...c, status: next } : c)));
    toast(`Status updated to ${next}`);
    setStatusChangeTarget(null);
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
        title="Categories"
        subtitle="Jewellery categories used across the inventory"
      >
        <Button variant="gold" size="sm" icon={<Plus size={16} />} onClick={openAdd}>
          Add Category
        </Button>
      </PageHero>

      <GlassCard>
        <div className="data-table-head" style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1fr" }}>
          <span>Category Name</span>
          <span>Group</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {categories.map((c) => (
          <div
            key={c.id}
            className="inventory-row"
            style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1fr" }}
          >
            <div className="inventory-row__group">
              <div className="kpi-card__icon" style={{ width: 28, height: 28, margin: 0 }}>
                <Tags size={14} strokeWidth={1.5} />
              </div>
              <div className="inventory-row__name">{c.name}</div>
            </div>
            <div className="inventory-row__value" data-label="Group">{c.group || "—"}</div>
            <div className="inventory-row__value" data-label="Status">
              <button
                onClick={() => requestStatusChange(c)}
                title="Click to change status"
                style={{
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 14px",
                  borderRadius: 999,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  border: `1px solid ${getStatus(c) === "Active" ? "var(--success)" : "var(--danger)"}`,
                  background: getStatus(c) === "Active" ? "rgba(46, 204, 113, 0.12)" : "rgba(231, 76, 60, 0.12)",
                  color: getStatus(c) === "Active" ? "var(--success)" : "var(--danger)",
                }}
              >
                {getStatus(c)}
              </button>
            </div>
            <div className="row-action">
              {confirmDeleteId === c.id ? (
                <>
                  <button className="icon-btn" style={{ color: "var(--danger)" }} onClick={() => handleDelete(c.id)} aria-label="Confirm delete">
                    <Check size={15} />
                  </button>
                  <button className="icon-btn" onClick={() => setConfirmDeleteId(null)} aria-label="Cancel delete">
                    <X size={15} />
                  </button>
                </>
              ) : (
                <>
                  <button className="icon-btn" onClick={() => openEdit(c)} aria-label="Edit">
                    <Pencil size={15} />
                  </button>
                  <button className="icon-btn" style={{ color: "var(--danger)" }} onClick={() => setConfirmDeleteId(c.id)} aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && <div className="empty-state">No categories yet.</div>}
      </GlassCard>

      {/* Add / Edit — centered modal popup */}
      <Modal
        open={modalOpen}
        title={editingId ? "Edit Category" : "New Category"}
        subtitle={editingId ? "Update category name" : "Create a new jewellery category"}
        onClose={() => setModalOpen(false)}
        width={400}
      >
        <div className="mb-3">
          <label className="form-label-lux">Category Name</label>
          <input className="glass-input" placeholder="e.g. Ring" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label-lux">Group</label>
          <select
            className="glass-input glass-select"
            value={form.group}
            onChange={(e) => setForm({ ...form, group: e.target.value })}
          >
            <option value="">Select a group</option>
            {(itemGroups || []).map((g) => (
              <option key={g.id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="glass" size="sm" icon={<X size={15} />} onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="gold" size="sm" icon={<Save size={15} />} onClick={handleSave}>{editingId ? "Save Changes" : "Add Category"}</Button>
        </div>
      </Modal>

      {/* Status change — confirmation modal popup */}
      <Modal
        open={!!statusChangeTarget}
        title="Change Status"
        subtitle="Please confirm this action"
        onClose={() => setStatusChangeTarget(null)}
        width={380}
      >
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
          {statusChangeTarget && (
            <>
              Are you sure you want to change <strong style={{ color: "var(--white)" }}>{statusChangeTarget.name}</strong> from{" "}
              <strong style={{ color: getStatus(statusChangeTarget) === "Inactive" ? "var(--danger)" : "var(--success)" }}>
                {getStatus(statusChangeTarget)}
              </strong>{" "}
              to{" "}
              <strong style={{ color: getStatus(statusChangeTarget) === "Active" ? "var(--danger)" : "var(--success)" }}>
                {getStatus(statusChangeTarget) === "Active" ? "Inactive" : "Active"}
              </strong>
              ?
            </>
          )}
        </p>
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="glass" size="sm" icon={<X size={15} />} onClick={() => setStatusChangeTarget(null)}>Cancel</Button>
          <Button variant="gold" size="sm" icon={<Check size={15} />} onClick={confirmStatusChange}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}