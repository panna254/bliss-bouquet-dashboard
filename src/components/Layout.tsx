import { ReactNode } from 'react';
import Header from './Header';
import { Button } from './ui/button';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  showBackToHome?: boolean;
}

const Layout = ({ children, showBackToHome = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {showBackToHome && (
          <div className="container py-4">
            <Button asChild variant="ghost" className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;
