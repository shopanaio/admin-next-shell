"use client";

import { Typography, Layout } from "antd";

const { Title, Paragraph } = Typography;

export default function ProductsPage() {
  return (
    <Layout.Content style={{ padding: 24, background: "var(--bg-gradient)" }}>
      <Title level={2}>Products</Title>
      <Paragraph>Products list page from module</Paragraph>
    </Layout.Content>
  );
}
