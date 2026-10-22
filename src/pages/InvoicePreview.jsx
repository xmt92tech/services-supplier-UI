import { useEffect, useState } from "react";
import { getCustomerById } from "../lib/api/customerApi";
import { getCompanyById } from "../lib/api/companyApi";

export default function InvoicePreview({
  invoice,
  selectedCompanyId,
  selectedCustomerId,
}) {
  const [company, setCompany] = useState(null);
  const [customer, setCustomer] = useState(null);

  // Fetch company details when selectedCompanyId changes
  useEffect(() => {
    if (selectedCompanyId) {
      getCompanyById(selectedCompanyId).then((data) => setCompany(data));
    }
  }, [selectedCompanyId]);

  // Fetch customer details when selectedCustomerId changes
  useEffect(() => {
    if (selectedCustomerId) {
      getCustomerById(selectedCustomerId).then((data) => setCustomer(data));
    }
  }, [selectedCustomerId]);

  // Calculate amounts (discount_rate comes from customer, tax_rate comes from company)
  const subtotal = invoice.items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );
  const discountRate = customer?.discount_rate || 0;
  const taxRate = company?.tax_rate || 0;

  const discount = subtotal * discountRate;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * taxRate;
  const grandTotal = taxableAmount + tax;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md overflow-y-auto max-h-[80vh] text-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-3">
            {company?.logo_url ? (
              <img src={company.logo_url} alt="logo" className="h-12 w-auto" />
            ) : null}
            <div>
              <h2 className="text-lg font-bold">
                {company?.name || "Company Name"}
              </h2>
              <p>{company?.address || "Company Address"}</p>
              <p>Tel: {company?.phone || "Company Phone"}</p>
              <p>Email: {company?.email || "Company Email"}</p>
            </div>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="text-right text-sm space-y-1">
          <p>
            <span className="font-medium">Invoice #:</span>{" "}
            {invoice.invoice_number}
          </p>
          <p>
            <span className="font-medium">Date :</span> {invoice.date2}
          </p>
          <p>
            <span className="font-medium">Reference :</span>{" "}
            {invoice.reference || "-"}
          </p>
          <p>
            <span className="font-medium">DO Number :</span>{" "}
            {invoice.do_number || "-"}
          </p>
          <p>
            <span className="font-medium">Terms :</span>{" "}
            {invoice.terms || "-"}
          </p>
          <p>
            <span className="font-medium">Page :</span> 1 of 1
          </p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-6">
        <h3 className="font-medium">Bill To:</h3>
        {customer ? (
          <div>
            <p className="font-semibold">{customer?.name}</p>
            <p>{customer?.address}</p>
            <p>Tel: {customer?.phone}</p>
            <p>Email: {customer?.email}</p>
          </div>
        ) : (
          <p>No customer selected</p>
        )}
      </div>

      {/* Items Table */}
      <div className="border border-gray-300">
        {/* Header Row */}
        <div className="grid grid-cols-6 bg-gray-100 font-semibold p-2 border-b border-gray-300">
          <div>#</div>
          <div>Item/Service</div>
          <div>Description</div>
          <div className="text-right">Qty</div>
          <div className="text-right">Price</div>
          <div className="text-right">Total</div>
        </div>

        {/* Item Rows */}
        {invoice.items.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-6 p-2 border-b border-gray-200"
          >
            <div>{idx + 1}</div>
            <div>{item.name}</div>
            <div>{item.description}</div>
            <div className="text-right">{item.quantity}</div>
            <div className="text-right">${item.price.toFixed(2)}</div>
            <div className="text-right">
              ${(item.quantity * item.price).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex justify-end mt-4">
        <div className="w-1/3 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount ({(discountRate * 100).toFixed(0)}%):</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({(taxRate * 100).toFixed(0)}%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Grand Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
