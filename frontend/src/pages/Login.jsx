import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../utils/auth";
import { API_BASE } from "../global";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Серверээс хариу шалгах
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Токен хадгалах
      auth.login(data.token);

      // Нүүр хуудас руу чиглүүлэх
      navigate("/resorts");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded w-full"
          disabled={loading}
        >
          {loading ? "..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
