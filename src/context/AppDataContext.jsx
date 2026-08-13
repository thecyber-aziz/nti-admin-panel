import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AppDataContext =
  createContext(null);

/* =====================================================
   DEFAULT DATA
===================================================== */

const defaultEmployees = [
  {
    id: "NTI-001",
    name: "Abdul",
    phone: "9876543210",
    department: "Production",
    designation: "Worker",
    monthlySalary: 25000,
    joiningDate: "2026-01-01",
    status: "Active",
  },

  {
    id: "NTI-002",
    name: "Rahul",
    phone: "9876543211",
    department: "Production",
    designation: "Machine Operator",
    monthlySalary: 22000,
    joiningDate: "2026-01-05",
    status: "Active",
  },

  {
    id: "NTI-003",
    name: "Amit",
    phone: "9876543212",
    department: "Maintenance",
    designation: "Technician",
    monthlySalary: 28000,
    joiningDate: "2026-02-01",
    status: "Active",
  },
];

const defaultAttendance = [];

const defaultAdvances = [];

/* =====================================================
   LOCAL STORAGE HELPER
===================================================== */

function getStoredData(key, defaultValue) {
  try {
    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return defaultValue;
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error(
      `Error reading ${key}:`,
      error
    );

    return defaultValue;
  }
}

/* =====================================================
   PROVIDER
===================================================== */

export function AppDataProvider({
  children,
}) {
  /* ===================================================
     EMPLOYEES
  =================================================== */

  const [employees, setEmployees] =
    useState(() =>
      getStoredData(
        "nti_employees",
        defaultEmployees
      )
    );

  /* ===================================================
     ATTENDANCE
  =================================================== */

  const [attendance, setAttendance] =
    useState(() =>
      getStoredData(
        "nti_attendance",
        defaultAttendance
      )
    );

  /* ===================================================
     ADVANCES
  =================================================== */

  const [advances, setAdvances] =
    useState(() =>
      getStoredData(
        "nti_advances",
        defaultAdvances
      )
    );

  /* ===================================================
     SAVE TO LOCAL STORAGE
  =================================================== */

  useEffect(() => {
    localStorage.setItem(
      "nti_employees",
      JSON.stringify(employees)
    );
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(
      "nti_attendance",
      JSON.stringify(attendance)
    );
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(
      "nti_advances",
      JSON.stringify(advances)
    );
  }, [advances]);

  /* ===================================================
     EMPLOYEE FUNCTIONS
  =================================================== */

  const addEmployee = (employee) => {
    const newEmployee = {
      ...employee,

      id:
        employee.id ||
        `NTI-${String(
          employees.length + 1
        ).padStart(3, "0")}`,

      monthlySalary: Number(
        employee.monthlySalary ||
          employee.salary ||
          0
      ),

      status:
        employee.status || "Active",
    };

    setEmployees((previous) => [
      ...previous,
      newEmployee,
    ]);

    return newEmployee;
  };

  const updateEmployee = (
    employeeId,
    updatedData
  ) => {
    setEmployees((previous) =>
      previous.map((employee) =>
        String(employee.id) ===
        String(employeeId)
          ? {
              ...employee,
              ...updatedData,

              monthlySalary:
                Number(
                  updatedData.monthlySalary ??
                    updatedData.salary ??
                    employee.monthlySalary ??
                    0
                ),
            }
          : employee
      )
    );
  };

  const deleteEmployee = (
    employeeId
  ) => {
    setEmployees((previous) =>
      previous.filter(
        (employee) =>
          String(employee.id) !==
          String(employeeId)
      )
    );

    /* Also remove related attendance */

    setAttendance((previous) =>
      previous.filter(
        (item) =>
          String(item.employeeId) !==
          String(employeeId)
      )
    );

    /* Also remove related advances */

    setAdvances((previous) =>
      previous.filter(
        (item) =>
          String(item.employeeId) !==
          String(employeeId)
      )
    );
  };

  /* ===================================================
     ATTENDANCE FUNCTIONS
  =================================================== */

  const addAttendance = (
    attendanceData
  ) => {
    const newAttendance = {
      ...attendanceData,

      id:
        attendanceData.id ||
        `ATT-${Date.now()}`,

      overtimeHours: Number(
        attendanceData.overtimeHours ||
          0
      ),

      status:
        attendanceData.status ||
        "Present",
    };

    setAttendance((previous) => {
      /*
       If same employee + same date already exists,
       update that record instead of creating duplicate.
      */

      const existingIndex =
        previous.findIndex(
          (item) =>
            String(
              item.employeeId
            ) ===
              String(
                newAttendance.employeeId
              ) &&
            item.date ===
              newAttendance.date
        );

      if (existingIndex !== -1) {
        return previous.map(
          (item, index) =>
            index === existingIndex
              ? {
                  ...item,
                  ...newAttendance,
                }
              : item
        );
      }

      return [
        ...previous,
        newAttendance,
      ];
    });

    return newAttendance;
  };

  const updateAttendance = (
    attendanceId,
    updatedData
  ) => {
    setAttendance((previous) =>
      previous.map((item) =>
        String(item.id) ===
        String(attendanceId)
          ? {
              ...item,
              ...updatedData,
              overtimeHours: Number(
                updatedData.overtimeHours ??
                  item.overtimeHours ??
                  0
              ),
            }
          : item
      )
    );
  };

  const deleteAttendance = (
    attendanceId
  ) => {
    setAttendance((previous) =>
      previous.filter(
        (item) =>
          String(item.id) !==
          String(attendanceId)
      )
    );
  };

  /* ===================================================
     ADVANCE FUNCTIONS
  =================================================== */

  const addAdvance = (
    advanceData
  ) => {
    const amount = Number(
      advanceData.amount || 0
    );

    const newAdvance = {
      ...advanceData,

      id:
        advanceData.id ||
        `ADV-${Date.now()}`,

      amount,

      /*
       Pending = not deducted
       Approved = deducted from salary
      */

      status:
        advanceData.status ===
        "Approved"
          ? "Approved"
          : "Pending",

      deducted:
        advanceData.status ===
        "Approved"
          ? amount
          : 0,

      balance:
        advanceData.status ===
        "Approved"
          ? 0
          : amount,

      createdAt:
        new Date().toISOString(),
    };

    setAdvances((previous) => [
      ...previous,
      newAdvance,
    ]);

    return newAdvance;
  };

  /* ===================================================
     UPDATE ADVANCE
  =================================================== */

  const updateAdvance = (
    advanceId,
    updatedData
  ) => {
    setAdvances((previous) =>
      previous.map((advance) => {
        if (
          String(advance.id) !==
          String(advanceId)
        ) {
          return advance;
        }

        const amount = Number(
          updatedData.amount ??
            advance.amount ??
            0
        );

        const status =
          updatedData.status ??
          advance.status ??
          "Pending";

        return {
          ...advance,
          ...updatedData,

          amount,

          status,

          deducted:
            status === "Approved"
              ? amount
              : 0,

          balance:
            status === "Approved"
              ? 0
              : amount,
        };
      })
    );
  };

  /* ===================================================
     APPROVE ADVANCE
  =================================================== */

  const approveAdvance = (
    advanceId
  ) => {
    setAdvances((previous) =>
      previous.map((advance) => {
        if (
          String(advance.id) !==
          String(advanceId)
        ) {
          return advance;
        }

        const amount = Number(
          advance.amount || 0
        );

        return {
          ...advance,

          status: "Approved",

          deducted: amount,

          balance: 0,

          approvedAt:
            new Date().toISOString(),
        };
      })
    );
  };

  /* ===================================================
     DELETE ADVANCE
  =================================================== */

  const deleteAdvance = (
    advanceId
  ) => {
    setAdvances((previous) =>
      previous.filter(
        (advance) =>
          String(advance.id) !==
          String(advanceId)
      )
    );
  };

  /* ===================================================
     GET EMPLOYEE
  =================================================== */

  const getEmployeeById = (
    employeeId
  ) => {
    return employees.find(
      (employee) =>
        String(employee.id) ===
        String(employeeId)
    );
  };

  /* ===================================================
     EMPLOYEE ADVANCE TOTAL
  =================================================== */

  const getEmployeeAdvance = (
    employeeId
  ) => {
    return advances
      .filter(
        (advance) =>
          String(
            advance.employeeId
          ) === String(employeeId) &&
          advance.status ===
            "Approved"
      )
      .reduce(
        (total, advance) =>
          total +
          Number(
            advance.amount || 0
          ),
        0
      );
  };

  /* ===================================================
     CONTEXT VALUE
  =================================================== */

  const value = useMemo(
    () => ({
      /* Data */

      employees,
      attendance,
      advances,

      /* Employee */

      addEmployee,
      updateEmployee,
      deleteEmployee,
      getEmployeeById,

      /* Attendance */

      addAttendance,
      updateAttendance,
      deleteAttendance,

      /* Advance */

      addAdvance,
      updateAdvance,
      approveAdvance,
      deleteAdvance,
      getEmployeeAdvance,
    }),
    [
      employees,
      attendance,
      advances,
    ]
  );

  return (
    <AppDataContext.Provider
      value={value}
    >
      {children}
    </AppDataContext.Provider>
  );
}

/* =====================================================
   useAppData HOOK
===================================================== */

export function useAppData() {
  const context =
    useContext(
      AppDataContext
    );

  if (!context) {
    throw new Error(
      "useAppData must be used inside AppDataProvider"
    );
  }

  return context;
}

export default AppDataContext;