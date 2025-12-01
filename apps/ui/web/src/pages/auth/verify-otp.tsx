import { useLocation, useNavigate } from "react-router";
import { useState } from "react";

export function VerifyOTPPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  if (!email) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Invalid session. Go register again.</p>
      </div>
    );
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:3000/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Invalid OTP");
      return;
    }

    nav("/login");
  }

  return (
    <div className="flex items-center justify-center h-screen ">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full space-y-4"
      >
        <h2 className="text-lg font-bold text-gray-800">Verify Email</h2>
        <p className="text-sm text-gray-500">OTP sent to {email}</p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          className="w-full px-3 py-2 border rounded-lg tracking-widest text-center text-lg"
          placeholder="------"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          Verify
        </button>
      </form>
    </div>
  );
}
