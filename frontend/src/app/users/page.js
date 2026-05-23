"use client";
import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api";
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name:"", email:"", role:"" });
  const [saving, setSaving] = useState(false);
  const load = () => { setLoading(true); getUsers().then(setUsers).catch((e)=>setError(e.message)).finally(()=>setLoading(false)); };
  useEffect(()=>{ load(); },[]);
  const openNew = () => { setEditUser(null); setForm({ name:"", email:"", role:"" }); setError(""); setShowModal(true); };
  const openEdit = (user) => { setEditUser(user); setForm({ name:user.name||"", email:user.email||"", role:user.role||"" }); setError(""); setShowModal(true); };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!form.email.trim()) { setError("Email is required"); return; }
    if (!form.role.trim()) { setError("Role is required"); return; }
    setSaving(true); setError("");
    try {
      if (editUser) { await updateUser(editUser._id, form); } else { await createUser(form); }
      setShowModal(false); load();
    } catch(e) { setError(e.message); } finally { setSaving(false); }
  };
  const handleDelete = async (id) => { if (!confirm("Remove this user?")) return; try { await deleteUser(id); load(); } catch(e) { setError(e.message); } };
  const initials = (name) => name ? name.split(" ").map((n)=>n[0]).join("").toUpperCase().slice(0,2) : "?";
  const avatarColor = (name) => { const colors=["#6c63ff","#3ecf8e","#f5c542","#ff5f5f","#58b0f5","#e07cff"]; let hash=0; for(let i=0;i<(name||"").length;i++) hash+=name.charCodeAt(i); return colors[hash%colors.length]; };
  return (
    <>
      <div className="page-header"><h2>Users</h2><p>Manage your team members</p></div>
      <div className="page-content">
        {!showModal && error && <div className="error-text">⚠ {error}</div>}
        <div className="toolbar">
          <span className="mono" style={{fontSize:"12px",color:"var(--text-dim)"}}>{users.length} member{users.length!==1?"s":""}</span>
          <button className="btn btn-primary" onClick={openNew}>+ Add User</button>
        </div>
        {loading ? <p className="loading-text">Loading users…</p> : users.length===0 ? (
          <div className="empty-state"><div className="empty-icon">👥</div><p>No team members yet.</p></div>
        ) : (
          <div className="grid-3">
            {users.map((user)=>(
              <div className="card" key={user._id} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                  <div style={{width:"44px",height:"44px",borderRadius:"50%",background:avatarColor(user.name),display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",fontWeight:800,color:"#fff",flexShrink:0}}>
                    {initials(user.name)}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <h4 style={{fontSize:"15px",fontWeight:700,marginBottom:"2px"}}>{user.name}</h4>
                    <p style={{fontSize:"12px",color:"var(--text-muted)",fontFamily:"DM Mono, monospace"}}>{user.email}</p>
                  </div>
                </div>
                {user.role && <span className="badge badge-todo" style={{alignSelf:"flex-start"}}>{user.role}</span>}
                <div style={{display:"flex",gap:"8px",marginTop:"auto"}}>
                  <button className="btn btn-ghost btn-sm" style={{flex:1}} onClick={()=>openEdit(user)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(user._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3>{editUser?"Edit User":"Add Team Member"}</h3>
            {error && <div className="error-text" style={{marginBottom:"12px"}}>⚠ {error}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Full Name *</label><input required placeholder="e.g. Shannon Jay" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} /></div>
              <div className="form-group"><label>Email *</label><input required type="email" placeholder="email@example.com" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} /></div>
              <div className="form-group"><label>Role *</label><input required placeholder="e.g. Developer, Designer, PM" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?"Saving…":editUser?"Save Changes":"Add Member"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
