import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaUserCheck,
  FaUserSlash,
  FaTrash,
  FaArrowRotateRight,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import "./AdminUsers.css";

const ROLE_TABS = [
  { key: "", label: "All" },
  { key: "user", label: "Users" },
  { key: "author", label: "Authors" },
  { key: "admin", label: "Admins" },
];

const ROLE_OPTIONS = ["user", "author", "admin"];

export default function AdminUsers() {
  const [searchParams, setSearchParams] = useSearchParams();

  const roleFilter = searchParams.get("role") || "";
  const statusFilter = searchParams.get("isActive") || "";
  const search = searchParams.get("search") || "";

  // --------------------------------------------------
  // Users state
  // --------------------------------------------------

  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Current admin (for self-action protection in the UI)
  // --------------------------------------------------

  const [currentUserId, setCurrentUserId] = useState(null);

  // --------------------------------------------------
  // Search input (separate from the committed URL param
  // so typing doesn't refetch on every keystroke)
  // --------------------------------------------------

  const [searchInput, setSearchInput] = useState(search);

  // --------------------------------------------------
  // Per-row action state
  // --------------------------------------------------

  const [actionUserId, setActionUserId] = useState(null);
  const [actionError, setActionError] = useState("");

  const [refreshToken, setRefreshToken] = useState(0);

  // --------------------------------------------------
  // API
  // --------------------------------------------------

  const API_URL = "http://localhost:5000/api";

  // --------------------------------------------------
  // Fetch current admin identity
  // --------------------------------------------------

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        const result = await response.json();

        if (response.ok && result?.data?.user?.id) {
          setCurrentUserId(result.data.user.id);
        }
      } catch (err) {
        // Non-fatal: worst case, self-protection only
        // happens server-side instead of in the UI too.
        console.error(
          "Failed to fetch current admin identity:",
          err,
        );
      }
    };

    fetchMe();
  }, []);

  // --------------------------------------------------
  // Fetch users
  // --------------------------------------------------

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (roleFilter) {
        params.set("role", roleFilter);
      }

      if (statusFilter) {
        params.set("isActive", statusFilter);
      }

      if (search) {
        params.set("search", search);
      }

      const query = params.toString()
        ? `?${params.toString()}`
        : "";

      const response = await fetch(
        `${API_URL}/admin/users${query}`,
        {
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to load users",
        );
      }

      setUsers(result.data || []);
      setCount(
        typeof result.count === "number"
          ? result.count
          : (result.data || []).length,
      );
    } catch (err) {
      console.error("Failed to fetch admin users:", err);

      setError(
        err.message ||
          "Something went wrong while loading users.",
      );

      setUsers([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshToken]);

  // --------------------------------------------------
  // Filter helpers
  // --------------------------------------------------

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next);
  };

  const handleRoleTabChange = (value) => {
    updateParam("role", value);
  };

  const handleStatusChange = (value) => {
    updateParam("isActive", value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    updateParam("search", searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    updateParam("search", "");
  };

  // --------------------------------------------------
  // Role change
  // --------------------------------------------------

  const handleRoleChange = async (userId, newRole) => {
    await runAction(
      userId,
      `${API_URL}/admin/users/${userId}/role`,
      "PATCH",
      "Failed to update role",
      { role: newRole },
    );
  };

  // --------------------------------------------------
  // Activate / Deactivate
  // --------------------------------------------------

  const handleActivate = async (userId) => {
    await runAction(
      userId,
      `${API_URL}/admin/users/${userId}/activate`,
      "PATCH",
      "Failed to activate user",
    );
  };

  const handleDeactivate = async (userId) => {
    await runAction(
      userId,
      `${API_URL}/admin/users/${userId}/deactivate`,
      "PATCH",
      "Failed to deactivate user",
    );
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDelete = async (userId, name) => {
    const confirmed = window.confirm(
      `Delete "${name}" permanently? This can't be undone.`,
    );

    if (!confirmed) {
      return;
    }

    await runAction(
      userId,
      `${API_URL}/admin/users/${userId}`,
      "DELETE",
      "Failed to delete user",
    );
  };

  // --------------------------------------------------
  // Shared action runner
  // --------------------------------------------------

  const runAction = async (
    userId,
    url,
    method,
    fallbackMessage,
    body,
  ) => {
    try {
      setActionUserId(userId);
      setActionError("");

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: body
          ? { "Content-Type": "application/json" }
          : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });

      const result = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || fallbackMessage,
        );
      }

      setRefreshToken((token) => token + 1);
    } catch (err) {
      console.error("Admin user action failed:", err);

      setActionError(
        err.message || fallbackMessage,
      );
    } finally {
      setActionUserId(null);
    }
  };

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    try {
      return new Date(value).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      );
    } catch {
      return "";
    }
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="admin-users">

      <div className="admin-users__header">
        <div>
          <span className="admin-users__eyebrow">
            Accounts
          </span>

          <h2>Users</h2>
        </div>

        <button
          type="button"
          className="admin-users__refresh"
          onClick={() =>
            setRefreshToken((token) => token + 1)
          }
          disabled={loading}
        >
          <FaArrowRotateRight
            className={loading ? "spin" : ""}
          />
          <span>Refresh</span>
        </button>
      </div>

      <div className="admin-users__controls">

        <div className="admin-users__tabs">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.key || "all"}
              type="button"
              className={`admin-users__tab ${
                roleFilter === tab.key
                  ? "admin-users__tab--active"
                  : ""
              }`}
              onClick={() =>
                handleRoleTabChange(tab.key)
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-users__right-controls">

          <select
            className="admin-users__status-select"
            value={statusFilter}
            onChange={(event) =>
              handleStatusChange(event.target.value)
            }
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value="true">Active only</option>
            <option value="false">Inactive only</option>
          </select>

          <form
            className="admin-users__search"
            onSubmit={handleSearchSubmit}
          >
            <FaMagnifyingGlass />

            <input
              type="text"
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder="Search name or email..."
              aria-label="Search users"
            />

            {search && (
              <button
                type="button"
                className="admin-users__search-clear"
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </form>

        </div>

      </div>

      <div className="admin-users__card">

        <div className="admin-users__card-heading">
          <span>
            {loading
              ? "Loading..."
              : `${count} user${count === 1 ? "" : "s"}`}
          </span>
        </div>

        {actionError && (
          <div className="admin-users__banner admin-users__banner--error">
            {actionError}
          </div>
        )}

        {loading && (
          <div className="admin-users__state">
            <div className="admin-users__spinner" />
            <p>Loading users...</p>
          </div>
        )}

        {!loading && error && (
          <div className="admin-users__state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="admin-users__state">
            <p>No users found for this filter.</p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="admin-users__table-wrap">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="admin-users-table__actions-col">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isBusy =
                    actionUserId === user._id;

                  const isSelf =
                    currentUserId &&
                    currentUserId === user._id;

                  return (
                    <tr key={user._id}>
                      <td className="admin-users-table__name">
                        {user.name}
                        {isSelf && (
                          <span className="admin-users-table__you">
                            You
                          </span>
                        )}
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <select
                          className="admin-users-table__role-select"
                          value={user.role}
                          onChange={(event) =>
                            handleRoleChange(
                              user._id,
                              event.target.value,
                            )
                          }
                          disabled={isBusy || isSelf}
                          title={
                            isSelf
                              ? "You cannot change your own role"
                              : "Change role"
                          }
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option
                              key={role}
                              value={role}
                            >
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <span
                          className={`status-pill ${
                            user.isActive
                              ? "status-pill--published"
                              : "status-pill--draft"
                          }`}
                        >
                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        {formatDate(user.createdAt)}
                      </td>

                      <td>
                        <div className="admin-users-table__actions">

                          {user.isActive ? (
                            <button
                              type="button"
                              className="admin-user-action admin-user-action--deactivate"
                              onClick={() =>
                                handleDeactivate(
                                  user._id,
                                )
                              }
                              disabled={isBusy || isSelf}
                              title={
                                isSelf
                                  ? "You cannot deactivate your own account"
                                  : "Deactivate"
                              }
                            >
                              <FaUserSlash />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="admin-user-action admin-user-action--activate"
                              onClick={() =>
                                handleActivate(
                                  user._id,
                                )
                              }
                              disabled={isBusy}
                              title="Activate"
                            >
                              <FaUserCheck />
                            </button>
                          )}

                          <button
                            type="button"
                            className="admin-user-action admin-user-action--delete"
                            onClick={() =>
                              handleDelete(
                                user._id,
                                user.name,
                              )
                            }
                            disabled={isBusy || isSelf}
                            title={
                              isSelf
                                ? "You cannot delete your own account"
                                : "Delete"
                            }
                          >
                            <FaTrash />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}