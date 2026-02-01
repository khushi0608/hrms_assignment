import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../services/api";
import Button from "../components/Button";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import styles from "./EmployeeList.module.css";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (e) {
      setError(e.response?.data?.detail ?? e.message ?? "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    setDeleting(true);
    setError(null);
    try {
      await deleteEmployee(id);
      setDeleteId(null);
      await load();
    } catch (e) {
      setError(e.response?.data?.detail ?? e.message ?? "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.spinner} aria-label="Loading" />
        <p className={styles.loadingText}>Loading employees…</p>
      </div>
    );
  }

  if (error && employees.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>{error}</div>
        <Button onClick={load}>Retry</Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Employees</h1>
        <Link to="/employees/new">
          <Button>Add employee</Button>
        </Link>
      </div>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      {employees.length === 0 ? (
        <EmptyState
          message="No employees yet."
          action={
            <Link to="/employees/new">
              <Button>Add employee</Button>
            </Link>
          }
        />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link to={"/attendance?employee=" + emp.id} className={styles.link}>
                        Attendance
                      </Link>
                      <Button variant="danger" onClick={() => setDeleteId(emp.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {deleteId && (
        <Modal title="Delete employee?" onClose={() => !deleting && setDeleteId(null)}>
          <p>This will remove the employee and their attendance records. This cannot be undone.</p>
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setDeleteId(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDelete(deleteId)} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
