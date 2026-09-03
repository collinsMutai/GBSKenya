import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export default function RequireAuthor() {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    const checkAuthor = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (mounted) {
            setUser(null);
          }

          return;
        }

        const result = await response.json();

        const authenticatedUser = result?.data?.user;

        if (!mounted) return;

        if (!authenticatedUser) {
          setUser(null);
          return;
        }

        if (authenticatedUser.role !== "author") {
          setUser(null);
          return;
        }

        setUser(authenticatedUser);
      } catch (error) {
        console.error(
          "Author authentication check failed:",
          error
        );

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuthor();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#475569",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              margin: "0 auto 16px",
              border: "4px solid #e2e8f0",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "require-author-spin 0.8s linear infinite",
            }}
          />

          <p style={{ margin: 0 }}>
            Checking author access...
          </p>
        </div>

        <style>
          {`
            @keyframes require-author-spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }

  /* ==========================================
     NOT AUTHENTICATED
  ========================================== */

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /* ==========================================
     AUTHOR
  ========================================== */

  return <Outlet />;
}