import {
  User,
  Phone,
  Mail,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  IndianRupee,
  CreditCard,
  X,
} from "lucide-react";

import { money } from "../utils/salaryCalculator";

export default function EmployeeProfileModal({
  employee,
  onClose,
  onEdit,
}) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="relative overflow-hidden bg-slate-900 px-6 py-7 text-white sm:px-8">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-yellow-400/10" />
          <div className="absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-yellow-400/5" />

          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={18} />
          </button>

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 shadow-xl">
              {employee.photo ? (
                <img
                  src={employee.photo}
                  alt={employee.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User
                  size={50}
                  className="text-white/60"
                />
              )}
            </div>

            <div>
              <div className="mb-2 inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                ● Active Employee
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                {employee.name}
              </h2>

              <p className="mt-1 text-sm text-slate-300">
                {employee.designation || "Employee"}
              </p>

              <p className="mt-2 text-xs font-medium text-slate-400">
                Employee ID: {employee.id}
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

            {/* CONTACT */}
            <ProfileCard
              title="Personal Information"
              icon={<User size={18} />}
            >
              <InfoRow
                label="Father's Name"
                value={employee.fatherName}
              />

              <InfoRow
                label="Phone"
                value={employee.phone}
                icon={<Phone size={15} />}
              />

              <InfoRow
                label="Email"
                value={employee.email}
                icon={<Mail size={15} />}
              />
            </ProfileCard>

            {/* JOB */}
            <ProfileCard
              title="Employment"
              icon={<BriefcaseBusiness size={18} />}
            >
              <InfoRow
                label="Department"
                value={employee.department}
              />

              <InfoRow
                label="Designation"
                value={employee.designation}
              />

              <InfoRow
                label="Joining Date"
                value={employee.joiningDate}
                icon={<CalendarDays size={15} />}
              />

              <InfoRow
                label="Monthly Salary"
                value={money(
                  employee.monthlySalary
                )}
                icon={<IndianRupee size={15} />}
                highlight
              />
            </ProfileCard>

            {/* ADDRESS */}
            <ProfileCard
              title="Address"
              icon={<MapPin size={18} />}
            >
              <div className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                {employee.address || "Not provided"}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <MiniInfo
                  label="City"
                  value={employee.city}
                />

                <MiniInfo
                  label="State"
                  value={employee.state}
                />

                <MiniInfo
                  label="PIN Code"
                  value={employee.pincode}
                />
              </div>
            </ProfileCard>
          </div>

          {/* AADHAAR */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <CreditCard size={18} />
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  Aadhaar Details
                </h3>

                <p className="text-xs text-slate-500">
                  Employee identification information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MiniInfo
                label="Aadhaar Number"
                value={
                  employee.aadhaarNumber
                    ? formatAadhaar(
                        employee.aadhaarNumber
                      )
                    : "Not provided"
                }
              />

              <MiniInfo
                label="Name on Aadhaar"
                value={
                  employee.aadhaarName
                }
              />

              <MiniInfo
                label="Date of Birth"
                value={
                  employee.aadhaarDob
                }
              />

              <MiniInfo
                label="Gender"
                value={
                  employee.aadhaarGender
                }
              />
            </div>

            <div className="mt-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Aadhaar Address
              </p>

              <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                {employee.aadhaarAddress ||
                  "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-8">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Close
          </button>

          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Edit Employee
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function ProfileCard({
  title,
  icon,
  children,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          {icon}
        </div>

        <h3 className="font-bold text-slate-800">
          {title}
        </h3>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
  highlight,
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div
        className={`flex items-center gap-2 text-sm font-semibold ${
          highlight
            ? "text-emerald-600"
            : "text-slate-700"
        }`}
      >
        {icon}
        {value || "Not provided"}
      </div>
    </div>
  );
}

function MiniInfo({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function formatAadhaar(value) {
  const digits = String(value).replace(
    /\D/g,
    ""
  );

  return digits.replace(
    /(\d{4})(?=\d)/g,
    "$1 "
  );
}