"use client";

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
      {
        key: "products-categories",
        icon: <SubitemIcon isFinal />,
        label: "Categories",
      },
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

export default function Home({ children }: { children: React.ReactNode }) {
  return <AppLayout menuItems={menuItems}>{children}</AppLayout>;
}
