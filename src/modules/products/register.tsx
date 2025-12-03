import { registerModule } from "@/registry";
import dynamic from "next/dynamic";

registerModule({
  key: "products",
  domain: "inventory",
  sidebar: {
    label: "Products",
    order: 1,
  },
  items: [
    {
      key: "products-list",
      path: "/products",
      component: dynamic(() => import("@/modules/products/page/page")),
      sidebar: {
        label: "All Products",
        order: 1,
      },
    },
  ],
});
