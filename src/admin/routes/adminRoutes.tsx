import { Route } from "react-router-dom";
import { AdminLayout } from "@/admin/components";
import AdminGuard from "@/admin/guards/AdminGuard";
import {
  AdminCustomersPage,
  AdminDashboardPage,
  AdminOrderDetailPage,
  AdminOrdersPage,
  AdminProductsPage,
  AdminSettingsPage,
} from "@/admin/pages";

const adminRoutes = (
  <Route path="/admin" element={<AdminGuard />}>
    <Route element={<AdminLayout />}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="products" element={<AdminProductsPage />} />
      <Route path="orders" element={<AdminOrdersPage />} />
      <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
      <Route path="customers" element={<AdminCustomersPage />} />
      <Route path="settings" element={<AdminSettingsPage />} />
    </Route>
  </Route>
);

export default adminRoutes;
