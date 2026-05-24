import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { buildLoginRedirectPath } from "@/services/authRedirect.service";

type AuthStatus = "checking" | "authorized" | "unauthenticated" | "unauthorized";

/**
 * AdminGuard Component
 *
 * Protects admin routes by verifying authentication and admin role.
 * Prevents UI flashing by only rendering content after auth check completes.
 *
 * Flow:
 * 1. "checking" - Verifying trusted profile role (no UI rendered)
 * 2. "authorized" - profiles.role is admin, render nested routes
 * 3. "unauthenticated" - No session, redirect to login
 * 4. "unauthorized" - Non-admin profile, redirect to home page
 */
const AdminGuard = () => {
  const navigate = useNavigate();
  const { initialized, isAdmin, isAuthenticated, loading } = useAuth();
  const [status, setStatus] = useState<AuthStatus>("checking");

  useEffect(() => {
    if (!initialized || loading) {
      setStatus("checking");
      return;
    }

    if (!isAuthenticated) {
      setStatus("unauthenticated");
      navigate(buildLoginRedirectPath("/admin"), { replace: true });
      return;
    }

    if (!isAdmin) {
      setStatus("unauthorized");
      navigate("/", { replace: true });
      return;
    }

    setStatus("authorized");
  }, [initialized, isAdmin, isAuthenticated, loading, navigate]);

  // Only render outlet once authorization is confirmed
  // This prevents unauthorized UI flashing
  if (status === "authorized") {
    return <Outlet />;
  }

  // During auth check or redirect, render nothing
  // This ensures no protected content is visible to unauthorized users
  return null;
};

export default AdminGuard;
