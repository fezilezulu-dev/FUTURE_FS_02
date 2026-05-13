import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    setToken(saved);
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (loading) return null;

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return <Dashboard logout={logout} />;
}

export default App;