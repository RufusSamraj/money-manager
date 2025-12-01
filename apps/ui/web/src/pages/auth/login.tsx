import { useState } from "react";
import { useNavigate } from "react-router";

export function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // important for cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    nav("/");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800">Welcome Back</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />

        <input
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          Login
        </button>

        <p className="text-sm text-gray-600 text-center">
          New here?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => nav("/register")}
          >
            Create account
          </span>
        </p>
      </form>
    </div>
  );
}
