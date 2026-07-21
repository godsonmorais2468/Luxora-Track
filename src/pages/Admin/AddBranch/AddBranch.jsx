import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";
import PageHero from "../../../components/hero/PageHero";
import GlassCard from "../../../components/common/GlassCard";
import Button from "../../../components/buttons/Button";
import MpinDialog from "../../../components/common/MpinDialog";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";

const emptyForm = { name: "", code: "", manager: "", phone: "" };

export default function AddBranch() {
  const navigate = useNavigate();
  const { setBranches } = useData();
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [showMpin, setShowMpin] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      toast("Branch name and code are required", "error");
      return;
    }
    setShowMpin(true);
  };

  const completeSave = () => {
    setBranches((prev) => [
      ...prev,
      {
        id: `br-${Date.now()}`,
        name: form.name,
        code: form.code,
        manager: form.manager,
        phone: form.phone,
        groups: [
          { group: "Gold", quantity: 0, weight: 0, categories: [] },
          { group: "Silver", quantity: 0, weight: 0, categories: [] },
        ],
      },
    ]);
    setShowMpin(false);
    toast("Branch Added Successfully");
    navigate("/admin/branches");
  };

  return (
    <div className="lux-container" style={{ maxWidth: 900 }}>
      <PageHero
        eyebrow="Network"
        title="Add New Branch"
        subtitle="Register a new premium atelier in the LUXORA network"
      />

      <GlassCard>
        <form onSubmit={handleSubmit}>
          <div className="form-section-title">Branch Information</div>
          <div className="form-section-sub">Enter the details for the new branch location. Stock is added later from the Branches page.</div>

          <div className="form-grid-2 mb-3">
            <div>
              <label className="form-label-lux">Branch Name</label>
              <input className="glass-input" placeholder="e.g. Tokyo Ginza Atelier" value={form.name} onChange={update("name")} required />
            </div>
            <div>
              <label className="form-label-lux">Branch Code</label>
              <input className="glass-input" placeholder="e.g. TYO-07" value={form.code} onChange={update("code")} required />
            </div>
          </div>

          <div className="form-grid-2 mb-4">
            <div>
              <label className="form-label-lux">Manager Name</label>
              <input className="glass-input" placeholder="Full name" value={form.manager} onChange={update("manager")} />
            </div>
            <div>
              <label className="form-label-lux">Phone Number</label>
              <input className="glass-input" placeholder="+xx xxx xxx xxxx" value={form.phone} onChange={update("phone")} />
            </div>
          </div>

          <div className="d-flex gap-2">
            <Button variant="gold" type="submit" size="sm" icon={<Save size={15} />}>
              Save Branch
            </Button>
            <Button variant="glass" size="sm" icon={<X size={15} />} onClick={() => setForm(emptyForm)}>
              Cancel
            </Button>
          </div>
        </form>
      </GlassCard>

      <MpinDialog
        open={showMpin}
        title="Authorize Branch Creation"
        onClose={() => setShowMpin(false)}
        onSuccess={completeSave}
      />
    </div>
  );
}
