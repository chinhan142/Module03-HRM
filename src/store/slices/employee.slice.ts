import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Employee, Gender, UserRole } from "../../types/user.interface";
import { EmployeeService } from "../../services/employee.service";

interface EmployeeState {
  employee: Employee | null;
  employeeList: Employee[] | null;
}

const initialEmployeeState: EmployeeState = {
  employee: null,
  employeeList: null,
};

export const getAllEmployeeThunk = createAsyncThunk(
  "employee/get",
  async (_, { rejectWithValue }) => {
    try {
      const employeeList = await EmployeeService.getAllEmployees();
      return employeeList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const addEmployeeThunk = createAsyncThunk(
  "employee/add",
  async (, { rejectWithValue }) => {
    try {
      const employee = await EmployeeService.addEmployee();
    } catch (error) {}
  },
);
