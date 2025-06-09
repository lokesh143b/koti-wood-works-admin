import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { BASE_URL, setAdminName, setAdminToken, setIsLoggedIn } = useContext(AdminContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminName", data.name || "Admin");

        setAdminToken(data.token);
        setAdminName(data.name || "Admin");
        setIsLoggedIn(true);

        navigate("/");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {error && <p className="error-msg">{error}</p>}

        <label>
          Email:
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
        </label>

        <label>
          Password:
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </label>

        <div className="auth-options">
          <label className="show-password-label">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
            Show Password
          </label>
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/*<p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>*/}
      </form>
    </div>
  );
};

export default Login;
