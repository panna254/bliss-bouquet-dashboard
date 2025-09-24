import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flower2, TreePine, Gift, Building2, Heart, Sparkles } from "lucide-react";

const categoryData = [
  {
    id: "roses",
    name: "Premium Roses",
    description: "Classic & elegant",
    icon: Flower2,
    color: "bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20",
    iconColor: "text-rose-600",
    popular: true
  },
  {
    id: "bouquets",
    name: "Fresh Bouquets",
    description: "Handcrafted daily",
    icon: Sparkles,
    color: "bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20",
    iconColor: "text-purple-600",
    popular: true
  },
  {
    id: "plants",
    name: "Green Plants",
    description: "Long-lasting beauty",
    icon: TreePine,
    color: "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20",
    iconColor: "text-green-600"
  },
  {
    id: "gifts",
    name: "Gift Sets",
    description: "Perfect combinations",
    icon: Gift,
    color: "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20",
    iconColor: "text-amber-600"
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Bulk & events",
    icon: Building2,
    color: "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20",
    iconColor: "text-blue-600"
  },
  {
    id: "occasions",
    name: "Special Occasions",
    description: "Weddings, sympathy & more",
    icon: Heart,
    color: "bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20",
    iconColor: "text-red-600",
    popular: true
  }
];

const CategoryTiles = () => {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From classic roses to unique arrangements, find the perfect flowers for every moment
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categoryData.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id}
                className={`group cursor-pointer border-2 hover:border-primary/50 transition-elegant hover:shadow-card-hover hover:-translate-y-1 ${category.color}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center relative">
                  {category.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs animate-bounce-in">
                      Popular
                    </Badge>
                  )}
                  
                  <div className="mb-4 flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center group-hover:scale-110 transition-elegant">
                      <Icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                  </div>
                  
                  <h3 className="font-heading font-semibold text-foreground mb-1 text-sm md:text-base">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryTiles;