// src/utils/dateUtils.js

// Today's date in YYYY-MM-DD format
export function todayISO() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


// Current month in YYYY-MM format
export function currentMonth() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}`;
}


// Current year
export function currentYear() {
  return new Date().getFullYear();
}


// Current month number
// January = 1
// December = 12
export function currentMonthNumber() {
  return new Date().getMonth() + 1;
}


// Current year as string
export function currentYearString() {
  return String(
    new Date().getFullYear()
  );
}


// Format YYYY-MM-DD
// Example: 2026-08-13 → 13 Aug 2026
export function formatDate(
  dateString
) {
  if (!dateString) {
    return "-";
  }

  const date = new Date(
    `${dateString}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


// Format month
// Example: 2026-08 → August 2026
export function monthLabel(
  monthString
) {
  if (!monthString) {
    return "-";
  }

  const date = new Date(
    `${monthString}-01T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return monthString;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );
}


// Get month label for current month
export function currentMonthLabel() {
  return monthLabel(
    currentMonth()
  );
}


// Get number of days in a month
export function daysInMonth(
  year,
  month
) {
  return new Date(
    year,
    month,
    0
  ).getDate();
}


// Get current month's number of days
export function currentMonthDays() {
  const date = new Date();

  return daysInMonth(
    date.getFullYear(),
    date.getMonth() + 1
  );
}


// Check whether date belongs to month
export function isDateInMonth(
  dateString,
  monthString
) {
  if (!dateString || !monthString) {
    return false;
  }

  return dateString.startsWith(
    monthString
  );
}


// Check whether date is today
export function isToday(
  dateString
) {
  return dateString === todayISO();
}