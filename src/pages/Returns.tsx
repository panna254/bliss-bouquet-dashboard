import { RefreshCw, Shield, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Header from "@/components/Header";

const Returns = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Header />

      <main className="container py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Returns & Refunds
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your satisfaction is our priority. Learn about our quality guarantee and return policy.
            </p>
          </div>

          <Alert className="bg-primary/5 border-primary/20">
            <Shield className="h-5 w-5 text-primary" />
            <AlertTitle className="text-lg">100% Satisfaction Guarantee</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              We stand behind the quality of our flowers. If you're not completely satisfied, 
              we'll make it right with a replacement or full refund.
            </AlertDescription>
          </Alert>

          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Our Quality Promise</CardTitle>
              <CardDescription>Fresh flowers, delivered with care</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We source our flowers fresh daily and take great care in arranging and delivering them. 
                Our team ensures every bouquet meets our high standards before it reaches you.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    All flowers are inspected for quality before delivery
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    We guarantee freshness for at least 7 days with proper care
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Professional packaging to protect flowers during transit
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>When to Contact Us</CardTitle>
                <CardDescription>Report issues within 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground font-semibold mb-2">
                  Contact us immediately if:
                </p>
                <p className="text-sm text-muted-foreground">
                  • Flowers arrive damaged or wilted
                </p>
                <p className="text-sm text-muted-foreground">
                  • Wrong items were delivered
                </p>
                <p className="text-sm text-muted-foreground">
                  • Arrangement differs significantly from photos
                </p>
                <p className="text-sm text-muted-foreground">
                  • Any quality concerns upon delivery
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Resolution Options</CardTitle>
                <CardDescription>We'll make it right</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground font-semibold mb-2">
                  We offer:
                </p>
                <p className="text-sm text-muted-foreground">
                  • Free replacement delivery
                </p>
                <p className="text-sm text-muted-foreground">
                  • Full refund to original payment method
                </p>
                <p className="text-sm text-muted-foreground">
                  • Store credit for future purchases
                </p>
                <p className="text-sm text-muted-foreground">
                  • Partial refund for minor issues
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How to Request a Return or Refund</CardTitle>
              <CardDescription>Simple 3-step process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Contact Us Immediately</h4>
                  <p className="text-sm text-muted-foreground">
                    Call us at <a href="tel:0743491613" className="text-primary hover:underline">0743 491 613</a> or 
                    email <a href="mailto:blissbouquet187@gmail.com" className="text-primary hover:underline">blissbouquet187@gmail.com</a> within 
                    24 hours of delivery.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Provide Details & Photos</h4>
                  <p className="text-sm text-muted-foreground">
                    Share your order number and photos of the flowers. This helps us understand 
                    the issue and improve our service.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">We'll Resolve It Quickly</h4>
                  <p className="text-sm text-muted-foreground">
                    Our team will review your case and offer a solution within 2 hours during business hours. 
                    We'll arrange a replacement or process your refund immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader>
              <AlertCircle className="h-6 w-6 text-amber-500 mb-2" />
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                • Claims must be made within 24 hours of delivery
              </p>
              <p className="text-sm text-muted-foreground">
                • Photos are required to process claims for damaged or wilted flowers
              </p>
              <p className="text-sm text-muted-foreground">
                • Natural variations in flowers (color, size) are not eligible for returns
              </p>
              <p className="text-sm text-muted-foreground">
                • Flowers that wilt due to improper care are not covered by our guarantee
              </p>
              <p className="text-sm text-muted-foreground">
                • Delivery issues (wrong address, recipient unavailable) may not qualify for refunds
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>We're here to assist you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Have questions about our return policy or need to report an issue? 
                Contact our customer service team and we'll respond promptly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="tel:0743491613" className="flex-1">
                  <Button className="w-full">
                    <Clock className="mr-2 h-4 w-4" />
                    Call Us
                  </Button>
                </a>
                <a href="mailto:blissbouquet187@gmail.com" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Email Support
                  </Button>
                </a>
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

export default Returns;
