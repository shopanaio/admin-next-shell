import { registerDomain } from "@/registry";
import { ShoppingOutlined } from "@ant-design/icons";
import { registerCategoryDrawers } from "./categories/drawers";

// Register category drawers at domain level
// (since categories don't have their own module registration yet)
registerCategoryDrawers();

registerDomain({
  key: "inventory",
  label: "Inventory",
  icon: <ShoppingOutlined />,
  order: 1,
});
