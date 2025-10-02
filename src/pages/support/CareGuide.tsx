import { Droplets, Sun, Scissors, Leaf, Zap, Droplet } from "lucide-react";
import { Card } from "@/components/ui/card";

const CareGuide = () => {
  const careTips = [
    {
      title: "Watering",
      icon: <Droplets className="h-6 w-6 text-primary" />,
      description: "Keep your flowers hydrated with fresh water daily.",
      details: [
        "Change water every 2-3 days",
        "Use room temperature water",
        "Fill vase 2/3 full with water",
        "Remove any leaves below the waterline"
      ]
    },
    {
      title: "Light & Temperature",
      icon: <Sun className="h-6 w-6 text-amber-500" />,
      description: "Find the perfect spot for your flowers to thrive.",
      details: [
        "Keep away from direct sunlight",
        "Avoid heat sources and drafts",
        "Ideal temperature: 18-22°C (65-72°F)",
        "Keep away from ripening fruits"
      ]
    },
    {
      title: "Trimming",
      icon: <Scissors className="h-6 w-6 text-emerald-600" />,
      description: "Proper trimming extends the life of your flowers.",
      details: [
        "Trim stems at a 45° angle",
        "Cut about 2-3cm from the bottom",
        "Use clean, sharp scissors",
        "Remove any wilted leaves or petals"
      ]
    }
  ];

  const flowerCare = [
    {
      type: "Roses",
      care: [
        "Remove guard petals if present",
        "Recut stems underwater for best absorption",
        "Use flower food for longer vase life",
        "Keep in a cool location"
      ]
    },
    {
      type: "Lilies",
      care: [
        "Remove pollen to prevent staining",
        "Remove stamens as they open",
        "Keep away from direct sunlight",
        "Change water frequently"
      ]
    },
    {
      type: "Tulips",
      care: [
        "They continue to grow after being cut",
        "Recut stems every few days",
        "Keep in a cool place",
        "Wrap in paper to straighten if they bend"
      ]
    }
  ];

  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Flower Care Guide</h1>
          <p className="text-lg text-muted-foreground">
            Expert tips to keep your flowers fresh and beautiful for longer
          </p>
        </div>

        <div className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold text-foreground flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              General Care Tips
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {careTips.map((tip, index) => (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      {tip.icon}
                    </div>
                    <h3 className="text-lg font-medium">{tip.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{tip.description}</p>
                  <ul className="space-y-2">
                    {tip.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 mt-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-6 w-6 text-amber-500" />
              Quick Revitalization
            </h2>
            
            <Card className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">For Wilted Flowers</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-foreground">1.</span>
                      <span>Recut stems at a 45° angle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-foreground">2.</span>
                      <span>Place in warm water (not hot) for 1-2 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-foreground">3.</span>
                      <span>Transfer to fresh, cool water with flower food</span>
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-medium mb-3">For Buds That Won't Open</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-foreground">1.</span>
                      <span>Recut stems and place in warm water</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-foreground">2.</span>
                      <span>Keep in a warm room (not in direct sunlight)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium text-foreground">3.</span>
                      <span>Add flower food to encourage blooming</span>
                    </li>
                  </ol>
                </div>
              </div>
            </Card>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              Flower-Specific Care
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {flowerCare.map((flower, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="bg-foreground/5 p-4 border-b">
                    <h3 className="font-medium text-foreground">{flower.type}</h3>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      {flower.care.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Droplet className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="bg-muted/30 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Need More Help?</h3>
            <p className="text-muted-foreground mb-4">
              Our floral experts are happy to provide personalized care advice.
            </p>
            <a 
              href="/contact-us" 
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              Contact Our Support Team
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CareGuide;
