const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const getProjects = () => request("/projects");
export const getProject = (id) => request(`/projects/${id}`);
export const createProject = (data) => request("/projects", { method: "POST", body: JSON.stringify(data) });
export const updateProject = (id, data) => request(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteProject = (id) => request(`/projects/${id}`, { method: "DELETE" });

export const getTasks = () => request("/tasks");
export const getTask = (id) => request(`/tasks/${id}`);
export const createTask = (data) => request("/tasks", { method: "POST", body: JSON.stringify(data) });
export const updateTask = (id, data) => request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });

export const getUsers = () => request("/users");
export const getUser = (id) => request(`/users/${id}`);
export const createUser = (data) => request("/users/register", { method: "POST", body: JSON.stringify(data) });
export const updateUser = (id, data) => request(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteUser = (id) => request(`/users/${id}`, { method: "DELETE" });
