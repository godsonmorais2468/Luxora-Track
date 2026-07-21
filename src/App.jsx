import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./context/ToastContext";
import Background from "./components/layout/Background";
import AppLayout from "./components/layout/AppLayout";
import { adminNav, staffNav } from "./config/navigation";

// Login stays eager — it's the very first thing most visits need.
import Login from "./pages/Login/Login";

// Every other page is lazy-loaded: its code only downloads when that
// route is actually visited, instead of shipping in the initial bundle.
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard/Dashboard"));
const Branches = lazy(() => import("./pages/Admin/Branches/Branches"));
const AddBranch = lazy(() => import("./pages/Admin/AddBranch/AddBranch"));
const BranchDetails = lazy(() => import("./pages/Admin/BranchDetails/BranchDetails"));
const RegisterUser = lazy(() => import("./pages/Admin/RegisterUser/RegisterUser"));
const ManageUsers = lazy(() => import("./pages/Admin/ManageUsers/ManageUsers"));
const ItemGroups = lazy(() => import("./pages/Admin/ItemGroups/ItemGroups"));
const Categories = lazy(() => import("./pages/Admin/Categories/Categories"));
const Reports = lazy(() => import("./pages/Admin/Reports/Reports"));

const StaffDashboard = lazy(() => import("./pages/Staff/Dashboard/Dashboard"));
const StaffItems = lazy(() => import("./pages/Staff/Items/Items"));
const OpeningStock = lazy(() => import("./pages/Staff/OpeningStock/OpeningStock"));
const ClosingStock = lazy(() => import("./pages/Staff/ClosingStock/ClosingStock"));
const Adjustments = lazy(() => import("./pages/Staff/Adjustments/Adjustments"));
const StaffReports = lazy(() => import("./pages/Staff/Reports/Reports"));
const Profile = lazy(() => import("./pages/Staff/Profile/Profile"));

// Lightweight themed fallback shown briefly while a lazy page chunk loads.
function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        color: "var(--gold)",
        fontSize: "0.9rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      Loading…
    </div>
  );
}

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to = "/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === "Admin" ? "/admin/dashboard" : "/staff/dashboard"} replace />;
  return <>{children}</>;
}

function AdminApp() {
  return (
    <AppLayout sections={adminNav}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path = "dashboard" element={<AdminDashboard />} />
          <Route path = "branches" element={<Branches />} />
          <Route path = "branches/add" element={<AddBranch />} />
          <Route path = "branches/:id" element={<BranchDetails />} />
          <Route path = "users/register" element={<RegisterUser />} />
          <Route path = "users/manage" element={<ManageUsers />} />
          <Route path = "item-groups" element={<ItemGroups />} />
          <Route path = "categories" element={<Categories />} />
          <Route path = "reports" element={<Reports />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}

function StaffApp() {
  return (
    <AppLayout sections={staffNav}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path = "dashboard" element={<StaffDashboard />} />
          <Route path = "items" element={<StaffItems />} />
          <Route path = "opening-stock" element={<OpeningStock />} />
          <Route path = "closing-stock" element={<ClosingStock />} />
          <Route path = "adjustments" element={<Adjustments />} />
          <Route path = "reports" element={<StaffReports />} />
          <Route path = "profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to = "/login" replace />;
  return <Navigate to={user.role === "Admin" ? "/admin/dashboard" : "/staff/dashboard"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <Background />
          <BrowserRouter>
            <Routes>
              <Route path = "/" element={<RootRedirect />} />
              <Route path = "/login" element={<Login />} />
              <Route
                path = "/admin/*"
                element={
                  <ProtectedRoute role = "Admin">
                    <AdminApp />
                  </ProtectedRoute>
                }
              />
              <Route
                path = "/staff/*"
                element={
                  <ProtectedRoute role = "Staff">
                    <StaffApp />
                  </ProtectedRoute>
                }
              />
              <Route path = "*" element={<RootRedirect />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  );
}