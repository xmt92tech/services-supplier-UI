import { useState, useEffect } from "react";
import InvoicePreview from "./InvoicePreview";
import { generateInvoice } from "../lib/api/invoiceApi";
import { openOrDownloadPdf } from "../lib/pdfUtils";
import { getCompanies } from "../lib/api/companyApi";
import { getCustomers, getCustomerById } from "../lib/api/customerApi";

export default function InvoiceForm() {
  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [invoice, setInvoice] = useState({
    reference: "",
    do_number: "",
    terms: "",
    date: new Date().toISOString().slice(0, 10),
    date2: new Date().toISOString().slice(0, 10),
    items: [{ name: "", description: "", quantity: 1, price: 0 }],
  });

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const data = await getCompanies();
        setCompanies(data);
        if (data.length > 0) setSelectedCompanyId(String(data[0].id));
      } catch (err) {
        console.error("Error fetching companies", err);
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const data = await getCustomers();
        setCustomers(data);
        if (data.length > 0) setSelectedCustomerId(String(data[0].id));
      } catch (err) {
        console.error("Error fetching customers", err);
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch full customer details when selectedCustomerId changes
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!selectedCustomerId) return;
      try {
        const customer = await getCustomerById(selectedCustomerId);
        setSelectedCustomer(customer);
      } catch (err) {
        console.error("Error fetching customer by id", err);
      }
    };
    fetchCustomerDetails();
  }, [selectedCustomerId]);

  const updateField = (path, value) => {
    const keys = path.split(".");
    setInvoice((prev) => {
      let copy = structuredClone(prev);
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", description: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // const handleGenerate = async (mode = "download") => {
  //   try {
  //     const company = companies.find((c) => String(c.id) === selectedCompanyId);
  //     const customer = selectedCustomer;

  //     if (!company || !customer) {
  //       alert("Please select both a company and a customer.");
  //       return;
  //     }

  //     const pdfBlob = await generateInvoice(invoice, company, customer);
  //     openOrDownloadPdf(pdfBlob, mode, `invoice.pdf`);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error generating invoice");
  //   }
  // };

  const handleGenerate = async (mode = "download") => {
  try {
    const company = companies.find((c) => String(c.id) === selectedCompanyId);
    const customer = selectedCustomer;

    if (!company || !customer) {
      alert("Please select both a company and a customer.");
      return;
    }

    // Clean API payload
    const payload = {
      company_id: company.id,
      customer_id: customer.id,
      date: invoice.date2,
      reference: invoice.reference,
      do_number: invoice.do_number,
      terms: invoice.terms,
      items: invoice.items.map((item) => ({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    console.log(payload);

    // Now just send payload
    const pdfBlob = await generateInvoice(payload);
    openOrDownloadPdf(pdfBlob, mode, `invoice.pdf`);
  } catch (err) {
    console.error(err);
    alert("Error generating invoice");
  }
};


  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* --- Form --- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">Invoice Form</h1>

        {/* Company + Customer Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium">Select Company</label>
            {loadingCompanies ? (
              <div className="p-2 text-gray-500 text-sm">Loading companies...</div>
            ) : (
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="border rounded p-2 w-full"
                disabled={companies.length === 0}
              >
                <option value="" disabled>
                  {companies.length === 0 ? "No companies found" : "Select company"}
                </option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">Select Customer</label>
            {loadingCustomers ? (
              <div className="p-2 text-gray-500 text-sm">Loading customers...</div>
            ) : (
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="border rounded p-2 w-full"
                disabled={customers.length === 0}
              >
                <option value="" disabled>
                  {customers.length === 0 ? "No customers found" : "Select customer"}
                </option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium">Reference</label>
            <input
              type="text"
              value={invoice.reference}
              onChange={(e) => updateField("reference", e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">DO Number</label>
            <input
              type="text"
              value={invoice.do_number}
              onChange={(e) => updateField("do_number", e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Terms</label>
            <input
              type="text"
              value={invoice.terms}
              onChange={(e) => updateField("terms", e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Date</label>
            <input
              type="date"
              value={invoice.date2}
              onChange={(e) => updateField("date2", e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
        </div>

        {/* Items */}
        <h2 className="font-semibold mt-4 mb-2">Items</h2>
        <button onClick={addItem} className="text-blue-600 text-sm hover:underline mb-2">
          + Add Item
        </button>

        {/* Header Row */}
        <div className="grid grid-cols-7 gap-2 font-semibold bg-gray-100 p-2 rounded text-sm">
          <div className="text-center">#</div>
          <div className="text-left">Item/Service</div>
          <div className="text-left">Description</div>
          <div className="text-right">Qty</div>
          <div className="text-right">Price</div>
          <div className="text-right">Total</div>
          <div className="text-center"></div>
        </div>

        {/* Item Rows */}
        {invoice.items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-7 gap-2 mb-2 items-center text-sm">
            <div className="text-center">{idx + 1}</div>

            <input
              type="text"
              placeholder="Name"
              value={item.name}
              onChange={(e) => updateField(`items.${idx}.name`, e.target.value)}
              className="border rounded p-1 w-full"
            />

            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateField(`items.${idx}.description`, e.target.value)}
              className="border rounded p-1 w-full"
            />

            <input
              type="number"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) =>
                updateField(`items.${idx}.quantity`, parseInt(e.target.value) || 0)
              }
              className="border rounded p-1 w-full text-right"
            />

            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) =>
                updateField(`items.${idx}.price`, parseFloat(e.target.value) || 0)
              }
              className="border rounded p-1 w-full text-right"
            />

            <div className="text-right font-medium">
              {(item.quantity * item.price).toFixed(2)}
            </div>

            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-red-600 hover:text-red-800 text-center"
            >
              ❌
            </button>
          </div>
        ))}

        {/* Grand Total */}
        <div className="grid grid-cols-7 gap-2 mt-4 font-semibold text-sm items-center">
          <div className="col-span-5 text-right">Grand Total:</div>
          <div className="text-right">
            {invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
          </div>
          <div></div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleGenerate("preview")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Preview Invoice
          </button>

          <button
            onClick={() => handleGenerate("download")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download Invoice
          </button>
        </div>
      </div>

      {/* --- Invoice Preview --- */}
      <InvoicePreview
        invoice={invoice}
        companies={companies}
        customers={customers}
        selectedCompanyId={selectedCompanyId}
        selectedCustomerId={selectedCustomerId}
      />
    </div>
  );
}
