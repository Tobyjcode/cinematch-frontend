import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMe, login } from "../api/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    try {
      setError(null);

      await login(username.trim(), password);
      await getMe();

      navigate("/movies");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
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
            onChange={(event) => setUsername(event.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="auth-button" type="submit">
            Login
          </button>
        </form>

        {error && <div className="status-card">{error}</div>}

        <p className="auth-switch">
          No account? <Link to="/register">Sign up</Link>
        </p>
      </section>
    </main>
  );
}