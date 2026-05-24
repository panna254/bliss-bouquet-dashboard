import { NavLink, Outlet } from "react-router-dom";

const adminNavItems = [
  { label: "Dashboard", to: "/admin" },
  { label: "Products", to: "/admin/products" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Customers", to: "/admin/customers" },
  { label: "Settings", to: "/admin/settings" },
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <div className="container grid gap-6 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-lg border bg-background p-3">
          <h1 className="px-3 pb-3 text-base font-heading font-semibold">Admin</h1>
          <nav className="space-y-1">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  [
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 rounded-lg border bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
