import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from "../components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <SEOHead
        title="404 Not Found | Page Missing - Bliss Bouquet Kenya"
        description="Sorry, the page you are looking for does not exist. Visit Bliss Bouquet Kenya for premium flower delivery and unique bouquets in Nairobi."
        canonical="https://blissbouquetkenya.com/404"
        keywords="404 error, page not found, Bliss Bouquet Kenya, florist Nairobi, missing page flowers"
        ogTitle="404 Page Not Found | Bliss Bouquet Kenya Flowers"
        ogDescription="This page could not be found. Browse home for fresh flowers, bouquets, and florist info in Nairobi, Kenya."
      />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
