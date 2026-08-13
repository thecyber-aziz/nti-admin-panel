// src/utils/salaryCalculator.js

const WORKING_DAYS = 26;
const NORMAL_WORKING_HOURS = 8;

// Overtime rate:
// Monthly salary / 26 working days / 8 hours
export const calculateOvertimeRate = (monthlySalary) => {
  const salary = Number(monthlySalary || 0);

  if (!salary) {
    return 0;
  }

  return salary / WORKING_DAYS / NORMAL_WORKING_HOURS;
};

// Indian currency formatter
export const money = (amount) => {
  const value = Number(amount || 0);

  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

// Salary formatter.
// Negative salary will show like:
// -₹3,000
export const salaryMoney = (amount) => {
  const value = Number(amount || 0);

  if (value < 0) {
    return `-₹${Math.abs(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  }

  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

export const calculateSalary = (
  employee,
  attendance = [],
  advances = []
) => {
  const monthlySalary = Number(
    employee?.monthlySalary ??
      employee?.salary ??
      employee?.basicSalary ??
      0
  );

  // --------------------------------------------------
  // BASIC DAILY / HOURLY SALARY
  // --------------------------------------------------

  const perDaySalary =
    monthlySalary / WORKING_DAYS;

  const perHourSalary =
    perDaySalary / NORMAL_WORKING_HOURS;

  // --------------------------------------------------
  // ATTENDANCE
  // --------------------------------------------------

  const presentDays = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentDays = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const halfDays = attendance.filter(
    (item) =>
      item.status === "Half Day"
  ).length;

  // --------------------------------------------------
  // ATTENDANCE DEDUCTION
  // --------------------------------------------------

  const absentDeduction =
    absentDays * perDaySalary;

  const halfDayDeduction =
    halfDays * (perDaySalary / 2);

  // --------------------------------------------------
  // OVERTIME
  // --------------------------------------------------

  const overtimeHours = attendance.reduce(
    (total, item) =>
      total +
      Number(item.overtimeHours || 0),
    0
  );

  const overtimeAmount =
    overtimeHours * perHourSalary;

  // --------------------------------------------------
  // MULTIPLE ADVANCES
  // --------------------------------------------------

  // Only Approved advances should affect salary.
  const approvedAdvances =
    advances.filter(
      (advance) =>
        String(
          advance.status || ""
        ).toLowerCase() === "approved"
    );

  // IMPORTANT:
  // Every approved advance is added.
  //
  // Example:
  //
  // Salary = 10,000
  //
  // Advance 1 = 4,000
  // Advance 2 = 6,000
  // Advance 3 = 3,000
  //
  // Total Advance = 13,000
  //
  // Salary after advance =
  // 10,000 - 13,000
  // = -3,000

  const advanceDeduction =
    approvedAdvances.reduce(
      (total, advance) =>
        total +
        Number(
          advance.amount || 0
        ),
      0
    );

  // --------------------------------------------------
  // FINAL SALARY
  // --------------------------------------------------

  const grossSalary =
    monthlySalary -
    absentDeduction -
    halfDayDeduction +
    overtimeAmount;

  const netSalary =
    grossSalary -
    advanceDeduction;

  // --------------------------------------------------
  // REMAINING / EXCESS ADVANCE
  // --------------------------------------------------

  const salaryAfterAdvance =
    monthlySalary -
    advanceDeduction;

  const excessAdvance =
    salaryAfterAdvance < 0
      ? Math.abs(salaryAfterAdvance)
      : 0;

  // --------------------------------------------------
  // ADVANCE DETAILS
  // --------------------------------------------------

  const totalAdvanceCount =
    approvedAdvances.length;

  return {
    monthlySalary,

    workingDays: WORKING_DAYS,

    normalWorkingHours:
      NORMAL_WORKING_HOURS,

    perDaySalary,

    perHourSalary,

    presentDays,

    absentDays,

    halfDays,

    absentDeduction,

    halfDayDeduction,

    overtimeHours,

    overtimeAmount,

    approvedAdvances,

    totalAdvanceCount,

    advanceDeduction,

    salaryAfterAdvance,

    excessAdvance,

    grossSalary,

    netSalary,
  };
};