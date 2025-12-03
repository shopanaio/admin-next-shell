'use client';

import { Typography, Layout } from 'antd';
import { AppLayout } from '@/layouts/app/components/Layout/Layout';
import type { ModulePageProps } from '@/registry';

const { Title, Paragraph } = Typography;

export default function ProductDetailPage({ pathParams }: ModulePageProps) {
  const productId = pathParams.id as string;

  return (
    <AppLayout>
      <Layout.Content style={{ padding: 24, background: 'var(--bg-gradient)' }}>
        <Title level={2}>Product Detail</Title>
        <Paragraph>Product ID: {productId}</Paragraph>
      </Layout.Content>
    </AppLayout>
  );
}
