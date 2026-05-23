import { useParams } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ProductCard from "@/components/ProductCard";
import NotFound from "@/pages/NotFound";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProducts, getProductsByCategory } from "@/adapters/productAdapter";
import { useState } from "react";
import { Grid, List } from "lucide-react";

interface CategoryConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  category?: string;
  occasion?: string;
}

const categoryConfigs: Record<string, CategoryConfig> = {
  'roses': {
    title: 'Premium Rose Bouquets Kenya | Fresh Roses Delivery Nairobi - Bliss Bouquet',
    description: 'Premium rose bouquets in Kenya. Red, pink, white roses for weddings, birthdays, anniversaries. Same-day delivery in Nairobi. Order fresh roses online from Kenya\'s best florist.',
    keywords: 'roses Kenya, rose bouquets Nairobi, red roses Kenya, wedding roses, birthday roses, anniversary roses, Valentine roses Kenya',
    ogTitle: 'Premium Rose Bouquets Kenya | Fresh Roses Delivery',
    ogDescription: 'Premium rose bouquets in Kenya. Red, pink, white roses for weddings, birthdays, anniversaries. Same-day delivery in Nairobi.',
    category: 'roses'
  },
  'bouquets': {
    title: 'Fresh Flower Bouquets Kenya | Wedding & Birthday Bouquets Nairobi',
    description: 'Fresh flower bouquets in Kenya. Wedding bouquets, birthday arrangements, anniversary flowers. Expert florist in Nairobi with same-day delivery. Order premium bouquets online.',
    keywords: 'flower bouquets Kenya, wedding bouquets Nairobi, birthday bouquets, anniversary flowers Kenya, fresh bouquets delivery',
    ogTitle: 'Fresh Flower Bouquets Kenya | Wedding & Birthday',
    ogDescription: 'Fresh flower bouquets in Kenya. Wedding bouquets, birthday arrangements, anniversary flowers. Expert florist in Nairobi with same-day delivery.',
    category: 'bouquets'
  },
  'birthday-flowers': {
    title: 'Birthday Flowers Kenya | Happy Birthday Bouquets Nairobi Delivery',
    description: 'Beautiful birthday flowers in Kenya. Happy birthday bouquets, colorful arrangements, surprise deliveries. Same-day birthday flower delivery in Nairobi. Make birthdays special!',
    keywords: 'birthday flowers Kenya, happy birthday bouquets Nairobi, birthday flower delivery, birthday arrangements Kenya, surprise birthday flowers',
    ogTitle: 'Birthday Flowers Kenya | Happy Birthday Bouquets',
    ogDescription: 'Beautiful birthday flowers in Kenya. Happy birthday bouquets, colorful arrangements, surprise deliveries. Same-day delivery in Nairobi.',
    occasion: 'birthday'
  },
  'wedding-flowers': {
    title: 'Wedding Flowers Kenya | Bridal Bouquets & Decorations Nairobi',
    description: 'Stunning wedding flowers in Kenya. Bridal bouquets, ceremony decorations, reception arrangements. Professional wedding florist in Nairobi. Make your wedding day perfect!',
    keywords: 'wedding flowers Kenya, bridal bouquets Nairobi, wedding decorations Kenya, ceremony flowers, reception arrangements Nairobi',
    ogTitle: 'Wedding Flowers Kenya | Bridal Bouquets & Decorations',
    ogDescription: 'Stunning wedding flowers in Kenya. Bridal bouquets, ceremony decorations, reception arrangements. Professional wedding florist in Nairobi.',
    occasion: 'wedding'
  }
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [displayCount, setDisplayCount] = useState(12);

  const categorySlug = category?.toLowerCase() ?? "";
  const config = categoryConfigs[categorySlug];
  
  if (!config) {
    return <NotFound />;
  }

  const filteredProducts = config.category
    ? getProductsByCategory(config.category)
    : getProducts().filter(product => {
        if (config.occasion) {
          // For occasion-based filtering, we'll check the product name and description
          const searchText = `${product.name} ${product.description}`.toLowerCase();
          return searchText.includes(config.occasion);
        }
        return false;
      });

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={config.title}
        description={config.description}
        canonical={`https://blissbouquetkenya.com/${categorySlug}`}
        keywords={config.keywords}
        ogTitle={config.ogTitle}
        ogDescription={config.ogDescription}
      />
      
      {/* Structured Data for Category Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": config.ogTitle,
            "description": config.ogDescription,
            "url": `https://blissbouquetkenya.com/${categorySlug}`,
            "mainEntity": {
              "@type": "ItemList",
              "name": config.ogTitle,
              "description": config.ogDescription,
              "numberOfItems": filteredProducts.length,
              "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": product.name,
                "description": product.description,
                "image": `https://blissbouquetkenya.com${product.image}`,
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
                },
                "brand": {
                  "@type": "Brand",
                  "name": "Bliss Bouquet Kenya"
                },
                "category": config.category || categorySlug.replace('-', ' ')
              }))
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://blissbouquetkenya.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": config.ogTitle,
                  "item": `https://blissbouquetkenya.com/${categorySlug}`
                }
              ]
            },
            "provider": {
              "@type": "LocalBusiness",
              "name": "Bliss Bouquet Kenya",
              "url": "https://blissbouquetkenya.com",
              "telephone": "+254743491613",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Nairobi",
                "addressCountry": "KE"
              }
            }
          })
        }}
      />
      
      <Header />
      
      <main className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            {config.ogTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {config.ogDescription}
          </p>
        </div>

        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li><a href="/" className="hover:text-primary">Home</a></li>
            <li>/</li>
            <li className="text-foreground capitalize">{categorySlug.replace('-', ' ')}</li>
          </ol>
        </nav>

        {/* View Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              {filteredProducts.length} Products Found
            </h2>
            <Badge variant="secondary">
              Same-Day Delivery Available
            </Badge>
          </div>
          
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
        {filteredProducts.length > 0 ? (
          <>
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
                  onClick={() => setDisplayCount(prev => prev + 12)}
                >
                  Load More Products
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">No products found</h3>
            <p className="text-muted-foreground mb-6">
              We're currently updating our {categorySlug.replace('-', ' ')} collection.
            </p>
            <Button asChild>
              <a href="/">Browse All Products</a>
            </Button>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose prose-lg max-w-none">
          <h2>About Our {config.ogTitle}</h2>
          <p>{config.description}</p>
          
          <h3>Why Choose Bliss Bouquet Kenya?</h3>
          <ul>
            <li>Same-day delivery in Nairobi</li>
            <li>Fresh flowers sourced daily</li>
            <li>Expert florist arrangements</li>
            <li>100% satisfaction guarantee</li>
            <li>Nationwide delivery across Kenya</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
