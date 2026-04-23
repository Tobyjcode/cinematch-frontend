import { useState } from "react";
import { login, getMe } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
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
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "100px" }}>
      <h1>Login</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
      />

      <button
        onClick={handleLogin}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        Login
      </button>

      {}
      <p style={{ textAlign: "center" }}>
        No account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}