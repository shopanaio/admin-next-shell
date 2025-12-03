import { registerModule } from "@/registry";
import dynamic from "next/dynamic";

registerModule({
  path: "/products",
  component: dynamic(() => import("@/modules/products/page/page")),
});
