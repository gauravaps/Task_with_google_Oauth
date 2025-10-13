import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../axios";

export default function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  if (user) return <Navigate to="/profile" replace />;

  return children;
}
