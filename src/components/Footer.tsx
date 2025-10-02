import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 bg-foreground/5 border-t border-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex flex-col items-start space-y-3">
              <img 
                src="/logo.png" 
                alt="Bliss Bouquet Kenya" 
                className="h-16 w-auto"
              />
              <h3 className="font-heading font-semibold text-foreground">Bliss Bouquet Kenya</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Kenya's premier florist delivering fresh flowers in Nairobi. Same-day delivery for weddings, birthdays, corporate events. Premium roses, lilies, and custom bouquets since 2020.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Flower Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#featured" className="hover:text-primary transition-elegant">Fresh Flowers Kenya</a></li>
              <li><a href="#categories" className="hover:text-primary transition-elegant">Wedding Bouquets</a></li>
              <li><a href="#occasions" className="hover:text-primary transition-elegant">Birthday Flowers</a></li>
              <li><a href="#products" className="hover:text-primary transition-elegant">Rose Arrangements</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Delivery Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/contact-us" className="hover:text-primary transition-elegant">Contact Florist Nairobi</Link></li>
              <li><Link to="/delivery-info" className="hover:text-primary transition-elegant">Same Day Delivery Kenya</Link></li>
              <li><Link to="/care-guide" className="hover:text-primary transition-elegant">Flower Care Guide</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-elegant">Returns & Refunds</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="tel:0743491613" className="hover:text-primary transition-elegant">0743 491 613</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="mailto:blissbouquet187@gmail.com" className="hover:text-primary transition-elegant">blissbouquet187@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Mon-Sat: 8AM-8PM</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Same-day delivery available</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bliss Bouquet Kenya. Made with <span role="img" aria-label="love">❤️</span> by Ujuzi Solutions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
