// src/components/AdvanceForm.jsx

import { useMemo, useState } from "react";

import {
  IndianRupee,
  CheckCircle2,
  Clock3,
  User,
  CalendarDays,
  FileText,
  AlertTriangle,
  Wallet,
} from "lucide-react";

export default function AdvanceForm({
  employees = [],
  onSubmit,
  onCancel,
}) {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const [employeeId, setEmployeeId] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [date, setDate] =
    useState(today);

  const [reason, setReason] =
    useState("");

  const [status, setStatus] =
    useState("Pending");

  const [error, setError] =
    useState("");

  const selectedEmployee =
    useMemo(() => {
      return employees.find(
        (employee) =>
          String(employee.id) ===
          String(employeeId)
      );
    }, [employees, employeeId]);

  const monthlySalary = Number(
    selectedEmployee?.monthlySalary ??
      selectedEmployee?.salary ??
      selectedEmployee?.basicSalary ??
      0
  );

  const advanceAmount =
    Number(amount || 0);

  const remainingSalary =
    monthlySalary - advanceAmount;

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!employeeId) {
      setError(
        "Please select an employee."
      );
      return;
    }

    if (
      !advanceAmount ||
      advanceAmount <= 0
    ) {
      setError(
        "Please enter a valid advance amount."
      );
      return;
    }

    if (!date) {
      setError(
        "Please select advance date."
      );
      return;
    }

    onSubmit({
      employeeId,
      amount: advanceAmount,
      date,
      reason: reason.trim(),
      status,
      deducted: 0,
      balance: advanceAmount,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Unable to create advance
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Employee */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <User size={16} />
          Employee
          <span className="text-red-500">
            *
          </span>
        </label>

        <select
          value={employeeId}
          onChange={(event) =>
            setEmployeeId(
              event.target.value
            )
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
        >
          <option value="">
            Select Employee
          </option>

          {employees.map(
            (employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {employee.name} —{" "}
                {employee.id}
              </option>
            )
          )}
        </select>
      </div>

      {/* Employee salary preview */}
      {selectedEmployee && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
              <Wallet size={20} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Salary Preview
              </h3>

              <p className="text-xs text-slate-500">
                {selectedEmployee.name}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Monthly */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Monthly Salary
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                ₹
                {monthlySalary.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            {/* After advance */}
            <div
              className={`rounded-xl p-4 shadow-sm ${
                remainingSalary < 0
                  ? "bg-red-50"
                  : "bg-emerald-50"
              }`}
            >
              <p className="text-xs font-medium text-slate-500">
                Salary After This Advance
              </p>

              <p
                className={`mt-1 text-xl font-bold ${
                  remainingSalary < 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {remainingSalary < 0
                  ? "-"
                  : ""}
                ₹
                {Math.abs(
                  remainingSalary
                ).toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Amount + Date */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Amount */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <IndianRupee size={16} />

            Advance Amount

            <span className="text-red-500">
              *
            </span>
          </label>

          <div className="relative">
            <IndianRupee
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="number"
              min="0"
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
              placeholder="Enter amount"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarDays size={16} />

            Advance Date

            <span className="text-red-500">
              *
            </span>
          </label>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
          />
        </div>
      </div>

      {/* Reason */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <FileText size={16} />
          Reason
        </label>

        <textarea
          rows={4}
          value={reason}
          onChange={(event) =>
            setReason(
              event.target.value
            )
          }
          placeholder="Why is the employee taking this advance?"
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
        />
      </div>

      {/* Status */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Advance Status
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Pending */}
          <button
            type="button"
            onClick={() =>
              setStatus("Pending")
            }
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
              status === "Pending"
                ? "border-orange-400 bg-orange-50 ring-2 ring-orange-100"
                : "border-slate-200 bg-white hover:border-orange-300"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Clock3 size={19} />
            </div>

            <div>
              <p className="font-bold text-slate-900">
                Pending
              </p>

              <p className="text-xs text-slate-500">
                Awaiting approval
              </p>
            </div>
          </button>

          {/* Approved */}
          <button
            type="button"
            onClick={() =>
              setStatus("Approved")
            }
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
              status === "Approved"
                ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100"
                : "border-slate-200 bg-white hover:border-emerald-300"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <p className="font-bold text-slate-900">
                Approved
              </p>

              <p className="text-xs text-slate-500">
                Deduct from salary
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Approval information */}
      {status === "Approved" &&
        selectedEmployee && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex gap-3">
              <CheckCircle2
                size={22}
                className="shrink-0 text-emerald-600"
              />

              <div>
                <h4 className="font-bold text-emerald-900">
                  Advance Approved
                </h4>

                <p className="mt-1 text-sm text-emerald-700">
                  ₹
                  {advanceAmount.toLocaleString(
                    "en-IN"
                  )}{" "}
                  will be included in this
                  employee's salary advance
                  total.
                </p>

                <div className="mt-3 inline-flex rounded-lg bg-white px-3 py-2 text-sm font-bold text-emerald-700 shadow-sm">
                  Salary after this advance:
                  <span className="ml-2">
                    {remainingSalary < 0
                      ? "-"
                      : ""}
                    ₹
                    {Math.abs(
                      remainingSalary
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Buttons */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 active:scale-[0.98]"
        >
          {status === "Approved" ? (
            <>
              <CheckCircle2 size={18} />
              Approve & Create
            </>
          ) : (
            <>
              <Clock3 size={18} />
              Create Advance
            </>
          )}
        </button>
      </div>
    </form>
  );
}