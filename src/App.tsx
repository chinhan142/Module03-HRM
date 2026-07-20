// src/App.tsx
import React, { useEffect } from "react";
import RouteConfig from "./routes/RouteConfig";
import { useAppDispatch } from "./store";
import { getUserProfileThunk } from "./store/slices/auth.slice";

export default function App() {
  const dispatch = useAppDispatch();

  // Restore user session from LocalStorage Token on App mount
  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, [dispatch]);

  return <RouteConfig />;
}
