import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-12 bg-foreground/5 border-t border-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Bliss Bouquet Kenya</h3>
            <p className="text-sm text-muted-foreground">
              Premium flowers and gifts delivered fresh to your doorstep with love and care.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#featured" className="hover:text-primary transition-elegant">Featured</a></li>
              <li><a href="#categories" className="hover:text-primary transition-elegant">Categories</a></li>
              <li><a href="#occasions" className="hover:text-primary transition-elegant">Occasions</a></li>
              <li><a href="#products" className="hover:text-primary transition-elegant">All Products</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/contact-us" className="hover:text-primary transition-elegant">Contact Us</Link></li>
              <li><Link to="/delivery-info" className="hover:text-primary transition-elegant">Delivery Info</Link></li>
              <li><Link to="/care-guide" className="hover:text-primary transition-elegant">Care Guide</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-elegant">Returns</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📞 <a href="tel:0743491613" className="hover:text-primary transition-elegant">0743491613</a></li>
              <li>✉️ <a href="mailto:blissbouquet187@gmail.com" className="hover:text-primary transition-elegant">blissbouquet187@gmail.com</a></li>
              <li>🕒 Mon-Sat: 8AM-8PM</li>
              <li>📍 Same-day delivery available</li>
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
