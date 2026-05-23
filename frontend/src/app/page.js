"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects, getTasks, getUsers } from "@/lib/api";

const STATUS_BADGE = {
  "To Do": "badge badge-todo",
  "In Progress": "badge badge-progress",
  "Done": "badge badge-done",
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProjects(), getTasks(), getUsers()])
      .then(([p, t, u]) => { setProjects(p); setTasks(t); setUsers(u); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const doneTasks = tasks.filter((t) => t.status === "Done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const todoTasks = tasks.filter((t) => t.status === "To Do" || !t.status).length;
  const completionRate = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;

  return (
    <>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your team's project activity</p>
      </div>
      <div className="page-content">
        {error && <div className="error-text">⚠ Could not reach backend: {error}</div>}
        {loading ? <p className="loading-text">Loading data…</p> : (
          <>
            {/* Stats */}
            <div className="grid-3" style={{ marginBottom: "28px" }}>
              <div className="stat-card">
                <div className="stat-label">Projects</div>
                <div className="stat-value accent">{projects.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Tasks</div>
                <div className="stat-value">{tasks.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Team Members</div>
                <div className="stat-value">{users.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Completed</div>
                <div className="stat-value green">{doneTasks}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">In Progress</div>
                <div className="stat-value yellow">{inProgressTasks}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Completion Rate</div>
                <div className="stat-value accent">{completionRate}%</div>
              </div>
            </div>

            {/* Overall progress bar */}
            <div className="card" style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Overall Progress</span>
                <span className="mono" style={{ fontSize: "13px", color: "var(--text-muted)" }}>{doneTasks}/{tasks.length} tasks done</span>
              </div>
              <div style={{ background: "var(--bg-3)", borderRadius: "6px", height: "8px", overflow: "hidden", marginBottom: "10px" }}>
                <div style={{ height: "100%", width: `${completionRate}%`, background: "var(--accent)", borderRadius: "6px", transition: "width 0.6s ease" }} />
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <span className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>✓ {doneTasks} done</span>
                <span className="mono" style={{ fontSize: "11px", color: "var(--yellow)" }}>◎ {inProgressTasks} in progress</span>
                <span className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>○ {todoTasks} to do</span>
              </div>
            </div>

            {/* Recent Projects */}
            <div style={{ marginBottom: "28px" }}>
              <div className="toolbar">
                <h3 style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)" }}>Recent Projects</h3>
                <Link href="/projects" className="btn btn-ghost btn-sm">View all →</Link>
              </div>
              {projects.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">📁</div><p>No projects yet. <Link href="/projects" style={{ color: "var(--accent)" }}>Create one →</Link></p></div>
              ) : (
                <div className="grid-2">
                  {projects.slice(0, 4).map((project) => {
                    const projectTasks = tasks.filter((t) => String(t.projectId) === project._id);
                    const done = projectTasks.filter((t) => t.status === "Done").length;
                    const pct = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0;
                    return (
                      <Link href={`/projects/${project._id}`} key={project._id} style={{ display: "block" }}>
                        <div className="card" style={{ cursor: "pointer" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                            <h4 style={{ fontSize: "15px", fontWeight: 700 }}>{project.name}</h4>
                            <span className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>{projectTasks.length} tasks</span>
                          </div>
                          {project.description && (
                            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px", lineHeight: 1.5 }}>
                              {project.description.substring(0, 80)}{project.description.length > 80 ? "…" : ""}
                            </p>
                          )}
                          <div style={{ background: "var(--bg-3)", borderRadius: "4px", height: "4px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "var(--green)" : "var(--accent)", borderRadius: "4px", transition: "width 0.4s" }} />
                          </div>
                          <p style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "6px", fontFamily: "DM Mono, monospace" }}>{pct}% complete</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Tasks */}
            <div>
              <div className="toolbar">
                <h3 style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)" }}>Recent Tasks</h3>
                <Link href="/tasks" className="btn btn-ghost btn-sm">View all →</Link>
              </div>
              {tasks.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">✓</div><p>No tasks yet. <Link href="/tasks" style={{ color: "var(--accent)" }}>Create one →</Link></p></div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Task</th><th>Status</th><th>Project</th><th>Assigned To</th></tr>
                    </thead>
                    <tbody>
                      {tasks.slice(0, 8).map((task) => {
                        const assignee = users.find((u) => u._id === String(task.assignedTo));
                        const project = projects.find((p) => p._id === String(task.projectId));
                        return (
                          <tr key={task._id}>
                            <td style={{ fontWeight: 600 }}>{task.title}</td>
                            <td><span className={STATUS_BADGE[task.status] || "badge badge-todo"}>{task.status || "To Do"}</span></td>
                            <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>{project?.name || "—"}</td>
                            <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>{assignee ? assignee.name : "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
