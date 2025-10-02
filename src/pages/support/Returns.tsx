import { RefreshCw, AlertTriangle, CheckCircle, HelpCircle, Package, Phone, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";

const Returns = () => {
  const returnReasons = [
    {
      title: "Damaged in Transit",
      description: "Items arrived damaged or in poor condition",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      policy: "We'll replace or refund your order"
    },
    {
      title: "Wrong Item",
      description: "Received a different product than ordered",
      icon: <Package className="h-5 w-5 text-blue-500" />,
      policy: "We'll arrange for the correct item to be sent"
    },
    {
      title: "Not as Described",
      description: "Product doesn't match the description or images",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      policy: "Return for a full refund or exchange"
    }
  ];

  const returnProcess = [
    {
      step: "1",
      title: "Contact Us",
      description: "Reach out within 24 hours of delivery with your order number and photos of the issue."
    },
    {
      step: "2",
      title: "Get Approval",
      description: "Our team will review your request and provide return instructions if applicable."
    },
    {
      step: "3",
      title: "Return & Replace",
      description: "For eligible returns, we'll arrange for pickup and process your replacement or refund."
    }
  ];

  return (
    <Layout>
      <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Returns & Exchanges</h1>
          <p className="text-lg text-muted-foreground">
            Our hassle-free return policy for your peace of mind
          </p>
        </div>

        <div className="space-y-12">
          <section className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
                    Our Return Policy
                  </h2>
                  <p className="text-muted-foreground">
                    We want you to be completely satisfied with your purchase. If you're not happy with your order, 
                    please contact us within 24 hours of delivery. Due to the perishable nature of our products, 
                    we can only accept returns for specific circumstances as outlined below.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              Eligible Return Reasons
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {returnReasons.map((reason, index) => (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-foreground/5">
                      {reason.icon}
                    </div>
                    <h3 className="font-medium">{reason.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{reason.description}</p>
                  <p className="text-sm font-medium text-foreground">Our Policy:</p>
                  <p className="text-sm text-muted-foreground">{reason.policy}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              How to Initiate a Return
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {returnProcess.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                      {step.step}
                    </div>
                    {index < returnProcess.length - 1 && (
                      <div className="h-full w-0.5 bg-border my-2"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              Important Notes
            </h2>
            
            <Card className="p-6 space-y-4">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <span className="font-medium text-foreground">24-Hour Window: </span>
                    All return requests must be made within 24 hours of delivery.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <span className="font-medium text-foreground">Photo Evidence: </span>
                    Please provide clear photos of any damaged or incorrect items.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <span className="font-medium text-foreground">Non-Returnable Items: </span>
                    Custom arrangements, perishable items, and final sale items cannot be returned.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>
                    <span className="font-medium text-foreground">Refund Processing: </span>
                    Refunds will be processed within 3-5 business days after we receive the returned items.
                  </span>
                </li>
              </ul>
            </Card>
          </section>

          <section className="bg-muted/30 p-8 rounded-lg">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">Need Help With a Return?</h3>
              <p className="text-muted-foreground mb-6">
                Our customer support team is here to assist you with any questions about returns or exchanges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:0743491613" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call Us: 0743 491 613
                </a>
                <a 
                  href="mailto:blissbouquet187@gmail.com" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email Us
                </a>
              </div>
            </div>
          </section>
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default Returns;
