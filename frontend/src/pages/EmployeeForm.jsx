import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "../services/api";
import Button from "../components/Button";
import styles from "./EmployeeForm.module.css";

const DEPARTMENTS = ["Engineering", "Product", "Design", "HR", "Operations", "Sales", "Marketing", "Other"];

export default function EmployeeForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createEmployee(form);
      navigate("/");
    } catch (e) {
      const detail = e.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join("; "));
      } else {
        setError(detail ?? e.message ?? "Failed to create employee");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1>Add employee</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}
        <label className={styles.label}>
          Employee ID
          <input
            type="text"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            required
            maxLength={50}
            placeholder="e.g. E001"
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Full Name
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            maxLength={255}
            placeholder="John Doe"
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="john@company.com"
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Department
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
            className={styles.input}
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
