import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCurrentSession } from "@/services/auth.service";

type AuthStatus = "checking" | "authorized" | "unauthenticated" | "unauthorized";

/**
 * AdminGuard Component
 *
 * Protects admin routes by verifying authentication and admin role.
 * Prevents UI flashing by only rendering content after auth check completes.
 *
 * Flow:
 * 1. "checking" - Verifying session and permissions (no UI rendered)
 * 2. "authorized" - Admin verified, render nested routes
 * 3. "unauthenticated" - No session, redirect to home page
 * 4. "unauthorized" - Non-admin user, redirect to home page
 */
const AdminGuard = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<AuthStatus>("checking");

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const session = await getCurrentSession();

        // Unauthenticated users: no session
        if (!session) {
          setStatus("unauthenticated");
          navigate("/", { replace: true });
          return;
        }

        // Authenticated non-admin users: session exists but role is not admin
        if (session.user.role !== "admin") {
          setStatus("unauthorized");
          navigate("/", { replace: true });
          return;
        }

        // Authenticated admin users: authorize
        setStatus("authorized");
      } catch (error) {
        // Error checking auth (e.g., network issue, session load failure)
        // Treat as unauthenticated for security
        console.error("Admin guard auth check failed:", error);
        setStatus("unauthenticated");
        navigate("/", { replace: true });
      }
    };

    verifyAdminAccess();
  }, [navigate]);

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
