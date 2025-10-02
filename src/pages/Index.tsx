import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryTiles from "@/components/CategoryTiles";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import TrendingOccasions from "@/components/TrendingOccasions";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products, categories } from "@/data/products";
import { useState } from "react";
import { Filter, Grid, List } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [displayCount, setDisplayCount] = useState(8);

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div id="hero">
        <Hero />
      </div>
      <div id="categories">
        <CategoryTiles />
      </div>
      <div id="featured">
        <FeaturedCarousel />
      </div>
      <div id="occasions">
        <TrendingOccasions />
      </div>
      
      {/* Products Section */}
      <section id="products" className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated collection of fresh flowers and premium arrangements
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="animate-fade-in"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-heading font-semibold text-foreground">
              {selectedCategory === "all" ? "All Products" : categories.find(c => c.id === selectedCategory)?.name} 
              <span className="text-muted-foreground ml-2">({filteredProducts.length})</span>
            </h3>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {displayedProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setDisplayCount(prev => prev + 8)}
              >
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Stay in Bloom
            </h2>
            <p className="text-lg text-muted-foreground">
              Get exclusive offers, seasonal arrangements, and flower care tips delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button variant="default" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground/5 border-t border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-foreground">Bliss Bouquet Kenya</h3>
              <p className="text-sm text-muted-foreground">
                Premium flowers and gifts delivered fresh to your doorstep with love and care.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-elegant">Fresh Flowers</a></li>
                <li><a href="#" className="hover:text-primary transition-elegant">Bouquets</a></li>
                <li><a href="#" className="hover:text-primary transition-elegant">Plants</a></li>
                <li><a href="#" className="hover:text-primary transition-elegant">Same-Day Delivery</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-elegant">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-elegant">Delivery Info</a></li>
                <li><a href="#" className="hover:text-primary transition-elegant">Care Guide</a></li>
                <li><a href="#" className="hover:text-primary transition-elegant">Returns</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>📞 <a href="tel:0743491613" className="hover:text-primary transition-elegant">0743491613</a></li>
                <li>✉️ <a href="mailto:blissbouquet187@gmail.com" className="hover:text-primary transition-elegant">blissbouquet187@gmail.com</a></li>
                <li>🕒 Mon-Sat: 8AM-8PM</li>
                <li>📍 Same-day delivery available</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Bliss Bouquet Kenya. Made with <span role="img" aria-label="love">❤️</span> by Ujuzi Solutions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
