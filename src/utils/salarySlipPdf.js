import jsPDF from "jspdf";

export function downloadSalarySlip({
  employee,
  salary,
  month,
}) {
  const doc = new jsPDF();

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const monthName = new Date(
    `${month}-01`
  ).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  // =========================
  // HEADER
  // =========================

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");

  doc.text(
    "NEW TAJ INDUSTRIES",
    pageWidth / 2,
    20,
    {
      align: "center",
    }
  );

  doc.setFontSize(14);

  doc.text(
    "EMPLOYEE SALARY SLIP",
    pageWidth / 2,
    30,
    {
      align: "center",
    }
  );

  doc.setLineWidth(0.5);

  doc.line(
    15,
    36,
    pageWidth - 15,
    36
  );

  // =========================
  // EMPLOYEE DETAILS
  // =========================

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  let y = 48;

  doc.text(
    `Employee Name: ${employee?.name || "-"}`,
    15,
    y
  );

  doc.text(
    `Employee ID: ${employee?.id || "-"}`,
    110,
    y
  );

  y += 9;

  doc.text(
    `Department: ${
      employee?.department || "-"
    }`,
    15,
    y
  );

  doc.text(
    `Designation: ${
      employee?.designation || "-"
    }`,
    110,
    y
  );

  y += 9;

  doc.text(
    `Salary Month: ${monthName}`,
    15,
    y
  );

  // =========================
  // SALARY TABLE
  // =========================

  y += 18;

  doc.setFont("helvetica", "bold");

  doc.text(
    "Salary Details",
    15,
    y
  );

  y += 10;

  doc.setFont("helvetica", "normal");

  const rows = [
    [
      "Monthly Salary",
      salary.monthlySalary,
    ],
    [
      "Working Days",
      salary.workingDays,
    ],
    [
      "Present Days",
      salary.presentDays,
    ],
    [
      "Absent Days",
      salary.absentDays,
    ],
    [
      "Half Days",
      salary.halfDays,
    ],
    [
      "Overtime Hours",
      `${salary.overtimeHours} hrs`,
    ],
    [
      "Overtime Pay",
      salary.overtimePay,
    ],
    [
      "Absent Deduction",
      salary.absentDeduction,
    ],
    [
      "Half Day Deduction",
      salary.halfDayDeduction,
    ],
    [
      "Approved Advance",
      salary.advanceDeduction,
    ],
  ];

  rows.forEach(([label, value]) => {
    doc.text(
      label,
      20,
      y
    );

    const displayValue =
      typeof value === "number"
        ? `Rs. ${value.toLocaleString(
            "en-IN"
          )}`
        : String(value);

    doc.text(
      displayValue,
      130,
      y
    );

    y += 9;
  });

  // =========================
  // TOTAL
  // =========================

  y += 5;

  doc.line(
    15,
    y,
    pageWidth - 15,
    y
  );

  y += 12;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  doc.text(
    "NET SALARY",
    20,
    y
  );

  doc.text(
    `Rs. ${Number(
      salary.netSalary || 0
    ).toLocaleString("en-IN")}`,
    130,
    y
  );

  // =========================
  // FOOTER
  // =========================

  y += 25;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text(
    "This is a computer generated salary slip.",
    pageWidth / 2,
    y,
    {
      align: "center",
    }
  );

  y += 7;

  doc.text(
    "NEW TAJ INDUSTRIES",
    pageWidth / 2,
    y,
    {
      align: "center",
    }
  );

  // =========================
  // DOWNLOAD
  // =========================

  const employeeName =
    employee?.name
      ?.replace(/[^a-zA-Z0-9]/g, "_") ||
    "Employee";

  doc.save(
    `Salary_Slip_${employeeName}_${month}.pdf`
  );
}