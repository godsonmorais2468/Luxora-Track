import { useState } from "react";
import { Save, X, CheckCircle2 } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import Button from "../../../components/buttons/Button";
import MpinDialog from "../../../components/common/MpinDialog";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";

const emptyForm = { name: "", email: "", phone: "", role: "Staff", branchId: "", password: "", confirmPassword: "" };

export default function RegisterUser() {
  const { branches, setUsers } = useData();
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [showMpin, setShowMpin] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // Role drives the branch dropdown: "All Branches (Admin)" is only a valid
  // choice for Admins. Switching to Staff clears any all-branches selection.
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setForm((f) => ({ ...f, role, branchId: role === "Staff" && f.branchId === "" ? "" : f.branchId }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setSuccessMsg(false);
    if (!form.name.trim() || !form.email.trim() || !form.password) return;
    if (form.role === "Staff" && !form.branchId) {
      toast("Please assign a branch for staff users", "error");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast("Passwords don't match", "error");
      return;
    }
    setShowMpin(true);
  };

  const completeRegistration = () => {
    const branch = branches.find((b) => b.id === form.branchId);
    setUsers((prev) => [
      ...prev,
      {
        id: `u${Date.now()}`,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        branch: branch ? branch.name : "All Branches",
        status: "Active",
        lastLogin: "Never",
      },
    ]);
    setShowMpin(false);
    setForm(emptyForm);
    setSuccessMsg(true);
    toast("User Registered Successfully");
  };

  return (
    <div className="lux-container" style={{ maxWidth: 900 }}>
      <PageHero
        eyebrow="Access Control"
        title="Register User"
        subtitle="Create a new staff or admin account"
      />

      {successMsg && (
        <GlassCard
          className="mb-3"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid var(--success)",
            background: "rgba(46, 204, 113, 0.08)",
          }}
        >
          <CheckCircle2 size={18} color="var(--success)" />
          <span style={{ color: "var(--success)", fontWeight: 600, fontSize: "0.88rem" }}>
            User registered successfully.
          </span>
        </GlassCard>
      )}

      <GlassCard>
        <form onSubmit={handleRegister}>
          <div className="form-section-title">User Information</div>
          <div className="form-section-sub">Personal details and credentials.</div>

          <div className="form-grid-2 mb-3">
            <div>
              <label className="form-label-lux">Full Name</label>
              <input className="glass-input" placeholder="Enter full name" value={form.name} onChange={update("name")} required />
            </div>
            <div>
              <label className="form-label-lux">Email Address</label>
              <input className="glass-input" type="email" placeholder="name@luxora.io" value={form.email} onChange={update("email")} required />
            </div>
          </div>

          <div className="form-grid-2 mb-3">
            <div>
              <label className="form-label-lux">Phone Number</label>
              <input className="glass-input" placeholder="+xx xxx xxx xxxx" value={form.phone} onChange={update("phone")} />
            </div>
            <div>
              <label className="form-label-lux">Role</label>
              <select className="glass-input glass-select" value={form.role} onChange={handleRoleChange}>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2 mb-3">
            <div>
              <label className="form-label-lux">Assigned Branch</label>
              <select className="glass-input glass-select" value={form.branchId} onChange={update("branchId")}>
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
            <div />
          </div>

          <div className="form-grid-2 mb-4">
            <div>
              <label className="form-label-lux">Password</label>
              <input className="glass-input" type="password" placeholder="Set initial password" value={form.password} onChange={update("password")} required />
            </div>
            <div>
              <label className="form-label-lux">Confirm Password</label>
              <input className="glass-input" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={update("confirmPassword")} required />
            </div>
          </div>

          <div className="d-flex gap-2">
            <Button variant="gold" type="submit" size="sm" icon={<Save size={15} />}>
              Register User
            </Button>
            <Button variant="glass" size="sm" icon={<X size={15} />} onClick={() => setForm(emptyForm)}>
              Cancel
            </Button>
          </div>
        </form>
      </GlassCard>

      <MpinDialog
        open={showMpin}
        title="Authorize User Registration"
        onClose={() => setShowMpin(false)}
        onSuccess={completeRegistration}
      />
    </div>
  );
}