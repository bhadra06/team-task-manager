import { useEffect, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:5000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .ct-wrap {
    background: var(--surface, #111118);
    border: 1px solid var(--border, rgba(255,255,255,0.06));
    border-radius: 16px; padding: 24px;
    font-family: 'DM Sans', sans-serif;
  }
  .ct-heading {
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    letter-spacing: 1px; text-transform: uppercase;
    color: var(--accent-todo, #4f6ef7); margin: 0 0 20px;
  }
  .ct-form {
    display: grid;
    grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr auto;
    gap: 12px; align-items: end;
  }
  .ct-field { display: flex; flex-direction: column; gap: 6px; }
  .ct-label {
    font-size: 11px; font-weight: 500;
    color: var(--text-secondary, #7b7b8f);
    letter-spacing: 0.6px; text-transform: uppercase;
  }
  .ct-input, .ct-select {
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    color: var(--text-primary, #f0f0f5);
    background: var(--surface-2, #18181f);
    border: 1px solid var(--border, rgba(255,255,255,0.06));
    border-radius: 10px; padding: 10px 13px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%; box-sizing: border-box;
  }
  .ct-input::placeholder { color: var(--text-muted, #44445a); }
  .ct-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }
  .ct-input:focus, .ct-select:focus {
    border-color: var(--accent-todo, #4f6ef7);
    box-shadow: 0 0 0 3px rgba(79,110,247,0.12);
  }
  .ct-select {
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237b7b8f' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 13px center;
    padding-right: 34px; cursor: pointer;
  }
  .ct-select option { background: #18181f; color: #f0f0f5; }
  .ct-btn {
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.4px; color: #fff;
    background: var(--accent-todo, #4f6ef7);
    border: none; border-radius: 10px; padding: 10px 20px;
    cursor: pointer; white-space: nowrap;
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 16px rgba(79,110,247,0.3); height: fit-content;
  }
  .ct-btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(79,110,247,0.4); }
  .ct-btn:active { transform: scale(0.97); }
  .ct-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .ct-error {
    font-size: 12px; color: #f46b6b;
    background: rgba(244,107,107,0.08); border: 1px solid rgba(244,107,107,0.18);
    border-radius: 8px; padding: 8px 12px; margin-top: 12px;
  }
  .ct-success {
    font-size: 12px; color: var(--accent-done, #3ecf8e);
    background: rgba(62,207,142,0.08); border: 1px solid rgba(62,207,142,0.18);
    border-radius: 8px; padding: 8px 12px; margin-top: 12px;
  }
  @media (max-width: 1100px) { .ct-form { grid-template-columns: 1fr 1fr 1fr; } }
  @media (max-width: 700px)  { .ct-form { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 500px)  { .ct-form { grid-template-columns: 1fr; } }
`;

export default function CreateTask({ refresh }) {
  const [users,       setUsers]       = useState([]);
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo,  setAssignedTo]  = useState("");
  const [priority,    setPriority]    = useState("medium");
  const [dueDate,     setDueDate]     = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState(false);

  useEffect(() => {
    axios.get(`${BASE}/api/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => setUsers(res.data))
      .catch(() => setError("Failed to load users"));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(false);
    if (!title.trim())  return setError("Title is required");
    if (!assignedTo)    return setError("Please select a user to assign");

    setLoading(true);
    try {
      await axios.post(
        `${BASE}/api/tasks`,
        { title, description, assignedTo, priority, dueDate: dueDate || undefined },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTitle(""); setDescription(""); setAssignedTo(""); setPriority("medium"); setDueDate("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      refresh();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ct-wrap">
        <p className="ct-heading">+ Assign New Task</p>
        <form className="ct-form" onSubmit={create}>

          <div className="ct-field">
            <label className="ct-label">Title</label>
            <input className="ct-input" placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="ct-field">
            <label className="ct-label">Description</label>
            <input className="ct-input" placeholder="Optional details" value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="ct-field">
            <label className="ct-label">Assign To</label>
            <select className="ct-select" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
              <option value="">Select user…</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          <div className="ct-field">
            <label className="ct-label">Priority</label>
            <select className="ct-select" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="ct-field">
            <label className="ct-label">Due Date</label>
            <input className="ct-input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>

          <button className="ct-btn" type="submit" disabled={loading}>
            {loading ? "Adding…" : "Add →"}
          </button>
        </form>

        {error   && <div className="ct-error">⚠ {error}</div>}
        {success && <div className="ct-success">✓ Task assigned successfully</div>}
      </div>
    </>
  );
}
