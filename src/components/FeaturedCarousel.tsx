import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { products } from "@/data/products";

const FeaturedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredProducts = products.filter(p => p.isPopular).slice(0, 6);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Bliss Bouquet Kenya Featured Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover our most loved arrangements, handpicked for you by Bliss Bouquet Kenya.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (window.innerWidth < 640 ? 100 : window.innerWidth < 768 ? 50 : 33.3333)}%)`
            }}
          >
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 flex-shrink-0 px-1 sm:px-2 md:px-3">
                <Card className="group overflow-hidden bg-gradient-card border-border hover:shadow-card-hover transition-elegant cursor-pointer h-full">
                  <div className="relative overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-elegant"
                      />
                    </div>
                    
                    {product.isPopular && (
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground animate-bounce-in">
                        ⭐ Featured
                      </Badge>
                    )}
                    
                    <Button
                      variant="default"
                      size="sm"
                      className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-elegant transform translate-y-2 group-hover:translate-y-0"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Quick Add
                    </Button>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating) 
                                ? 'text-accent fill-current' 
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>

                    <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-elegant">
                      {product.name}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-heading font-semibold text-primary">
                          Ksh {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            Ksh {product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-elegant ${
                index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;