import { registerModule } from "@/registry";
import dynamic from "next/dynamic";
import { ShoppingOutlined } from "@ant-design/icons";

registerModule({
  path: "/products",
  component: dynamic(() => import("@/modules/products/page/page")),
  sidebar: {
    key: "products",
    label: "Products",
    icon: <ShoppingOutlined />,
    order: 2,
  },
});
