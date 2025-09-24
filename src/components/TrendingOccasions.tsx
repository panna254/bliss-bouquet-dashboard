import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Heart, 
  Gift, 
  PartyPopper, 
  Home, 
  Briefcase,
  GraduationCap,
  Baby
} from "lucide-react";

const occasions = [
  {
    id: "birthday",
    name: "Birthday",
    description: "Bright & cheerful arrangements",
    icon: PartyPopper,
    color: "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20",
    iconColor: "text-orange-600",
    trending: true,
    count: "124 arrangements"
  },
  {
    id: "anniversary",
    name: "Anniversary",
    description: "Romantic roses & elegant bouquets",
    icon: Heart,
    color: "bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20",
    iconColor: "text-red-600",
    trending: true,
    count: "89 arrangements"
  },
  {
    id: "sympathy",
    name: "Sympathy",
    description: "Thoughtful & comforting",
    icon: Home,
    color: "bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-900/20 dark:to-gray-900/20",
    iconColor: "text-slate-600",
    count: "56 arrangements"
  },
  {
    id: "congratulations",
    name: "Congratulations",
    description: "Celebrate achievements",
    icon: GraduationCap,
    color: "bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20",
    iconColor: "text-emerald-600",
    trending: true,
    count: "78 arrangements"
  },
  {
    id: "new-baby",
    name: "New Baby",
    description: "Sweet & delicate arrangements",
    icon: Baby,
    color: "bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20",
    iconColor: "text-pink-600",
    count: "43 arrangements"
  },
  {
    id: "corporate",
    name: "Corporate Events",
    description: "Professional & sophisticated",
    icon: Briefcase,
    color: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20",
    iconColor: "text-blue-600",
    count: "92 arrangements"
  }
];

const TrendingOccasions = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Trending Occasions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect flowers for life's special moments
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {occasions.map((occasion, index) => {
            const Icon = occasion.icon;
            return (
              <Card 
                key={occasion.id}
                className={`group cursor-pointer border-2 hover:border-primary/50 transition-elegant hover:shadow-card-hover hover:-translate-y-1 ${occasion.color}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 relative">
                  {occasion.trending && (
                    <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs animate-bounce-in">
                      🔥 Trending
                    </Badge>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center group-hover:scale-110 transition-elegant flex-shrink-0">
                      <Icon className={`w-6 h-6 ${occasion.iconColor}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-foreground mb-2 text-lg">
                        {occasion.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {occasion.description}
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        {occasion.count}
                      </p>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-elegant"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Occasions
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingOccasions;