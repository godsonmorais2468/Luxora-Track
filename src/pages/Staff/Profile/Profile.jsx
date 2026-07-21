import { useState } from "react";
import { Mail, Phone, Building, Shield, Edit, Save } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import SectionHeader from "../../../components/common/SectionHeader";
import Button from "../../../components/buttons/Button";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";

export default function Profile() {
  const { user } = useAuth();
  const toast = useToast();
  const initials = user?.full_name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    phone: "+971 4 555 0192",
  });

  const [security, setSecurity] = useState({ currentPassword: "", newPassword: "", newMpin: "", confirmMpin: "" });

  const saveProfile = () => {
    setEditing(false);
    toast("Profile Updated Successfully");
  };

  const updateSecurity = () => {
    if (!security.newPassword && !security.newMpin) {
      toast("Enter a new password or MPIN to update", "error");
      return;
    }
    if (security.newMpin && security.newMpin !== security.confirmMpin) {
      toast("MPIN values don't match", "error");
      return;
    }
    setSecurity({ currentPassword: "", newPassword: "", newMpin: "", confirmMpin: "" });
    toast("Security Details Updated Successfully");
  };

  return (
    <div className="lux-container" style={{ maxWidth: 900 }}>
      <PageHero
        eyebrow="Account"
        title="My Profile"
        subtitle="View and manage your account information"
      />

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="fade-in-up">
            <GlassCard style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: "linear-gradient(135deg, var(--gold), #b8941f)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "1.7rem",
                  fontWeight: 700,
                  color: "#0a0a0a",
                  fontFamily: "var(--font-heading)",
                  boxShadow: "0 8px 32px rgba(212,175,55,0.3)",
                }}
              >
                {initials}
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem" }}>{profile.name}</h3>
              <p style={{ color: "var(--gold)", fontSize: "0.8rem", marginTop: 4 }}>{user?.role}</p>
              <div className="divider-gold my-3" />
              <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                  <Building size={13} /> {user?.branch}
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <Shield size={13} /> {user?.role} Access Level
                </div>
              </div>
              <Button variant="glass" size="sm" icon={<Edit size={15} />} className="mt-3 w-100" onClick={() => setEditing((e) => !e)}>
                {editing ? "Editing…" : "Edit Profile"}
              </Button>
            </GlassCard>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="fade-in-up">
            <GlassCard className="mb-3">
              <SectionHeader title="Personal Information" subtitle="Your account details" />
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label-lux">Full Name</label>
                  <input
                    className="glass-input"
                    value={profile.name}
                    disabled={!editing}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-lux">Email</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={15} color="var(--muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      className="glass-input"
                      style={{ paddingLeft: 38 }}
                      value={profile.email}
                      disabled={!editing}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label-lux">Phone</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={15} color="var(--muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      className="glass-input"
                      style={{ paddingLeft: 38 }}
                      value={profile.phone}
                      disabled={!editing}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label-lux">Assigned Branch</label>
                  <input className="glass-input" defaultValue={user?.branch} disabled />
                </div>
              </div>
              {editing && (
                <Button variant="gold" size="sm" icon={<Save size={15} />} onClick={saveProfile}>
                  Save Changes
                </Button>
              )}
            </GlassCard>

            <GlassCard>
              <SectionHeader title="Security" subtitle="Change your MPIN and password" />
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label-lux">Current Password</label>
                  <input
                    className="glass-input"
                    type="password"
                    placeholder="••••••••"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-lux">New Password</label>
                  <input
                    className="glass-input"
                    type="password"
                    placeholder="••••••••"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-lux">New MPIN (4 digits)</label>
                  <input
                    className="glass-input"
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    value={security.newMpin}
                    onChange={(e) => setSecurity({ ...security, newMpin: e.target.value.replace(/\D/g, "") })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-lux">Confirm MPIN</label>
                  <input
                    className="glass-input"
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    value={security.confirmMpin}
                    onChange={(e) => setSecurity({ ...security, confirmMpin: e.target.value.replace(/\D/g, "") })}
                  />
                </div>
              </div>
              <Button variant="gold" size="sm" onClick={updateSecurity}>Update Security</Button>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
