import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../components/Dashboard";
import LoginPage from "../components/LoginPage";

export default function RouteConfig() {
  // Using Route to routing those url
  // Each route has: path: the url leading to; element: the component of that route
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Private route */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Wrong url or homepage -> leading back to dashboard */}
      <Route path="*" element={<Navigate to={"/dashboard"} replace />} />
    </Routes>
  );
}
