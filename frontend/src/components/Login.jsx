import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const userId = res.data.userId;
      const userType = res.data.type?.toLowerCase(); // normalize

      if (!userId) throw new Error("Invalid login response from server");

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      // Redirect based on role
      if (userType === "donor") history.push("/donor-dashboard");
      else if (userType === "volunteer") history.push("/volunteer-dashboard");
      else if (userType === "ngo") history.push("/ngo-dashboard");
      else history.push("/");

    } catch (err) {
      setMessage("❌ Login failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
}

export default Login;
