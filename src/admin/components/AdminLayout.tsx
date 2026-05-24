import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <div className="container grid gap-6 py-6 lg:grid-cols-[220px_1fr]">
        <AdminSidebar />

        <div className="min-w-0 space-y-6">
          <AdminHeader />
          <main className="rounded-lg border bg-background p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
