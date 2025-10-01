import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, Heart } from "lucide-react";
import heroImage from "@/assets/hero-flowers.jpg";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Seasonal Banner */}
      <div className="bg-accent text-accent-foreground text-center py-3 text-sm font-medium animate-fade-in">
        🌸 Welcome to Bliss Bouquet Kenya! Experience the freshest flowers, beautiful arrangements, and heartfelt service—delivered with love across Kenya.
      </div>
      
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <Badge 
              className="inline-flex bg-accent text-accent-foreground hover:bg-accent-hover animate-fade-in"
            >
              <Heart className="w-3 h-3 mr-1" />
              Same-Day Delivery Available
            </Badge>

            {/* Headline */}
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
                Beautiful Flowers
                <span className="block text-primary">Delivered Fresh</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-body">
                Premium arrangements crafted with love for every special moment. 
                From elegant roses to seasonal bouquets, we bring joy to your doorstep.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-scale-in">
              <Button variant="hero" size="hero" className="animate-fade-in">
                Shop Fresh Flowers
              </Button>
              <Button variant="premium" size="lg" className="animate-fade-in">
                Create Custom Bouquet
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 animate-fade-in">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-5 h-5 text-secondary" />
                Same-Day Delivery
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-5 h-5 text-secondary" />
                Fresh Guarantee
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-5 h-5 text-accent" />
                Handcrafted with Love
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative overflow-hidden rounded-2xl shadow-elegant">
              <img
                src={heroImage}
                alt="Beautiful coral pink roses and white peonies arrangement in elegant vase"
                className="w-full h-[500px] md:h-[600px] object-cover hover:scale-105 transition-elegant"
              />
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              
              {/* Floating price tag */}
              <div className="absolute top-6 right-6 bg-background/95 backdrop-blur rounded-lg p-3 shadow-medium animate-bounce-in">
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-2xl font-heading font-semibold text-primary">Ksh 3000</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-accent/10 rounded-full blur-xl" />
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mt-16 animate-fade-in">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};

export default Hero;