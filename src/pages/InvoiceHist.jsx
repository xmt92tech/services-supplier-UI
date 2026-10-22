// import {
//   getInvoiceList,
//   getInvoiceById
// } from "../lib/api/invoiceApi";

// const invoiceApi = {
//   getAll: getInvoiceList,
//   getById: getInvoiceById,
// };

// const initialInvoice = {
//   datefrm: "",
//   dateto: "",
// };

// export default function InvoiceHist() {
//     const {
//         items: invoices,
//         form,
//         handleSearch,
//         handlePreview,
//         resetForm,
//       } = useFormManager(invoiceApi, initialInvoice);

//     return (
//         <div className="p-6">
//             <h1 className="text-xl font-bold mb-4">Invoice History</h1>

//             {/* Filter Section */}
//             <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex gap-4">
//                 <div>
//                 <label className="block text-sm mb-1">From Date</label>
//                 <input
//                     type="date"
//                     value={filters.datefrm}
//                     onChange={(e) =>
//                     setFilters({
//                         ...filters,
//                         datefrm: e.target.value,
//                     })
//                     }
//                     className="border rounded px-3 py-2"
//                 />
//                 </div>

//                 <div>
//                 <label className="block text-sm mb-1">To Date</label>
//                 <input
//                     type="date"
//                     value={filters.dateto}
//                     onChange={(e) =>
//                     setFilters({
//                         ...filters,
//                         dateto: e.target.value,
//                     })
//                     }
//                     className="border rounded px-3 py-2"
//                 />
//                 </div>

//                 <div className="flex items-end">
//                 <button
//                     onClick={fetchInvoices}
//                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                     Search
//                 </button>
//                 </div>
//             </div>

//             <ul className="mt-2 bg-white p-4 rounded-lg shadow-md divide-y">
//                 {invoices.map((c) => (
//                 <li
//                     key={c.id}
//                     className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded"
//                 >
//                     {/* <span
//                     className="cursor-pointer"
//                     onClick={() =>
//                         handleEdit(c, (item) => ({
//                         ...item,
//                         discount_rate: item.discount_rate
//                             ? item.discount_rate * 100
//                             : "",
//                         }))
//                     }
//                     title="Click to edit"
//                     >
//                     {c.name} – {c.email} – {c.discount_rate * 100}%
//                     </span> */}
//                     <span>
//                         {c.invoice_number}
//                     </span>
//                     <button
//                     onClick={() => handlePreview(c.invoice_id)}
//                     className="text-red-600 hover:text-red-800 text-sm"
//                     >
//                     Preview
//                     </button>
//                 </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import { openOrDownloadPdf } from "../lib/pdfUtils";
import { getInvoiceList, getInvoiceById } from "../lib/api/invoiceApi";

const initialInvoice = {
  datefrm: new Date().toISOString().slice(0, 10),
  dateto: new Date().toISOString().slice(0, 10),
};

export default function InvoiceHist() {
  const [filters, setFilters] = useState(initialInvoice);
  const [invoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getInvoiceList(filters);

      setInvoiceList(response || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load invoice list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
    };

    const handlePreview = async (mode, id) => {
      try {
        const pdfBlob = await getInvoiceById(id);
        openOrDownloadPdf(pdfBlob, mode, `invoice.pdf`);
      } catch (err) {
        console.error(err);
        alert("Error preview invoice");
      }
    };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Invoice History</h1>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex gap-4">
        <div>
          <label className="block text-sm mb-1">From Date</label>
          <input
            type="date"
            value={filters.datefrm}
            onChange={(e) =>
              setFilters({
                ...filters,
                datefrm: e.target.value,
              })
            }
            className="border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">To Date</label>
          <input
            type="date"
            value={filters.dateto}
            onChange={(e) =>
              setFilters({
                ...filters,
                dateto: e.target.value,
              })
            }
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={fetchInvoices}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          Loading invoices...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Invoice Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Invoice No</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-right p-3"></th>
              </tr>
            </thead>

            <tbody>
              {invoiceList.length > 0 ? (
                invoiceList.map((invoice) => (
                  <tr
                    key={invoice.invoice_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">{invoice.invoice_number}</td>
                    <td className="p-3">{invoice.customer_name}</td>
                    <td className="p-3">{formatDate(invoice.invoice_date)}</td>
                    <td className="p-3">
                      RM {Number(invoice.total).toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                        <button
                            onClick={() => {
                                const selectedInv = {
                                invoice_id: invoice.invoice_id,
                                };
                                handlePreview("preview", selectedInv);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                            >
                            Preview
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-6 text-gray-500"
                  >
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}