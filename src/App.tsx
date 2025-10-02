import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import WhatsAppButton from "./components/WhatsAppButton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ContactUs from "./pages/support/ContactUs";
import DeliveryInfo from "./pages/support/DeliveryInfo";
import CareGuide from "./pages/support/CareGuide";
import Returns from "./pages/support/Returns";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Support Pages */}
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/care-guide" element={<CareGuide />} />
            <Route path="/returns" element={<Returns />} />
            {/* ADD ALL OTHER CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
