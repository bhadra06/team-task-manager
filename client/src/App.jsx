import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login    from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects  from "./pages/Projects";

// Route guards
const PrivateRoute = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" />;
  if (role !== "admin") return <Navigate to="/dashboard" />;
  return children;
};

const GuestRoute = ({ children }) => {
  return !localStorage.getItem("token") ? children : <Navigate to="/dashboard" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/login" element={
          <GuestRoute><Login /></GuestRoute>
        } />

        <Route path="/register" element={
          <GuestRoute><Register /></GuestRoute>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />

        <Route path="/projects" element={
          <AdminRoute><Projects /></AdminRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
