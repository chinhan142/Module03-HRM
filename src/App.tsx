// src/App.tsx
import React, { useEffect } from "react";
import RouteConfig from "./routes/RouteConfig";
import { useAppDispatch } from "./store";
import { getUserProfileThunk } from "./store/slices/auth.slice";

export default function App() {
  const dispatch = useAppDispatch();

  // Khôi phục phiên làm việc từ LocalStorage Token khi nạp App
  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, [dispatch]);

  return <RouteConfig />;
}
