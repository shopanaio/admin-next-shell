import { registerModule } from "@/registry";
import dynamic from "next/dynamic";

registerModule({
  key: "products",
  domain: "inventory",
  path: "/products",
  component: dynamic(() => import("@/modules/products/page/page")),
  sidebar: {
    label: "Products",
    order: 1,
  },
});
