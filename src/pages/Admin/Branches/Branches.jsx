import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Save, X, Check, Coins, ChevronRight } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import Button from "../../../components/buttons/Button";
import Modal from "../../../components/common/Modal";
import { formatWeight } from "../../../data/mockData";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";

const emptyForm = { name: "", code: "", manager: "", phone: "" };

export default function Branches() {
  const navigate = useNavigate();
  const { branches, setBranches } = useData();
  const toast = useToast();
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const startEdit = (b) => {
    setEditingId(b.id);
    setForm({ name: b.name, code: b.code, manager: b.manager, phone: b.phone });
  };

  const saveEdit = () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast("Branch name and code are required", "error");
      return;
    }
    setBranches((prev) => prev.map((b) => (b.id === editingId ? { ...b, ...form } : b)));
    setEditingId(null);
    toast("Branch Updated Successfully");
  };

  const deleteBranch = (id) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
    setConfirmDeleteId(null);
    toast("Branch Deleted Successfully");
  };

  return (
    <div className="lux-container">
      <PageHero eyebrow="Network" title="Branches" subtitle="Stock by branch and metal group" />

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {branches.map((b, i) => (
          <div
            key={b.id}
            className="glass-card"
            style={{ padding: "0.85rem 1.1rem", cursor: "pointer" }}
            onClick={() => navigate(`/admin/branches/${b.id}`)}
          >
            <div className="d-flex justify-content-between align-items-center" style={{ gap: 10, marginBottom: "0.55rem", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "0.98rem", color: "var(--white)" }}>{b.name}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                  Branch Code: <span style={{ color: "var(--gold)" }}>{b.code}</span> · {b.manager}
                </div>
              </div>
              <div className="row-action" onClick={(e) => e.stopPropagation()}>
                {confirmDeleteId === b.id ? (
                  <>
                    <button className="icon-btn" style={{ color: "var(--danger)" }} onClick={() => deleteBranch(b.id)} aria-label="Confirm delete">
                      <Check size={15} />
                    </button>
                    <button className="icon-btn" onClick={() => setConfirmDeleteId(null)} aria-label="Cancel delete">
                      <X size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="icon-btn" onClick={() => startEdit(b)} aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button className="icon-btn" style={{ color: "var(--danger)" }} onClick={() => setConfirmDeleteId(b.id)} aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                    <button className="icon-btn" onClick={() => navigate(`/admin/branches/${b.id}`)} aria-label="View details">
                      <ChevronRight size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Both metal groups inside the SAME branch card */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {b.groups.map((g) => (
                <div key={g.group} className="metal-row">
                  <div className="metal-row__name">
                    <Coins size={13} color={g.group === "Gold" ? "var(--gold)" : "var(--secondary)"} /> {g.group}
                  </div>
                  <div className="metal-row__stats">
                    <div className="metal-row__stat">
                      <span className="metal-row__stat-label">Quantity</span>
                      <span className="metal-row__stat-value">{g.quantity}</span>
                    </div>
                    <div className="metal-row__stat">
                      <span className="metal-row__stat-label">Weight</span>
                      <span className="metal-row__stat-value">{formatWeight(g.weight)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {branches.length === 0 && <div className="empty-state">No branches yet.</div>}
      </div>

      {/* Edit branch — centered modal popup */}
      <Modal open={!!editingId} title="Edit Branch" subtitle="Update branch details" onClose={() => setEditingId(null)}>
        <div className="form-grid-2 mb-3">
          <div>
            <label className="form-label-lux">Branch Name</label>
            <input className="glass-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="form-label-lux">Branch Code</label>
            <input className="glass-input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <div>
            <label className="form-label-lux">Manager</label>
            <input className="glass-input" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />
          </div>
          <div>
            <label className="form-label-lux">Phone</label>
            <input className="glass-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="glass" size="sm" icon={<X size={15} />} onClick={() => setEditingId(null)}>Cancel</Button>
          <Button variant="gold" size="sm" icon={<Save size={15} />} onClick={saveEdit}>Save Changes</Button>
        </div>
      </Modal>
    </div>
  );
}
