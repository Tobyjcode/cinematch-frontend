import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    try {
      setError(null);

      await register(username.trim(), password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Could not create account");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Cinematch</p>
        <h1>Create account</h1>
        <p className="auth-subtitle">
          Join Cinematch and start discovering movies.
        </p>

        <form className="auth-form" onSubmit={handleRegister}>
          <input
            className="auth-input"
            type="text"
            placeholder="Choose username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Choose password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="auth-button" type="submit">
            Sign up
          </button>
        </form>

        {error && <div className="status-card">{error}</div>}

        <p className="auth-switch">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </section>
    </main>
  );
}