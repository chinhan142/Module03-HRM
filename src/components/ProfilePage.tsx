// src/components/ProfilePage.tsx
import React, { useEffect, useMemo } from "react";
import { Layout, Card, Descriptions, Tag, Avatar, Typography, Alert } from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  WomanOutlined,
  ManOutlined,
} from "@ant-design/icons";
import HeaderNavbar from "./HeaderNavbar";
import { useAppDispatch, useAppSelector } from "../store";
import { getAllEmployeeThunk } from "../store/slices/employee.slice";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { employees } = useAppSelector((state) => state.employee);

  // Tự động lấy danh sách nhân viên để khớp thông tin chi tiết của user đang đăng nhập
  useEffect(() => {
    dispatch(getAllEmployeeThunk());
  }, [dispatch]);

  // Tìm thông tin chi tiết nhân viên có email trùng với user đăng nhập
  const currentEmployee = useMemo(() => {
    if (!user) return null;
    return employees.find((emp) => emp.email === user.email);
  }, [user, employees]);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <HeaderNavbar />

      <Content style={{ padding: "36px 48px", display: "flex", justifyContent: "center" }}>
        <Card
          style={{ width: "100%", maxWidth: 700, borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
        >
          {/* Avatar & Header Profile */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <Avatar
              size={95}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff", marginBottom: 12, boxShadow: "0 4px 12px rgba(24,144,255,0.3)" }}
            />
            <Title level={3} style={{ margin: 0 }}>
              {currentEmployee?.fullName || "Hồ Sơ Cá Nhân"}
            </Title>
            <Text type="secondary">Thông tin nhân viên hệ thống HRM</Text>
          </div>

          {/* Thông báo phân quyền */}
          <Alert
            message="Thông báo phân quyền (View-Only)"
            description="Tài khoản Nhân viên chỉ có quyền xem thông tin cá nhân. Mọi thao tác cập nhật hoặc chỉnh sửa phải được thực hiện bởi Quản trị viên (Admin / HR)."
            type="info"
            showIcon
            style={{ marginBottom: 24, borderRadius: 6 }}
          />

          {/* Chi tiết thông tin cá nhân đầy đủ */}
          <Descriptions
            bordered
            column={1}
            size="middle"
            labelStyle={{ width: "190px", fontWeight: "bold", background: "#fafafa" }}
          >
            <Descriptions.Item label={<><UserOutlined /> Họ và tên</>}>
              <Text strong>{currentEmployee?.fullName || "Chưa cập nhật"}</Text>
            </Descriptions.Item>

            <Descriptions.Item label={<><MailOutlined /> Địa chỉ Email</>}>
              {user?.email}
            </Descriptions.Item>

            <Descriptions.Item label={<><ManOutlined /> Giới tính</>}>
              {currentEmployee?.gender === "MALE" ? (
                <Tag color="green">Nam</Tag>
              ) : currentEmployee?.gender === "FEMALE" ? (
                <Tag color="magenta">Nữ</Tag>
              ) : (
                <Tag color="purple">Khác</Tag>
              )}
            </Descriptions.Item>

            <Descriptions.Item label={<><CalendarOutlined /> Ngày sinh</>}>
              {currentEmployee?.dob || "Chưa cập nhật"}
            </Descriptions.Item>

            <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ cư trú</>}>
              {currentEmployee?.address || "Chưa cập nhật"}
            </Descriptions.Item>

            <Descriptions.Item label={<><SafetyCertificateOutlined /> Vai trò (Role)</>}>
              <Tag color={user?.role === "ADMIN" ? "red" : "blue"} style={{ fontSize: "13px", padding: "2px 8px" }}>
                {user?.role}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label={<><IdcardOutlined /> ID Nhân viên</>}>
              {currentEmployee?.id || user?.id}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Content>
    </Layout>
  );
}
