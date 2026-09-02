import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaGaugeHigh,
  FaBookOpen,
  FaPenToSquare,
  FaComments,
  FaUserPen,
  FaGear,
  FaArrowRightFromBracket,
} from "react-icons/fa6";

import "./AuthorDashboard.css";

const API_URL = "http://localhost:5000/api";

export default function AuthorDashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // --------------------------------------------------
  // Fetch current user
  // --------------------------------------------------

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoadingUser(true);

        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok || !result?.data?.user) {
          navigate("/login", { replace: true });
          return;
        }

        const user = result.data.user;

        // ------------------------------------------------
        // Authors only
        // ------------------------------------------------

        if (user.role !== "author") {
          navigate("/", { replace: true });
          return;
        }

        setCurrentUser(user);
      } catch (error) {
        console.error(
          "Failed to fetch current author:",
          error,
        );

        navigate("/login", { replace: true });
      } finally {
        setLoadingUser(false);
      }
    };

    fetchMe();
  }, [navigate]);

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(
        "Logout request failed:",
        error,
      );
    } finally {
      setLoggingOut(false);
      navigate("/", { replace: true });
    }
  };

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------

  const navItems = [
    {
      section: "MAIN",
      items: [
        {
          label: "Dashboard",
          path: "/author",
          icon: <FaGaugeHigh />,
          end: true,
        },
      ],
    },

    {
      section: "CONTENT",
      items: [
        {
          label: "My Stories",
          path: "/author/stories",
          icon: <FaBookOpen />,
        },
        {
          label: "Write a Story",
          path: "/author/stories/new",
          icon: <FaPenToSquare />,
        },
        {
          label: "Comments",
          path: "/author/comments",
          icon: <FaComments />,
        },
      ],
    },

    {
      section: "ACCOUNT",
      items: [
        {
          label: "Author Profile",
          path: "/author/profile",
          icon: <FaUserPen />,
        },
        {
          label: "Settings",
          path: "/author/settings",
          icon: <FaGear />,
        },
      ],
    },
  ];

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loadingUser) {
    return (
      <div className="author-dashboard author-dashboard--loading">
        <div className="author-dashboard__loader">
          <div className="author-dashboard__spinner" />
          <p>Loading author dashboard...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="author-dashboard">
      <aside className="author-sidebar">
        {/* -------------------------------------------- */}
        {/* BRAND */}
        {/* -------------------------------------------- */}

        <div className="author-sidebar__brand">
          <div className="author-sidebar__logo">
            <span>A</span>
          </div>

          <div>
            <strong>AUTHOR</strong>
            <span>Creator Center</span>
          </div>
        </div>

        {/* -------------------------------------------- */}
        {/* NAVIGATION */}
        {/* -------------------------------------------- */}

        <nav className="author-sidebar__nav">
          {navItems.map((group) => (
            <div
              className="author-nav-group"
              key={group.section}
            >
              <span className="author-nav-group__title">
                {group.section}
              </span>

              <div className="author-nav-group__items">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `author-nav-link ${
                        isActive
                          ? "author-nav-link--active"
                          : ""
                      }`
                    }
                  >
                    <span className="author-nav-link__icon">
                      {item.icon}
                    </span>

                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* -------------------------------------------- */}
        {/* FOOTER */}
        {/* -------------------------------------------- */}

        <div className="author-sidebar__footer">
          <button
            type="button"
            className="author-logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <FaArrowRightFromBracket />

            <span>
              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </span>
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------- */}
      {/* MAIN */}
      {/* ---------------------------------------------- */}

      <main className="author-main">
        {/* -------------------------------------------- */}
        {/* TOPBAR */}
        {/* -------------------------------------------- */}

        <header className="author-topbar">
          <div>
            <span className="author-topbar__eyebrow">
              Author Workspace
            </span>

            <h1>Author Dashboard</h1>
          </div>

          <div className="author-topbar__user">
            <div className="author-topbar__avatar">
              {(currentUser?.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {currentUser?.name || "Author"}
              </strong>

              <span>
                {currentUser?.role || "Author"}
              </span>
            </div>
          </div>
        </header>

        {/* -------------------------------------------- */}
        {/* CONTENT */}
        {/* -------------------------------------------- */}

        <div className="author-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}