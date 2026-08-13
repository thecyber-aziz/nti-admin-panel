import { useMemo, useState } from "react";

import {
  Plus,
  Search,
  Banknote,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { useAppData } from "../context/AppDataContext";

import Modal from "../components/Modal";
import AdvanceForm from "../components/AdvanceForm";
import EmptyState from "../components/EmptyState";

import { money } from "../utils/salaryCalculator";

export default function Advance() {
  const {
    employees = [],
    advances = [],
    addAdvance,
  } = useAppData();

  const [showModal, setShowModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const employeeMap = useMemo(() => {
    return Object.fromEntries(
      employees.map((employee) => [
        employee.id,
        employee,
      ])
    );
  }, [employees]);

  const filteredAdvances =
    advances.filter((advance) => {
      const query =
        search.trim().toLowerCase();

      if (!query) return true;

      const employee =
        employeeMap[advance.employeeId];

      return (
        employee?.name
          ?.toLowerCase()
          .includes(query) ||
        String(advance.employeeId || "")
          .toLowerCase()
          .includes(query)
      );
    });

  const totalAdvance =
    advances.reduce(
      (sum, advance) =>
        sum + Number(advance.amount || 0),
      0
    );

  const approvedAdvance =
    advances
      .filter(
        (advance) =>
          advance.status === "Approved"
      )
      .reduce(
        (sum, advance) =>
          sum + Number(advance.amount || 0),
        0
      );

  const pendingAdvance =
    advances
      .filter(
        (advance) =>
          advance.status !== "Approved"
      )
      .reduce(
        (sum, advance) =>
          sum + Number(advance.amount || 0),
        0
      );

  const handleSubmit = (data) => {
    addAdvance({
      ...data,

      id: `ADV-${Date.now()}`,

      amount: Number(data.amount),

      status:
        data.status === "Approved"
          ? "Approved"
          : "Pending",
    });

    setShowModal(false);
  };

  return (
    <div className="page-container">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h2>
            Salary Advance
          </h2>

          <p>
            Manage employee salary
            advances and salary deductions.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            setShowModal(true)
          }
        >
          <Plus size={18} />

          Add Advance
        </button>
      </div>

      {/* SUMMARY */}

      <div className="advance-summary-grid">

        <div className="advance-summary-card">
          <div className="advance-icon">
            <Banknote size={22} />
          </div>

          <div>
            <span>
              Total Advances
            </span>

            <strong>
              {money(totalAdvance)}
            </strong>
          </div>
        </div>

        <div className="advance-summary-card">
          <div className="advance-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>
              Approved
            </span>

            <strong>
              {money(approvedAdvance)}
            </strong>
          </div>
        </div>

        <div className="advance-summary-card">
          <div className="advance-icon">
            <Clock3 size={22} />
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {money(pendingAdvance)}
            </strong>
          </div>
        </div>

      </div>

      {/* TABLE */}

      <div className="panel">

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

        </div>

        {filteredAdvances.length === 0 ? (

          <EmptyState
            title="No advances found"
            message="Employee salary advances will appear here."
          />

        ) : (

          <div className="table-wrapper">

            <table className="data-table">

              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Salary</th>
                  <th>Advance</th>
                  <th>Remaining</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredAdvances.map(
                  (advance) => {

                    const employee =
                      employeeMap[
                        advance.employeeId
                      ];

                    const salary =
                      Number(
                        employee?.monthlySalary ??
                          employee?.salary ??
                          employee?.basicSalary ??
                          0
                      );

                    const employeeAdvances =
                      advances.filter(
                        (item) =>
                          item.employeeId ===
                            advance.employeeId &&
                          item.status ===
                            "Approved"
                      );

                    const totalApproved =
                      employeeAdvances.reduce(
                        (sum, item) =>
                          sum +
                          Number(
                            item.amount || 0
                          ),
                        0
                      );

                    const remaining =
                      Math.max(
                        0,
                        salary -
                          totalApproved
                      );

                    const isApproved =
                      advance.status ===
                      "Approved";

                    return (
                      <tr
                        key={advance.id}
                      >

                        {/* EMPLOYEE */}

                        <td>
                          <div className="employee-cell">

                            <div className="employee-avatar">
                              {employee?.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "?"}
                            </div>

                            <div>
                              <strong>
                                {employee?.name ||
                                  "Unknown"}
                              </strong>

                              <small>
                                {
                                  advance.employeeId
                                }
                              </small>
                            </div>

                          </div>
                        </td>

                        {/* DATE */}

                        <td>
                          {advance.date ||
                            "-"}
                        </td>

                        {/* SALARY */}

                        <td>
                          <strong>
                            {money(salary)}
                          </strong>
                        </td>

                        {/* ADVANCE */}

                        <td>
                          <strong
                            className={
                              isApproved
                                ? "danger-text"
                                : ""
                            }
                          >
                            {money(
                              advance.amount
                            )}
                          </strong>
                        </td>

                        {/* REMAINING */}

                        <td>
                          <strong
                            className={
                              isApproved
                                ? "success-text"
                                : ""
                            }
                          >
                            {money(
                              isApproved
                                ? remaining
                                : salary
                            )}
                          </strong>
                        </td>

                        {/* REASON */}

                        <td>
                          {advance.reason ||
                            "-"}
                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`status-badge ${
                              isApproved
                                ? "status-active"
                                : "status-pending"
                            }`}
                          >
                            {isApproved
                              ? "Approved"
                              : "Pending"}
                          </span>

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

      {/* MODAL */}

      <Modal
        open={showModal}
        onClose={() =>
          setShowModal(false)
        }
        title="Add Salary Advance"
        size="large"
      >
        <AdvanceForm
          employees={employees}
          onSubmit={handleSubmit}
          onCancel={() =>
            setShowModal(false)
          }
        />
      </Modal>

    </div>
  );
}