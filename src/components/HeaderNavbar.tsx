// src/components/HeaderNavbar.tsx
import React from "react";
import { Layout, Button, Tag, Space, Avatar, Typography } from "antd";
import { UserOutlined, LogoutOutlined, TeamOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store";
import { logoutAction } from "../store/slices/auth.slice";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

export default function HeaderNavbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
  };

  return (
    <Header style={{ background: "#001529", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Space size="middle">
        <TeamOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
        <Text strong style={{ color: "#fff", fontSize: "18px" }}>
          Hệ Thống Quản Lý Nhân Sự (HRM)
        </Text>
      </Space>

      {user && (
        <Space size="large">
          <Space>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
            <Text style={{ color: "#fff" }}>{user.email}</Text>
            <Tag color={user.role === "ADMIN" ? "red" : "blue"}>{user.role}</Tag>
          </Space>

          <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Space>
      )}
    </Header>
  );
}
