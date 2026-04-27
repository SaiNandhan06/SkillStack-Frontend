import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./components/home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills";
import Certifications from "./pages/Certifications";
import Goals from "./pages/Goals";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import InfoPage from "./pages/InfoPage";
// Admin Interface
import AdminLogin from "./pages/AdminLogin";
import AdminDashboardLayout from "./components/dashboard/AdminDashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCertifications from "./pages/AdminCertifications";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import AdminVerificationHistory from "./pages/AdminVerificationHistory";

// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] text-[#00D9FF]">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

// A wrapper for <Route> specifically for admins
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] text-[#00D9FF]">Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

// A wrapper to prevent authenticated users from seeing Login/Register
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] text-[#00D9FF]">Loading...</div>;
  }

  if (user) {
    return <Navigate to={user.isAdmin ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return children;
}

function AppContent() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] text-[#00D9FF]">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/p/:slug" element={<InfoPage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin-login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
          <Route element={<AdminRoute><AdminDashboardLayout /></AdminRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/certifications" element={<AdminCertifications />} />
            <Route path="/admin/history" element={<AdminVerificationHistory />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;
