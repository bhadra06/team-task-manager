import { useState } from "react";
import axios from "axios";

const BASE = "https://team-task-manager-production-69da.up.railway.app";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  :root {
    --bg: #0a0a0f; --surface: #111118; --surface-2: #18181f;
    --border: rgba(255,255,255,0.06); --border-hover: rgba(255,255,255,0.14);
    --text-primary: #f0f0f5; --text-secondary: #7b7b8f; --text-muted: #44445a;
    --accent-todo: #4f6ef7; --accent-done: #3ecf8e;
    --shadow: 0 8px 32px rgba(0,0,0,0.4); --shadow-glow: 0 0 60px rgba(79,110,247,0.12);
  }
  * { box-sizing: border-box; }
  .lg-root {
    min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif;
    color: var(--text-primary); display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .lg-root::before {
    content: ''; position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(79,110,247,0.07) 0%, transparent 70%);
    top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
  }
  .lg-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
    padding: 40px 36px; width: 100%; max-width: 380px;
    box-shadow: var(--shadow), var(--shadow-glow); position: relative; z-index: 1;
    animation: lg-fadein 0.4s ease;
  }
  @keyframes lg-fadein { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .lg-brand { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: var(--text-primary); margin: 0 0 4px; }
  .lg-brand span { color: var(--accent-todo); }
  .lg-subtitle { font-size: 13px; color: var(--text-muted); margin: 0 0 32px; }
  .lg-divider { height: 1px; background: var(--border); margin: 0 -4px 28px; }
  .lg-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .lg-label { font-size: 12px; font-weight: 500; color: var(--text-secondary); letter-spacing: 0.6px; text-transform: uppercase; }
  .lg-input {
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-primary);
    background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px;
    padding: 11px 14px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; width: 100%;
  }
  .lg-input::placeholder { color: var(--text-muted); }
  .lg-input:focus { border-color: var(--accent-todo); box-shadow: 0 0 0 3px rgba(79,110,247,0.12); }
  .lg-btn {
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #fff;
    background: var(--accent-todo); border: none; border-radius: 10px; padding: 13px;
    width: 100%; cursor: pointer; margin-top: 8px;
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 16px rgba(79,110,247,0.3);
  }
  .lg-btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(79,110,247,0.4); }
  .lg-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .lg-footer { text-align: center; margin-top: 24px; font-size: 13px; color: var(--text-muted); }
  .lg-footer a { color: var(--accent-todo); text-decoration: none; font-weight: 500; }
  .lg-footer a:hover { opacity: 0.75; }
  .lg-error { font-size: 13px; color: #f46b6b; background: rgba(244,107,107,0.08); border: 1px solid rgba(244,107,107,0.2); border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; }
`;

export default function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const login = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await axios.post(`${BASE}/api/auth/login`, { email, password });
      localStorage.setItem("token",  res.data.token);
      localStorage.setItem("role",   res.data.user.role);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("name",   res.data.user.name);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lg-root">
        <div className="lg-card">
          <h1 className="lg-brand">Task<span>Board</span></h1>
          <p className="lg-subtitle">Sign in to your workspace</p>
          <div className="lg-divider" />
          {error && <div className="lg-error">{error}</div>}
          <form onSubmit={login}>
            <div className="lg-field">
              <label className="lg-label">Email</label>
              <input className="lg-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="lg-field">
              <label className="lg-label">Password</label>
              <input className="lg-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button className="lg-btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
          <p className="lg-footer">Don't have an account? <a href="/register">Register</a></p>
        </div>
      </div>
    </>
  );
}
