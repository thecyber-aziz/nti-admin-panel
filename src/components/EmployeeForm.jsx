import { useEffect, useState } from "react";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  BriefcaseBusiness,
  CalendarDays,
  IndianRupee,
  Upload,
  X,
} from "lucide-react";

const defaultForm = {
  name: "",
  fatherName: "",
  phone: "",
  email: "",
  department: "Production",
  designation: "",
  joiningDate: "",
  monthlySalary: "",

  address: "",
  city: "",
  state: "",
  pincode: "",

  aadhaarNumber: "",
  aadhaarName: "",
  aadhaarDob: "",
  aadhaarGender: "",
  aadhaarAddress: "",

  photo: "",
};

export default function EmployeeForm({
  initialData,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(
    initialData
      ? {
          ...defaultForm,
          ...initialData,
        }
      : defaultForm
  );

  const [photoPreview, setPhotoPreview] = useState(
    initialData?.photo || ""
  );

  useEffect(() => {
    if (initialData) {
      setForm({
        ...defaultForm,
        ...initialData,
      });

      setPhotoPreview(initialData.photo || "");
    } else {
      setForm(defaultForm);
      setPhotoPreview("");
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Photo size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const image = reader.result;

      setPhotoPreview(image);

      setForm((previous) => ({
        ...previous,
        photo: image,
      }));
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview("");

    setForm((previous) => ({
      ...previous,
      photo: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.designation.trim() ||
      !form.monthlySalary
    ) {
      alert(
        "Please fill Employee Name, Phone, Designation and Monthly Salary."
      );

      return;
    }

    if (
      form.aadhaarNumber &&
      form.aadhaarNumber.replace(/\D/g, "").length !== 12
    ) {
      alert("Aadhaar number must contain 12 digits.");
      return;
    }

    onSubmit({
      ...form,
      monthlySalary: Number(form.monthlySalary),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 bg-white"
    >
      {/* PROFILE PHOTO */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-800">
            Employee Profile
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Upload employee passport-size photograph and basic information.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 shadow-sm">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Employee"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User
                  size={48}
                  className="text-slate-400"
                />
              )}
            </div>

            {photoPreview && (
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
              <Upload size={17} />

              {photoPreview
                ? "Change Photo"
                : "Upload Photo"}

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>

            <p className="mt-2 text-xs text-slate-500">
              JPG or PNG • Maximum 2MB
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Recommended: passport-size photo
            </p>
          </div>
        </div>
      </section>

      {/* PERSONAL INFORMATION */}
      <section className="rounded-2xl border border-slate-200 p-5">
        <SectionTitle
          icon={<User size={19} />}
          title="Personal Information"
          description="Basic employee information"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputField
            label="Employee Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />

          <InputField
            label="Father's Name"
            name="fatherName"
            value={form.fatherName}
            onChange={handleChange}
            placeholder="Enter father's name"
          />

          <InputField
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter 10 digit phone number"
            maxLength={10}
            required
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="employee@email.com"
          />
        </div>
      </section>

      {/* JOB INFORMATION */}
      <section className="rounded-2xl border border-slate-200 p-5">
        <SectionTitle
          icon={<BriefcaseBusiness size={19} />}
          title="Job Information"
          description="Department, designation and salary details"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <SelectField
            label="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
            options={[
              "Production",
              "Maintenance",
              "Quality",
              "Store",
              "Accounts",
              "HR",
              "Administration",
            ]}
          />

          <InputField
            label="Designation"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            placeholder="Machine Operator"
            required
          />

          <InputField
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={form.joiningDate}
            onChange={handleChange}
          />

          <InputField
            label="Monthly Salary"
            name="monthlySalary"
            type="number"
            value={form.monthlySalary}
            onChange={handleChange}
            placeholder="25000"
            min="0"
            required
          />
        </div>
      </section>

      {/* ADDRESS */}
      <section className="rounded-2xl border border-slate-200 p-5">
        <SectionTitle
          icon={<MapPin size={19} />}
          title="Address Details"
          description="Employee residential address"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextAreaField
              label="Full Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House number, street, village / locality..."
            />
          </div>

          <InputField
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Faridabad"
          />

          <InputField
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="Haryana"
          />

          <InputField
            label="PIN Code"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="121001"
            maxLength={6}
          />
        </div>
      </section>

      {/* AADHAAR */}
      <section className="rounded-2xl border border-slate-200 p-5">
        <SectionTitle
          icon={<CreditCard size={19} />}
          title="Aadhaar Details"
          description="Employee identification information"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputField
            label="Aadhaar Number"
            name="aadhaarNumber"
            value={form.aadhaarNumber}
            onChange={handleChange}
            placeholder="XXXX XXXX XXXX"
            maxLength={12}
          />

          <InputField
            label="Name on Aadhaar"
            name="aadhaarName"
            value={form.aadhaarName}
            onChange={handleChange}
            placeholder="Name as printed on Aadhaar"
          />

          <InputField
            label="Date of Birth"
            name="aadhaarDob"
            type="date"
            value={form.aadhaarDob}
            onChange={handleChange}
          />

          <SelectField
            label="Gender"
            name="aadhaarGender"
            value={form.aadhaarGender}
            onChange={handleChange}
            options={[
              "Male",
              "Female",
              "Other",
            ]}
            placeholder="Select gender"
          />

          <div className="md:col-span-2">
            <TextAreaField
              label="Aadhaar Address"
              name="aadhaarAddress"
              value={form.aadhaarAddress}
              onChange={handleChange}
              placeholder="Address as mentioned on Aadhaar"
            />
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 py-4 backdrop-blur sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          {initialData
            ? "Update Employee"
            : "Add Employee"}
        </button>
      </div>
    </form>
  );
}

/* ---------------- HELPERS ---------------- */

function SectionTitle({
  icon,
  title,
  description,
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
        {icon}
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-800">
          {title}
        </h3>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function InputField({
  label,
  required,
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <input
          {...props}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
        />
      </div>
    </div>
  );
}

function TextAreaField({
  label,
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        {...props}
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
      />
    </div>
  );
}

function SelectField({
  label,
  options,
  placeholder,
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        {...props}
        className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}