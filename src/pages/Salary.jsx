import {
  useMemo,
  useState,
} from "react";

import {
  Search,
  Download,
  Calculator,
  Clock3,
  Banknote,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";

import jsPDF from "jspdf";

import { useAppData } from "../context/AppDataContext";

import {
  calculateSalary,
  money,
  salaryMoney,
} from "../utils/salaryCalculator";

import {
  currentMonth,
  monthLabel,
} from "../utils/dateUtils";

export default function Salary() {
  const {
    employees = [],
    attendance = [],
    advances = [],
  } = useAppData();

  const [month, setMonth] = useState(
    currentMonth()
  );

  const [search, setSearch] = useState("");

  // =========================================================
  // SALARY CALCULATION
  // =========================================================

  const salaryRows = useMemo(() => {
    return employees
      .filter(
        (employee) =>
          employee.status !== "Inactive"
      )
      .map((employee) => {
        const employeeAttendance =
          attendance.filter(
            (item) =>
              String(item.employeeId) ===
                String(employee.id) &&
              String(item.date || "").startsWith(
                month
              )
          );

        const employeeAdvances =
          advances.filter(
            (item) =>
              String(item.employeeId) ===
                String(employee.id) &&
              String(item.date || "").startsWith(
                month
              )
          );

        const salary = calculateSalary(
          employee,
          employeeAttendance,
          employeeAdvances
        );

        return {
          employee,
          salary,
        };
      });
  }, [
    employees,
    attendance,
    advances,
    month,
  ]);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredRows = salaryRows.filter(
    ({ employee }) => {
      const query = search
        .trim()
        .toLowerCase();

      if (!query) return true;

      return (
        employee.name
          ?.toLowerCase()
          .includes(query) ||
        employee.id
          ?.toLowerCase()
          .includes(query) ||
        employee.department
          ?.toLowerCase()
          .includes(query)
      );
    }
  );

  // =========================================================
  // TOTALS
  // =========================================================

  const totals = filteredRows.reduce(
    (total, row) => ({
      gross:
        total.gross +
        Number(
          row.salary.monthlySalary || 0
        ),

      overtime:
        total.overtime +
        Number(
          row.salary.overtimeAmount || 0
        ),

      deductions:
        total.deductions +
        Number(
          row.salary.absentDeduction || 0
        ) +
        Number(
          row.salary.halfDayDeduction || 0
        ) +
        Number(
          row.salary.advanceDeduction || 0
        ),

      net:
        total.net +
        Number(
          row.salary.netSalary || 0
        ),
    }),
    {
      gross: 0,
      overtime: 0,
      deductions: 0,
      net: 0,
    }
  );

  // =========================================================
  // PROFESSIONAL SALARY SLIP PDF
  // =========================================================

  const generateSalarySlip = (
    employee,
    salary
  ) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    const left = 16;
    const right = pageWidth - 16;

    // -------------------------------------------------------
    // COMPANY HEADER
    // -------------------------------------------------------

    doc.setFillColor(
      31,
      41,
      55
    );

    doc.rect(
      0,
      0,
      pageWidth,
      42,
      "F"
    );

    // Company logo-style NTI box
    doc.setFillColor(
      245,
      183,
      48
    );

    doc.roundedRect(
      left,
      9,
      25,
      25,
      3,
      3,
      "F"
    );

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(15);

    doc.text(
      "NTI",
      left + 12.5,
      25,
      {
        align: "center",
      }
    );

    // Company name
    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFontSize(18);

    doc.text(
      "NEW TAJ INDUSTRIES",
      47,
      17
    );

    doc.setFontSize(9);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      "EMPLOYEE MANAGEMENT & PAYROLL",
      47,
      24
    );

    doc.setFontSize(8);

    doc.text(
      "Salary Statement",
      47,
      31
    );

    // Salary slip badge
    doc.setFillColor(
      255,
      255,
      255
    );

    doc.roundedRect(
      151,
      12,
      43,
      16,
      3,
      3,
      "F"
    );

    doc.setTextColor(
      31,
      41,
      55
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(8);

    doc.text(
      "SALARY SLIP",
      172.5,
      22,
      {
        align: "center",
      }
    );

    // -------------------------------------------------------
    // MONTH + EMPLOYEE INFORMATION
    // -------------------------------------------------------

    let y = 53;

    doc.setTextColor(
      31,
      41,
      55
    );

    doc.setFontSize(13);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Employee Information",
      left,
      y
    );

    y += 8;

    // Info box
    doc.setDrawColor(
      220,
      225,
      230
    );

    doc.setFillColor(
      248,
      250,
      252
    );

    doc.roundedRect(
      left,
      y,
      pageWidth - 32,
      34,
      3,
      3,
      "FD"
    );

    doc.setFontSize(8);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(
      100,
      110,
      120
    );

    // Row 1
    doc.text(
      "EMPLOYEE NAME",
      left + 6,
      y + 8
    );

    doc.text(
      "EMPLOYEE ID",
      108,
      y + 8
    );

    doc.text(
      "MONTH",
      154,
      y + 8
    );

    doc.setTextColor(
      31,
      41,
      55
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(9);

    doc.text(
      employee.name || "-",
      left + 6,
      y + 15
    );

    doc.text(
      employee.id || "-",
      108,
      y + 15
    );

    doc.text(
      monthLabel(month),
      154,
      y + 15
    );

    // Row 2
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(8);

    doc.setTextColor(
      100,
      110,
      120
    );

    doc.text(
      "DEPARTMENT",
      left + 6,
      y + 24
    );

    doc.text(
      "DESIGNATION",
      108,
      y + 24
    );

    doc.setTextColor(
      31,
      41,
      55
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(9);

    doc.text(
      employee.department || "-",
      left + 6,
      y + 30
    );

    doc.text(
      employee.designation || "-",
      108,
      y + 30
    );

    // -------------------------------------------------------
    // ATTENDANCE SUMMARY
    // -------------------------------------------------------

    y += 46;

    doc.setFontSize(13);

    doc.text(
      "Attendance Summary",
      left,
      y
    );

    y += 7;

    const attendanceBoxes = [
      {
        label: "Working Days",
        value: salary.workingDays,
      },
      {
        label: "Present",
        value: salary.presentDays,
      },
      {
        label: "Absent",
        value: salary.absentDays,
      },
      {
        label: "Half Day",
        value: salary.halfDays,
      },
      {
        label: "OT Hours",
        value: `${salary.overtimeHours} hrs`,
      },
    ];

    const boxGap = 3;
    const totalWidth =
      pageWidth - 32;

    const boxWidth =
      (totalWidth -
        boxGap * 4) /
      5;

    attendanceBoxes.forEach(
      (item, index) => {
        const x =
          left +
          index *
            (boxWidth + boxGap);

        doc.setFillColor(
          248,
          250,
          252
        );

        doc.setDrawColor(
          225,
          229,
          234
        );

        doc.roundedRect(
          x,
          y,
          boxWidth,
          23,
          2,
          2,
          "FD"
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(7);

        doc.setTextColor(
          100,
          110,
          120
        );

        doc.text(
          item.label,
          x + boxWidth / 2,
          y + 8,
          {
            align: "center",
          }
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(12);

        doc.setTextColor(
          31,
          41,
          55
        );

        doc.text(
          String(item.value),
          x + boxWidth / 2,
          y + 17,
          {
            align: "center",
          }
        );
      }
    );

    // -------------------------------------------------------
    // SALARY DETAILS
    // -------------------------------------------------------

    y += 35;

    doc.setFontSize(13);

    doc.setTextColor(
      31,
      41,
      55
    );

    doc.text(
      "Salary Details",
      left,
      y
    );

    y += 7;

    const tableX = left;
    const tableW =
      pageWidth - 32;

    // Header
    doc.setFillColor(
      31,
      41,
      55
    );

    doc.rect(
      tableX,
      y,
      tableW,
      9,
      "F"
    );

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(8);

    doc.text(
      "DESCRIPTION",
      tableX + 5,
      y + 6
    );

    doc.text(
      "AMOUNT",
      right - 5,
      y + 6,
      {
        align: "right",
      }
    );

    y += 9;

    const salaryLines = [
      [
        "Monthly Basic Salary",
        money(
          salary.monthlySalary
        ),
      ],
      [
        "Overtime Amount",
        money(
          salary.overtimeAmount
        ),
      ],
      [
        "Absent Deduction",
        money(
          salary.absentDeduction
        ),
      ],
      [
        "Half Day Deduction",
        money(
          salary.halfDayDeduction
        ),
      ],
      [
        "Approved Advance",
        money(
          salary.advanceDeduction
        ),
      ],
    ];

    salaryLines.forEach(
      ([label, value], index) => {
        if (index % 2 === 0) {
          doc.setFillColor(
            248,
            250,
            252
          );

          doc.rect(
            tableX,
            y,
            tableW,
            9,
            "F"
          );
        }

        doc.setTextColor(
          55,
          65,
          75
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setFontSize(8.5);

        doc.text(
          label,
          tableX + 5,
          y + 6
        );

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.text(
          value,
          right - 5,
          y + 6,
          {
            align: "right",
          }
        );

        y += 9;
      }
    );

    // -------------------------------------------------------
    // SALARY AFTER ADVANCE
    // -------------------------------------------------------

    y += 5;

    doc.setFillColor(
      239,
      246,
      255
    );

    doc.roundedRect(
      tableX,
      y,
      tableW,
      15,
      3,
      3,
      "F"
    );

    doc.setTextColor(
      30,
      64,
      175
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(9);

    doc.text(
      "SALARY AFTER ADVANCE",
      tableX + 6,
      y + 9
    );

    doc.text(
      salaryMoney(
        salary.salaryAfterAdvance
      ),
      right - 6,
      y + 9,
      {
        align: "right",
      }
    );

    // -------------------------------------------------------
    // NET SALARY BIG BOX
    // -------------------------------------------------------

    y += 22;

    const negative =
      Number(
        salary.netSalary
      ) < 0;

    if (negative) {
      doc.setFillColor(
        254,
        242,
        242
      );

      doc.setDrawColor(
        239,
        68,
        68
      );
    } else {
      doc.setFillColor(
        240,
        253,
        244
      );

      doc.setDrawColor(
        34,
        197,
        94
      );
    }

    doc.roundedRect(
      tableX,
      y,
      tableW,
      29,
      4,
      4,
      "FD"
    );

    doc.setTextColor(
      negative
        ? 185
        : 22,
      negative
        ? 28
        : 101,
      negative
        ? 28
        : 52
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(9);

    doc.text(
      negative
        ? "NET SALARY / OUTSTANDING"
        : "NET SALARY",
      tableX + 7,
      y + 10
    );

    doc.setFontSize(17);

    doc.text(
      salaryMoney(
        salary.netSalary
      ),
      right - 7,
      y + 13,
      {
        align: "right",
      }
    );

    if (negative) {
      doc.setFontSize(7.5);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `Extra advance outstanding: ${money(
          salary.excessAdvance
        )}`,
        tableX + 7,
        y + 21
      );
    }

    // -------------------------------------------------------
    // ADVANCE INFORMATION
    // -------------------------------------------------------

    if (
      Number(
        salary.totalAdvanceCount || 0
      ) > 0
    ) {
      y += 36;

      doc.setTextColor(
        31,
        41,
        55
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(9);

      doc.text(
        `Approved Advances: ${
          salary.totalAdvanceCount
        }`,
        tableX,
        y
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(8);

      doc.text(
        `Total advance amount: ${money(
          salary.advanceDeduction
        )}`,
        tableX,
        y + 7
      );
    }

    // -------------------------------------------------------
    // FOOTER
    // -------------------------------------------------------

    doc.setDrawColor(
      220,
      225,
      230
    );

    doc.line(
      left,
      pageHeight - 24,
      right,
      pageHeight - 24
    );

    doc.setTextColor(
      120,
      125,
      130
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(7.5);

    doc.text(
      "This is a computer-generated salary slip and does not require a signature.",
      pageWidth / 2,
      pageHeight - 17,
      {
        align: "center",
      }
    );

    doc.text(
      "NEW TAJ INDUSTRIES",
      pageWidth / 2,
      pageHeight - 11,
      {
        align: "center",
      }
    );

    // -------------------------------------------------------
    // SAVE
    // -------------------------------------------------------

    doc.save(
      `${employee.id}-${month}-salary-slip.pdf`
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="page-container">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h2>
            Salary Management
          </h2>

          <p>
            Calculate monthly salary,
            overtime, advances and
            deductions.
          </p>
        </div>
      </div>

      {/* SUMMARY */}

      <div className="salary-summary-grid">

        <div className="salary-summary-card">
          <div className="salary-summary-icon">
            <IndianRupee size={20} />
          </div>

          <div>
            <span>
              Gross Salary
            </span>

            <strong>
              {money(totals.gross)}
            </strong>
          </div>
        </div>

        <div className="salary-summary-card">

          <div className="salary-summary-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>
              Overtime
            </span>

            <strong>
              {money(
                totals.overtime
              )}
            </strong>
          </div>

        </div>

        <div className="salary-summary-card">

          <div className="salary-summary-icon">
            <Banknote size={20} />
          </div>

          <div>
            <span>
              Total Deductions
            </span>

            <strong>
              {money(
                totals.deductions
              )}
            </strong>
          </div>

        </div>

        <div
          className={`salary-summary-card ${
            totals.net < 0
              ? "negative"
              : "highlight"
          }`}
        >

          <div className="salary-summary-icon">
            {totals.net < 0 ? (
              <AlertTriangle size={20} />
            ) : (
              <Calculator size={20} />
            )}
          </div>

          <div>

            <span>
              Net Payroll
            </span>

            <strong
              className={
                totals.net < 0
                  ? "danger-text"
                  : "success-text"
              }
            >
              {salaryMoney(
                totals.net
              )}
            </strong>

          </div>

        </div>

      </div>

      {/* MAIN PANEL */}

      <div className="panel">

        {/* TOOLBAR */}

        <div className="toolbar">

          <div className="date-input-wrapper">

            <span>
              Month
            </span>

            <input
              type="month"
              value={month}
              onChange={(event) =>
                setMonth(
                  event.target.value
                )
              }
            />

          </div>

          <div className="search-box">

            <Search size={18} />

            <input
              placeholder="Search employee..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* INFO */}

        <div className="salary-info-banner">

          <strong>
            {monthLabel(month)}
          </strong>

          <span>
            Calculation based on
            26 working days and
            8 normal working
            hours per day.
          </span>

        </div>

        {/* TABLE */}

        <div className="table-wrapper">

          <table className="data-table salary-table">

            <thead>

              <tr>

                <th>
                  Employee
                </th>

                <th>
                  Basic Salary
                </th>

                <th>
                  Present
                </th>

                <th>
                  Absent
                </th>

                <th>
                  Half Day
                </th>

                <th>
                  OT Hours
                </th>

                <th>
                  OT Amount
                </th>

                <th>
                  Advance
                </th>

                <th>
                  Net Salary
                </th>

                <th>
                  Slip
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredRows.length === 0 ? (

                <tr>

                  <td
                    colSpan="10"
                    className="table-empty"
                  >
                    No employees found.
                  </td>

                </tr>

              ) : (

                filteredRows.map(
                  ({
                    employee,
                    salary,
                  }) => (

                    <tr
                      key={
                        employee.id
                      }
                    >

                      {/* EMPLOYEE */}

                      <td>

                        <div className="employee-cell">

                          <div className="employee-avatar">

                            {employee.name
                              ?.charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {employee.name}
                            </strong>

                            <small>
                              {employee.id}
                            </small>

                          </div>

                        </div>

                      </td>

                      {/* BASIC */}

                      <td>
                        {money(
                          salary.monthlySalary
                        )}
                      </td>

                      {/* PRESENT */}

                      <td>

                        <span className="text-emerald-600 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.35)]">
                          {
                            salary.presentDays
                          }
                        </span>

                      </td>

                      {/* ABSENT */}

                      <td>

                        <span className="text-red-600 font-bold drop-shadow-[0_0_5px_rgba(239,68,68,0.35)]">
                          {
                            salary.absentDays
                          }
                        </span>

                      </td>

                      {/* HALF DAY */}

                      <td>

                        <span className="text-orange-500 font-bold drop-shadow-[0_0_5px_rgba(249,115,22,0.35)]">
                          {
                            salary.halfDays
                          }
                        </span>

                      </td>

                      {/* OT HOURS */}

                      <td>

                        <span className="text-purple-600 font-bold drop-shadow-[0_0_5px_rgba(147,51,234,0.35)]">
                          {
                            salary.overtimeHours
                          }
                        </span>

                      </td>

                      {/* OT AMOUNT */}

                      <td>

                        <span className="text-emerald-600 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.35)]">
                          {money(
                            salary.overtimeAmount
                          )}
                        </span>

                      </td>

                      {/* ADVANCE */}

                      <td>

                        <span className="text-blue-600 font-bold drop-shadow-[0_0_5px_rgba(37,99,235,0.35)]">
                          {money(
                            salary.advanceDeduction
                          )}
                        </span>

                        {salary.totalAdvanceCount >
                          1 && (

                          <small className="block mt-1 text-blue-500 font-semibold">
                            {
                              salary.totalAdvanceCount
                            }{" "}
                            advances
                          </small>

                        )}

                      </td>

                      {/* NET SALARY */}

                      <td>

                        <strong
                          className={
                            salary.netSalary < 0
                              ? "text-red-600 font-black drop-shadow-[0_0_7px_rgba(239,68,68,0.45)]"
                              : "text-emerald-600 font-black drop-shadow-[0_0_7px_rgba(16,185,129,0.45)]"
                          }
                        >

                          {salaryMoney(
                            salary.netSalary
                          )}

                        </strong>

                        {salary.netSalary <
                          0 && (

                          <small className="block mt-1 text-red-600 font-semibold">

                            Extra advance:{" "}
                            {money(
                              salary.excessAdvance
                            )}

                          </small>

                        )}

                      </td>

                      {/* PDF */}

                      <td>

                        <button
                          className="table-action download"
                          title="Download Salary Slip"
                          onClick={() =>
                            generateSalarySlip(
                              employee,
                              salary
                            )
                          }
                        >

                          <Download size={16} />

                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}