import coralDreamsBouquet from "@/assets/coral-dreams-bouquet.jpg";
import gardenFreshMixed from "@/assets/garden-fresh-mixed.jpg";
import whiteOrchid from "@/assets/white-orchid.jpg";
import sunflowerBundle from "@/assets/sunflower-bundle.jpg";
import premiumRoseBox from "@/assets/premium-rose-box.jpg";
import springTulips from "@/assets/spring-tulips.jpg";

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
    price: 89,
    originalPrice: 109,
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
    price: 65,
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
    price: 120,
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
    price: 45,
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
    price: 149,
    originalPrice: 179,
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
    price: 55,
    image: springTulips,
    rating: 4.5,
    reviewCount: 78,
    isSameDay: true,
    description: "Fresh tulips in vibrant colors, capturing the essence of spring.",
    category: "seasonal"
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