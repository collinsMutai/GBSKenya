import { useEffect, useState } from "react";
import "./AuthorProfilePage.css";

const API_URL = "http://localhost:5000/api";

export default function AuthorProfilePage() {
  // --------------------------------------------------
  // Basic account info
  // --------------------------------------------------

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // --------------------------------------------------
  // Author bio / social links
  // --------------------------------------------------

  const [authorForm, setAuthorForm] = useState({
    bio: "",
    twitter: "",
    linkedin: "",
    website: "",
  });
  const [authorLoading, setAuthorLoading] = useState(true);
  const [authorSaving, setAuthorSaving] = useState(false);
  const [authorMessage, setAuthorMessage] = useState("");
  const [authorError, setAuthorError] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        const result = await response.json();

        if (response.ok && result?.data?.user) {
          setProfileForm({
            name: result.data.user.name || "",
            email: result.data.user.email || "",
          });
        }
      } catch (err) {
        console.error(
          "Failed to fetch current user:",
          err,
        );
      }
    };

    const fetchAuthorProfile = async () => {
      try {
        setAuthorLoading(true);

        const response = await fetch(
          `${API_URL}/me/author-profile`,
          { credentials: "include" },
        );

        const result = await response.json();

        if (response.ok && result.success !== false) {
          setAuthorForm({
            bio: result.data.bio || "",
            twitter: result.data.socialLinks?.twitter || "",
            linkedin:
              result.data.socialLinks?.linkedin || "",
            website:
              result.data.socialLinks?.website || "",
          });
        }
      } catch (err) {
        console.error(
          "Failed to fetch author profile:",
          err,
        );
      } finally {
        setAuthorLoading(false);
      }
    };

    fetchMe();
    fetchAuthorProfile();
  }, []);

  // --------------------------------------------------
  // Save basic profile
  // --------------------------------------------------

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      setProfileSaving(true);
      setProfileMessage("");
      setProfileError("");

      const response = await fetch(
        `${API_URL}/me/profile`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileForm),
        },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        const firstError = result.errors?.[0]?.message;

        throw new Error(
          firstError ||
            result.message ||
            "Failed to update profile",
        );
      }

      setProfileMessage("Profile updated.");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setProfileError(
        err.message || "Failed to update profile.",
      );
    } finally {
      setProfileSaving(false);
    }
  };

  // --------------------------------------------------
  // Save author bio/social
  // --------------------------------------------------

  const handleAuthorSubmit = async (event) => {
    event.preventDefault();

    try {
      setAuthorSaving(true);
      setAuthorMessage("");
      setAuthorError("");

      const response = await fetch(
        `${API_URL}/me/author-profile`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bio: authorForm.bio,
            socialLinks: {
              twitter: authorForm.twitter,
              linkedin: authorForm.linkedin,
              website: authorForm.website,
            },
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        const firstError = result.errors?.[0]?.message;

        throw new Error(
          firstError ||
            result.message ||
            "Failed to update author profile",
        );
      }

      setAuthorMessage("Author profile updated.");
    } catch (err) {
      console.error(
        "Failed to update author profile:",
        err,
      );

      setAuthorError(
        err.message || "Failed to update author profile.",
      );
    } finally {
      setAuthorSaving(false);
    }
  };

  return (
    <div className="author-profile-page">

      <h2>Profile</h2>

      <div className="author-profile-page__grid">

        {/* ==========================================
            BASIC ACCOUNT INFO
        ========================================== */}

        <section className="author-profile-page__card">
          <h3>Account</h3>

          <form onSubmit={handleProfileSubmit}>
            <label>
              Name

              <input
                type="text"
                value={profileForm.name}
                onChange={(event) =>
                  setProfileForm((form) => ({
                    ...form,
                    name: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Email

              <input
                type="email"
                value={profileForm.email}
                onChange={(event) =>
                  setProfileForm((form) => ({
                    ...form,
                    email: event.target.value,
                  }))
                }
              />
            </label>

            {profileError && (
              <div className="author-profile-page__banner author-profile-page__banner--error">
                {profileError}
              </div>
            )}

            {profileMessage && (
              <div className="author-profile-page__banner author-profile-page__banner--success">
                {profileMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-outline"
              disabled={profileSaving}
            >
              {profileSaving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </section>

        {/* ==========================================
            AUTHOR BIO / SOCIAL
        ========================================== */}

        <section className="author-profile-page__card">
          <h3>Public author profile</h3>

          <p className="author-profile-page__hint">
            This shows up alongside your published stories.
          </p>

          {authorLoading ? (
            <p className="author-profile-page__loading">
              Loading...
            </p>
          ) : (
            <form onSubmit={handleAuthorSubmit}>
              <label>
                Bio

                <textarea
                  value={authorForm.bio}
                  onChange={(event) =>
                    setAuthorForm((form) => ({
                      ...form,
                      bio: event.target.value,
                    }))
                  }
                  maxLength={500}
                  rows={4}
                  placeholder="A short bio for readers..."
                />

                <span className="author-profile-page__char-count">
                  {authorForm.bio.length}/500
                </span>
              </label>

              <label>
                X / Twitter

                <input
                  type="text"
                  value={authorForm.twitter}
                  onChange={(event) =>
                    setAuthorForm((form) => ({
                      ...form,
                      twitter: event.target.value,
                    }))
                  }
                  placeholder="twitter.com/username"
                />
              </label>

              <label>
                LinkedIn

                <input
                  type="text"
                  value={authorForm.linkedin}
                  onChange={(event) =>
                    setAuthorForm((form) => ({
                      ...form,
                      linkedin: event.target.value,
                    }))
                  }
                  placeholder="linkedin.com/in/username"
                />
              </label>

              <label>
                Website

                <input
                  type="text"
                  value={authorForm.website}
                  onChange={(event) =>
                    setAuthorForm((form) => ({
                      ...form,
                      website: event.target.value,
                    }))
                  }
                  placeholder="example.com"
                />
              </label>

              {authorError && (
                <div className="author-profile-page__banner author-profile-page__banner--error">
                  {authorError}
                </div>
              )}

              {authorMessage && (
                <div className="author-profile-page__banner author-profile-page__banner--success">
                  {authorMessage}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-outline"
                disabled={authorSaving}
              >
                {authorSaving ? "Saving..." : "Save changes"}
              </button>
            </form>
          )}
        </section>

      </div>
    </div>
  );
}