import { useEffect, useState } from "react";
import { X, User, Lock, Eye, EyeOff } from "lucide-react";
import "./LoginModal.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Close with Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || `Login failed with status ${response.status}`,
        );
      }

      if (onLoginSuccess) {
        onLoginSuccess(data?.data?.user);
      }

      setEmail("");
      setPassword("");
      setError("");

      onClose();
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error?.message || "Unable to login. Please check your details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        {/* Close button */}

        <button
          type="button"
          className="login-modal-close"
          onClick={onClose}
          aria-label="Close login"
        >
          <X size={20} />
        </button>

        {/* Header */}

        <div className="login-modal-header">
          <div className="login-modal-icon">
            <User size={25} />
          </div>

          <h2 id="login-modal-title">Welcome back</h2>

          <p>Sign in to your account</p>
        </div>

        {/* Form */}

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {/* Email */}

          <div className="login-field">
            <label htmlFor="login-email">Email address</label>

            <div className="login-input-wrapper">
              <User size={18} />

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}

          <div className="login-field">
            <label htmlFor="login-password">Password</label>

            <div className="login-input-wrapper">
              <Lock size={18} />

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}

          <button
            type="submit"
            className="login-submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
