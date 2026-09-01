import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import "./RequireAdmin.css";

const API_URL = "http://localhost:5000/api";

export default function RequireAdmin() {
  // "checking" | "authorized" | "unauthorized"
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        const result = await response.json().catch(() => ({}));

        if (!isMounted) {
          return;
        }

        const role = result?.data?.user?.role;

        if (response.ok && role === "admin") {
          setStatus("authorized");
        } else {
          setStatus("unauthorized");
        }
      } catch (err) {
        console.error(
          "Failed to verify admin session:",
          err,
        );

        if (isMounted) {
          setStatus("unauthorized");
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // --------------------------------------------------
  // Still checking - render nothing admin-related yet,
  // just a blank loading state so the dashboard shell
  // never flashes before the auth check resolves.
  // --------------------------------------------------

  if (status === "checking") {
    return (
      <div className="admin-guard">
        <div className="admin-guard__spinner" />
      </div>
    );
  }

  // --------------------------------------------------
  // No valid admin session - bounce home instead of
  // ever mounting the admin dashboard.
  // --------------------------------------------------

  if (status === "unauthorized") {
    return <Navigate to="/" replace />;
  }

  // --------------------------------------------------
  // Authorized - render the actual admin route tree.
  // --------------------------------------------------

  return <Outlet />;
}