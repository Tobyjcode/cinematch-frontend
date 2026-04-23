import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      await register(username, password);
      alert("Account created. You can log in now.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Register failed");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Cinematch</p>
        <h1>Create account</h1>
        <p className="auth-subtitle">Join Cinematch and start discovering movies.</p>

        <form className="auth-form" onSubmit={handleRegister}>
          <input
            className="auth-input"
            type="text"
            placeholder="Choose username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Choose password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-button" type="submit">
            Sign up
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </section>
    </main>
  );
}