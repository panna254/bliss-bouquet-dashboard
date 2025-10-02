import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      <main className="flex-1 container py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're here to help with your flower needs. Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Phone</CardTitle>
                <CardDescription>Call us directly for immediate assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="tel:0743491613" 
                  className="text-lg font-semibold text-primary hover:underline"
                >
                  0743 491 613
                </a>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email</CardTitle>
                <CardDescription>Send us a message anytime</CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="mailto:blissbouquet187@gmail.com" 
                  className="text-lg font-semibold text-primary hover:underline break-all"
                >
                  blissbouquet187@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>When we're available</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">Monday - Saturday</p>
                <p className="text-muted-foreground">8:00 AM - 8:00 PM</p>
                <p className="text-sm text-muted-foreground mt-2">Closed on Sundays</p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Delivery Coverage</CardTitle>
                <CardDescription>We deliver across Kenya</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">Nationwide Delivery</p>
                <p className="text-muted-foreground">Same-day delivery available in select areas</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>WhatsApp Support</CardTitle>
              <CardDescription>Get instant responses on WhatsApp</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                For the fastest response, message us on WhatsApp. Our team is ready to help with orders, 
                custom arrangements, and any questions you have.
              </p>
              <a 
                href="https://wa.me/254743491613"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full md:w-auto">
                  <Phone className="mr-2 h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </a>
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

export default ContactUs;
