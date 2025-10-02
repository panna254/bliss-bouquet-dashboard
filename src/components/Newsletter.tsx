import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Submit to Netlify Forms
      const formData = new FormData();
      formData.append('form-name', 'newsletter');
      formData.append('email', email);

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
        
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for subscribing to our newsletter. You'll receive exclusive offers and flower care tips.",
        });

        // Reset success state after 5 seconds
        setTimeout(() => setIsSubscribed(false), 5000);
      } else {
        throw new Error('Form submission failed');
      }
      
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-hero">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              Welcome to Our Garden!
            </h2>
            <p className="text-lg text-muted-foreground">
              You're now subscribed to receive exclusive offers, seasonal arrangements, and expert flower care tips.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsSubscribed(false)}
              className="mt-4"
            >
              Subscribe Another Email
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-hero">
      <div className="container text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Stay in Bloom
          </h2>
          <p className="text-lg text-muted-foreground">
            Get exclusive offers, seasonal arrangements, and flower care tips delivered to your inbox
          </p>
          
          <form 
            name="newsletter" 
            method="POST" 
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubscribe} 
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input type="hidden" name="form-name" value="newsletter" />
            <input type="hidden" name="bot-field" />
            <Input 
              type="email" 
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 text-base"
              disabled={isLoading}
              required
            />
            <Button 
              type="submit" 
              size="lg" 
              disabled={isLoading}
              className="h-12 px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>
          
          <p className="text-sm text-muted-foreground">
            Join over 1,000+ flower lovers who receive our weekly newsletter. 
            <br />
            Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
