import { Link, NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          HRMS Lite
        </Link>
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`} end>
            Employees
          </NavLink>
          <NavLink to="/attendance" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}>
            Attendance
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
