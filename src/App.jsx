import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Salary from "./pages/Salary";
import Advance from "./pages/Advance";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>

      {/* Public Route */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>

        <Route element={<Layout />}>

          <Route
            index
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/employees"
            element={<Employees />}
          />

          <Route
            path="/attendance"
            element={<Attendance />}
          />

          <Route
            path="/salary"
            element={<Salary />}
          />

          <Route
            path="/advance"
            element={<Advance />}
          />


          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}