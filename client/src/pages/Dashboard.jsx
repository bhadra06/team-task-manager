import { useEffect, useState } from "react";
import axios from "axios";
import CreateTask from "../components/CreateTask";

const BASE = "http://localhost:5000";

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
    --accent-progress: #f0a04b;
    --accent-progress-bg: rgba(240,160,75,0.08);
    --accent-done: #3ecf8e;
    --accent-done-bg: rgba(62,207,142,0.08);
    --accent-overdue: #f46b6b;
    --accent-overdue-bg: rgba(244,107,107,0.08);
    --shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  * { box-sizing: border-box; }

  .db-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    padding: 40px 32px;
  }

  /* ── Header ── */
  .db-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
  }
  .db-header-left { display: flex; flex-direction: column; gap: 4px; }
  .db-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px; font-weight: 800;
    letter-spacing: -0.5px; margin: 0;
  }
  .db-title span { color: var(--accent-todo); }
  .db-subtitle { font-size: 13px; color: var(--text-muted); }
  .db-header-right { display: flex; align-items: center; gap: 12px; }

  .db-nav-btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    padding: 7px 14px; border-radius: 8px;
    border: 1px solid var(--border-hover);
    background: var(--surface-2);
    color: var(--text-secondary);
    cursor: pointer; text-decoration: none;
    transition: background 0.15s, color 0.15s;
    display: flex; align-items: center; gap: 6px;
  }
  .db-nav-btn:hover { background: var(--accent-todo-bg); color: var(--accent-todo); border-color: rgba(79,110,247,0.3); }

  .db-user-badge {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 7px 13px;
  }
  .db-user-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--accent-todo-bg);
    border: 1px solid rgba(79,110,247,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: var(--accent-todo);
    font-family: 'Syne', sans-serif;
  }
  .db-user-name { font-size: 13px; font-weight: 500; color: var(--text-primary); line-height: 1; }
  .db-user-role { font-size: 11px; color: var(--text-muted); text-transform: capitalize; margin-top: 2px; }

  .db-btn-logout {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    padding: 7px 14px; border-radius: 8px;
    border: 1px solid rgba(244,107,107,0.25);
    background: rgba(244,107,107,0.06); color: #f46b6b;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
    display: flex; align-items: center; gap: 6px;
  }
  .db-btn-logout:hover { background: rgba(244,107,107,0.14); border-color: rgba(244,107,107,0.45); transform: scale(1.03); }

  /* ── Stats Row ── */
  .db-stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
    margin-bottom: 32px;
  }
  .db-stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 18px 20px;
    display: flex; flex-direction: column; gap: 6px;
    transition: border-color 0.2s, transform 0.15s;
    animation: fadeUp 0.4s ease both;
  }
  .db-stat:hover { border-color: var(--border-hover); transform: translateY(-2px); }
  .db-stat-label { font-size: 11px; font-weight: 500; color: var(--text-muted); letter-spacing: 0.8px; text-transform: uppercase; }
  .db-stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; line-height: 1; }
  .db-stat-value.total    { color: var(--text-primary); }
  .db-stat-value.todo     { color: var(--accent-todo); }
  .db-stat-value.progress { color: var(--accent-progress); }
  .db-stat-value.done     { color: var(--accent-done); }
  .db-stat-value.overdue  { color: var(--accent-overdue); }
  .db-stat-bar { height: 3px; border-radius: 2px; margin-top: 4px; }
  .db-stat-bar.total    { background: rgba(240,240,245,0.15); }
  .db-stat-bar.todo     { background: var(--accent-todo); }
  .db-stat-bar.progress { background: var(--accent-progress); }
  .db-stat-bar.done     { background: var(--accent-done); }
  .db-stat-bar.overdue  { background: var(--accent-overdue); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .db-stat:nth-child(1) { animation-delay: 0.05s; }
  .db-stat:nth-child(2) { animation-delay: 0.10s; }
  .db-stat:nth-child(3) { animation-delay: 0.15s; }
  .db-stat:nth-child(4) { animation-delay: 0.20s; }
  .db-stat:nth-child(5) { animation-delay: 0.25s; }

  /* ── Create wrap ── */
  .db-create-wrap { margin-bottom: 32px; }

  /* ── Columns ── */
  .db-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

  .db-column {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 20px;
    display: flex; flex-direction: column; gap: 12px; min-height: 320px;
  }
  .db-col-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .db-col-title {
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 1.2px; text-transform: uppercase;
  }
  .db-col-title.todo     { color: var(--accent-todo); }
  .db-col-title.progress { color: var(--accent-progress); }
  .db-col-title.done     { color: var(--accent-done); }
  .db-col-count {
    font-size: 12px; font-weight: 500; color: var(--text-muted);
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 20px; padding: 2px 10px;
  }
  .db-col-divider { height: 1px; background: var(--border); margin: 0 -4px 4px; }

  /* ── Card ── */
  .db-card {
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px;
    display: flex; flex-direction: column; gap: 10px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
    cursor: default;
  }
  .db-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow); transform: translateY(-2px); }
  .db-card.overdue { border-color: rgba(244,107,107,0.3); }
  .db-card.overdue:hover { border-color: rgba(244,107,107,0.55); }

  .db-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .db-card-title { font-size: 14px; font-weight: 500; color: var(--text-primary); line-height: 1.4; margin: 0; flex: 1; }

  .db-priority {
    font-size: 10px; font-weight: 600; letter-spacing: 0.5px;
    text-transform: uppercase; border-radius: 5px; padding: 2px 7px;
    flex-shrink: 0;
  }
  .db-priority.high   { background: rgba(244,107,107,0.12); color: #f46b6b; border: 1px solid rgba(244,107,107,0.25); }
  .db-priority.medium { background: rgba(240,160,75,0.12);  color: var(--accent-progress); border: 1px solid rgba(240,160,75,0.25); }
  .db-priority.low    { background: rgba(62,207,142,0.10);  color: var(--accent-done); border: 1px solid rgba(62,207,142,0.2); }

  .db-card-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; }

  .db-card-due {
    font-size: 11px; color: var(--text-muted);
    display: flex; align-items: center; gap: 4px;
  }
  .db-card-due.overdue { color: var(--accent-overdue); font-weight: 500; }

  .db-card-assignee {
    font-size: 11px; color: var(--text-muted);
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 5px; padding: 2px 7px;
    max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .db-card-footer { display: flex; align-items: center; justify-content: flex-end; }

  .db-btn-move {
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
    padding: 6px 14px; border-radius: 8px;
    border: 1px solid var(--border-hover);
    background: var(--surface); color: var(--text-secondary);
    cursor: pointer; letter-spacing: 0.2px;
    transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.1s;
    display: flex; align-items: center; gap: 6px;
  }
  .db-btn-move:hover { background: var(--accent-todo); border-color: var(--accent-todo); color: #fff; transform: scale(1.04); }
  .db-btn-move.to-done:hover { background: var(--accent-done); border-color: var(--accent-done); }

  .db-badge-done {
    font-size: 11px; font-weight: 500; color: var(--accent-done);
    background: var(--accent-done-bg); border: 1px solid rgba(62,207,142,0.2);
    border-radius: 6px; padding: 4px 10px; letter-spacing: 0.3px;
  }

  .db-overdue-tag {
    font-size: 10px; font-weight: 600; color: var(--accent-overdue);
    background: var(--accent-overdue-bg); border: 1px solid rgba(244,107,107,0.2);
    border-radius: 5px; padding: 2px 7px; letter-spacing: 0.4px; text-transform: uppercase;
  }

  .db-empty { color: var(--text-muted); font-size: 13px; text-align: center; padding: 32px 0; }

  @media (max-width: 1100px) { .db-stats { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 900px) {
    .db-columns { grid-template-columns: 1fr; }
    .db-root { padding: 24px 16px; }
    .db-stats { grid-template-columns: repeat(2, 1fr); }
    .db-user-name, .db-user-role { display: none; }
  }
`;

const API = (path) => axios.get(`${BASE}${path}`, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const isOverdue = (task) =>
  task.dueDate && task.status !== "done" && new Date(task.dueDate) < new Date();

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function Dashboard() {
  const [tasks, setTasks]   = useState([]);
  const [stats, setStats]   = useState({ total: 0, todo: 0, inProgress: 0, done: 0, overdue: 0 });

  const userName = localStorage.getItem("name") || "User";
  const userRole = localStorage.getItem("role") || "member";
  const initials = userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const fetchAll = async () => {
    const [tRes, sRes] = await Promise.all([
      API("/api/tasks/my"),
      API("/api/tasks/stats"),
    ]);
    setTasks(tRes.data);
    setStats(sRes.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`${BASE}/api/tasks/${id}`, { status }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchAll();
  };

  const logout = () => {
    ["token","role","userId","name"].forEach(k => localStorage.removeItem(k));
    window.location.href = "/login";
  };

  const todo     = tasks.filter(t => t.status === "todo");
  const progress = tasks.filter(t => t.status === "in-progress");
  const done     = tasks.filter(t => t.status === "done");

  const columns = [
    { key: "todo",     label: "Todo",        cls: "todo",     list: todo     },
    { key: "progress", label: "In Progress", cls: "progress", list: progress },
    { key: "done",     label: "Done",        cls: "done",     list: done     },
  ];

  const statCards = [
    { label: "Total",       value: stats.total,      cls: "total"    },
    { label: "Todo",        value: stats.todo,        cls: "todo"     },
    { label: "In Progress", value: stats.inProgress,  cls: "progress" },
    { label: "Done",        value: stats.done,        cls: "done"     },
    { label: "Overdue",     value: stats.overdue,     cls: "overdue"  },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="db-root">

        {/* Header */}
        <div className="db-header">
          <div className="db-header-left">
            <h1 className="db-title">Task<span>Board</span></h1>
            <span className="db-subtitle">Welcome back, {userName}</span>
          </div>
          <div className="db-header-right">
            {userRole === "admin" && (
              <a href="/projects" className="db-nav-btn">⬡ Projects</a>
            )}
            <div className="db-user-badge">
              <div className="db-user-avatar">{initials}</div>
              <div>
                <div className="db-user-name">{userName}</div>
                <div className="db-user-role">{userRole}</div>
              </div>
            </div>
            <button className="db-btn-logout" onClick={logout}>⎋ Logout</button>
          </div>
        </div>

        {/* Stats */}
        <div className="db-stats">
          {statCards.map(({ label, value, cls }) => (
            <div className="db-stat" key={cls}>
              <span className="db-stat-label">{label}</span>
              <span className={`db-stat-value ${cls}`}>{value}</span>
              <div className={`db-stat-bar ${cls}`} />
            </div>
          ))}
        </div>

        {/* Create Task (admin) */}
        {userRole === "admin" && (
          <div className="db-create-wrap">
            <CreateTask refresh={fetchAll} />
          </div>
        )}

        {/* Kanban */}
        <div className="db-columns">
          {columns.map(({ key, label, cls, list }) => (
            <div className="db-column" key={key}>
              <div className="db-col-header">
                <span className={`db-col-title ${cls}`}>{label}</span>
                <span className="db-col-count">{list.length}</span>
              </div>
              <div className="db-col-divider" />

              {list.length === 0 && <p className="db-empty">No tasks here</p>}

              {list.map(task => {
                const overdue = isOverdue(task);
                return (
                  <div className={`db-card ${overdue ? "overdue" : ""}`} key={task._id}>
                    <div className="db-card-top">
                      <p className="db-card-title">{task.title}</p>
                      {task.priority && (
                        <span className={`db-priority ${task.priority}`}>{task.priority}</span>
                      )}
                    </div>

                    <div className="db-card-meta">
                      {task.dueDate ? (
                        <span className={`db-card-due ${overdue ? "overdue" : ""}`}>
                          {overdue ? "⚠ " : "📅 "}{fmtDate(task.dueDate)}
                        </span>
                      ) : <span />}
                      {task.assignedTo?.name && (
                        <span className="db-card-assignee">👤 {task.assignedTo.name}</span>
                      )}
                    </div>

                    <div className="db-card-footer">
                      {overdue && task.status !== "done" && (
                        <span className="db-overdue-tag" style={{marginRight:"auto"}}>Overdue</span>
                      )}
                      {task.status !== "done" ? (
                        <button
                          className={`db-btn-move ${task.status === "in-progress" ? "to-done" : ""}`}
                          onClick={() => updateStatus(task._id, task.status === "todo" ? "in-progress" : "done")}
                        >
                          {task.status === "todo" ? "▶ Start" : "✓ Complete"}
                        </button>
                      ) : (
                        <span className="db-badge-done">✓ Done</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
