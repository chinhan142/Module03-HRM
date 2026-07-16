import type { Employee } from "../types/user.interface";
import api from "./api";

export const EmployeeService = {
  getAllEmployees: async () => {
    const employeeList = await api.get(`/employees`);

    return employeeList.data;
  },

  addEmployee: async (employeeData: Omit<Employee, "id">) => {
    // Omit: auto omit the id of the employee, which means when the FE send the data payload, it doesn't need the id fields
    const response = await api.post(`/employees`, employeeData);
    return response.data;
  },

  updateEmployee: async (id: string, employeeData: Employee) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id: string) => {
    const response = await api.delete(`/employees/${id}`);
    return response.status;
  },
};
