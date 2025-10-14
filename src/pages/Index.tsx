import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryTiles from "@/components/CategoryTiles";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import TrendingOccasions from "@/components/TrendingOccasions";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products, categories } from "@/data/products";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Grid, List } from "lucide-react";
import Footer from "@/components/Footer";

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
      <SEOHead 
        title="Bliss Bouquet Kenya - Fresh Flowers Delivery Nairobi | Same Day Flower Delivery Kenya"
        description="Premium fresh flowers delivery in Nairobi, Kenya. Same-day flower delivery, wedding bouquets, birthday flowers, roses, lilies. Best florist in Kenya with 30+ arrangements. Order online now!"
        canonical="https://blissbouquetkenya.com/"
        keywords="flowers Kenya, flower delivery Nairobi, same day flower delivery Kenya, fresh flowers Nairobi, wedding bouquets Kenya, birthday flowers, roses Kenya, lilies Kenya, florist Nairobi, flower shop Kenya"
        ogTitle="Bliss Bouquet Kenya - Fresh Flowers Delivery Nairobi | Same Day Delivery"
        ogDescription="Premium fresh flowers delivery in Nairobi, Kenya. Same-day delivery, wedding bouquets, birthday flowers. Best florist in Kenya with 30+ arrangements."
      />
      
      {/* Enhanced Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://blissbouquetkenya.com/#organization",
            "name": "Bliss Bouquet Kenya",
            "alternateName": "Bliss Bouquet",
            "description": "Premium fresh flowers delivery service in Nairobi, Kenya. Specializing in same-day flower delivery, wedding bouquets, birthday arrangements, and corporate flowers.",
            "url": "https://blissbouquetkenya.com",
            "logo": "https://blissbouquetkenya.com/logo.png",
            "image": [
              "https://blissbouquetkenya.com/logo.png"
            ],
            "telephone": "+254743491613",
            "email": "blissbouquet187@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Nairobi",
              "addressLocality": "Nairobi",
              "addressRegion": "Nairobi County",
              "postalCode": "00100",
              "addressCountry": "KE"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": -1.286389,
              "longitude": 36.817223
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "08:00",
                "closes": "20:00"
              }
            ],
            "serviceArea": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": -1.286389,
                "longitude": 36.817223
              },
              "geoRadius": "50000"
            },
            "priceRange": "KSh 1000 - KSh 15000",
            "currenciesAccepted": "KES",
            "paymentAccepted": "Cash, Credit Card, Mobile Money",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Flower Arrangements",
              "itemListElement": displayedProducts.slice(0, 5).map((product, index) => ({
                "@type": "Offer",
                "position": index + 1,
                "price": product.price,
                "priceCurrency": "KES",
                "availability": "https://schema.org/InStock",
                "itemOffered": {
                  "@type": "Product",
                  "name": product.name,
                  "description": product.description,
                  "image": `https://blissbouquetkenya.com${product.image}`,
                  "brand": {
                    "@type": "Brand",
                    "name": "Bliss Bouquet Kenya"
                  },
                  "offers": {
                    "@type": "Offer",
                    "price": product.price,
                    "priceCurrency": "KES",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                      "@type": "Organization",
                      "name": "Bliss Bouquet Kenya"
                    }
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": product.rating,
                    "reviewCount": product.reviewCount,
                    "bestRating": 5,
                    "worstRating": 1
                  }
                }
              }))
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Nairobi"
              },
              {
                "@type": "Country",
                "name": "Kenya"
              }
            ],
            "sameAs": [
              "https://www.facebook.com/blissbouquetkenya",
              "https://www.instagram.com/blissbouquetkenya"
            ]
          })
        }}
      />
      
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
      <Newsletter />

      <Footer />
    </div>
  );
};

export default Index;
