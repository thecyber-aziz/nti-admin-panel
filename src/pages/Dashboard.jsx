import {
  Users,
  UserCheck,
  UserX,
  Clock3,
  IndianRupee,
  Banknote,
  CalendarDays,
} from "lucide-react";

import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";

import { useAppData } from "../context/AppDataContext";

import {
  todayISO,
  currentMonth,
  currentYear,
} from "../utils/dateUtils";

import {
  calculateSalary,
  money,
} from "../utils/salaryCalculator";

export default function Dashboard() {
  const {
    employees = [],
    attendance = [],
    advances = [],
  } = useAppData();

  /* =========================================
     CURRENT DATE
  ========================================= */

  const today = todayISO();

  /*
    currentMonth is a number.
    Example: 8
  */

  const monthNumber = currentMonth;

  /*
    currentYear is a number.
    Example: 2026
  */

  const yearNumber = currentYear;

  /*
    Convert to YYYY-MM.
    Example: 2026-08
  */

  const month = `${yearNumber}-${String(
    monthNumber
  ).padStart(2, "0")}`;

  /* =========================================
     ACTIVE EMPLOYEES
  ========================================= */

  const activeEmployees =
    employees.filter(
      (employee) =>
        employee.status === "Active"
    );

  /* =========================================
     TODAY ATTENDANCE
  ========================================= */

  const todayAttendance =
    attendance.filter(
      (item) =>
        item.date === today
    );

  /* =========================================
     PRESENT TODAY
  ========================================= */

  const presentToday =
    todayAttendance.filter(
      (item) =>
        item.status === "Present"
    ).length;

  /* =========================================
     ABSENT TODAY
  ========================================= */

  const absentToday =
    todayAttendance.filter(
      (item) =>
        item.status === "Absent"
    ).length;

  /* =========================================
     OVERTIME TODAY
  ========================================= */

  const overtimeToday =
    todayAttendance.reduce(
      (total, item) =>
        total +
        Number(
          item.overtimeHours || 0
        ),
      0
    );

  /* =========================================
     MONTHLY PAYROLL
  ========================================= */

  const monthlyPayroll =
    activeEmployees.reduce(
      (total, employee) => {
        const employeeAttendance =
          attendance.filter(
            (item) =>
              item.employeeId ===
                employee.id &&
              item.date &&
              item.date.startsWith(
                month
              )
          );

        const employeeAdvances =
          advances.filter(
            (item) =>
              item.employeeId ===
                employee.id &&
              item.date &&
              item.date.startsWith(
                month
              )
          );

        const presentDays =
          employeeAttendance.filter(
            (item) =>
              item.status ===
              "Present"
          ).length;

        const absentDays =
          employeeAttendance.filter(
            (item) =>
              item.status ===
              "Absent"
          ).length;

        const halfDays =
          employeeAttendance.filter(
            (item) =>
              item.status ===
              "Half Day"
          ).length;

        const overtimeHours =
          employeeAttendance.reduce(
            (sum, item) =>
              sum +
              Number(
                item.overtimeHours ||
                  0
              ),
            0
          );

        /*
          Calculate advance deduction
        */

        const advanceDeduction =
          employeeAdvances.reduce(
            (sum, advance) => {
              if (
                advance.status ===
                "Completed"
              ) {
                return sum;
              }

              const amount =
                Number(
                  advance.amount || 0
                );

              const deducted =
                Number(
                  advance.deductedAmount ||
                    0
                );

              const balance =
                Math.max(
                  amount - deducted,
                  0
                );

              const monthlyDeduction =
                Number(
                  advance.deductionFromSalary ||
                    0
                );

              return (
                sum +
                Math.min(
                  balance,
                  monthlyDeduction
                )
              );
            },
            0
          );

        /*
          Calculate salary
        */

        const salary =
          calculateSalary({
            monthlySalary:
              employee.monthlySalary ||
              0,

            workingDays:
              employee.workingDays ||
              26,

            presentDays,

            absentDays,

            halfDays,

            overtimeHours,

            overtimeRate:
              employee.overtimeRate ||
              0,

            advanceDeduction,

            otherDeductions: 0,

            bonus: 0,
          });

        return (
          total +
          Number(
            salary.finalSalary || 0
          )
        );
      },
      0
    );

  /* =========================================
     OUTSTANDING ADVANCE
  ========================================= */

  const outstandingAdvance =
    advances.reduce(
      (total, advance) => {
        /*
          If balance already exists,
          use balance.
        */

        if (
          advance.balance !==
          undefined
        ) {
          return (
            total +
            Number(
              advance.balance || 0
            )
          );
        }

        /*
          Otherwise calculate balance
        */

        const amount =
          Number(
            advance.amount || 0
          );

        const deducted =
          Number(
            advance.deductedAmount ||
              0
          );

        return (
          total +
          Math.max(
            amount - deducted,
            0
          )
        );
      },
      0
    );

  /* =========================================
     RECENT ATTENDANCE
  ========================================= */

  const recentAttendance =
    [...attendance]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 6);

  /* =========================================
     EMPLOYEE MAP
  ========================================= */

  const employeeMap =
    Object.fromEntries(
      employees.map(
        (employee) => [
          employee.id,
          employee,
        ]
      )
    );

  /* =========================================
     PRESENTAGE
  ========================================= */

  const attendancePercentage =
    activeEmployees.length
      ? Math.min(
          100,
          (presentToday /
            activeEmployees.length) *
            100
        )
      : 0;

  /* =========================================
     NOT MARKED
  ========================================= */

  const notMarkedToday =
    Math.max(
      0,
      activeEmployees.length -
        todayAttendance.length
    );

  /* =========================================
     RETURN
  ========================================= */

  return (
    <div className="page-container">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="page-header">

        <div>
          <h1 className="page-title">
            Dashboard
          </h1>

          <p className="page-subtitle">
            Overview of your factory
            workforce and payroll.
          </p>
        </div>

        <div className="date-badge">
          <CalendarDays size={17} />

          {new Date().toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )}
        </div>

      </div>


      {/* =====================================
          STAT CARDS
      ===================================== */}

      <div className="stats-grid">

        <StatCard
          title="Total Employees"
          value={
            activeEmployees.length
          }
          icon={Users}
          description="Active"
        />

        <StatCard
          title="Present Today"
          value={presentToday}
          icon={UserCheck}
          description={`${todayAttendance.length} marked`}
          className="stat-success"
        />

        <StatCard
          title="Absent Today"
          value={absentToday}
          icon={UserX}
          description="Today"
          className="stat-danger"
        />

        <StatCard
          title="Overtime Today"
          value={`${overtimeToday} hrs`}
          icon={Clock3}
          description="Total hours"
          className="stat-warning"
        />

        <StatCard
          title="Monthly Payroll"
          value={money(
            monthlyPayroll
          )}
          icon={IndianRupee}
          description="Estimated"
          className="stat-primary"
        />

        <StatCard
          title="Advance Balance"
          value={money(
            outstandingAdvance
          )}
          icon={Banknote}
          description="Outstanding"
          className="stat-purple"
        />

      </div>


      {/* =====================================
          DASHBOARD GRID
      ===================================== */}

      <div className="dashboard-grid">

        {/* ===================================
            RECENT ATTENDANCE
        =================================== */}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h3>
                Recent Attendance
              </h3>

              <p>
                Latest attendance records
              </p>

            </div>

          </div>


          {recentAttendance.length ===
          0 ? (

            <EmptyState
              title="No attendance"
              message="Attendance records will appear here."
            />

          ) : (

            <div className="table-wrapper">

              <table className="data-table">

                <thead>

                  <tr>

                    <th>
                      Employee
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      In
                    </th>

                    <th>
                      Out
                    </th>

                    <th>
                      OT
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {recentAttendance.map(
                    (item) => {

                      const employee =
                        employeeMap[
                          item.employeeId
                        ];

                      const statusClass =
                        String(
                          item.status ||
                            ""
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          );

                      return (

                        <tr
                          key={`${item.employeeId}-${item.date}`}
                        >

                          <td>

                            <strong>
                              {employee?.name ||
                                "Unknown"}
                            </strong>

                            <small
                              style={{
                                display:
                                  "block",
                                marginTop:
                                  "3px",
                                color:
                                  "#6b7280",
                              }}
                            >
                              {
                                item.employeeId
                              }
                            </small>

                          </td>


                          <td>
                            {item.date}
                          </td>


                          <td>

                            <span
                              className={`status-badge status-${statusClass}`}
                            >
                              {
                                item.status ||
                                "-"
                              }
                            </span>

                          </td>


                          <td>
                            {item.checkIn ||
                              "-"}
                          </td>


                          <td>
                            {item.checkOut ||
                              "-"}
                          </td>


                          <td>
                            {Number(
                              item.overtimeHours ||
                                0
                            )}{" "}
                            hrs
                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* ===================================
            ATTENDANCE SUMMARY
        =================================== */}

        <section className="panel dashboard-summary">

          <div className="panel-header">

            <div>

              <h3>
                Attendance Summary
              </h3>

              <p>
                Today's workforce status
              </p>

            </div>

          </div>


          {/* Progress */}

          <div className="attendance-progress">

            <div className="progress-label">

              <span>
                Present
              </span>

              <strong>
                {presentToday}/
                {activeEmployees.length}
              </strong>

            </div>


            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width: `${attendancePercentage}%`,
                }}
              />

            </div>

          </div>


          {/* Summary List */}

          <div className="summary-list">

            <div>

              <span>

                <span className="summary-dot green" />

                Present

              </span>

              <strong>
                {presentToday}
              </strong>

            </div>


            <div>

              <span>

                <span className="summary-dot red" />

                Absent

              </span>

              <strong>
                {absentToday}
              </strong>

            </div>


            <div>

              <span>

                <span className="summary-dot orange" />

                Not Marked

              </span>

              <strong>
                {notMarkedToday}
              </strong>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}