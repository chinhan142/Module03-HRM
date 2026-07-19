import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "../../types/user.interface";
import { EmployeeService } from "../../services/employee.service";

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  searchKeyword: string;
  filterGender: string;
  filterRole: string;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
  searchKeyword: "",
  filterGender: "ALL",
  filterRole: "ALL",
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
  async (employeeData: Omit<Employee, "id">, { rejectWithValue }) => {
    try {
      const newEmployee = await EmployeeService.addEmployee(employeeData);
      return newEmployee;
    } catch (error: any) {
      return rejectWithValue(error.message || "Fail to add employee");
    }
  },
);

export const updateEmployeeThunk = createAsyncThunk(
  "employee/update",
  async (
    { id, data }: { id: string; data: Omit<Employee, "id"> },
    { rejectWithValue },
  ) => {
    try {
      const updatedEmployee = await EmployeeService.updateEmployee(id, data);
      return updatedEmployee;
    } catch (error: any) {
      return rejectWithValue(error.message || "Fail to update employee");
    }
  },
);

export const deleteEmployeeThunk = createAsyncThunk(
  "employee/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await EmployeeService.deleteEmployee(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Fail to delete employee");
    }
  },
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    // Action for keyword and filter function
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload;
    },
    setFilterGender: (state, action: PayloadAction<string>) => {
      state.filterGender = action.payload;
    },
    setFilterRole: (state, action: PayloadAction<string>) => {
      state.filterRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Builder for get all employee thunk
    builder
      .addCase(getAllEmployeeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllEmployeeThunk.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(getAllEmployeeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Builder for adding employee thunk
    builder.addCase(addEmployeeThunk.fulfilled, (state, action: PayloadAction<Employee>) => {
      state.employees.unshift(action.payload);
    });

    // Builder for update employee thunk
    builder.addCase(updateEmployeeThunk.fulfilled, (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex(
        (e) => e.id === action.payload.id,
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    });

    // Builder for delete employee thunk
    builder.addCase(deleteEmployeeThunk.fulfilled, (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter((e) => e.id !== action.payload);
    });
  },
});

export const { setSearchKeyword, setFilterGender, setFilterRole } =
  employeeSlice.actions;
export default employeeSlice.reducer;
