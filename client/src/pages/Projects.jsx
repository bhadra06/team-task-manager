import { useEffect, useState } from "react";
import axios from "axios";

const BASE = "https://team-task-manager-production-69da.up.railway.app";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface-2: #18181f;
    --border: rgba(255,255,255,0.06);
    --border-hover: rgba(255,255,255,0.14);
    --text-primary: #f0f0f5;
    --text-secondary: #7b7b8f;
    --text-muted: #44445a;
    --accent-todo: #4f6ef7;
    --accent-todo-bg: rgba(79,110,247,0.08);
    --accent-done: #3ecf8e;
    --accent-done-bg: rgba(62,207,142,0.08);
    --shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  * { box-sizing: border-box; }

  .pj-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    padding: 40px 32px;
  }

  .pj-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 36px; padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
  }
  .pj-header-left { display: flex; flex-direction: column; gap: 4px; }
  .pj-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
  .pj-title span { color: var(--accent-todo); }
  .pj-subtitle { font-size: 13px; color: var(--text-muted); }
  .pj-header-right { display: flex; gap: 12px; align-items: center; }

  .pj-nav-btn {
    font-size: 12px; font-weight: 500; padding: 7px 14px; border-radius: 8px;
    border: 1px solid var(--border-hover); background: var(--surface-2);
    color: var(--text-secondary); cursor: pointer; text-decoration: none;
    transition: all 0.15s; display: flex; align-items: center; gap: 6px;
    font-family: 'DM Sans', sans-serif;
  }
  .pj-nav-btn:hover { background: var(--accent-todo-bg); color: var(--accent-todo); border-color: rgba(79,110,247,0.3); }

  .pj-btn-logout {
    font-size: 12px; font-weight: 500; padding: 7px 14px; border-radius: 8px;
    border: 1px solid rgba(244,107,107,0.25); background: rgba(244,107,107,0.06);
    color: #f46b6b; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.15s; display: flex; align-items: center; gap: 6px;
  }
  .pj-btn-logout:hover { background: rgba(244,107,107,0.14); border-color: rgba(244,107,107,0.45); }

  /* Create form */
  .pj-form-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px; margin-bottom: 32px;
  }
  .pj-form-title {
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase; color: var(--accent-todo); margin: 0 0 20px;
  }
  .pj-form { display: grid; grid-template-columns: 1fr 1fr 2fr auto; gap: 12px; align-items: end; }
  .pj-field { display: flex; flex-direction: column; gap: 6px; }
  .pj-label { font-size: 11px; font-weight: 500; color: var(--text-secondary); letter-spacing: 0.6px; text-transform: uppercase; }
  .pj-input, .pj-select {
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-primary);
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 13px; outline: none; width: 100%;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .pj-input::placeholder { color: var(--text-muted); }
  .pj-input:focus, .pj-select:focus { border-color: var(--accent-todo); box-shadow: 0 0 0 3px rgba(79,110,247,0.12); }
  .pj-select {
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237b7b8f' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 13px center; padding-right: 34px; cursor: pointer;
  }
  .pj-select option { background: #18181f; color: #f0f0f5; }
  .pj-btn {
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    color: #fff; background: var(--accent-todo); border: none; border-radius: 10px;
    padding: 10px 20px; cursor: pointer; white-space: nowrap;
    box-shadow: 0 4px 16px rgba(79,110,247,0.3); transition: all 0.15s; height: fit-content;
  }
  .pj-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .pj-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .pj-btn.danger {
    background: transparent; border: 1px solid rgba(244,107,107,0.3);
    color: #f46b6b; box-shadow: none; font-size: 12px; padding: 6px 12px;
  }
  .pj-btn.danger:hover { background: rgba(244,107,107,0.1); border-color: rgba(244,107,107,0.5); }
  .pj-btn.sm {
    font-size: 12px; padding: 6px 12px; box-shadow: none;
    background: var(--accent-todo-bg); color: var(--accent-todo);
    border: 1px solid rgba(79,110,247,0.25);
  }
  .pj-btn.sm:hover { background: var(--accent-todo); color: #fff; }

  /* Message */
  .pj-error { font-size: 12px; color: #f46b6b; background: rgba(244,107,107,0.08); border: 1px solid rgba(244,107,107,0.18); border-radius: 8px; padding: 8px 12px; margin-top: 12px; }
  .pj-success { font-size: 12px; color: var(--accent-done); background: rgba(62,207,142,0.08); border: 1px solid rgba(62,207,142,0.18); border-radius: 8px; padding: 8px 12px; margin-top: 12px; }

  /* Grid */
  .pj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }

  .pj-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px;
    display: flex; flex-direction: column; gap: 14px;
    transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
    animation: fadeUp 0.3s ease both;
  }
  .pj-card:hover { border-color: var(--border-hover); transform: translateY(-2px); box-shadow: var(--shadow); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pj-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .pj-card-name { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: var(--text-primary); margin: 0; line-height: 1.3; }
  .pj-card-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0; }

  .pj-card-members { display: flex; flex-direction: column; gap: 6px; }
  .pj-members-label { font-size: 11px; font-weight: 500; color: var(--text-muted); letter-spacing: 0.6px; text-transform: uppercase; }
  .pj-members-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .pj-member-chip {
    font-size: 12px; color: var(--text-secondary);
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 6px; padding: 3px 9px;
  }
  .pj-no-members { font-size: 12px; color: var(--text-muted); font-style: italic; }

  .pj-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 4px; border-top: 1px solid var(--border); }
  .pj-card-meta { font-size: 11px; color: var(--text-muted); }
  .pj-card-actions { display: flex; gap: 8px; }

  .pj-empty { text-align: center; padding: 60px 20px; color: var(--text-muted); font-size: 14px; }

  @media (max-width: 900px) {
    .pj-root { padding: 24px 16px; }
    .pj-form { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 600px) { .pj-form { grid-template-columns: 1fr; } }
`;

const authH = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [form,     setForm]     = useState({ name: "", description: "", members: [] });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const userName = localStorage.getItem("name") || "User";

  const fetchAll = async () => {
    const [pRes, uRes] = await Promise.all([
      axios.get(`${BASE}/api/projects`, { headers: authH() }),
      axios.get(`${BASE}/api/users`,    { headers: authH() }),
    ]);
    setProjects(pRes.data);
    setUsers(uRes.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleMembers = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value);
    setForm(f => ({ ...f, members: selected }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.name.trim()) return setError("Project name is required");
    setLoading(true);
    try {
      await axios.post(`${BASE}/api/projects`, form, { headers: authH() });
      setForm({ name: "", description: "", members: [] });
      setSuccess("Project created!");
      setTimeout(() => setSuccess(""), 3000);
      fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await axios.delete(`${BASE}/api/projects/${id}`, { headers: authH() });
      fetchAll();
    } catch {
      setError("Failed to delete project");
    }
  };

  const logout = () => {
    ["token","role","userId","name"].forEach(k => localStorage.removeItem(k));
    window.location.href = "/login";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="pj-root">

        <div className="pj-header">
          <div className="pj-header-left">
            <h1 className="pj-title">Task<span>Board</span></h1>
            <span className="pj-subtitle">Project Management</span>
          </div>
          <div className="pj-header-right">
            <a href="/dashboard" className="pj-nav-btn">⬡ Dashboard</a>
            <button className="pj-btn-logout" onClick={logout}>⎋ Logout</button>
          </div>
        </div>

        {/* Create Project */}
        <div className="pj-form-wrap">
          <p className="pj-form-title">+ New Project</p>
          <form className="pj-form" onSubmit={submit}>
            <div className="pj-field">
              <label className="pj-label">Project Name</label>
              <input className="pj-input" placeholder="e.g. Website Redesign" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="pj-field">
              <label className="pj-label">Description</label>
              <input className="pj-input" placeholder="Optional" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="pj-field">
              <label className="pj-label">Add Members (hold Ctrl/Cmd for multiple)</label>
              <select className="pj-select" multiple value={form.members} onChange={handleMembers}
                style={{ height: "44px", paddingRight: "13px" }}>
                {users.filter(u => u.role === "member").map(u => (
                  <option key={u._id} value={u._id}>{u.name} — {u.email}</option>
                ))}
              </select>
            </div>
            <button className="pj-btn" type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create →"}
            </button>
          </form>
          {error   && <div className="pj-error">⚠ {error}</div>}
          {success && <div className="pj-success">✓ {success}</div>}
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="pj-empty">No projects yet. Create your first one above.</div>
        ) : (
          <div className="pj-grid">
            {projects.map((p, i) => (
              <div className="pj-card" key={p._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="pj-card-header">
                  <h3 className="pj-card-name">{p.name}</h3>
                </div>
                {p.description && <p className="pj-card-desc">{p.description}</p>}

                <div className="pj-card-members">
                  <span className="pj-members-label">Team Members</span>
                  <div className="pj-members-list">
                    {p.members?.length > 0
                      ? p.members.map(m => (
                          <span className="pj-member-chip" key={m._id}>{m.name}</span>
                        ))
                      : <span className="pj-no-members">No members assigned</span>
                    }
                  </div>
                </div>

                <div className="pj-card-footer">
                  <span className="pj-card-meta">
                    By {p.createdBy?.name} · {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <div className="pj-card-actions">
                    <button className="pj-btn danger" onClick={() => deleteProject(p._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}
