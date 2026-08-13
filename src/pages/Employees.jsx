import { useMemo, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Phone,
  Users,
  X,
  MapPin,
  CalendarDays,
  BriefcaseBusiness,
  IndianRupee,
  CreditCard,
  User,
  Mail,
  ShieldCheck,
  Edit3,
} from "lucide-react";

import { useAppData } from "../context/AppDataContext";

import Modal from "../components/Modal";
import EmployeeForm from "../components/EmployeeForm";
import EmptyState from "../components/EmptyState";

import { money } from "../utils/salaryCalculator";

export default function Employees() {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useAppData();

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return employees;
    }

    return employees.filter((employee) => {
      return (
        employee.name
          ?.toLowerCase()
          .includes(query) ||
        employee.id
          ?.toLowerCase()
          .includes(query) ||
        employee.phone
          ?.toLowerCase()
          .includes(query) ||
        employee.department
          ?.toLowerCase()
          .includes(query) ||
        employee.designation
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [employees, search]);

  const openAdd = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const openEdit = (employee) => {
    setSelectedEmployee(null);
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const openProfile = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleSubmit = (data) => {
    if (editingEmployee) {
      updateEmployee(
        editingEmployee.id,
        data
      );
    } else {
      addEmployee(data);
    }

    setShowModal(false);
    setEditingEmployee(null);
  };

  const handleDelete = (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (confirmed) {
      deleteEmployee(employee.id);

      if (
        selectedEmployee?.id ===
        employee.id
      ) {
        setSelectedEmployee(null);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="page-container">
      {/* PAGE HEADER */}

      <div className="page-header">
        <div>
          <h2>Employees</h2>

          <p>
            Manage factory employees,
            departments and salaries.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openAdd}
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* EMPLOYEE TABLE */}

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

          <div className="toolbar-count">
            <Users size={17} />

            {filteredEmployees.length}{" "}
            employees
          </div>
        </div>

        {filteredEmployees.length === 0 ? (
          <EmptyState
            title="No employees found"
            message="Add an employee or change your search."
          />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Phone</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map(
                  (employee) => (
                    <tr
                      key={employee.id}
                      className="cursor-pointer"
                      onClick={() =>
                        openProfile(employee)
                      }
                    >
                      <td>
                        <div className="employee-cell">
                          <div className="employee-avatar overflow-hidden">
                            {employee.photo ? (
                              <img
                                src={employee.photo}
                                alt={employee.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              employee.name
                                ?.charAt(0)
                                .toUpperCase()
                            )}
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

                      <td>
                        {employee.department ||
                          "-"}
                      </td>

                      <td>
                        {employee.designation ||
                          "-"}
                      </td>

                      <td>
                        <span className="phone-cell">
                          <Phone size={14} />

                          {employee.phone ||
                            "-"}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {money(
                            employee.monthlySalary
                          )}
                        </strong>
                      </td>

                      <td>
                        <span className="status-badge status-active">
                          {employee.status ||
                            "Active"}
                        </span>
                      </td>

                      <td
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        <div className="action-buttons">
                          <button
                            className="table-action edit"
                            title="Edit"
                            onClick={() =>
                              openEdit(
                                employee
                              )
                            }
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="table-action delete"
                            title="Delete"
                            onClick={() =>
                              handleDelete(
                                employee
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT EMPLOYEE MODAL */}

      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEmployee(null);
        }}
        title={
          editingEmployee
            ? "Edit Employee"
            : "Add New Employee"
        }
        size="large"
      >
        <EmployeeForm
          initialData={editingEmployee}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditingEmployee(null);
          }}
        />
      </Modal>

      {/* =====================================================
          EMPLOYEE PROFILE POPUP
      ====================================================== */}

      {selectedEmployee && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/60
            backdrop-blur-sm
            p-4
          "
          onClick={() =>
            setSelectedEmployee(null)
          }
        >
          <div
            className="
              relative
              w-full
              max-w-4xl
              max-h-[92vh]
              overflow-hidden
              rounded-3xl
              bg-white
              shadow-2xl
              animate-[profilePopup_.2s_ease-out]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* CLOSE BUTTON */}

            <button
              onClick={() =>
                setSelectedEmployee(null)
              }
              className="
                absolute
                right-5
                top-5
                z-20
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/90
                text-gray-600
                shadow-md
                transition
                hover:bg-gray-100
                hover:text-gray-900
              "
            >
              <X size={20} />
            </button>

            {/* PROFILE HEADER */}

            <div
              className="
                relative
                overflow-hidden
                bg-gradient-to-br
                from-slate-900
                via-slate-800
                to-gray-900
                px-6
                pb-8
                pt-8
                sm:px-10
              "
            >
              {/* decorative circles */}

              <div
                className="
                  absolute
                  -right-20
                  -top-20
                  h-56
                  w-56
                  rounded-full
                  bg-yellow-400/10
                "
              />

              <div
                className="
                  absolute
                  -bottom-24
                  -left-20
                  h-64
                  w-64
                  rounded-full
                  bg-yellow-400/5
                "
              />

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* PHOTO */}

                <div
                  className="
                    h-28
                    w-28
                    shrink-0
                    overflow-hidden
                    rounded-2xl
                    border-4
                    border-white/20
                    bg-gray-700
                    shadow-xl
                    sm:h-36
                    sm:w-36
                  "
                >
                  {selectedEmployee.photo ? (
                    <img
                      src={
                        selectedEmployee.photo
                      }
                      alt={
                        selectedEmployee.name
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        bg-gradient-to-br
                        from-yellow-400
                        to-yellow-600
                        text-5xl
                        font-bold
                        text-white
                      "
                    >
                      {selectedEmployee.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                {/* NAME */}

                <div className="min-w-0 text-white">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-green-500/20
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-green-300
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                      {selectedEmployee.status ||
                        "Active"}
                    </span>

                    <span
                      className="
                        rounded-full
                        bg-white/10
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-gray-300
                      "
                    >
                      {selectedEmployee.id}
                    </span>
                  </div>

                  <h2
                    className="
                      text-2xl
                      font-bold
                      tracking-tight
                      sm:text-3xl
                    "
                  >
                    {selectedEmployee.name}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-300
                      sm:text-base
                    "
                  >
                    {selectedEmployee.designation ||
                      "Employee"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <BriefcaseBusiness
                        size={15}
                      />
                      {selectedEmployee.department ||
                        "Department"}
                    </span>

                    {selectedEmployee.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={15} />

                        {
                          selectedEmployee.phone
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* PROFILE BODY */}

            <div
              className="
                max-h-[calc(92vh-250px)]
                overflow-y-auto
                p-5
                sm:p-8
              "
            >
              {/* QUICK STATS */}

              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <ProfileStat
                  icon={IndianRupee}
                  label="Monthly Salary"
                  value={money(
                    selectedEmployee.monthlySalary
                  )}
                />

                <ProfileStat
                  icon={CalendarDays}
                  label="Joining Date"
                  value={formatDate(
                    selectedEmployee.joiningDate
                  )}
                />

                <ProfileStat
                  icon={BriefcaseBusiness}
                  label="Department"
                  value={
                    selectedEmployee.department ||
                    "-"
                  }
                />
              </div>

              {/* PERSONAL INFORMATION */}

              <ProfileSection
                icon={User}
                title="Personal Information"
              >
                <ProfileItem
                  label="Full Name"
                  value={
                    selectedEmployee.name
                  }
                />

                <ProfileItem
                  label="Father's Name"
                  value={
                    selectedEmployee.fatherName
                  }
                />

                <ProfileItem
                  label="Phone Number"
                  value={
                    selectedEmployee.phone
                  }
                />

                <ProfileItem
                  label="Designation"
                  value={
                    selectedEmployee.designation
                  }
                />
              </ProfileSection>

              {/* ADDRESS */}

              <ProfileSection
                icon={MapPin}
                title="Address"
              >
                <div className="sm:col-span-2">
                  <ProfileItem
                    label="Full Address"
                    value={
                      selectedEmployee.address
                    }
                  />
                </div>

                <ProfileItem
                  label="City"
                  value={
                    selectedEmployee.city
                  }
                />

                <ProfileItem
                  label="State"
                  value={
                    selectedEmployee.state
                  }
                />

                <ProfileItem
                  label="PIN Code"
                  value={
                    selectedEmployee.pincode
                  }
                />
              </ProfileSection>

              {/* AADHAAR */}

              <ProfileSection
                icon={CreditCard}
                title="Aadhaar Details"
              >
               <ProfileItem
                 label="Aadhaar Number"
                 value={selectedEmployee.aadhaarNumber}
                />

                <ProfileItem
                  label="Aadhaar Name"
                  value={
                    selectedEmployee.aadhaarName ||
                    selectedEmployee.name
                  }
                />
              </ProfileSection>

              {/* EMPLOYMENT */}

              <ProfileSection
                icon={ShieldCheck}
                title="Employment Details"
              >
                <ProfileItem
                  label="Employee ID"
                  value={
                    selectedEmployee.id
                  }
                />

                <ProfileItem
                  label="Department"
                  value={
                    selectedEmployee.department
                  }
                />

                <ProfileItem
                  label="Designation"
                  value={
                    selectedEmployee.designation
                  }
                />

                <ProfileItem
                  label="Joining Date"
                  value={formatDate(
                    selectedEmployee.joiningDate
                  )}
                />

                <ProfileItem
                  label="Monthly Salary"
                  value={money(
                    selectedEmployee.monthlySalary
                  )}
                />

                <ProfileItem
                  label="Employment Status"
                  value={
                    selectedEmployee.status ||
                    "Active"
                  }
                />
              </ProfileSection>

              {/* ACTIONS */}

              <div
                className="
                  mt-8
                  flex
                  flex-col-reverse
                  gap-3
                  border-t
                  border-gray-200
                  pt-6
                  sm:flex-row
                  sm:justify-end
                "
              >
                <button
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-gray-700
                    transition
                    hover:bg-gray-50
                  "
                  onClick={() =>
                    setSelectedEmployee(null)
                  }
                >
                  Close
                </button>

                <button
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-slate-900
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-slate-800
                  "
                  onClick={() =>
                    openEdit(
                      selectedEmployee
                    )
                  }
                >
                  <Edit3 size={16} />
                  Edit Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PROFILE STAT
========================================================= */

function ProfileStat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-gray-50
        p-4
      "
    >
      <div
        className="
          mb-3
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          bg-yellow-100
          text-yellow-700
        "
      >
        <Icon size={18} />
      </div>

      <p className="text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-base font-bold text-gray-900">
        {value || "-"}
      </p>
    </div>
  );
}

/* =========================================================
   PROFILE SECTION
========================================================= */

function ProfileSection({
  icon: Icon,
  title,
  children,
}) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-yellow-100
            text-yellow-700
          "
        >
          <Icon size={18} />
        </div>

        <h3 className="text-base font-bold text-gray-900">
          {title}
        </h3>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-x-8
          gap-y-5
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          sm:grid-cols-2
        "
      >
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   PROFILE ITEM
========================================================= */

function ProfileItem({
  label,
  value,
  sensitive = false,
}) {
  let displayValue = value || "-";

  if (
    sensitive &&
    value &&
    value.length >= 4
  ) 
  {
    displayValue =
      "XXXX XXXX " +
      value.slice(-4);
  }

  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="break-words text-sm font-semibold text-gray-800">
        {displayValue}
      </p>
    </div>
  );
}