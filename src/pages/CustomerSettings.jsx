import { useFormManager } from "../hooks/useFormManager";
import {
  createCustomer,
  getCustomers,
  deleteCustomer,
  updateCustomer,
} from "../lib/api/customerApi";

const customerApi = {
  create: createCustomer,
  getAll: getCustomers,
  remove: deleteCustomer,
  update: updateCustomer,
};

const initialCustomerForm = {
  name: "",
  address: "",
  phone: "",
  email: "",
  discount_rate: "",
};

export default function CustomerSettings() {
  const {
    items: customers,
    form,
    editingId,
    handleChange,
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,
  } = useFormManager(customerApi, initialCustomerForm);

  // transform payload for save
  const saveCustomer = () =>
    handleSave((form) => ({
      ...form,
      company_id: "2", // fixed company for now
      discount_rate: form.discount_rate
        ? parseFloat(form.discount_rate) / 100
        : 0,
    }));

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Customer Settings</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Name"
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
          type="number"
          placeholder="Discount Rate (%)"
          value={form.discount_rate}
          onChange={(e) => handleChange("discount_rate", e.target.value)}
          className="border rounded p-2"
        />

        <div className="col-span-2 flex gap-2">
          <button
            onClick={saveCustomer}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Customer" : "Save Customer"}
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
      <h2 className="mt-6 text-lg font-semibold">Saved Customers</h2>
      <ul className="mt-2 bg-white p-4 rounded-lg shadow-md divide-y">
        {customers.map((c) => (
          <li
            key={c.id}
            className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded"
          >
            <span
              className="cursor-pointer"
              onClick={() =>
                handleEdit(c, (item) => ({
                  ...item,
                  discount_rate: item.discount_rate
                    ? item.discount_rate * 100
                    : "",
                }))
              }
              title="Click to edit"
            >
              {c.name} – {c.email} – {c.discount_rate * 100}%
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
