import coralDreamsBouquet from "@/assets/coral-dreams-bouquet.jpg";
import gardenFreshMixed from "@/assets/garden-fresh-mixed.jpg";
import whiteOrchid from "@/assets/white-orchid.jpg";
import sunflowerBundle from "@/assets/sunflower-bundle.jpg";
import premiumRoseBox from "@/assets/premium-rose-box.jpg";
import springTulips from "@/assets/spring-tulips.jpg";
import lavenderBliss from "@/assets/lavender-bliss.jpg";
import tropicalParadise from "@/assets/tropical-paradise.jpg";
import pinkPeony from "@/assets/pink-peony.jpg";
import succulentGarden from "@/assets/succulent-garden.jpg";
import redRoseRomance from "@/assets/red-rose-romance.jpg";
import wildflowerMeadow from "@/assets/wildflower-meadow.jpg";
import lilyElegance from "@/assets/lily-elegance.jpg";
import chrysanthemumCluster from "@/assets/chrysanthemum-cluster.jpg";
import exoticProtea from "@/assets/exotic-protea.jpg";
import peaceLily from "@/assets/peace-lily.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
  isSameDay?: boolean;
  description: string;
  category: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Dreams Bouquet",
    price: 2600,
    originalPrice: 3000,
    image: coralDreamsBouquet,
    rating: 4.8,
    reviewCount: 124,
    isPopular: true,
    isSameDay: true,
    description: "Stunning roses bouquet with white peonies and eucalyptus, perfect for any special occasion.",
    category: "bouquets"
  },
  {
    id: "2", 
    name: "Rose Gift Set",
    price: 8000,
    image: gardenFreshMixed,
    rating: 4.6,
    reviewCount: 89,
    isSameDay: true,
    description: "Elegant bouquet featuring fresh roses, seasonal flowers, and a special touch of rolled notes, beautifully arranged in a premium gift set. Perfect for expressing your heartfelt emotions on any occasion.",
    category: "gift-sets"
  },
  {
    id: "3",
    name: "Packed Roses Bouquet",
    price: 3000,
    image: whiteOrchid, 
    rating: 4.9,
    reviewCount: 67,
    isPopular: true,
    description: "Exquisite packed roses bouquet, hand-tied with seasonal foliage for a fresh and elegant presentation.",
    category: "bouquets"
  },
  {
    id: "4",
    name: "Elegant Rose Gift Hamper",
    price: 7500,
    image: sunflowerBundle, // Note: You might want to update this image to match the rose hamper
    rating: 4.8,
    reviewCount: 64,
    isSameDay: true,
    description: "A luxurious rose gift hamper featuring a beautiful arrangement of premium roses, complemented by gourmet chocolates and a scented candle. Perfect for special occasions and romantic gestures.",
    category: "gift-sets"
  },
  {
    id: "5",
    name: "Premium Rose Box",
    price: 3000,
    originalPrice: 5200,
    image: premiumRoseBox,
    rating: 4.9,
    reviewCount: 93,
    isPopular: true,
    description: "Luxury long-stem roses in elegant gift box with gold accents.",
    category: "roses"
  },
  {
    id: "6",
    name: "Spring Tulip Garden",
    price: 1900,
    image: springTulips,
    rating: 4.5,
    reviewCount: 78,
    isSameDay: true,
    description: "Fresh tulips in vibrant colors, capturing the essence of spring.",
    category: "bouquets"
  },
  {
    id: "7",
    name: "Lavender Bliss Arrangement",
    price: 2800,
    image: lavenderBliss,
    rating: 4.7,
    reviewCount: 112,
    isSameDay: true,
    description: "Purple lavender stems with white roses, calming and elegant.",
    category: "bouquets"
  },
  {
    id: "8",
    name: "Tropical Paradise Mix",
    price: 3500,
    image: tropicalParadise,
    rating: 4.8,
    reviewCount: 85,
    description: "Exotic tropical flowers including bird of paradise and anthuriums.",
    category: "bouquets"
  },
  {
    id: "9",
    name: "Romantic Proposal Gift Set",
    price: 13500,
    image: pinkPeony,
    rating: 4.9,
    reviewCount: 143,
    isPopular: true,
    description: "Exclusive romantic gift set featuring a dozen premium red roses and a fine bottle of red wine, perfect for birthdays, anniversaries, or that special proposal moment.",
    category: "bouquets"
  },
  {
    id: "10",
    name: "Succulent Garden Box",
    price: 2100,
    image: succulentGarden,
    rating: 4.6,
    reviewCount: 91,
    description: "Assorted succulents in wooden box, long-lasting and low maintenance.",
    category: "plants"
  },
  {
    id: "11",
    name: "Red Rose Romance",
    price: 4800,
    image: redRoseRomance,
    rating: 4.9,
    reviewCount: 187,
    isPopular: true,
    description: "Classic red roses in elegant presentation, perfect for romance.",
    category: "roses"
  },
  {
    id: "12",
    name: "Wildflower Meadow",
    price: 1750,
    image: wildflowerMeadow,
    rating: 4.5,
    reviewCount: 64,
    isSameDay: true,
    description: "Rustic wildflower mix with daisies and cosmos, country charm.",
    category: "bouquets"
  },
  {
    id: "13",
    name: "Lily Elegance",
    price: 3100,
    image: lilyElegance,
    rating: 4.7,
    reviewCount: 98,
    isSameDay: true,
    description: "White and pink oriental lilies with greenery, sophisticated choice.",
    category: "bouquets"
  },
  {
    id: "14",
    name: "Chrysanthemum Cluster",
    price: 1950,
    image: chrysanthemumCluster,
    rating: 4.6,
    reviewCount: 73,
    isSameDay: true,
    description: "Colorful chrysanthemums in yellow, orange, and purple.",
    category: "bouquets"
  },
  {
    id: "15",
    name: "Exotic Protea Collection",
    price: 5500,
    originalPrice: 6800,
    image: exoticProtea,
    rating: 4.9,
    reviewCount: 56,
    isPopular: true,
    description: "Rare protea flowers, dramatic and unique luxury arrangement.",
    category: "roses"
  },
  {
    id: "16",
    name: "Peace Lily Plant",
    price: 2400,
    image: peaceLily,
    rating: 4.7,
    reviewCount: 102,
    isSameDay: true,
    description: "Indoor peace lily in decorative pot, air-purifying and elegant.",
    category: "plants"
  }
];

export const categories = [
  {
    id: "all",
    name: "All Products",
    count: products.length
  },
  {
    id: "bouquets", 
    name: "Bouquets",
    count: products.filter(p => p.category === "bouquets").length
  },
  {
    id: "gift-sets",
    name: "Gift Sets",
    count: products.filter(p => p.category === "gift-sets").length
  },
  {
    id: "roses",
    name: "Roses",
    count: products.filter(p => p.category === "roses").length
  }
];