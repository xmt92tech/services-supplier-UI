import { BrowserRouter as Router, Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CompanySettings from "./pages/CompanySettings";
import CustomerSettings from "./pages/CustomerSettings";
import InvoiceHist from "./pages/InvoiceHist";
import InvoiceForm from "./pages/InvoiceForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { userLogout, setNavigate } from "./lib/api/authApi";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

// Navbar Component
function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    userLogout(); // clear token
    navigate("/login"); // redirect to login page
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/" className="font-medium hover:text-blue-600">
          Invoice
        </Link>
        <Link to="/invoiceHist" className="font-medium hover:text-blue-600">
          Invoice History
        </Link>
        <Link to="/companies" className="font-medium hover:text-blue-600">
          Company Settings
        </Link>
        <Link to="/customers" className="font-medium hover:text-blue-600">
          Customer Settings
        </Link>
      </div>
      {localStorage.getItem("token") && (
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      )}
    </nav>
  );
}

// Layout for protected pages
function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        <Outlet /> {/* renders child routes */}
      </div>
    </div>
  );
}

// Layout for auth pages (login/register/forgot-password)
function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Outlet /> {/* renders login/register */}
      </div>
    </div>
  );
}

function AppLayout() {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "HongLim Workshop",
      address: "123 Street, City",
      phone: "012-3456789",
      email: "info@mycompany.com",
      currency: "MYR",
      bank: "HongLeong Bank",
      account: "1234567890",
      logoUrl:
        "https://raw.githubusercontent.com/ximingtech/company-assets/main/HongLimCarSprayLogo.png",
      logoBase64: null,
    },
  ]);

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      address: "456 Avenue, City",
      phone: "098-7654321",
      email: "john@example.com",
    },
  ]);

  const navigate = useNavigate();
  
  useEffect(() => {
    setNavigate(navigate); // makes navigate available globally
  }, [navigate]);

  return (
    <Routes>
      {/* Auth routes (standalone) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        {/* You can add register/forgot-password here later */}
      </Route>

      {/* Protected routes with navbar */}
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <InvoiceForm companies={companies} customers={customers} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoiceHist"
          element={
            <ProtectedRoute>
              <InvoiceHist/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <CompanySettings companies={companies} setCompanies={setCompanies} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomerSettings customers={customers} setCustomers={setCustomers} />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  // const [companies, setCompanies] = useState([
  //   {
  //     id: 1,
  //     name: "HongLim Workshop",
  //     address: "123 Street, City",
  //     phone: "012-3456789",
  //     email: "info@mycompany.com",
  //     currency: "MYR",
  //     bank: "HongLeong Bank",
  //     account: "1234567890",
  //     logoUrl:
  //       "https://raw.githubusercontent.com/ximingtech/company-assets/main/HongLimCarSprayLogo.png",
  //     logoBase64: null,
  //   },
  // ]);

  // const [customers, setCustomers] = useState([
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     address: "456 Avenue, City",
  //     phone: "098-7654321",
  //     email: "john@example.com",
  //   },
  // ]);

  // const navigate = useNavigate();
  
  // useEffect(() => {
  //   setNavigate(navigate); // makes navigate available globally
  // }, [navigate]);

  return (
    <Router>
      <AppLayout />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}
