// src/components/Dashboard.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Layout,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  message,
  Card,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import HeaderNavbar from "./HeaderNavbar";
import EmployeeModal from "./EmployeeModal";
import { useAppDispatch, useAppSelector } from "../store";
import {
  getAllEmployeeThunk,
  deleteEmployeeThunk,
  setSearchKeyword,
  setFilterGender,
  setFilterRole,
} from "../store/slices/employee.slice";
import type { Employee } from "../types/user.interface";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { employees, loading, searchKeyword, filterGender, filterRole } =
    useAppSelector((state) => state.employee);
  const { user } = useAppSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // If employee role is USER, redirect to profile page
  useEffect(() => {
    if (user?.role === "USER") {
      navigate("/profile");
    }
  }, [user, navigate]);

  // Automatically dispatch to fetch employee list on mount
  useEffect(() => {
    dispatch(getAllEmployeeThunk());
  }, [dispatch]);

  // Filter employee list by search keyword & filters
  const filteredEmployees = useMemo(() => {
    return (employees || []).filter((emp) => {
      const matchSearch =
        emp.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchKeyword.toLowerCase());

      const matchGender = filterGender === "ALL" || emp.gender === filterGender;
      const matchRole = filterRole === "ALL" || emp.role === filterRole;

      return matchSearch && matchGender && matchRole;
    });
  }, [employees, searchKeyword, filterGender, filterRole]);

  // Delete employee
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteEmployeeThunk(id)).unwrap();
      message.success("Employee deleted successfully!");
    } catch (err: any) {
      message.error(err || "Failed to delete employee!");
    }
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (record: Employee) => {
    setEditingEmployee(record);
    setModalOpen(true);
  };

  // Column definitions for Antd Table
  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a: Employee, b: Employee) =>
        a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "ADMIN" ? "red" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => {
        if (gender === "MALE") return <Tag color="green">Nam</Tag>;
        if (gender === "FEMALE") return <Tag color="magenta">Nữ</Tag>;
        return <Tag color="purple">Khác</Tag>;
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_: any, record: Employee) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenEditModal(record)}
          >
            Sửa
          </Button>

          {user?.role === "ADMIN" && (
            <Popconfirm
              title="Xóa nhân viên"
              description={`Bạn có chắc muốn xóa ${record.fullName}?`}
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderNavbar />

      <Content style={{ padding: "24px 48px", background: "#f5f5f5" }}>
        <Card
          style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          {/* Toolbar: Search, Filters & Add Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Danh Sách Nhân Viên
            </Title>

            <Space wrap size="middle">
              {/* Search input */}
              <Input
                placeholder="Tìm theo tên hoặc email..."
                prefix={<SearchOutlined />}
                value={searchKeyword}
                onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
                style={{ width: 220 }}
                allowClear
              />

              {/* Gender Filter */}
              <Select
                value={filterGender}
                onChange={(val) => dispatch(setFilterGender(val))}
                style={{ width: 130 }}
              >
                <Select.Option value="ALL">Tất cả giới tính</Select.Option>
                <Select.Option value="MALE">Nam</Select.Option>
                <Select.Option value="FEMALE">Nữ</Select.Option>
                <Select.Option value="OTHER">Khác</Select.Option>
              </Select>

              {/* Role Filter */}
              <Select
                value={filterRole}
                onChange={(val) => dispatch(setFilterRole(val))}
                style={{ width: 130 }}
              >
                <Select.Option value="ALL">Tất cả vai trò</Select.Option>
                <Select.Option value="ADMIN">ADMIN</Select.Option>
                <Select.Option value="USER">USER</Select.Option>
              </Select>

              {/* Add Button */}
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenAddModal}
              >
                Thêm Nhân Viên
              </Button>
            </Space>
          </div>

          {/* Employee Data Table */}
          <Table
            dataSource={filteredEmployees}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
            }}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </Content>

      {/* Add / Edit Employee Form Modal */}
      <EmployeeModal
        open={modalOpen}
        editingEmployee={editingEmployee}
        onClose={() => setModalOpen(false)}
      />
    </Layout>
  );
}
