import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Gem } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ sections, collapsed }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Scoped responsive rules — hidden on mobile (replaced by BottomNav), tablet auto-sizing */}
      <style>{`
        .sidebar {
          transition: width 0.3s ease;
        }

        /* Mobile phones — bottom nav takes over navigation entirely */
        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
        }

        /* Tablets */
        @media (min-width: 769px) and (max-width: 1024px) {
          .sidebar {
            width: var(--sidebar-collapsed) !important;
          }
          .sidebar-link {
            justify-content: center;
          }
          .sidebar-brand__name,
          .sidebar-brand__sub,
          .sidebar-section__label,
          .sidebar-link span {
            display: none;
          }
          .sidebar-footer span {
            display: none;
          }
        }

        .sidebar-link {
          touch-action: manipulation;
        }
      `}</style>

      <aside
        className="sidebar"
        style={{ width: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)" }}
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand__mark">
            <Gem size={20} strokeWidth={1.5} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="sidebar-brand__name">LUXORA</div>
                <div className="sidebar-brand__sub">Track System</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {sections.map((section, si) => (
            <div key={si} className="sidebar-section">
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="sidebar-section__label"
                  >
                    {section.label}
                  </motion.div>
                )}
              </AnimatePresence>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                  style={{ justifyContent: collapsed ? "center" : "flex-start" }}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={20} strokeWidth={1.5} className="sidebar-link__icon" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{ width: "100%", color: "var(--danger)" }}
          >
            <LogOut size={20} strokeWidth={1.5} className="sidebar-link__icon" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}