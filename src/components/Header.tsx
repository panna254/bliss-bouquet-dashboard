import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, Menu, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SearchBar from "./SearchBar";

const Header = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [searchOpen, setSearchOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - Always visible, including mobile */}
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Bliss Bouquet Kenya" 
              className="h-12 w-auto transition-all duration-200 hover:scale-105"
            />
          </a>
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Fresh Flowers
          </button>
          <button 
            onClick={() => scrollToSection('featured')}
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Bouquets
          </button>
          <button 
            onClick={() => scrollToSection('occasions')}
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Plants
          </button>
          <button 
            onClick={() => scrollToSection('products')}
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Gifts
          </button>
          <button 
            onClick={() => scrollToSection('hero')}
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Same-Day Delivery
          </button>
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-muted"
            onClick={() => setSearchOpen(true)}
          >
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

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Search Flowers & Gifts</DialogTitle>
          </DialogHeader>
          <SearchBar />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;