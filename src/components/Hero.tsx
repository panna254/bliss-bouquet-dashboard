import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-flowers.jpg";
import coralDreams from "@/assets/coral-dreams-bouquet.jpg";
import exoticProtea from "@/assets/exotic-protea.jpg";
import SearchBar from "./SearchBar";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: heroImage,
      alt: "Beautiful coral pink roses and white peonies arrangement",
      title: "Beautiful Flowers",
      subtitle: "Delivered Fresh",
      description: "Premium arrangements crafted with love for every special moment. From elegant roses to seasonal bouquets, we bring joy to your doorstep."
    },
    {
      image: coralDreams,
      alt: "Stunning coral dreams bouquet with mixed flowers",
      title: "Coral Dreams",
      subtitle: "Vibrant Collection",
      description: "Discover our vibrant coral collection featuring stunning mixed arrangements that capture the essence of tropical beauty and warmth."
    },
    {
      image: exoticProtea,
      alt: "Exotic protea flowers in artistic arrangement",
      title: "Exotic Protea",
      subtitle: "Unique Artistry",
      description: "Experience the extraordinary with our exotic protea arrangements, featuring rare and dramatic flowers for those who appreciate unique beauty."
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Carousel Navigation */}
      <div className="absolute inset-y-0 left-4 z-20 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-4 z-20 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-110'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Seasonal Banner */}
      <div className="relative z-10 bg-accent/90 backdrop-blur-sm text-accent-foreground text-center py-3 text-sm font-medium animate-fade-in">
        🌸 Welcome to Bliss Bouquet Kenya! Experience the freshest flowers, beautiful arrangements, and heartfelt service—delivered with love across Kenya.
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container py-16 md:py-24">
          <div className="max-w-4xl">
            {/* Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Badge */}
              <Badge 
                className="inline-flex bg-accent/90 backdrop-blur-sm text-accent-foreground hover:bg-accent animate-fade-in"
              >
                <Heart className="w-3 h-3 mr-1" />
                Same-Day Delivery Available
              </Badge>

              {/* Headline */}
              <div className="space-y-6 animate-fade-in" key={currentSlide}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight drop-shadow-lg">
                  {currentSlideData.title}
                  <span className="block text-accent">{currentSlideData.subtitle}</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 max-w-3xl font-body drop-shadow-md">
                  {currentSlideData.description}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 animate-scale-in">
                <Button 
                  variant="hero" 
                  size="hero" 
                  className="animate-fade-in bg-primary hover:bg-primary/90 text-white shadow-xl"
                >
                  Shop Fresh Flowers
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="animate-fade-in bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-xl"
                >
                  Create Custom Bouquet
                </Button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-6 animate-fade-in">
                <div className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Truck className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Same-Day Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Fresh Guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Heart className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Handcrafted with Love</span>
                </div>
              </div>

              {/* Floating price tag */}
              <div className="inline-block bg-white/95 backdrop-blur rounded-xl p-4 shadow-2xl animate-bounce-in">
                <p className="text-sm text-muted-foreground">Premium bouquets starting from</p>
                <p className="text-3xl font-heading font-bold text-primary">Ksh 3,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      {/* Search Bar */}
      <div className="relative z-10 container pb-8 animate-fade-in">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};

export default Hero;