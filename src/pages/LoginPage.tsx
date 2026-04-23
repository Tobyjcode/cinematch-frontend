import { useState } from "react";
import { login, getMe } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
  try {
    await login(username, password);
    const user = await getMe();
    console.log("Logged in user:", user);
    alert("Login success");
    navigate("/movies");
  } catch (error) {
    console.error("REAL LOGIN ERROR:", error);
    alert("Login failed");
  }
}

  return (
    <div>
      <h1>Login</h1>

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

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}