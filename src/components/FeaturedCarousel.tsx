import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { loadFeaturedProducts, type Product } from "@/services/products.service";

const FeaturedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);
  const { addToCart, openCart } = useCart();

  const loadFeatured = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await loadFeaturedProducts();
      setFeaturedProducts(result.featuredProducts);
      setUsedFallback(result.usedFallback);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeatured();
  }, [loadFeatured]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [featuredProducts.length]);

  const slideStepPercent =
    typeof window !== "undefined" && window.innerWidth < 640
      ? 100
      : typeof window !== "undefined" && window.innerWidth < 768
        ? 50
        : 33.3333;

  const nextSlide = () => {
    if (featuredProducts.length === 0) {
      return;
    }

    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    if (featuredProducts.length === 0) {
      return;
    }

    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const handleQuickAdd = (product: Product) => {
    addToCart(product);
    setTimeout(() => openCart(), 500);
  };

  const showSkeleton = isLoading && featuredProducts.length === 0;
  const showEmpty = !isLoading && featuredProducts.length === 0;

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
              disabled={featuredProducts.length === 0}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={featuredProducts.length === 0}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {usedFallback && !showSkeleton && !showEmpty && (
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Showing saved featured catalog while live products are temporarily unavailable.
          </p>
        )}

        {showSkeleton ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`featured-skeleton-${index}`} className="space-y-4 rounded-lg border border-border p-4">
                <Skeleton className="aspect-square w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : showEmpty ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center">
            <p className="text-muted-foreground">Featured products will appear here soon.</p>
            <Button className="mt-4" variant="outline" onClick={() => void loadFeatured()}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * slideStepPercent}%)`
                }}
              >
                {featuredProducts.map((product) => (
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
                          type="button"
                          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-elegant transform translate-y-2 group-hover:translate-y-0"
                          onClick={() => handleQuickAdd(product)}
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
                          <Button variant="outline" size="sm" type="button">
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
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-elegant ${
                    index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedCarousel;
