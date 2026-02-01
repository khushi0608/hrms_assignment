import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getEmployees, getAttendance, markAttendance } from "../services/api";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import styles from "./AttendancePage.module.css";

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export default function AttendancePage() {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("employee");
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(preselectedId ? Number(preselectedId) : "");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [markForm, setMarkForm] = useState({ date: "", status: "present" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(() => setError("Failed to load employees"));
  }, []);

  useEffect(() => {
    if (!employeeId) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const params = {};
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    getAttendance(employeeId, params)
      .then(setRecords)
      .catch((e) => setError(e.response?.data?.detail ?? "Failed to load attendance"))
      .finally(() => setLoading(false));
  }, [employeeId, fromDate, toDate]);

  const handleMark = async (e) => {
    e.preventDefault();
    if (!employeeId || !markForm.date) return;
    setSubmitting(true);
    setError(null);
    try {
      await markAttendance({
        employee_id: Number(employeeId),
        date: markForm.date,
        status: markForm.status,
      });
      setMarkForm((prev) => ({ ...prev, date: "" }));
      setListLoading(true);
      const params = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;
      const data = await getAttendance(employeeId, params);
      setRecords(data);
    } catch (e) {
      setError(e.response?.data?.detail ?? e.message ?? "Failed to mark attendance");
    } finally {
      setSubmitting(false);
      setListLoading(false);
    }
  };

  const selectedEmployee = employees.find((e) => e.id === Number(employeeId));
  const presentCount = records.filter((r) => r.status === "present").length;

  return (
    <div className={styles.page}>
      <h1>Attendance</h1>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      <div className={styles.controls}>
        <label className={styles.label}>
          Employee
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value ? Number(e.target.value) : "")}
            className={styles.select}
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.employee_id} – {emp.full_name}
              </option>
            ))}
          </select>
        </label>
        {employeeId && (
          <>
            <label className={styles.label}>
              From date
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              To date
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={styles.input}
              />
            </label>
          </>
        )}
      </div>

      {!employeeId ? (
        <EmptyState message="Select an employee to view and mark attendance." />
      ) : (
        <>
          {selectedEmployee && (
            <p className={styles.summary}>
              {selectedEmployee.full_name} – Present days in range: <strong>{presentCount}</strong>
            </p>
          )}
          <div className={styles.markForm}>
            <h2>Mark attendance</h2>
            <form onSubmit={handleMark} className={styles.form}>
              <label className={styles.label}>
                Date
                <input
                  type="date"
                  value={markForm.date}
                  onChange={(e) => setMarkForm((p) => ({ ...p, date: e.target.value }))}
                  required
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Status
                <select
                  value={markForm.status}
                  onChange={(e) => setMarkForm((p) => ({ ...p, status: e.target.value }))}
                  className={styles.select}
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </label>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Mark"}
              </Button>
            </form>
          </div>
          <div className={styles.records}>
            <h2>Attendance records</h2>
            {loading || listLoading ? (
              <div className={styles.spinner} aria-label="Loading" />
            ) : records.length === 0 ? (
              <EmptyState message="No attendance records for this employee in the selected range." />
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id}>
                        <td>{formatDate(r.date)}</td>
                        <td>
                          <span className={r.status === "present" ? styles.present : styles.absent}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
