import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";
import AttendancePage from "./pages/AttendancePage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EmployeeList />} />
          <Route path="employees/new" element={<EmployeeForm />} />
          <Route path="attendance" element={<AttendancePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
