import React from "react";
import { useAppSelector } from "../store";
import Spin from "antd/es/spin";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Use state from redux store
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Authentication checking..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }

  return <Outlet />;
}
