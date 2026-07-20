// src/components/LoginPage.tsx
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../store";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { clearAuthError, loginThunk } from "../store/slices/auth.slice";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useFormik } from "formik";

const { Title, Text } = Typography;

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string().required("Vui lòng nhập mật khẩu"),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  // Using useEffect to listen to the changes from redux to automatically handling routes or pop up toast
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  // Using formik and yup for form filling and handle input validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      // Dispatch thunk đăng nhập
      const result = await dispatch(loginThunk(values));
      if (loginThunk.fulfilled.match(result)) {
        message.success("Đăng nhập thành công!");
        navigate("/dashboard");
      }
    },
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 4 }}>
            Đăng Nhập System
          </Title>
          <Text type="secondary">Quản Lý Nhân Sự (HRM Web App)</Text>
        </div>
        <Form layout="vertical" onFinish={formik.handleSubmit}>
          {/* Ô Email */}
          <Form.Item
            label="Email"
            validateStatus={
              formik.touched.email && formik.errors.email ? "error" : ""
            }
            help={formik.touched.email && formik.errors.email}
          >
            <Input
              prefix={<UserOutlined />}
              name="email"
              placeholder="admin@finalproject.com"
              size="large"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Item>
          {/* Ô Mật khẩu */}
          <Form.Item
            label="Mật khẩu"
            validateStatus={
              formik.touched.password && formik.errors.password ? "error" : ""
            }
            help={formik.touched.password && formik.errors.password}
          >
            <Input.Password
              prefix={<LockOutlined />}
              name="password"
              placeholder="AdminPassword123!"
              size="large"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Item>
          {/* Nút Submit */}
          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
