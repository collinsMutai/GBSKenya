import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaGaugeHigh,
  FaBookOpen,
  FaComments,
  FaUsers,
  FaUserPen,
  FaClock,
  FaFlag,
  FaGear,
  FaArrowRightFromBracket,
} from "react-icons/fa6";

import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // --------------------------------------------------
  // Current admin (for the topbar, instead of a
  // hardcoded "Administrator" placeholder)
  // --------------------------------------------------

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        const result = await response.json();

        if (response.ok && result?.data?.user) {
          setCurrentUser(result.data.user);
        }
      } catch (err) {
        console.error(
          "Failed to fetch current admin:",
          err,
        );
      }
    };

    fetchMe();
  }, []);

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // Even if the request fails (e.g. network hiccup),
      // still send the admin home - the session cookie
      // will simply expire on its own if it wasn't cleared.
      console.error("Logout request failed:", err);
    } finally {
      setLoggingOut(false);
      navigate("/");
    }
  };

  const navItems = [
    {
      section: "MAIN",
      items: [
        {
          label: "Dashboard",
          path: "/admin",
          icon: <FaGaugeHigh />,
          end: true,
        },
      ],
    },
    {
      section: "CONTENT",
      items: [
        {
          label: "Stories",
          path: "/admin/stories",
          icon: <FaBookOpen />,
        },
        {
          label: "Comments",
          path: "/admin/comments",
          icon: <FaComments />,
        },
      ],
    },
    {
      section: "USERS",
      items: [
        {
          label: "Users",
          path: "/admin/users",
          icon: <FaUsers />,
        },
        {
          label: "Authors",
          path: "/admin/authors",
          icon: <FaUserPen />,
        },
      ],
    },
    {
      section: "MODERATION",
      items: [
        {
          label: "Pending Comments",
          path: "/admin/comments?status=pending",
          icon: <FaClock />,
        },
        {
          label: "Reports",
          path: "/admin/reports",
          icon: <FaFlag />,
        },
      ],
    },
    {
      section: "SYSTEM",
      items: [
        {
          label: "Settings",
          path: "/admin/settings",
          icon: <FaGear />,
        },
      ],
    },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">
            <span>A</span>
          </div>

          <div>
            <strong>ADMIN</strong>
            <span>Control Center</span>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((group) => (
            <div className="admin-nav-group" key={group.section}>
              <span className="admin-nav-group__title">
                {group.section}
              </span>

              <div className="admin-nav-group__items">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `admin-nav-link ${
                        isActive ? "admin-nav-link--active" : ""
                      }`
                    }
                  >
                    <span className="admin-nav-link__icon">
                      {item.icon}
                    </span>

                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <FaArrowRightFromBracket />
            <span>{loggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-topbar__eyebrow">
              Administration
            </span>

            <h1>Admin Dashboard</h1>
          </div>

          <div className="admin-topbar__user">
            <div className="admin-topbar__avatar">
              {(currentUser?.name || "A").charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{currentUser?.name || "Administrator"}</strong>
              <span>{currentUser?.role || "Admin"}</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}