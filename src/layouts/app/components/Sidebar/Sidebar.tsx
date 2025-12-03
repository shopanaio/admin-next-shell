import { useState } from "react";
import { ConfigProvider, Layout, Menu, MenuProps } from "antd";
import { StoreMenu } from "@/layouts/app/components/StoreMenu/StoreMenu";
import { SidebarLogo } from "@/layouts/app/components/Sidebar/SidebarLogo";
import { createStyles } from "antd-style";

const useStyles = createStyles(
  ({ css }, { collapsed }: { collapsed: boolean }) => ({
    siderPlaceholder: css`
      background: var(--color-gray-2);
      border-right: 1px solid var(--color-gray-5);
    `,
    siderFixed: css`
      overflow-y: auto;
      overflow-x: hidden;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      background: transparent;

      /* Hide scrollbar */
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }
    `,
    content: css`
      transition: transform 0.2s ease;
      transform: ${collapsed
        ? "translateX(var(--x1))"
        : "translateX(var(--x2))"};
    `,
    menu: css`
      border: none;
      transition: width 0.2s ease;
      background: transparent;
      width: ${collapsed ? "calc(100% - var(--x2))" : "calc(100% - var(--x4))"};
    `,
  })
);

interface Props extends MenuProps {
  menuItems?: MenuProps["items"];
}

export const Sidebar = ({ menuItems = [], ...menuProps }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { styles } = useStyles({ collapsed });

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.at(-1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const onCollapse = (value: boolean) => setCollapsed(value);

  return (
    <>
      <Layout.Sider
        collapsible
        theme="light"
        collapsed={collapsed}
        collapsedWidth={72}
        width={260}
        trigger={null}
        onCollapse={onCollapse}
        className={styles.siderPlaceholder}
      />
      <Layout.Sider
        collapsible
        theme="light"
        collapsed={collapsed}
        collapsedWidth={72}
        width={260}
        trigger={null}
        className={styles.siderFixed}
      >
        <div className={styles.content}>
          <SidebarLogo isCollapsed={collapsed} />
          <StoreMenu isCollapsed={collapsed} />
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  activeBarBorderWidth: 0,
                  itemHeight: 32,
                  itemMarginInline: 0,
                  itemMarginBlock: 4,
                  subMenuItemBg: "transparent",
                },
              },
            }}
          >
            <Menu
              {...menuProps}
              className={styles.menu}
              selectedKeys={selectedKeys}
              theme="light"
              mode="inline"
              items={menuItems}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
            />
          </ConfigProvider>
        </div>
      </Layout.Sider>
    </>
  );
};
