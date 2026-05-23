"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects, createProject, deleteProject } from "@/lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getProjects()
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await createProject(form);
      setShowModal(false);
      setForm({ name: "", description: "" });
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Projects</h2>
        <p>Create and manage your team's projects</p>
      </div>
      <div className="page-content">
        {error && <div className="error-text">⚠ {error}</div>}
        <div className="toolbar">
          <span className="mono" style={{ fontSize: "12px", color: "var(--text-dim)" }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </span>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Project
          </button>
        </div>

        {loading ? (
          <p className="loading-text">Loading projects…</p>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <p>No projects yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid-2">
            {projects.map((project) => (
              <div className="card" key={project._id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Link href={`/projects/${project._id}`}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px", cursor: "pointer" }}>
                      {project.name}
                    </h3>
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(project._id)}>
                    ✕
                  </button>
                </div>
                {project.description && (
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
                    {project.description}
                  </p>
                )}
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <Link href={`/projects/${project._id}`} className="btn btn-ghost btn-sm">
                    View details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>New Project</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  required
                  placeholder="e.g. Website Redesign"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="What is this project about?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Creating…" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
