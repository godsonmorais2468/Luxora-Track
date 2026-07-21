import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Gem } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({
  sections, collapsed, onToggle, mobileOpen, onMobileClose,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Auto-close the mobile drawer whenever a nav link is tapped
  const handleLinkClick = () => {
    if (mobileOpen && onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Scoped responsive rules — mobile drawer, tablet auto-sizing, desktop collapse */}
      <style>{`
        .sidebar {
          transition: width 0.3s ease, transform 0.3s ease;
        }

        /* Mobile phones */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 260px !important;
            max-width: 82vw;
            transform: translateX(-100%);
            z-index: 1000;
            box-shadow: 8px 0 32px rgba(0,0,0,0.4);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .sidebar-link {
            min-height: 44px;
            font-size: 0.95rem;
          }
          .sidebar-brand {
            padding: 1.1rem 1rem;
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

      {mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
            backdropFilter: "blur(4px)",
          }}
        />
      )}
      <aside
        className={`sidebar ${mobileOpen ? "open" : ""}`}
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
                  onClick={handleLinkClick}
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