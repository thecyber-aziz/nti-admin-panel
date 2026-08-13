// src/components/SalarySummary.jsx

import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock3,
} from "lucide-react";

import {
  money,
  salaryMoney,
} from "../utils/salaryCalculator";

export default function SalarySummary({
  salary,
}) {
  if (!salary) {
    return null;
  }

  const isNegative =
    salary.netSalary < 0;

  return (
    <div className="space-y-5">
      {/* Main salary */}
      <div
        className={`rounded-3xl border p-6 ${
          isNegative
            ? "border-red-200 bg-red-50"
            : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Final Net Salary
            </p>

            <h2
              className={`mt-1 text-4xl font-black ${
                isNegative
                  ? "text-red-600"
                  : "text-emerald-600"
              }`}
            >
              {salaryMoney(
                salary.netSalary
              )}
            </h2>

            {isNegative && (
              <p className="mt-2 text-sm font-semibold text-red-600">
                Advance exceeds current
                month's salary by{" "}
                {money(
                  salary.negativeAmount
                )}
              </p>
            )}
          </div>

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              isNegative
                ? "bg-red-100 text-red-600"
                : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {isNegative ? (
              <TrendingDown size={27} />
            ) : (
              <TrendingUp size={27} />
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={IndianRupee}
          title="Monthly Salary"
          value={money(
            salary.monthlySalary
          )}
        />

        <SummaryCard
          icon={Wallet}
          title="Total Advance"
          value={money(
            salary.totalAdvance
          )}
          danger={
            salary.totalAdvance >
            salary.salaryBeforeAdvance
          }
        />

        <SummaryCard
          icon={Clock3}
          title="Overtime"
          value={`${salary.overtimeHours} hrs`}
          subValue={money(
            salary.overtimeAmount
          )}
        />

        <SummaryCard
          icon={TrendingDown}
          title="Absent Deduction"
          value={money(
            salary.absentDeduction +
              salary.halfDayDeduction
          )}
        />
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  title,
  value,
  subValue,
  danger = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <p
            className={`mt-2 text-xl font-black ${
              danger
                ? "text-red-600"
                : "text-slate-900"
            }`}
          >
            {value}
          </p>

          {subValue && (
            <p className="mt-1 text-xs font-medium text-emerald-600">
              + {subValue}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}