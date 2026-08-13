import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  CalendarDays,
  Clock3,
  UserCheck,
  UserX,
} from "lucide-react";

import { useAppData } from "../context/AppDataContext";

import Modal from "../components/Modal";
import AttendanceForm from "../components/AttendanceForm";
import EmptyState from "../components/EmptyState";

import {
  todayISO,
  formatDate,
} from "../utils/dateUtils";

export default function Attendance() {
  const {
    employees = [],
    attendance = [],
    addAttendance,
    updateAttendance,
    deleteAttendance,
  } = useAppData();

  const [showModal, setShowModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] =
    useState(todayISO());

  const employeeMap = useMemo(() => {
    return Object.fromEntries(
      employees.map((employee) => [
        employee.id,
        employee,
      ])
    );
  }, [employees]);

  const filteredAttendance = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attendance
      .filter((item) => {
        const matchesDate =
          !selectedDate ||
          item.date === selectedDate;

        if (!matchesDate) {
          return false;
        }

        if (!query) {
          return true;
        }

        const employee =
          employeeMap[item.employeeId];

        return (
          employee?.name
            ?.toLowerCase()
            .includes(query) ||
          String(item.employeeId)
            .toLowerCase()
            .includes(query)
        );
      })
      .sort((a, b) => {
        const employeeA =
          employeeMap[a.employeeId]?.name || "";

        const employeeB =
          employeeMap[b.employeeId]?.name || "";

        return employeeA.localeCompare(employeeB);
      });
  }, [
    attendance,
    employees,
    employeeMap,
    search,
    selectedDate,
  ]);

  const presentCount = filteredAttendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentCount = filteredAttendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const halfDayCount = filteredAttendance.filter(
    (item) => item.status === "Half Day"
  ).length;

  const overtimeHours =
    filteredAttendance.reduce(
      (total, item) =>
        total +
        Number(item.overtimeHours || 0),
      0
    );

  const openAdd = () => {
    setEditingAttendance(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingAttendance(item);
    setShowModal(true);
  };

  const handleSubmit = (data) => {
    if (editingAttendance) {
      if (updateAttendance) {
        updateAttendance(
          editingAttendance.id,
          data
        );
      }
    } else {
      if (typeof addAttendance !== "function") {
        console.error(
          "addAttendance is not available in AppDataContext"
        );

        alert(
          "Attendance save function is not available. Please check AppDataContext.jsx."
        );

        return;
      }

      addAttendance(data);
    }

    setShowModal(false);
    setEditingAttendance(null);
  };

  const handleDelete = (item) => {
    if (!deleteAttendance) {
      return;
    }

    const employee =
      employeeMap[item.employeeId];

    const confirmed = window.confirm(
      `Delete attendance for ${
        employee?.name || item.employeeId
      } on ${formatDate(item.date)}?`
    );

    if (confirmed) {
      deleteAttendance(item.id);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}

      <div className="page-header">
        <div>
          <h2>Attendance</h2>

          <p>
            Manage employee attendance,
            working hours and overtime.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openAdd}
        >
          <Plus size={18} />
          Mark Attendance
        </button>
      </div>

      {/* Summary */}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <UserCheck size={20} />
          </div>

          <div>
            <span>Present</span>

            <strong>
              {presentCount}
            </strong>

            <small>
              {formatDate(selectedDate)}
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <UserX size={20} />
          </div>

          <div>
            <span>Absent</span>

            <strong>
              {absentCount}
            </strong>

            <small>
              {formatDate(selectedDate)}
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Half Day</span>

            <strong>
              {halfDayCount}
            </strong>

            <small>
              {formatDate(selectedDate)}
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Overtime</span>

            <strong>
              {overtimeHours} hrs
            </strong>

            <small>
              Total overtime
            </small>
          </div>
        </div>
      </div>

      {/* Main Panel */}

      <div className="panel">
        {/* Toolbar */}

        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="form-group-inline">
            <label>
              <CalendarDays size={16} />
              Date
            </label>

            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(event) =>
                setSelectedDate(
                  event.target.value
                )
              }
            />
          </div>
        </div>

        {/* Table */}

        {filteredAttendance.length === 0 ? (
          <EmptyState
            title="No attendance found"
            message="No attendance record exists for the selected date."
          />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Overtime</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.map(
                  (item) => {
                    const employee =
                      employeeMap[
                        item.employeeId
                      ];

                    const statusClass =
                      item.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-");

                    return (
                      <tr key={item.id}>
                        {/* Employee */}

                        <td>
                          <div className="employee-cell">
                            <div className="employee-avatar">
                              {employee?.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "E"}
                            </div>

                            <div>
                              <strong>
                                {employee?.name ||
                                  "Unknown"}
                              </strong>

                              <small>
                                {item.employeeId}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* Date */}

                        <td>
                          {formatDate(
                            item.date
                          )}
                        </td>

                        {/* Status */}

                        <td>
                          <span
                            className={`status-badge status-${statusClass}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Check In */}

                        <td>
                          {item.checkIn || "-"}
                        </td>

                        {/* Check Out */}

                        <td>
                          {item.checkOut || "-"}
                        </td>

                        {/* Working Hours */}

                        <td>
                          {item.workingHours ||
                            item.totalHours ||
                            0}{" "}
                          hrs
                        </td>

                        {/* Overtime */}

                        <td>
                          <strong>
                            {item.overtimeHours ||
                              0}{" "}
                            hrs
                          </strong>
                        </td>

                        {/* Actions */}

                        <td>
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="table-action edit"
                              onClick={() =>
                                openEdit(item)
                              }
                              title="Edit"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="table-action delete"
                              onClick={() =>
                                handleDelete(item)
                              }
                              title="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attendance Modal */}

      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAttendance(null);
        }}
        title={
          editingAttendance
            ? "Edit Attendance"
            : "Mark Employee Attendance"
        }
        size="large"
      >
        <AttendanceForm
          employees={employees}
          initialData={
            editingAttendance
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditingAttendance(null);
          }}
        />
      </Modal>
    </div>
  );
}