import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import BottomNav from "../bottomnav/BottomNav";
import { useAuth } from "../../context/AuthContext";
import { adminBottomNav, staffBottomNav } from "../../config/navigation";

export default function AppLayout({ sections, children }) {
  const { user } = useAuth();
  const [viewport, setViewport] = useState("desktop"); // "mobile" | "tablet" | "desktop"
  const location = useLocation();
  const pageBodyRef = useRef(null);

  useEffect(() => {
    const computeViewport = () => {
      const width = window.innerWidth;
      if (width <= 768) return "mobile";
      if (width <= 1024) return "tablet";
      return "desktop";
    };

    const handleResize = () => setViewport(computeViewport());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset scroll position whenever the route changes, so a new page never
  // opens already scrolled down to wherever the previous page was left.
  useEffect(() => {
    if (pageBodyRef.current) {
      pageBodyRef.current.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  // On mobile the sidebar is an off-canvas drawer (no horizontal space reserved).
  // On tablet the sidebar auto-shrinks to icon-only width via CSS.
  // On desktop the sidebar no longer collapses (collapse button was removed),
  // so it always reserves its full width.
  const contentMarginLeft =
    viewport === "mobile"
      ? 0
      : viewport === "tablet"
      ? "var(--sidebar-collapsed)"
      : "var(--sidebar-width)";

  const bottomNav = user?.role === "Admin" ? adminBottomNav : staffBottomNav;

  return (
    <>
      <Sidebar sections={sections} />
      <div
        className="main-content"
        style={{ marginLeft: contentMarginLeft, transition: "margin-left 0.3s ease" }}
      >
        <Navbar />
        <div className="page-body" ref={pageBodyRef}>
          <div key={location.pathname} className="fade-in-up">
            {children}
          </div>
        </div>
      </div>
      <BottomNav primary={bottomNav.primary} overflow={bottomNav.overflow} />
    </>
  );
}