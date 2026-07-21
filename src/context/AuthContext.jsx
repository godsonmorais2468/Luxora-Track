import { createContext, useContext, useState } from "react";

const AuthContext = createContext(undefined);
const USER_KEY = "luxora_user";

// ---------------------------------------------------------------------------
// DEMO MODE — no backend involved. All auth calls below are mocked in-memory
// so this prototype can be shown standalone. Demo logins are shown on the
// login page itself (phone: 9999999999 / 8888888888 / 7777777777).
// ---------------------------------------------------------------------------
const DEMO_USERS = {
  "9999999999": { id: 1, phone_number: "9999999999", full_name: "Arjun Mehta", role: "Admin", branch: "All Branches", has_mpin: true },
  "8888888888": { id: 2, phone_number: "8888888888", full_name: "Priya Nair", role: "Staff", branch: "Dubai Marina Atelier", has_mpin: true },
  "7777777777": { id: 3, phone_number: "7777777777", full_name: "New Team Member", role: "Staff", branch: "Geneva Rue du Rhone", has_mpin: false },
};

const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export function AuthProvider({ children }) {
  // localStorage (not sessionStorage) so the session survives screen sleep,
  // tab discards, and browser restarts — the user stays signed in until they
  // explicitly log out.
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading] = useState(false);

  const persistUser = (u) => {
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  /** Step 1: does this phone number have a demo account, and does it already have an MPIN? */
  const checkPhone = async (phone) => {
    await wait();
    const demoUser = DEMO_USERS[phone];
    if (!demoUser) return { exists: false, has_mpin: false };
    return { exists: true, has_mpin: demoUser.has_mpin };
  };

  /** First-time login (accepts any password for demo accounts that don't have an MPIN yet). */
  const loginWithPassword = async (phone) => {
    await wait();
    const demoUser = DEMO_USERS[phone];
    if (!demoUser) throw new Error("Invalid phone number or password.");
    persistUser(demoUser);
    return demoUser;
  };

  /** Every login after the first (accepts any 4+ digit MPIN for demo accounts). */
  const loginWithMpin = async (phone, mpin) => {
    await wait();
    const demoUser = DEMO_USERS[phone];
    if (!demoUser || mpin.trim().length < 4) {
      throw new Error("Invalid phone number or MPIN.");
    }
    persistUser(demoUser);
    return demoUser;
  };

  /** Called right after loginWithPassword, while the demo session is still fresh. */
  const setMpin = async () => {
    await wait();
    const updated = { ...user, has_mpin: true };
    DEMO_USERS[updated.phone_number] = updated;
    persistUser(updated);
    return updated;
  };

  /** Mid-session re-verification for sensitive actions — always succeeds in demo mode. */
  const verifyMpin = async () => {
    await wait();
    return "demo-mpin-token";
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        checkPhone,
        loginWithPassword,
        loginWithMpin,
        setMpin,
        verifyMpin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
