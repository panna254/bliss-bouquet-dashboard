import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  buildLoginRedirectPath,
  persistAuthRedirect,
  resolveAuthRedirectReason,
} from "@/services/authRedirect.service";

type CustomerGuardStatus = "checking" | "authorized" | "redirecting";

const CustomerGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { initialized, isAdmin, isAuthenticated, loading } = useAuth();
  const [status, setStatus] = useState<CustomerGuardStatus>("checking");

  useEffect(() => {
    if (!initialized || loading) {
      setStatus("checking");
      return;
    }

    const targetPath = `${location.pathname}${location.search}`;

    if (!isAuthenticated) {
      persistAuthRedirect(targetPath);
      setStatus("redirecting");
      navigate(buildLoginRedirectPath(targetPath, resolveAuthRedirectReason(targetPath)), { replace: true });
      return;
    }

    if (isAdmin) {
      setStatus("redirecting");
      navigate("/admin", { replace: true });
      return;
    }

    setStatus("authorized");
  }, [initialized, isAdmin, isAuthenticated, loading, location.pathname, location.search, navigate]);

  if (status === "authorized") {
    return <Outlet />;
  }

  return null;
};

export default CustomerGuard;
