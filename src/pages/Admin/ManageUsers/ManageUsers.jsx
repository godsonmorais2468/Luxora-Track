import { useState } from "react";
import { Pencil, Trash2, Shield, Mail, Save, X, Check } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import Button from "../../../components/buttons/Button";
import Modal from "../../../components/common/Modal";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";

const emptyForm = { name: "", email: "", role: "Staff" };

export default function ManageUsers() {
  const { users, setUsers } = useData();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase())
  );

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({ name: u.name, email: u.email, role: u.role });
  };

  const saveEdit = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast("Name and email are required", "error");
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...form } : u)));
    setEditingId(null);
    toast("User Updated Successfully");
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setConfirmDeleteId(null);
    toast("User Deleted Successfully");
  };

  // One-click status toggle — no form needed.
  const toggleStatus = (u) => {
    const next = u.status === "Active" ? "Inactive" : "Active";
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: next } : x)));
    toast(`Status updated to ${next}`);
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
            align-items: center;
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
        eyebrow="Access Control"
        title="Manage Users"
        subtitle="Click a status badge to toggle it — edit and delete inline"
      />

      <GlassCard className="mb-3">
        <input
          className="glass-input"
          placeholder="Search by name, email, or role..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </GlassCard>

      <GlassCard>
        <div className="data-table-head" style={{ gridTemplateColumns: "2fr 2fr 1fr 2fr 1fr 1.5fr 1fr" }}>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Branch</span>
          <span>Status</span>
          <span>Last Login</span>
          <span>Actions</span>
        </div>
        {filtered.map((u) => (
          <div
            key={u.id}
            className="inventory-row"
            style={{ gridTemplateColumns: "2fr 2fr 1fr 2fr 1fr 1.5fr 1fr" }}
          >
            <div className="inventory-row__group">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: u.role === "Admin" ? "linear-gradient(135deg, var(--gold), #b8941f)" : "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: u.role === "Admin" ? "#0a0a0a" : "var(--white)",
                  flexShrink: 0,
                }}
              >
                {u.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="inventory-row__name">{u.name}</div>
              </div>
            </div>
            <div className="inventory-row__value" data-label="Email" style={{ fontSize: "0.78rem" }}>
              <Mail size={11} style={{ display: "inline", marginRight: 4 }} />
              {u.email}
            </div>
            <div className="inventory-row__value" data-label="Role">
              <span className={`badge-lux ${u.role === "Admin" ? "badge-lux--gold" : "badge-lux--neutral"}`}>
                {u.role === "Admin" && <Shield size={11} />}
                {u.role}
              </span>
            </div>
            <div className="inventory-row__value" data-label="Branch" style={{ fontSize: "0.78rem" }}>{u.branch}</div>
            <div className="inventory-row__value" data-label="Status">
              <button
                className={`badge-lux ${u.status === "Active" ? "badge-lux--success" : "badge-lux--danger"}`}
                onClick={() => toggleStatus(u)}
                title="Click to toggle status"
                style={{ cursor: "pointer" }}
              >
                {u.status}
              </button>
            </div>
            <div className="inventory-row__value" data-label="Last Login" style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{u.lastLogin}</div>
            <div className="row-action">
              {confirmDeleteId === u.id ? (
                <>
                  <button className="icon-btn" style={{ color: "var(--danger)" }} onClick={() => deleteUser(u.id)} aria-label="Confirm delete">
                    <Check size={15} />
                  </button>
                  <button className="icon-btn" onClick={() => setConfirmDeleteId(null)} aria-label="Cancel delete">
                    <X size={15} />
                  </button>
                </>
              ) : (
                <>
                  <button className="icon-btn" onClick={() => startEdit(u)} aria-label="Edit">
                    <Pencil size={15} />
                  </button>
                  <button className="icon-btn" style={{ color: "var(--danger)" }} onClick={() => setConfirmDeleteId(u.id)} aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-state">No users found.</div>}
      </GlassCard>

      {/* Edit user — centered modal popup */}
      <Modal open={!!editingId} title="Edit User" subtitle="Update account details" onClose={() => setEditingId(null)}>
        <div className="form-grid-2 mb-3">
          <div>
            <label className="form-label-lux">Full Name</label>
            <input className="glass-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="form-label-lux">Email</label>
            <input className="glass-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label-lux">Role</label>
          <select className="glass-input glass-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <Button variant="glass" size="sm" icon={<X size={15} />} onClick={() => setEditingId(null)}>Cancel</Button>
          <Button variant="gold" size="sm" icon={<Save size={15} />} onClick={saveEdit}>Save Changes</Button>
        </div>
      </Modal>
    </div>
  );
}
