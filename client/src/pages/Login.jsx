import { useState } from "react";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Mini CRM</h1>
        <p style={styles.subtitle}>Admin Login</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #ff7a00, #ff3b30)",
    fontFamily: "Arial",
  },

  card: {
    width: "350px",
    padding: "30px",
    background: "#ffffff",
    borderRadius: 8,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },

  title: {
    margin: 0,
    color: "#ff3b30",
    fontSize: "28px",
    fontWeight: "bold",
  },

  subtitle: {
    marginBottom: 20,
    color: "#666",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    border: "1px solid #ddd",
    borderRadius: 6,
    outline: "none",
  },

  button: {
    width: "100%",
    padding: 12,
    background: "linear-gradient(135deg, #ff3b30, #ff7a00)",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: 10,
  },
};