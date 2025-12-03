import { createLayout } from "@/registry";
import { AppLayout } from "@/layouts/app/components/Layout/Layout";

const { Layout: ModuleLayout } = createLayout({
  modulesContext: require.context("../../modules", true, /(register|domain)\.tsx?$/),
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleLayout>
      <AppLayout>{children}</AppLayout>
    </ModuleLayout>
  );
}
