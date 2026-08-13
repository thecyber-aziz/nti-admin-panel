import { useState } from "react";

import {
  Factory,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck
} from "lucide-react";

import {
  Navigate,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const {
    login,
    isAuthenticated
  } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] =
    useState(
      "admin@newtajindustries.com"
    );

  const [password, setPassword] =
    useState("admin123");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = login(
        email,
        password
      );

      if (!result.success) {
        setError(result.message);
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    }, 400);
  };

  return (
    <div className="login-page">
      <div className="login-background-shape shape-one" />
      <div className="login-background-shape shape-two" />

      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">
            {/* <Factory size={34} /> */}
            <img src="/nti.png" alt="New Taj Industries" />
          </div>

          <div>
            <h1>NEW TAJ</h1>
            <span>INDUSTRIES</span>
          </div>
        </div>

        <div className="login-heading">
          <h2>Welcome Back</h2>

          <p>
            Sign in to manage your factory
            employees and payroll.
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>
              Admin Email
            </label>

            <div className="input-with-icon">
              <Mail size={18} />

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Password
            </label>

            <div className="input-with-icon">
              <LockKeyhole size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>

        <div className="login-security">
          <ShieldCheck size={18} />

          <span>
            Secure Admin Access
          </span>
        </div>

        <p className="login-footer">
          © {new Date().getFullYear()} New
          Taj Industries
        </p>
      </div>
    </div>
  );
}