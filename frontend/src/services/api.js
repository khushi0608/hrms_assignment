import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Employees
export const getEmployees = () => api.get("/api/employees").then((r) => r.data.employees);
export const createEmployee = (data) => api.post("/api/employees", data).then((r) => r.data);
export const deleteEmployee = (id) => api.delete(`/api/employees/${id}`);

// Attendance
export const getAttendance = (employeeId, params) =>
  api.get(`/api/employees/${employeeId}/attendance`, { params }).then((r) => r.data);
export const markAttendance = (data) => api.post("/api/attendance", data).then((r) => r.data);

export default api;
