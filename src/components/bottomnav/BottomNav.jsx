import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { MoreHorizontal, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function BottomNav({ primary, overflow }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isOverflowActive = overflow.some((item) => location.pathname === item.path);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="bottom-nav" aria-label="Primary">
        {primary.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) => `bottom-nav__item ${isActive ? "active" : ""}`}
          >
            <item.icon size={21} strokeWidth={1.6} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        {overflow.length > 0 && (
          <button
            type="button"
            className={`bottom-nav__item bottom-nav__item--more ${isOverflowActive ? "active" : ""}`}
            onClick={() => setMoreOpen(true)}
            aria-label="More"
          >
            <MoreHorizontal size={21} strokeWidth={1.6} />
            <span>More</span>
          </button>
        )}
      </nav>

      {moreOpen && (
        <div className="bottom-sheet-backdrop" onClick={() => setMoreOpen(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet__handle" />
            <div className="bottom-sheet__title">More</div>
            {overflow.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) => `bottom-sheet__link ${isActive ? "active" : ""}`}
                onClick={() => setMoreOpen(false)}
              >
                <item.icon size={19} strokeWidth={1.6} />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <button type="button" className="bottom-sheet__link bottom-sheet__link--danger" onClick={handleLogout}>
              <LogOut size={19} strokeWidth={1.6} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
