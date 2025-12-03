'use client';

import { Typography, Layout } from 'antd';
import { AppLayout } from '@/layouts/app/components/Layout/Layout';

const { Title, Paragraph } = Typography;

export default function ProductsPage() {
  return (
    <AppLayout>
      <Layout.Content style={{ padding: 24, background: 'var(--bg-gradient)' }}>
        <Title level={2}>Products</Title>
        <Paragraph>Products list page from module</Paragraph>
      </Layout.Content>
    </AppLayout>
  );
}
