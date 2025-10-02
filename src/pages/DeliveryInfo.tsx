import { Truck, Clock, MapPin, Package, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DeliveryInfo = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      <Header />
      <main className="flex-1 container py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Delivery Information
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fresh flowers delivered with care. Learn about our delivery options and coverage areas.
            </p>
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Same-Day Delivery</CardTitle>
              <CardDescription>Order before 2 PM for same-day delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We offer same-day delivery for orders placed before 2:00 PM within select coverage areas. 
                Perfect for last-minute gifts and special occasions.
              </p>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Orders placed after 2 PM will be delivered the next business day
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Coverage Areas</CardTitle>
                <CardDescription>We deliver nationwide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-foreground mb-1">Same-Day Areas:</p>
                  <p className="text-sm text-muted-foreground">
                    Nairobi CBD, Westlands, Kilimani, Karen, Lavington, Kileleshwa, and surrounding areas
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Next-Day Delivery:</p>
                  <p className="text-sm text-muted-foreground">
                    All major cities and towns across Kenya
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Delivery Times</CardTitle>
                <CardDescription>When you can expect your order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-foreground mb-1">Morning Slot:</p>
                  <p className="text-sm text-muted-foreground">9:00 AM - 12:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Afternoon Slot:</p>
                  <p className="text-sm text-muted-foreground">2:00 PM - 5:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Evening Slot:</p>
                  <p className="text-sm text-muted-foreground">5:00 PM - 7:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Delivery Rates</CardTitle>
              <CardDescription>Transparent pricing for all deliveries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b border-border pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-foreground">Within Nairobi</p>
                    <p className="text-sm text-muted-foreground">Same-day delivery available</p>
                  </div>
                  <p className="text-lg font-bold text-primary">KES 500</p>
                </div>
              </div>
              <div className="border-b border-border pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-foreground">Nairobi Suburbs</p>
                    <p className="text-sm text-muted-foreground">Within 20km radius</p>
                  </div>
                  <p className="text-lg font-bold text-primary">KES 800</p>
                </div>
              </div>
              <div className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-foreground">Upcountry</p>
                    <p className="text-sm text-muted-foreground">Major cities and towns</p>
                  </div>
                  <p className="text-lg font-bold text-primary">KES 1,500+</p>
                </div>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Free delivery</strong> on orders above KES 5,000 within Nairobi
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/5 border-secondary/20">
            <CardHeader>
              <CardTitle>Delivery Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Ensure someone is available at the delivery address to receive the flowers
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Provide accurate contact information for the recipient
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Our delivery team will call before arrival
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  For surprises, we can coordinate discreetly with the recipient
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-8">
            <a href="/" className="inline-block">
              <button className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200 font-medium">
                ← Back to Home
              </button>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryInfo;
