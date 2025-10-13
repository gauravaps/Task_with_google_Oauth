import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios";

export default function LoginSuccess() {
  const navigate = useNavigate();
 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/me");
        if (res.data.success) {
          navigate("/profile");
        }
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  return <p style={{ textAlign: "center" }}>Logging in...</p>;
}
