import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import WhatsAppButton from "./components/WhatsAppButton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContactUs from "./pages/ContactUs";
import DeliveryInfo from "./pages/DeliveryInfo";
import CareGuide from "./pages/CareGuide";
import Returns from "./pages/Returns";
import CategoryPage from "./pages/CategoryPage";
import { adminRoutes } from "./admin/routes";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CustomerGuard from "./guards/CustomerGuard";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
              {adminRoutes}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route element={<CustomerGuard />}>
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
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
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
