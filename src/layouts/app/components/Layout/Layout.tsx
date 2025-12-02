import { Layout, MenuProps } from 'antd';
import { Sidebar } from '@/layouts/app/components/Sidebar/Sidebar';
import { createStyles } from 'antd-style';
import { ReactNode } from 'react';

const useStyles = createStyles({
  layout: {
    minHeight: '100vh',
    background: 'var(--bg-gradient)',
    '& .ant-layout-sider-trigger': {
      display: 'none',
    },
  },
});

interface AppLayoutProps {
  children?: ReactNode;
  menuItems?: MenuProps['items'];
}

export const AppLayout = ({ children, menuItems }: AppLayoutProps) => {
  const { styles } = useStyles();

  return (
    <Layout data-testid="project-layout" className={styles.layout}>
      <Sidebar menuItems={menuItems} />
      <Layout>{children}</Layout>
    </Layout>
  );
};
