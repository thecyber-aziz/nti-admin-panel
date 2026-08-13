import { useEffect, useState } from "react";

import {
  todayISO
} from "../utils/dateUtils";

const defaultForm = {
  employeeId: "",
  date: todayISO(),
  status: "Present",
  checkIn: "09:00",
  checkOut: "18:00",
  overtimeHours: 0
};

export default function AttendanceForm({
  employees,
  initialData,
  onSubmit,
  onCancel
}) {
  const [form, setForm] =
    useState(
      initialData || defaultForm
    );

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.employeeId) {
      alert("Please select employee.");
      return;
    }

    onSubmit({
      ...form,
      overtimeHours:
        Number(
          form.overtimeHours || 0
        )
    });
  };

  return (
    <form
      className="form"
      onSubmit={handleSubmit}
    >
      <div className="form-grid">
        <div className="form-group">
          <label>
            Employee *
          </label>

          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
          >
            <option value="">
              Select employee
            </option>

            {employees.map(
              (employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.name} -{" "}
                  {employee.id}
                </option>
              )
            )}
          </select>
        </div>

        <div className="form-group">
          <label>
            Date *
          </label>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            Attendance Status *
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Present</option>
            <option>Absent</option>
            <option>Half Day</option>
            <option>Leave</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Check In
          </label>

          <input
            type="time"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            Check Out
          </label>

          <input
            type="time"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            Overtime Hours
          </label>

          <input
            type="number"
            name="overtimeHours"
            value={form.overtimeHours}
            onChange={handleChange}
            min="0"
            step="0.5"
            placeholder="0"
          />

          <small className="form-help">
            Normal working hours: 8 hours
          </small>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-primary"
        >
          Save Attendance
        </button>
      </div>
    </form>
  );
}