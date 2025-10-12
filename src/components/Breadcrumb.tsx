import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap: Record<string, string> = {
    'contact-us': 'Contact Us',
    'delivery-info': 'Delivery Information',
    'care-guide': 'Flower Care Guide',
    'returns': 'Returns & Refunds',
    'roses': 'Premium Roses',
    'bouquets': 'Fresh Bouquets',
    'birthday-flowers': 'Birthday Flowers',
    'wedding-flowers': 'Wedding Flowers',
    'gift-sets': 'Gift Sets',
    'plants': 'Green Plants',
    'anniversary-flowers': 'Anniversary Flowers',
    'sympathy-flowers': 'Sympathy Flowers',
    'valentine-flowers': 'Valentine Flowers',
    'mothers-day-flowers': 'Mother\'s Day Flowers'
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ];

  let currentPath = '';
  pathnames.forEach((pathname) => {
    currentPath += `/${pathname}`;
    const label = breadcrumbNameMap[pathname] || pathname.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    breadcrumbs.push({
      label,
      href: currentPath
    });
  });

  // Don't show breadcrumb on homepage
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="container py-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.href || crumb.label} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
              )}
              
              {isLast ? (
                <span className="text-foreground font-medium flex items-center">
                  {index === 0 && <Home className="h-4 w-4 mr-1" />}
                  {crumb.label}
                </span>
              ) : (
                <Link 
                  to={crumb.href!} 
                  className="hover:text-primary transition-colors flex items-center"
                >
                  {index === 0 && <Home className="h-4 w-4 mr-1" />}
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
