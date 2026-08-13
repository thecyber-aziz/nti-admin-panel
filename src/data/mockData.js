export const initialEmployees = [

  {
    id: "NTI-001",

    name: "Rahul Kumar",

    fatherName:
      "Ramesh Kumar",

    phone:
      "9876543210",

    department:
      "Production",

    designation:
      "Machine Operator",

    joiningDate:
      "2025-04-12",

    monthlySalary:
      25000,

    status:
      "Active"
  },

  {
    id: "NTI-002",

    name: "Amit Singh",

    fatherName:
      "Mahesh Singh",

    phone:
      "9876501234",

    department:
      "Maintenance",

    designation:
      "Technician",

    joiningDate:
      "2025-06-01",

    monthlySalary:
      28000,

    status:
      "Active"
  },

  {
    id: "NTI-003",

    name: "Suresh Yadav",

    fatherName:
      "Ram Yadav",

    phone:
      "9876512345",

    department:
      "Production",

    designation:
      "Helper",

    joiningDate:
      "2026-01-15",

    monthlySalary:
      22000,

    status:
      "Active"
  }

];

export const initialAttendance = [

  {
    employeeId:
      "NTI-001",

    date:
      "2026-08-08",

    status:
      "Present",

    checkIn:
      "09:00",

    checkOut:
      "18:00",

    overtimeHours:
      2
  },

  {
    employeeId:
      "NTI-002",

    date:
      "2026-08-08",

    status:
      "Present",

    checkIn:
      "08:55",

    checkOut:
      "18:00",

    overtimeHours:
      0
  },

  {
    employeeId:
      "NTI-003",

    date:
      "2026-08-08",

    status:
      "Half Day",

    checkIn:
      "09:00",

    checkOut:
      "13:00",

    overtimeHours:
      0
  }

];

export const initialAdvances = [

  {
    id:
      "ADV-100001",

    employeeId:
      "NTI-001",

    date:
      "2026-08-02",

    amount:
      5000,

    deducted:
      0,

    balance:
      5000,

    reason:
      "Personal requirement"
  }

];