import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, Menu, Heart, X } from "lucide-react";
import UserMenu from "./UserMenu";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import SearchBar from "./SearchBar";
import CartPanel from "./CartPanel";

const Header = () => {
  const { getCartCount, toggleCart } = useCart();
  const cartCount = getCartCount();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-24 items-center justify-between">
        {/* Logo - Always visible, including mobile */}
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Bliss Bouquet Kenya" 
              className="h-20 md:h-24 lg:h-28 w-auto transition-all duration-200 hover:scale-105"
            />
          </a>
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="/roses"
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Premium Roses
          </a>
          <a 
            href="/bouquets"
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Fresh Bouquets
          </a>
          <a 
            href="/birthday-flowers"
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Birthday Flowers
          </a>
          <a 
            href="/wedding-flowers"
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Wedding Flowers
          </a>
          <a 
            href="/delivery-info"
            className="text-sm font-medium text-foreground hover:text-primary transition-elegant"
          >
            Same-Day Delivery
          </a>
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

          {/* User / Login */}
          <UserMenu />

          {/* Cart */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-muted"
            onClick={toggleCart}
          >
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden hover:bg-muted"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Search Flowers & Gifts</DialogTitle>
            <DialogDescription>Search the Bliss Bouquet catalog by product name or category.</DialogDescription>
          </DialogHeader>
          <SearchBar />
        </DialogContent>
      </Dialog>
      
      {/* Cart Panel */}
      <CartPanel />
      
      {/* Mobile Menu Panel */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-full sm:max-w-xs">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              <img 
                src="/logo.png" 
                alt="Bliss Bouquet Kenya" 
                className="h-6 w-auto"
              />
              <span className="text-sm font-medium">Menu</span>
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col space-y-4 mt-4">
            {/* Navigation Links */}
            <nav className="space-y-1">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Navigation</h4>
              <a 
                href="/roses"
                className="block w-full text-left text-sm font-medium text-foreground hover:text-primary hover:bg-muted/50 transition-elegant py-2 px-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Premium Roses
              </a>
              <a 
                href="/bouquets"
                className="block w-full text-left text-sm font-medium text-foreground hover:text-primary hover:bg-muted/50 transition-elegant py-2 px-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fresh Bouquets
              </a>
              <a 
                href="/birthday-flowers"
                className="block w-full text-left text-sm font-medium text-foreground hover:text-primary hover:bg-muted/50 transition-elegant py-2 px-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Birthday Flowers
              </a>
              <a 
                href="/wedding-flowers"
                className="block w-full text-left text-sm font-medium text-foreground hover:text-primary hover:bg-muted/50 transition-elegant py-2 px-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Wedding Flowers
              </a>
              <a 
                href="/delivery-info"
                className="block w-full text-left text-sm font-medium text-foreground hover:text-primary hover:bg-muted/50 transition-elegant py-2 px-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Same-Day Delivery
              </a>
            </nav>
            
            {/* Action Buttons */}
            <div className="border-t border-border pt-4 space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Actions</h4>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start gap-2 h-8 text-sm"
                onClick={() => {
                  setSearchOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start gap-2 h-8 text-sm"
                onClick={() => {
                  toggleCart();
                  setMobileMenuOpen(false);
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                Cart ({cartCount})
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start gap-2 h-8 text-sm"
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Button>
            </div>
            
            {/* Contact Info */}
            <div className="border-t border-border pt-4 space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Contact</h4>
              <div className="space-y-1">
                <a href="tel:0743491613" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-elegant py-1">
                  <span className="text-xs">📞</span>
                  0743 491 613
                </a>
                <a href="mailto:blissbouquet187@gmail.com" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-elegant py-1">
                  <span className="text-xs">✉️</span>
                  blissbouquet187@gmail.com
                </a>
                <p className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                  <span className="text-xs">🕒</span>
                  Mon-Sat: 8AM-8PM
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;