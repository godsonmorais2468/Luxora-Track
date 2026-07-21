import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../inputs/SearchBar";

export default function Navbar() {
  const { user } = useAuth();
  const initials = user?.full_name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav className = "navbar-lux">
      <div className = "d-flex align-items-center gap-3 navbar-row navbar-row--search">
        <SearchBar />
      </div>
      <div className = "d-flex align-items-center gap-3 navbar-row navbar-row--actions">
        <motion.button
          className = "icon-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label = "Notifications"
          style={{ position: "relative" }}
        >
          <Bell size={20} strokeWidth={1.5} />
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--gold)",
              boxShadow: "0 0 8px var(--gold)",
            }}
          />
        </motion.button>
        <div className = "navbar-profile">
          <div className = "d-none d-sm-flex flex-column text-end">
            <span style={{ fontSize: "0.82rem", color: "var(--white)", fontWeight: 500 }}>
              {user?.full_name}
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--gold)" }}>
              {user?.role}
            </span>
          </div>
          <div className = "navbar-profile__avatar">{initials}</div>
        </div>
      </div>
    </nav>
  );
}
