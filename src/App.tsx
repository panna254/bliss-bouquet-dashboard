import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { CartProvider } from "@/contexts/CartContext";
import WhatsAppButton from "./components/WhatsAppButton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContactUs from "./pages/support/ContactUs";
import DeliveryInfo from "./pages/support/DeliveryInfo";
import CareGuide from "./pages/support/CareGuide";
import Returns from "./pages/support/Returns";

const queryClient = new QueryClient();

// Add a component to handle scroll restoration and redirects
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle GitHub Pages redirects
    if (window.location.pathname.startsWith('/Bliss-Bouquet-Kenya/')) {
      const redirectPath = window.location.pathname.replace('/Bliss-Bouquet-Kenya', '');
      navigate(redirectPath);
    }
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [pathname, navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Support Pages */}
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/care-guide" element={<CareGuide />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/delivery-info" element={<DeliveryInfo />} />
            {/* ADD ALL OTHER CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
