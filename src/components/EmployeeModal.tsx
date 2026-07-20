// src/components/EmployeeModal.tsx
import React from "react";
import { Modal, Form, Input, Select, DatePicker, message } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import type { Employee, Gender, UserRole } from "../types/user.interface";
import { useAppDispatch } from "../store";
import { addEmployeeThunk, updateEmployeeThunk } from "../store/slices/employee.slice";

interface EmployeeModalProps {
  open: boolean;
  editingEmployee: Employee | null;
  onClose: () => void;
}

// Strict Formik + Yup Validation Schema
const validationSchema = Yup.object({
  fullName: Yup.string().min(2, "Họ tên phải từ 2 ký tự").required("Vui lòng nhập họ tên"),
  email: Yup.string().email("Email không đúng định dạng").required("Vui lòng nhập email"),
  role: Yup.string().required("Vui lòng chọn vai trò"),
  gender: Yup.string().required("Vui lòng chọn giới tính"),
  dob: Yup.string().required("Vui lòng chọn ngày sinh"),
  address: Yup.string().required("Vui lòng nhập địa chỉ"),
});

export default function EmployeeModal({ open, editingEmployee, onClose }: EmployeeModalProps) {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: editingEmployee?.fullName || "",
      email: editingEmployee?.email || "",
      role: editingEmployee?.role || ("USER" as UserRole),
      gender: editingEmployee?.gender || ("MALE" as Gender),
      dob: editingEmployee?.dob || "",
      address: editingEmployee?.address || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingEmployee) {
          await dispatch(updateEmployeeThunk({ id: editingEmployee.id, data: values })).unwrap();
          message.success("Cập nhật thông tin nhân viên thành công!");
        } else {
          await dispatch(addEmployeeThunk(values)).unwrap();
          message.success("Thêm nhân viên mới thành công!");
        }
        formik.resetForm();
        onClose();
      } catch (err: any) {
        message.error(err || "Thao tác thất bại!");
      }
    },
  });

  return (
    <Modal
      title={editingEmployee ? "Cập Nhật Thông Tin Nhân Viên" : "Thêm Nhân Viên Mới"}
      open={open}
      onCancel={() => {
        formik.resetForm();
        onClose();
      }}
      onOk={() => formik.handleSubmit()}
      okText={editingEmployee ? "Lưu thay đổi" : "Thêm mới"}
      cancelText="Hủy"
    >
      <Form layout="vertical">
        <Form.Item label="Họ và tên" validateStatus={formik.touched.fullName && formik.errors.fullName ? "error" : ""} help={formik.touched.fullName && formik.errors.fullName}>
          <Input name="fullName" placeholder="Nguyễn Văn A" value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>

        <Form.Item label="Email" validateStatus={formik.touched.email && formik.errors.email ? "error" : ""} help={formik.touched.email && formik.errors.email}>
          <Input name="email" placeholder="example@gmail.com" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item label="Vai trò" style={{ flex: 1 }}>
            <Select value={formik.values.role} onChange={(val) => formik.setFieldValue("role", val)}>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
              <Select.Option value="USER">USER</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Giới tính" style={{ flex: 1 }}>
            <Select value={formik.values.gender} onChange={(val) => formik.setFieldValue("gender", val)}>
              <Select.Option value="MALE">Nam</Select.Option>
              <Select.Option value="FEMALE">Nữ</Select.Option>
              <Select.Option value="OTHER">Khác</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item label="Ngày sinh">
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" value={formik.values.dob ? dayjs(formik.values.dob) : null} onChange={(_, dateString) => formik.setFieldValue("dob", dateString)} />
        </Form.Item>

        <Form.Item label="Địa chỉ">
          <Input.TextArea name="address" rows={2} placeholder="Nhập địa chỉ cư trú" value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
