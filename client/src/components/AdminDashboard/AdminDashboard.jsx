import { NavLink, Outlet } from "react-router-dom";
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

export default function AdminDashboard() {
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
          <button type="button" className="admin-logout">
            <FaArrowRightFromBracket />
            <span>Logout</span>
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
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Admin</span>
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
