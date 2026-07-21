import { useState } from "react";
import { Pencil, Trash2, Shield, Mail, Phone, Save, X, Check } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import Button from "../../../components/buttons/Button";
import Modal from "../../../components/common/Modal";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";

const emptyForm = { name: "", email: "", phone: "", role: "Staff", branchId: "" };

export default function ManageUsers() {
  const { users, setUsers, branches } = useData();
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
    const matchedBranch = branches.find((b) => b.name === u.branch);
    setForm({
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      role: u.role,
      branchId: matchedBranch ? matchedBranch.id : "",
    });
  };

  // Role drives the branch dropdown, same behavior as Register User:
  // "All Branches (Admin)" is only a valid choice for Admins.
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setForm((f) => ({ ...f, role, branchId: role === "Staff" && f.branchId === "" ? "" : f.branchId }));
  };

  const saveEdit = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast("Name and email are required", "error");
      return;
    }
    if (form.role === "Staff" && !form.branchId) {
      toast("Please assign a branch for staff users", "error");
      return;
    }
    const branch = branches.find((b) => b.id === form.branchId);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingId
          ? {
              ...u,
              name: form.name,
              email: form.email,
              phone: form.phone,
              role: form.role,
              branch: branch ? branch.name : "All Branches",
            }
          : u
      )
    );
    setEditingId(null);
    toast("User Updated Successfully");
  };

  // Newest user shows first — sorted by id timestamp, no data mutation needed.
  const sortedFiltered = [...filtered].sort((a, b) => {
    const tb = parseInt(String(b.id).replace(/\D/g, ""), 10) || 0;
    const ta = parseInt(String(a.id).replace(/\D/g, ""), 10) || 0;
    return tb - ta;
  });

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
        <div className="data-table-head" style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr" }}>
          <span>Name / Branch</span>
          <span>Phone Number / Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {sortedFiltered.map((u) => (
          <div
            key={u.id}
            className="inventory-row"
            style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr" }}
          >
            {/* Name / Branch — stacked, Branch directly below Name */}
            <div className="inventory-row__group" style={{ flexDirection: "row", alignItems: "flex-start" }}>
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
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div className="inventory-row__name">{u.name}</div>
                <div style={{ fontSize: "0.76rem", color: "var(--muted)" }}>{u.branch}</div>
              </div>
            </div>

            {/* Phone Number / Email — stacked, Email directly below Phone Number */}
            <div className="inventory-row__value" data-label="Phone / Email" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, fontSize: "0.78rem" }}>
              <span>
                <Phone size={11} style={{ display: "inline", marginRight: 4 }} />
                {u.phone || "—"}
              </span>
              <span style={{ color: "var(--muted)" }}>
                <Mail size={11} style={{ display: "inline", marginRight: 4 }} />
                {u.email}
              </span>
            </div>

            <div className="inventory-row__value" data-label="Role">
              <span className={`badge-lux ${u.role === "Admin" ? "badge-lux--gold" : "badge-lux--neutral"}`}>
                {u.role === "Admin" && <Shield size={11} />}
                {u.role}
              </span>
            </div>

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
        {sortedFiltered.length === 0 && <div className="empty-state">No users found.</div>}
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
        <div className="form-grid-2 mb-3">
          <div>
            <label className="form-label-lux">Phone Number</label>
            <input className="glass-input" placeholder="+xx xxx xxx xxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="form-label-lux">Role</label>
            <select className="glass-input glass-select" value={form.role} onChange={handleRoleChange}>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label-lux">Assigned Branch</label>
          <select className="glass-input glass-select" value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
            {form.role === "Admin" ? (
              <option value="">All Branches (Admin)</option>
            ) : (
              <option value="" disabled>
                Select branch…
              </option>
            )}
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
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