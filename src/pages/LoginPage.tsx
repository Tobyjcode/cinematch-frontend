import { useState } from "react";
import { login, getMe } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      await login(username, password);
      const user = await getMe();
      console.log("Logged in user:", user);
      navigate("/movies");
    } catch (error) {
      console.error("REAL LOGIN ERROR:", error);
      alert("Login failed");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Cinematch</p>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Log in to continue browsing movies.</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-button" type="submit">
            Login
          </button>
        </form>

        <p className="auth-switch">
          No account? <Link to="/register">Sign up</Link>
        </p>
      </section>
    </main>
  );
}