import { useState } from "react";
import { Plus, Tags, Pencil, Trash2, Save, X, Check } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import Button from "../../../components/buttons/Button";
import Modal from "../../../components/common/Modal";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";

const emptyForm = { name: "" };

export default function Categories() {
  const { categories, setCategories } = useData();
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

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast("Category name is required", "error");
      return;
    }
    if (editingId) {
      setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form } : c)));
      toast("Category Updated Successfully");
    } else {
      setCategories((prev) => [...prev, { id: `c${Date.now()}`, ...form }]);
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
            flex-direction: row !important;
            justify-content: space-between;
            align-items: center !important;
            padding: 0.6rem 0.8rem !important;
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
        <div className="data-table-head" style={{ gridTemplateColumns: "3fr 1fr" }}>
          <span>Category</span>
          <span>Actions</span>
        </div>
        {categories.map((c) => (
          <div
            key={c.id}
            className="inventory-row"
            style={{ gridTemplateColumns: "3fr 1fr" }}
          >
            <div className="inventory-row__group">
              <div className="kpi-card__icon" style={{ width: 28, height: 28, margin: 0 }}>
                <Tags size={14} strokeWidth={1.5} />
              </div>
              <div className="inventory-row__name">{c.name}</div>
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
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="glass" size="sm" icon={<X size={15} />} onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="gold" size="sm" icon={<Save size={15} />} onClick={handleSave}>{editingId ? "Save Changes" : "Add Category"}</Button>
        </div>
      </Modal>
    </div>
  );
}
