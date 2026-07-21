import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Gem, Lock, Phone, Eye, EyeOff, ShieldCheck, Sparkles, BarChart3, KeyRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/buttons/Button";
import Captcha, { generateCaptchaCode } from "../../components/common/Captcha";

// Steps in the login flow:
// "phone"      -> enter phone number
// "password"   -> first-time login (no MPIN set yet)
// "mpin"       -> returning user, enter MPIN
// "setup-mpin" -> right after first password login, choose an MPIN
const STEP = { PHONE: "phone", PASSWORD: "password", MPIN: "mpin", SETUP_MPIN: "setup-mpin" };

export default function Login() {
  const navigate = useNavigate();
  const { checkPhone, loginWithPassword, loginWithMpin, setMpin } = useAuth();

  const [step, setStep] = useState(STEP.PHONE);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [mpin, setMpinValue] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [captchaCode, setCaptchaCode] = useState(() => generateCaptchaCode());
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptchaCode());
    setCaptchaInput("");
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        size: Math.random() * 6 + 2,
        left: Math.random() * 100,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 10,
      })),
    []
  );

  const goToDashboard = (user) => {
    navigate(user.role === "Admin" ? "/admin/dashboard" : "/staff/dashboard");
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    setBusy(true);
    try {
      const { exists, has_mpin } = await checkPhone(phone.trim());
      if (!exists) {
        setError("No account found with this phone number.");
        return;
      }
      setStep(has_mpin ? STEP.MPIN : STEP.PASSWORD);
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await loginWithPassword(phone.trim(), password);
      // First-time login succeeded — now set up an MPIN before continuing.
      setStep(STEP.SETUP_MPIN);
    } catch (err) {
      setError(err.message || "Invalid phone number or password.");
    } finally {
      setBusy(false);
    }
  };

  const handleMpinSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCaptchaError("");
    setBusy(true);
    try {
      if (captchaInput.trim() !== captchaCode) {
        setCaptchaError("Incorrect captcha. Please try again.");
        return;
      }
      const user = await loginWithMpin(phone.trim(), mpin);
      goToDashboard(user);
    } catch (err) {
      setError(err.message || "Invalid phone number or MPIN.");
    } finally {
      setBusy(false);
      refreshCaptcha();
    }
  };

  const handleSetupMpinSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (mpin.length < 4) {
      setError("MPIN must be at least 4 digits.");
      return;
    }
    if (mpin !== confirmMpin) {
      setError("MPIN values don't match.");
      return;
    }
    setBusy(true);
    try {
      const user = await setMpin(mpin, confirmMpin);
      goToDashboard(user);
    } catch (err) {
      setError(err.message || "Couldn't set your MPIN. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleBack = () => {
    setError("");
    setPassword("");
    setMpinValue("");
    setConfirmMpin("");
    setStep(STEP.PHONE);
    refreshCaptcha();
  };

  const features = [
    {
      icon: Sparkles,
      title: "Precision Inventory",
      desc: "Track every piece down to the carat, metal purity and hallmark.",
    },
    {
      icon: ShieldCheck,
      title: "Bank-Grade Security",
      desc: "Role-based access with a fully audited trail on every action.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Insights",
      desc: "Live stock, sales and valuation reports across every outlet.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexWrap: "wrap", position: "relative", zIndex: 2 }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              bottom: "-20px",
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .login-left-panel { display: none !important; }
        }
      `}</style>

      {/* LEFT: Premium showcase panel */}
      <div
        className="login-left-panel"
        style={{ flex: "1 1 480px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "4rem", position: "relative", zIndex: 2 }}
      >
        <div className="fade-in-up" style={{ maxWidth: 460 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, var(--gold), #b8941f)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "1.5rem", boxShadow: "0 8px 32px rgba(212,175,55,0.3)",
            }}
          >
            <Gem size={28} strokeWidth={1.5} color="#0a0a0a" />
          </div>

          <p style={{ fontSize: "0.78rem", color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Premium Jewellery Item Tracking System
          </p>

          <h1
            style={{
              fontFamily: "var(--font-heading)", fontSize: "2.6rem", fontWeight: 600,
              letterSpacing: "0.04em", color: "var(--white)", lineHeight: 1.2, marginBottom: "1rem",
            }}
          >
            Where Elegance
            <br />
            Meets Precision
          </h1>

          <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            LUXORA TRACK gives your boutique complete command over stock,
            sales and security — built for jewellers who deal in nothing
            less than perfection.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {features.map((f) => (
              <div
                key={f.title}
                className="fade-in-up"
                style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
              >
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)",
                  }}
                >
                  <f.icon size={18} color="var(--gold)" strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ color: "var(--white)", fontSize: "0.92rem", fontWeight: 600, marginBottom: 2 }}>{f.title}</p>
                  <p style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Login card */}
      <div style={{ flex: "1 1 440px", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", zIndex: 2 }}>
        <div
          className="glass-panel login-card fade-in-up"
          style={{ width: 440, maxWidth: "92vw", padding: "3rem 2.5rem", position: "relative" }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: 64, height: 64, borderRadius: 18,
                background: "linear-gradient(135deg, var(--gold), #b8941f)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1rem", boxShadow: "0 8px 32px rgba(212,175,55,0.3)",
              }}
            >
              <Gem size={32} strokeWidth={1.5} color="#0a0a0a" />
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 600, letterSpacing: "0.08em", color: "var(--white)" }}>
              LUXORA TRACK
            </h1>
            <p style={{ fontSize: "0.78rem", color: "var(--gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>
              Premium Jewellery Item Tracking System
            </p>
          </div>

          {/* STEP 1 — Phone number */}
          {step === STEP.PHONE && (
              <form
                className="fade-in-up"
                onSubmit={handlePhoneSubmit}
              >
                <div className="mb-4">
                  <label className="form-label-lux">Phone Number</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={18} color="var(--muted)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      className="glass-input"
                      style={{ paddingLeft: 44 }}
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      aria-label="Phone Number"
                      autoFocus
                    />
                  </div>
                </div>

                {error && <p style={{ color: "var(--danger, #e74c3c)", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</p>}

                <Button variant="gold" type="submit" className="w-100" size="md" disabled={busy}>
                  {busy ? "Checking..." : "Continue"}
                </Button>

                <p className="login-mobile-hide" style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.72rem", color: "var(--muted-dark)" }}>
                  Authorized personnel only. All actions are audited.
                </p>

                <div
                  className="login-mobile-hide"
                  style={{
                    marginTop: "1.5rem",
                    padding: "0.9rem 1rem",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(212,175,55,0.06)",
                    border: "1px dashed rgba(212,175,55,0.3)",
                  }}
                >
                  <p style={{ fontSize: "0.72rem", color: "var(--gold)", letterSpacing: "0.05em", marginBottom: 6, fontWeight: 600 }}>
                    DEMO PROTOTYPE — SAMPLE LOGINS
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.6 }}>
                    Admin: <span style={{ color: "var(--white)" }}>9999999999</span> (any MPIN, 4+ digits)
                    <br />
                    Staff: <span style={{ color: "var(--white)" }}>8888888888</span> (any MPIN, 4+ digits)
                    <br />
                    New user flow: <span style={{ color: "var(--white)" }}>7777777777</span> (any password, then set an MPIN)
                  </p>
                </div>
              </form>
          )}

          {/* STEP 2a — First-time login: password */}
          {step === STEP.PASSWORD && (
              <form
                className="fade-in-up"
                onSubmit={handlePasswordSubmit}
              >
                <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1.25rem" }}>
                  First time signing in. Enter your password — you'll set up an MPIN next for faster logins.
                </p>

                <div className="mb-4">
                  <label className="form-label-lux">Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock size={18} color="var(--muted)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      className="glass-input"
                      style={{ paddingLeft: 44, paddingRight: 44 }}
                      type={showPass ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-label="Password"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none" }}
                      aria-label="Toggle password visibility"
                    >
                      {showPass ? <EyeOff size={18} color="var(--muted)" /> : <Eye size={18} color="var(--muted)" />}
                    </button>
                  </div>
                </div>

                {error && <p style={{ color: "var(--danger, #e74c3c)", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</p>}

                <Button variant="gold" type="submit" className="w-100" size="md" disabled={busy}>
                  {busy ? "Signing in..." : "Sign In"}
                </Button>

                <button
                  type="button"
                  onClick={handleBack}
                  style={{ display: "block", margin: "1rem auto 0", background: "none", border: "none", color: "var(--muted)", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  ← Use a different phone number
                </button>
              </form>
          )}

          {/* STEP 2b — Returning user: MPIN */}
          {step === STEP.MPIN && (
              <form
                className="fade-in-up"
                onSubmit={handleMpinSubmit}
              >
                <div className="mb-4">
                  <label className="form-label-lux">MPIN</label>
                  <div style={{ position: "relative" }}>
                    <KeyRound size={18} color="var(--muted)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      className="glass-input"
                      style={{ paddingLeft: 44, letterSpacing: "0.3em" }}
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="••••"
                      value={mpin}
                      onChange={(e) => setMpinValue(e.target.value.replace(/\D/g, ""))}
                      aria-label="MPIN"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label-lux">Security Check</label>
                  <Captcha code={captchaCode} onRefresh={refreshCaptcha} />
                  <input
                    className="glass-input"
                    style={{ marginTop: 10, letterSpacing: "0.3em" }}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter the 4-digit code"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, ""))}
                    aria-label="Captcha code"
                    maxLength={4}
                  />
                  {captchaError && <p style={{ color: "var(--danger, #e74c3c)", fontSize: "0.8rem", marginTop: 6 }}>{captchaError}</p>}
                </div>

                {error && <p style={{ color: "var(--danger, #e74c3c)", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</p>}

                <Button variant="gold" type="submit" className="w-100" size="md" disabled={busy}>
                  {busy ? "Signing in..." : "Sign In to LUXORA"}
                </Button>

                <button
                  type="button"
                  onClick={handleBack}
                  style={{ display: "block", margin: "1rem auto 0", background: "none", border: "none", color: "var(--muted)", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  ← Use a different phone number
                </button>
              </form>
          )}

          {/* STEP 3 — Set up MPIN right after first password login */}
          {step === STEP.SETUP_MPIN && (
              <form
                className="fade-in-up"
                onSubmit={handleSetupMpinSubmit}
              >
                <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1.25rem" }}>
                  Set up a 4–6 digit MPIN. You'll use it to sign in from now on.
                </p>

                <div className="mb-3">
                  <label className="form-label-lux">New MPIN</label>
                  <input
                    className="glass-input"
                    style={{ letterSpacing: "0.3em" }}
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••"
                    value={mpin}
                    onChange={(e) => setMpinValue(e.target.value.replace(/\D/g, ""))}
                    aria-label="New MPIN"
                    autoFocus
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label-lux">Confirm MPIN</label>
                  <input
                    className="glass-input"
                    style={{ letterSpacing: "0.3em" }}
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••"
                    value={confirmMpin}
                    onChange={(e) => setConfirmMpin(e.target.value.replace(/\D/g, ""))}
                    aria-label="Confirm MPIN"
                  />
                </div>

                {error && <p style={{ color: "var(--danger, #e74c3c)", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</p>}

                <Button variant="gold" type="submit" className="w-100" size="md" disabled={busy}>
                  {busy ? "Saving..." : "Set MPIN & Continue"}
                </Button>
              </form>
          )}
        </div>
      </div>
    </div>
  );
}
