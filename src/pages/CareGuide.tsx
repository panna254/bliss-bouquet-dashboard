import { Link } from "react-router-dom";
import { Droplets, Sun, Scissors, ThermometerSun, ArrowLeft, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CareGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-primary/5">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-heading font-bold text-primary">Bliss Bouquet Kenya</h1>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Flower Care Guide
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Keep your flowers fresh and beautiful for longer with our expert care tips.
            </p>
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Flower2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Essential Care Tips</CardTitle>
              <CardDescription>Follow these basics to maximize the life of your flowers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fresh flowers are a beautiful addition to any space, but they need proper care to stay vibrant. 
                Follow our professional tips to enjoy your blooms for as long as possible.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Water Regularly</CardTitle>
                <CardDescription>Keep your flowers hydrated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  • Change water every 2-3 days
                </p>
                <p className="text-sm text-muted-foreground">
                  • Use clean, room temperature water
                </p>
                <p className="text-sm text-muted-foreground">
                  • Fill vase to about 3/4 full
                </p>
                <p className="text-sm text-muted-foreground">
                  • Add flower food if provided
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Scissors className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Trim Stems</CardTitle>
                <CardDescription>Promote water absorption</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  • Cut stems at 45-degree angle
                </p>
                <p className="text-sm text-muted-foreground">
                  • Use sharp, clean scissors or knife
                </p>
                <p className="text-sm text-muted-foreground">
                  • Trim 1-2 cm off bottom
                </p>
                <p className="text-sm text-muted-foreground">
                  • Re-cut every time you change water
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sun className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Perfect Location</CardTitle>
                <CardDescription>Choose the right spot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  • Avoid direct sunlight
                </p>
                <p className="text-sm text-muted-foreground">
                  • Keep away from heat sources
                </p>
                <p className="text-sm text-muted-foreground">
                  • Place in cool, well-ventilated area
                </p>
                <p className="text-sm text-muted-foreground">
                  • Avoid drafty windows or doors
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ThermometerSun className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Temperature Control</CardTitle>
                <CardDescription>Maintain optimal conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  • Ideal temperature: 18-22°C
                </p>
                <p className="text-sm text-muted-foreground">
                  • Keep away from air conditioning vents
                </p>
                <p className="text-sm text-muted-foreground">
                  • Avoid placing near ripening fruit
                </p>
                <p className="text-sm text-muted-foreground">
                  • Remove wilted blooms promptly
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Flower-Specific Care Tips</CardTitle>
              <CardDescription>Different flowers need different care</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="roses">
                  <AccordionTrigger>Roses</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p>• Remove any leaves below the water line to prevent bacterial growth</p>
                    <p>• Roses love flower food - it helps them stay fresh longer</p>
                    <p>• Change water daily and re-cut stems at an angle</p>
                    <p>• Expected lifespan: 7-12 days with proper care</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="lilies">
                  <AccordionTrigger>Lilies</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p>• Remove stamens to prevent pollen stains and extend bloom life</p>
                    <p>• Keep water level consistent as lilies are heavy drinkers</p>
                    <p>• Highly sensitive to ethylene gas - keep away from fruit</p>
                    <p>• Expected lifespan: 8-14 days</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="orchids">
                  <AccordionTrigger>Orchids</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p>• Water once a week with room temperature water</p>
                    <p>• Prefer indirect bright light</p>
                    <p>• Mist leaves occasionally but avoid getting water in crown</p>
                    <p>• Expected lifespan: 2-4 weeks, blooms can last months with proper care</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sunflowers">
                  <AccordionTrigger>Sunflowers</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p>• Woody stems benefit from smashing ends before placing in water</p>
                    <p>• Need lots of water - check daily and refill as needed</p>
                    <p>• Remove lower leaves to keep water clean</p>
                    <p>• Expected lifespan: 6-12 days</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tulips">
                  <AccordionTrigger>Tulips</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-muted-foreground">
                    <p>• Continue to grow in vase - stems may curve toward light</p>
                    <p>• Use cold water to slow growth and extend life</p>
                    <p>• Don't mix with daffodils - they produce harmful sap</p>
                    <p>• Expected lifespan: 5-7 days</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="bg-secondary/5 border-secondary/20">
            <CardHeader>
              <CardTitle>Quick Care Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="trim" className="rounded" />
                  <label htmlFor="trim" className="text-sm text-muted-foreground cursor-pointer">
                    Trim stems at 45-degree angle upon arrival
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="vase" className="rounded" />
                  <label htmlFor="vase" className="text-sm text-muted-foreground cursor-pointer">
                    Use clean vase with fresh water
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="leaves" className="rounded" />
                  <label htmlFor="leaves" className="text-sm text-muted-foreground cursor-pointer">
                    Remove leaves below water line
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="food" className="rounded" />
                  <label htmlFor="food" className="text-sm text-muted-foreground cursor-pointer">
                    Add flower food to water
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="location" className="rounded" />
                  <label htmlFor="location" className="text-sm text-muted-foreground cursor-pointer">
                    Place in cool spot away from direct sunlight
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="change" className="rounded" />
                  <label htmlFor="change" className="text-sm text-muted-foreground cursor-pointer">
                    Change water every 2-3 days
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-8 border-t border-border bg-background/95 backdrop-blur">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Bliss Bouquet Kenya. Made with ❤️ by Ujuzi Solutions.</p>
        </div>
      </footer>
    </div>
  );
};

export default CareGuide;
