// src/lib/invoiceApi.js
import api from "../axios";

// // Generate invoice PDF
// export async function generateInvoice(invoice, company, customer) {
//   const payload = { ...invoice, company, customer };

//   const response = await api.post("/invoices/generate", payload, {
//     responseType: "blob", // we expect a PDF
//   });

//   return response.data; // return blob data
// }

// Generate invoice PDF
export async function generateInvoice(payload) {
  const response = await api.post("/invoices/generate", payload, {
    responseType: "blob", // we expect a PDF
  });

  return response.data; // return blob data
}

export const getInvoiceList = async (data) => {
    const response = await api.post(`/invoices`, data)
    return response.data
}

export const getInvoiceById = async (data) => {
  const response = await api.post(`/invoices/preview`, data, {
    responseType: "blob", // we expect a PDF
  })

  return response.data
}