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
    name: "Coral Dreams Bouquet",
    price: 3200,
    originalPrice: 3900,
    image: coralDreamsBouquet,
    rating: 4.8,
    reviewCount: 124,
    isPopular: true,
    isSameDay: true,
    description: "Stunning coral roses with white peonies and eucalyptus, perfect for any special occasion.",
    category: "bouquets"
  },
  {
    id: "2", 
    name: "Garden Fresh Mixed",
    price: 2300,
    image: gardenFreshMixed,
    rating: 4.6,
    reviewCount: 89,
    isSameDay: true,
    description: "A delightful mix of seasonal flowers including roses, lilies, and baby's breath.",
    category: "mixed"
  },
  {
    id: "3",
    name: "Elegant White Orchid",
    price: 4200,
    image: whiteOrchid, 
    rating: 4.9,
    reviewCount: 67,
    isPopular: true,
    description: "Sophisticated white orchid in premium ceramic pot, perfect for office or home.",
    category: "plants"
  },
  {
    id: "4",
    name: "Sunny Sunflower Bundle",
    price: 1600,
    image: sunflowerBundle,
    rating: 4.7,
    reviewCount: 156,
    isSameDay: true,
    description: "Bright and cheerful sunflowers to bring sunshine to any room.",
    category: "seasonal"
  },
  {
    id: "5",
    name: "Premium Rose Box",
    price: 5200,
    originalPrice: 6300,
    image: premiumRoseBox,
    rating: 4.9,
    reviewCount: 93,
    isPopular: true,
    description: "Luxury long-stem roses in elegant gift box with gold accents.",
    category: "premium"
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
    category: "seasonal"
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
    category: "mixed"
  },
  {
    id: "9",
    name: "Pink Peony Perfection",
    price: 4100,
    image: pinkPeony,
    rating: 4.9,
    reviewCount: 143,
    isPopular: true,
    description: "Luxury pink peonies in full bloom, romantic and sophisticated.",
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
    category: "premium"
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
    category: "seasonal"
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
    category: "seasonal"
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
    category: "premium"
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
    name: "All Flowers",
    count: products.length
  },
  {
    id: "bouquets", 
    name: "Bouquets",
    count: products.filter(p => p.category === "bouquets").length
  },
  {
    id: "plants",
    name: "Plants", 
    count: products.filter(p => p.category === "plants").length
  },
  {
    id: "premium",
    name: "Premium",
    count: products.filter(p => p.category === "premium").length
  },
  {
    id: "seasonal",
    name: "Seasonal",
    count: products.filter(p => p.category === "seasonal").length
  }
];