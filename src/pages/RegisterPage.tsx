import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
    try {
      await register(username, password);
      alert("User created. You can log in now.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Register failed");
    }
  }

  return (
    <div>
      <h1>Create account</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Sign up</button>

      <p>
        Already have an account? <Link to="/">Log in</Link>
      </p>
    </div>
  );
}