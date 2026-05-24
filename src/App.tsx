import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import WhatsAppButton from "./components/WhatsAppButton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContactUs from "./pages/ContactUs";
import DeliveryInfo from "./pages/DeliveryInfo";
import CareGuide from "./pages/CareGuide";
import Returns from "./pages/Returns";
import CategoryPage from "./pages/CategoryPage";
import { AdminLayout } from "./admin/components";
import { RequireAdmin } from "./admin/guards";
import {
  AdminCustomersPage,
  AdminDashboardPage,
  AdminOrdersPage,
  AdminProductsPage,
  AdminSettingsPage,
} from "./admin/pages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/delivery-info" element={<DeliveryInfo />} />
            <Route path="/care-guide" element={<CareGuide />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/admin" element={<RequireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>
            
            {/* Category and Occasion Pages */}
            <Route path="/:category" element={<CategoryPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WhatsAppButton />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
