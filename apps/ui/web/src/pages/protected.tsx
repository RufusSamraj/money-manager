import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { API_BASE_URL } from "../lib/constants";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 401) return setAuth(false);
        return res.json().then(() => setAuth(true));
      })
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) {
    return <div className="text-center pt-20 text-gray-500">Loading...</div>;
  }

  return auth ? children : <Navigate to="/login" />;
}
