"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProject, getTasks, createTask, updateTask, deleteTask, getUsers } from "@/lib/api";
const STATUSES = ["To Do", "In Progress", "Done"];
const STATUS_BADGE = {"To Do":"badge badge-todo","In Progress":"badge badge-progress","Done":"badge badge-done"};
export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({ title:"", description:"", status:"To Do", assignedTo:"" });
  const [saving, setSaving] = useState(false);
  const load = () => {
    Promise.all([getProject(id), getTasks(), getUsers()])
      .then(([p,t,u]) => { setProject(p); setTasks(t.filter((task)=>String(task.projectId)===id)); setUsers(u); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [id]);
  const openNew = () => { setEditTask(null); setForm({ title:"", description:"", status:"To Do", assignedTo:"" }); setShowModal(true); };
  const openEdit = (task) => { setEditTask(task); setForm({ title:task.title||"", description:task.description||"", status:task.status||"To Do", assignedTo:String(task.assignedTo||"") }); setShowModal(true); };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true); setError("");
    try {
      const payload = { title:form.title, description:form.description, status:form.status, projectId:id, assignedTo:form.assignedTo||undefined };
      if (editTask) { await updateTask(editTask._id, payload); } else { await createTask(payload); }
      setShowModal(false); load();
    } catch(e) { setError(e.message); } finally { setSaving(false); }
  };
  const handleDeleteTask = async (taskId) => { if (!confirm("Delete?")) return; try { await deleteTask(taskId); load(); } catch(e) { setError(e.message); } };
  const handleStatusChange = async (task, newStatus) => { try { await updateTask(task._id, { title:task.title, description:task.description, status:newStatus, projectId:id, assignedTo:task.assignedTo||undefined }); load(); } catch(e) { setError(e.message); } };
  const grouped = STATUSES.reduce((acc,s) => { acc[s]=tasks.filter((t)=>(t.status||"To Do")===s); return acc; }, {});
  if (loading) return <p className="loading-text">Loading project…</p>;
  return (
    <>
      <div className="page-header">
        <div style={{marginBottom:"4px"}}><Link href="/projects" style={{color:"var(--text-muted)",fontSize:"13px"}}>← Projects</Link></div>
        <h2>{project?.name||"Project"}</h2>
        {project?.description && <p>{project.description}</p>}
      </div>
      <div className="page-content">
        {error && <div className="error-text">⚠ {error}</div>}
        <div className="grid-3" style={{marginBottom:"24px"}}>
          {STATUSES.map((s)=>(
            <div className="stat-card" key={s}>
              <div className="stat-label">{s}</div>
              <div className={`stat-value ${s==="Done"?"green":s==="In Progress"?"yellow":""}`}>{grouped[s].length}</div>
            </div>
          ))}
        </div>
        <div className="toolbar">
          <span className="mono" style={{fontSize:"12px",color:"var(--text-dim)"}}>{tasks.length} task{tasks.length!==1?"s":""} total</span>
          <button className="btn btn-primary" onClick={openNew}>+ New Task</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px"}}>
          {STATUSES.map((status)=>(
            <div key={status} style={{background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",overflow:"hidden"}}>
              <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span className={STATUS_BADGE[status]}>{status}</span>
                <span className="mono" style={{fontSize:"11px",color:"var(--text-dim)"}}>{grouped[status].length}</span>
              </div>
              <div style={{padding:"12px",display:"flex",flexDirection:"column",gap:"10px",minHeight:"120px"}}>
                {grouped[status].length===0 ? <p style={{color:"var(--text-dim)",fontSize:"12px",textAlign:"center",paddingTop:"20px"}}>Empty</p> : grouped[status].map((task)=>{
                  const assignee=users.find((u)=>u._id===String(task.assignedTo));
                  return (
                    <div key={task._id} className="card" style={{padding:"14px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"6px"}}>
                        <h4 style={{fontSize:"14px",fontWeight:700}}>{task.title}</h4>
                        <div style={{display:"flex",gap:"4px"}}>
                          <button className="btn btn-ghost btn-sm" style={{padding:"4px 8px"}} onClick={()=>openEdit(task)}>✎</button>
                          <button className="btn btn-danger btn-sm" style={{padding:"4px 8px"}} onClick={()=>handleDeleteTask(task._id)}>✕</button>
                        </div>
                      </div>
                      {task.description && <p style={{fontSize:"12px",color:"var(--text-muted)",marginBottom:"10px"}}>{task.description}</p>}
                      {assignee && <p style={{fontSize:"11px",color:"var(--text-dim)",fontFamily:"DM Mono, monospace",marginBottom:"8px"}}>👤 {assignee.name}</p>}
                      <select value={task.status||"To Do"} onChange={(e)=>handleStatusChange(task,e.target.value)} style={{width:"100%",background:"var(--bg-3)",border:"1px solid var(--border)",borderRadius:"6px",padding:"5px 8px",color:"var(--text-muted)",fontSize:"11px"}}>
                        {STATUSES.map((s)=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3>{editTask?"Edit Task":"New Task"}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Title *</label><input required placeholder="Task title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} /></div>
              <div className="form-group"><label>Description</label><textarea placeholder="Task details…" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} /></div>
              <div className="form-group"><label>Status</label><select value={form.status} onChange={(e)=>setForm({...form,status:e.target.value})}>{STATUSES.map((s)=><option key={s} value={s}>{s}</option>)}</select></div>
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
