import { useFormManager } from "../hooks/useFormManager";
import {
  createCompany,
  getCompanies,
  deleteCompany,
  updateCompany,
} from "../lib/api/companyApi";

const companyApi = {
  create: createCompany,
  getAll: getCompanies,
  remove: deleteCompany,
  update: updateCompany,
};

const initialCompanyForm = {
  name: "",
  address: "",
  phone: "",
  email: "",
  tax_number: "",
  bank: "",
  account: "",
  logo_url: "",
  logo_base64: "",
  currency: "MYR",
  tax_rate: 0, // ✅ added field
};

export default function CompanySettings() {
  const {
    items: companies,
    form,
    editingId,
    handleChange,
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,
  } = useFormManager(companyApi, initialCompanyForm);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Company Settings</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Company Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Tax Number"
          value={form.tax_number}
          onChange={(e) => handleChange("tax_number", e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Tax Rate (%)"
          value={form.tax_rate * 100}
          onChange={(e) =>
            handleChange("tax_rate", (parseFloat(e.target.value) || 0) / 100)
          } 
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Currency (e.g. MYR)"
          value={form.currency}
          onChange={(e) => handleChange("currency", e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Bank"
          value={form.bank}
          onChange={(e) => handleChange("bank", e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Account Number"
          value={form.account}
          onChange={(e) => handleChange("account", e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Logo URL"
          value={form.logo_url}
          onChange={(e) => handleChange("logo_url", e.target.value)}
          className="border rounded p-2"
        />

        <div className="col-span-2 flex gap-2">
          <button
            onClick={() => handleSave()}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Company" : "Save Company"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <h2 className="mt-6 text-lg font-semibold">Saved Companies</h2>
      <ul className="mt-2 bg-white p-4 rounded-lg shadow-md divide-y">
        {companies.map((c) => (
          <li
            key={c.id}
            className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded"
          >
            <span
              className="cursor-pointer"
              onClick={() => handleEdit(c)}
              title="Click to edit"
            >
              {c.name} – {c.email} – Tax: {c.tax_rate * 100}%
            </span>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
