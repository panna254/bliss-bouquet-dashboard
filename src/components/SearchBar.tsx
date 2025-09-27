import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Nairobi");

  return (
    <div className="w-full max-w-4xl mx-auto bg-background/95 backdrop-blur rounded-2xl shadow-elegant border border-border p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search flowers, occasions, or message ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-foreground placeholder:text-muted-foreground bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-elegant"
          />
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-4">
          <div className="relative min-w-[200px]">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-foreground bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-elegant appearance-none cursor-pointer"
            >
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Kisumu">Kisumu</option>
              <option value="Eldoret">Eldoret</option>
              <option value="Nakuru">Nakuru</option>
              <option value="Thika">Thika</option>
              <option value="Kitale">Kitale</option>
              <option value="Machakos">Machakos</option>
              <option value="Nyeri">Nyeri</option>
              <option value="Meru">Meru</option>
            </select>
          </div>

          {/* Search Button */}
          <Button variant="hero" size="lg" className="px-8">
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Quick Search Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-sm text-muted-foreground mr-2">Popular:</span>
        {["Roses", "Birthday Bouquet", "Anniversary", "Same-Day", "Sympathy"].map((tag) => (
          <button
            key={tag}
            className="px-3 py-1 text-sm bg-muted hover:bg-accent hover:text-accent-foreground rounded-full transition-elegant"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;