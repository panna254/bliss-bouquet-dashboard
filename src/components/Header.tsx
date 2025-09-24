import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, Menu, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <h1 className="text-xl font-heading font-semibold text-foreground">
            Bloom & Bliss
          </h1>
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#" 
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Fresh Flowers
          </a>
          <a 
            href="#" 
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Bouquets
          </a>
          <a 
            href="#" 
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Plants
          </a>
          <a 
            href="#" 
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Gifts
          </a>
          <a 
            href="#" 
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Same-Day Delivery
          </a>
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <Search className="h-5 w-5" />
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <Heart className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative hover:bg-muted">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-bounce-in"
              >
                {cartCount}
              </Badge>
            )}
          </Button>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;