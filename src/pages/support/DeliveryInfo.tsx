import { Truck, Clock, MapPin, Package, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const DeliveryInfo = () => {
  const deliveryOptions = [
    {
      title: "Same-Day Delivery",
      description: "Order by 2PM for same-day delivery within Nairobi.",
      icon: <Clock className="h-6 w-6 text-primary" />,
      price: "KSh 500",
      available: true,
      details: [
        "Available Monday - Saturday",
        "Delivery between 9AM - 8PM",
        "Order by 2PM for same-day delivery"
      ]
    },
    {
      title: "Next-Day Delivery",
      description: "Order by 9PM for next-day delivery.",
      icon: <Truck className="h-6 w-6 text-primary" />,
      price: "KSh 400",
      available: true,
      details: [
        "Available 7 days a week",
        "Delivery between 9AM - 8PM",
        "Order by 9PM for next-day delivery"
      ]
    },
    {
      title: "Scheduled Delivery",
      description: "Plan ahead for special occasions.",
      icon: <Clock className="h-6 w-6 text-primary" />,
      price: "KSh 600",
      available: true,
      details: [
        "Book up to 30 days in advance",
        "Specific time slots available",
        "Perfect for events and special occasions"
      ]
    }
  ];

  const coverageAreas = [
    "Nairobi CBD",
    "Westlands",
    "Karen",
    "Runda",
    "Gigiri",
    "Lavington",
    "Kileleshwa",
    "Kilimani",
    "Parklands",
    "Upper Hill"
  ];

  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Delivery Information</h1>
          <p className="text-lg text-muted-foreground">
            Fast, reliable flower delivery to brighten someone's day
          </p>
        </div>

        <div className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold text-foreground flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              Delivery Options
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {deliveryOptions.map((option, index) => (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      {option.icon}
                    </div>
                    <h3 className="text-lg font-medium">{option.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{option.description}</p>
                  <div className="space-y-2 mb-4">
                    {option.details.map((detail, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="h-1 w-1 mt-2 rounded-full bg-primary flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{detail}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-lg font-semibold">{option.price}</p>
                    {!option.available && (
                      <p className="text-sm text-destructive mt-1">Currently unavailable</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Delivery Areas
            </h2>
            
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {coverageAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{area}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Don't see your area? Contact us to check if we can deliver to your location.
              </p>
            </Card>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold text-foreground flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Order Processing
            </h2>
            
            <Card className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Processing Time</h3>
                  <p className="text-muted-foreground text-sm">
                    Orders are typically processed within 1-2 hours during business hours. 
                    For same-day delivery, please place your order by 2PM.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Delivery Instructions</h3>
                  <p className="text-muted-foreground text-sm">
                    Please provide specific delivery instructions during checkout. 
                    If the recipient isn't available, we'll contact them to arrange a suitable delivery time.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <section className="bg-muted/30 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              Have questions about delivery? Our team is here to help.
            </p>
            <a 
              href="/contact-us" 
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              Contact Us
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

export default DeliveryInfo;
