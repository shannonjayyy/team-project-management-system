"use client";
import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask, getProjects, getUsers } from "@/lib/api";
const STATUSES = ["To Do", "In Progress", "Done"];
const STATUS_BADGE = {"To Do":"badge badge-todo","In Progress":"badge badge-progress","Done":"badge badge-done"};
export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProject, setFilterProject] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({ title:"", description:"", status:"To Do", projectId:"", assignedTo:"" });
  const [saving, setSaving] = useState(false);
  const load = () => {
    setLoading(true);
    Promise.all([getTasks(), getProjects(), getUsers()])
      .then(([t,p,u]) => { setTasks(t); setProjects(p); setUsers(u); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);
  const openNew = () => { setEditTask(null); setForm({ title:"", description:"", status:"To Do", projectId:"", assignedTo:"" }); setShowModal(true); };
  const openEdit = (task) => { setEditTask(task); setForm({ title:task.title||"", description:task.description||"", status:task.status||"To Do", projectId:String(task.projectId||""), assignedTo:String(task.assignedTo||"") }); setShowModal(true); };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (!form.projectId) { setError("Please select a project"); return; }
    setSaving(true); setError("");
    try {
      const payload = { title:form.title, description:form.description, status:form.status, projectId:form.projectId, assignedTo:form.assignedTo||undefined };
      if (editTask) { await updateTask(editTask._id, payload); } else { await createTask(payload); }
      setShowModal(false); load();
    } catch(e) { setError(e.message); } finally { setSaving(false); }
  };
  const handleDelete = async (id) => { if (!confirm("Delete?")) return; try { await deleteTask(id); load(); } catch(e) { setError(e.message); } };
  const filtered = tasks.filter((t) => {
    if (filterStatus !== "All" && (t.status||"To Do") !== filterStatus) return false;
    if (filterProject !== "All" && String(t.projectId) !== filterProject) return false;
    return true;
  });
  return (
    <>
      <div className="page-header"><h2>Tasks</h2><p>All tasks across your projects</p></div>
      <div className="page-content">
        {error && <div className="error-text">⚠ {error}</div>}
        <div className="toolbar">
          <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
            <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)} style={{background:"var(--bg-3)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"8px 12px",color:"var(--text)",fontSize:"13px"}}>
              <option value="All">All Statuses</option>
              {STATUSES.map((s)=><option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterProject} onChange={(e)=>setFilterProject(e.target.value)} style={{background:"var(--bg-3)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"8px 12px",color:"var(--text)",fontSize:"13px"}}>
              <option value="All">All Projects</option>
              {projects.map((p)=><option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <span className="mono" style={{fontSize:"12px",color:"var(--text-dim)"}}>{filtered.length} results</span>
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ New Task</button>
        </div>
        {loading ? <p className="loading-text">Loading…</p> : filtered.length===0 ? <div className="empty-state"><div className="empty-icon">✓</div><p>No tasks found.</p></div> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Title</th><th>Status</th><th>Project</th><th>Assigned To</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((task)=>{
                const project=projects.find((p)=>p._id===String(task.projectId));
                const assignee=users.find((u)=>u._id===String(task.assignedTo));
                return (<tr key={task._id}>
                  <td style={{fontWeight:600}}>{task.title}</td>
                  <td><span className={STATUS_BADGE[task.status]||"badge badge-todo"}>{task.status||"To Do"}</span></td>
                  <td style={{color:"var(--text-muted)",fontSize:"13px"}}>{project?.name||"—"}</td>
                  <td style={{color:"var(--text-muted)",fontSize:"13px"}}>{assignee?.name||"—"}</td>
                  <td><div style={{display:"flex",gap:"6px"}}><button className="btn btn-ghost btn-sm" onClick={()=>openEdit(task)}>Edit</button><button className="btn btn-danger btn-sm" onClick={()=>handleDelete(task._id)}>Delete</button></div></td>
                </tr>);
              })}
            </tbody>
          </table></div>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3>{editTask?"Edit Task":"New Task"}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Title *</label><input required placeholder="Task title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} /></div>
              <div className="form-group"><label>Description</label><textarea placeholder="Task details…" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} /></div>
              <div className="form-group"><label>Status</label><select value={form.status} onChange={(e)=>setForm({...form,status:e.target.value})}>{STATUSES.map((s)=><option key={s} value={s}>{s}</option>)}</select></div>
              <div className="form-group"><label>Project *</label>
                <select value={form.projectId} onChange={(e)=>setForm({...form,projectId:e.target.value})}>
                  <option value="">— Select a project —</option>
                  {projects.map((p)=><option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Assign To</label><select value={form.assignedTo} onChange={(e)=>setForm({...form,assignedTo:e.target.value})}><option value="">— Unassigned —</option>{users.map((u)=><option key={u._id} value={u._id}>{u.name}</option>)}</select></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?"Saving…":editTask?"Save Changes":"Create Task"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
