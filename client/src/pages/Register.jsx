import { useState } from "react";
import axios from "axios";

const BASE = "http://localhost:5000";

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
  .rg-root {
    min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif;
    color: var(--text-primary); display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .rg-root::before {
    content: ''; position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(79,110,247,0.07) 0%, transparent 70%);
    top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
  }
  .rg-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
    padding: 40px 36px; width: 100%; max-width: 400px;
    box-shadow: var(--shadow), var(--shadow-glow); position: relative; z-index: 1;
    animation: rg-fadein 0.4s ease;
  }
  @keyframes rg-fadein { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .rg-brand { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: var(--text-primary); margin: 0 0 4px; }
  .rg-brand span { color: var(--accent-todo); }
  .rg-subtitle { font-size: 13px; color: var(--text-muted); margin: 0 0 32px; }
  .rg-divider { height: 1px; background: var(--border); margin: 0 -4px 28px; }
  .rg-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .rg-label { font-size: 12px; font-weight: 500; color: var(--text-secondary); letter-spacing: 0.6px; text-transform: uppercase; }
  .rg-input {
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-primary);
    background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px;
    padding: 11px 14px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; width: 100%;
  }
  .rg-input::placeholder { color: var(--text-muted); }
  .rg-input:focus { border-color: var(--accent-todo); box-shadow: 0 0 0 3px rgba(79,110,247,0.12); }
  .rg-role-group { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .rg-role-option { position: relative; }
  .rg-role-option input[type="radio"] { position: absolute; opacity: 0; width: 0; height: 0; }
  .rg-role-label {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--surface-2); font-size: 13px; font-weight: 500;
    color: var(--text-secondary); cursor: pointer; transition: all 0.2s; user-select: none;
  }
  .rg-role-option input:checked + .rg-role-label { border-color: var(--accent-todo); background: rgba(79,110,247,0.1); color: var(--text-primary); }
  .rg-role-label:hover { border-color: var(--border-hover); color: var(--text-primary); }
  .rg-role-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--text-muted); transition: background 0.2s; }
  .rg-role-option input:checked + .rg-role-label .rg-role-dot { background: var(--accent-todo); }
  .rg-btn {
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #fff;
    background: var(--accent-todo); border: none; border-radius: 10px; padding: 13px;
    width: 100%; cursor: pointer; margin-top: 8px;
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 16px rgba(79,110,247,0.3);
  }
  .rg-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .rg-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .rg-error { font-size: 13px; color: #f46b6b; background: rgba(244,107,107,0.08); border: 1px solid rgba(244,107,107,0.2); border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; }
  .rg-success { font-size: 13px; color: var(--accent-done); background: rgba(62,207,142,0.08); border: 1px solid rgba(62,207,142,0.2); border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; }
  .rg-footer { text-align: center; margin-top: 24px; font-size: 13px; color: var(--text-muted); }
  .rg-footer a { color: var(--accent-todo); text-decoration: none; font-weight: 500; }
`;

export default function Register() {
  const [form,    setForm]    = useState({ name: "", email: "", password: "", role: "member" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await axios.post(`${BASE}/api/auth/register`, form);
      setSuccess(true);
      setTimeout(() => window.location.href = "/login", 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rg-root">
        <div className="rg-card">
          <h1 className="rg-brand">Task<span>Board</span></h1>
          <p className="rg-subtitle">Create your account</p>
          <div className="rg-divider" />
          {error   && <div className="rg-error">{error}</div>}
          {success && <div className="rg-success">✓ Registered! Redirecting…</div>}
          <form onSubmit={submit}>
            <div className="rg-field">
              <label className="rg-label">Full Name</label>
              <input className="rg-input" name="name" placeholder="John Doe" value={form.name} onChange={handle} required />
            </div>
            <div className="rg-field">
              <label className="rg-label">Email</label>
              <input className="rg-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
            </div>
            <div className="rg-field">
              <label className="rg-label">Password</label>
              <input className="rg-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required />
            </div>
            <div className="rg-field">
              <label className="rg-label">Role</label>
              <div className="rg-role-group">
                {["member","admin"].map(r => (
                  <label className="rg-role-option" key={r}>
                    <input type="radio" name="role" value={r} checked={form.role === r} onChange={handle} />
                    <span className="rg-role-label">
                      <span className="rg-role-dot" />
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <button className="rg-btn" type="submit" disabled={loading || success}>
              {loading ? "Creating…" : "Create Account →"}
            </button>
          </form>
          <p className="rg-footer">Already have an account? <a href="/login">Sign in</a></p>
        </div>
      </div>
    </>
  );
}
