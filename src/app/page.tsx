"use client";

import { Button, Typography, Space, Layout } from "antd";
import { AppLayout } from "@/layouts/app/components/Layout/Layout";
import {
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { SubitemIcon } from "@/ui-kit/Arrows";
import type { MenuProps } from "antd";

const { Title, Paragraph } = Typography;

const menuItems: MenuProps["items"] = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "Home",
  },
  {
    key: "products",
    icon: <ShoppingOutlined />,
    label: "Products",
    children: [
      { key: "products-list", icon: <SubitemIcon />, label: "All Products" },
      { key: "products-categories", icon: <SubitemIcon isFinal />, label: "Categories" },
    ],
  },
  {
    key: "customers",
    icon: <UserOutlined />,
    label: "Customers",
  },
  {
    key: "content",
    icon: <FileTextOutlined />,
    label: "Content",
    children: [
      { key: "content-pages", icon: <SubitemIcon />, label: "Pages" },
      { key: "content-menus", icon: <SubitemIcon isFinal />, label: "Menus" },
    ],
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

export default function Home() {
  return (
    <AppLayout menuItems={menuItems}>
      <Layout.Content style={{ padding: 24, background: "var(--bg-gradient)" }}>
        <Space size="large" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Title level={2}>Dashboard</Title>
          <Paragraph>
            Welcome to Admin Shell - Next.js + Ant Design + TypeScript
          </Paragraph>
          <Button type="primary">Get Started</Button>
        </Space>
      </Layout.Content>
    </AppLayout>
  );
}
