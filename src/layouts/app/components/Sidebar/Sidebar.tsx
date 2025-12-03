import { useState, useMemo } from "react";
import { ConfigProvider, Layout, Menu, MenuProps, Typography } from "antd";
import { StoreMenu } from "@/layouts/app/components/StoreMenu/StoreMenu";
import { SidebarLogo } from "@/layouts/app/components/Sidebar/SidebarLogo";
import { createStyles } from "antd-style";
import { moduleRegistry, type SidebarItem } from "@/registry";
import { SubitemIcon } from "@/ui-kit/Arrows/Arrows";

type AntMenuItem = NonNullable<MenuProps["items"]>[number];

function buildMenuItems(
  items: SidebarItem[],
  isSubitem = false,
  parentChildrenCount = 0
): AntMenuItem[] {
  return items.map((item, index) => {
    const isFinal = isSubitem && index === parentChildrenCount - 1;
    const icon = isSubitem
      ? <SubitemIcon isFinal={isFinal} />
      : item.icon;

    if (item.type === "group") {
      return {
        key: item.key,
        label: (
          <Typography.Text ellipsis type="secondary">
            {item.label}
          </Typography.Text>
        ),
        type: "group" as const,
        children: item.children
          ? buildMenuItems(item.children, false, 0)
          : [],
      };
    }

    if (item.children && item.children.length > 0) {
      return {
        key: item.key,
        label: item.label,
        icon,
        children: buildMenuItems(item.children, true, item.children.length),
      };
    }

    return {
      key: item.key,
      label: item.label,
      icon,
    };
  });
}

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

export const Sidebar = () => {
  const sidebarItems = moduleRegistry.getSidebarItems();
  const menuItems = useMemo(() => buildMenuItems(sidebarItems), [sidebarItems]);
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
