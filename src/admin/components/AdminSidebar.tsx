import { NavLink } from "react-router-dom";

const adminNavItems = [
  { label: "Dashboard", to: "/admin" },
  { label: "Products", to: "/admin/products" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Customers", to: "/admin/customers" },
  { label: "Settings", to: "/admin/settings" },
];

const AdminSidebar = () => {
  return (
    <aside className="rounded-lg border bg-background p-3 lg:sticky lg:top-6 lg:h-fit">
      <h1 className="px-3 pb-3 text-base font-heading font-semibold">Admin</h1>
      <nav className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            className={({ isActive }) =>
              [
                "block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
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
  );
};

export default AdminSidebar;
