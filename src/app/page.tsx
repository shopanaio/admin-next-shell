"use client";

import { Button, Typography, Space } from "antd";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <main style={{ padding: 48, minHeight: "100vh" }}>
      <Space orientation="vertical" size="large">
        <Title>Admin Shell</Title>
        <Paragraph>
          Next.js + Ant Design + TypeScript + Turbopack
        </Paragraph>
        <Button type="primary">Get Started</Button>
      </Space>
    </main>
  );
}
