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
import moneyBouquetGold from "@/assets/money-bouquet-gold.jpg";
import moneyBouquetPremium from "@/assets/money-bouquet-premium.jpg";

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
    name: "Tulip Flowers Gift Set",
    price: 7500,
    image: springTulips, // Note: Consider updating the image to match the gift set
    rating: 4.7,
    reviewCount: 92,
    isSameDay: true,
    isPopular: true,
    description: "An elegant gift set featuring a beautiful arrangement of fresh tulips in a decorative vase, perfect for birthdays, anniversaries, or to brighten someone's day. This set includes a selection of vibrant tulips in seasonal colors, carefully arranged with complementary foliage.",
    category: "gift-sets"
  },
  {
    id: "7",
    name: "Purple and Red Roses Bouquet",
    price: 3000,
    image: lavenderBliss, // Note: Consider updating the image to match the new bouquet
    rating: 4.7,
    reviewCount: 112,
    isSameDay: true,
    isPopular: true,
    description: "A stunning bouquet featuring a beautiful mix of purple and red roses, symbolizing enchantment and love. Perfect for romantic occasions, anniversaries, or to make a bold statement of affection.",
    category: "bouquets"
  },
  {
    id: "8",
    name: "Red Rose Flower Bouquet",
    price: 3000,
    image: tropicalParadise, // Note: Update the image when you have a red rose bouquet image
    rating: 4.8,
    reviewCount: 85,
    isSameDay: true,
    isPopular: true,
    description: "A classic bouquet of fresh red roses, symbolizing deep love and passion. Each rose is carefully selected and arranged to create a stunning presentation that's perfect for anniversaries, Valentine's Day, or to express your deepest feelings.",
    category: "bouquets"
  },
  {
    id: "9",
    name: "Premium Red Roses & Fine Wine Gift Set",
    price: 13500,
    image: pinkPeony, // Note: Update the image import when available
    rating: 4.9,
    reviewCount: 112,
    isPopular: true,
    isSameDay: true,
    description: "An exquisite gift set featuring a dozen premium red roses paired with a fine bottle of wine, elegantly presented in a luxury gift box. Perfect for anniversaries, romantic occasions, or to make a lasting impression.",
    category: "gift-sets"
  },
  {
    id: "10",
    name: "Pink Teddy Bear & Red Roses Gift Set",
    price: 9500,
    image: succulentGarden, // Note: Update the image import when available
    rating: 4.9,
    reviewCount: 76,
    isPopular: true,
    isSameDay: true,
    description: "Adorable pink teddy bear paired with a dozen red roses, perfect for birthdays, anniversaries, or to show someone special you care.",
    category: "gift-sets"
  },
  {
    id: "11",
    name: "Red & Blue Roses bouquet",
    price: 4800,
    image: redRoseRomance,
    rating: 4.9,
    reviewCount: 187,
    isPopular: true,
    description: "Classic red roses in elegant presentation, perfect for happy moments.",
    category: "bouquets"
  },
  {
    id: "12",
    name: "Luxury Roses Gift Box",
    price: 12500,
    image: wildflowerMeadow, // Note: Update the image import when available
    rating: 4.9,
    reviewCount: 89,
    isPopular: true,
    isSameDay: true,
    description: "An exquisite collection of premium roses in a luxurious gift box, featuring a mix of red, pink, and white roses, elegantly arranged with seasonal foliage. Perfect for anniversaries, Valentine's Day, or to make a grand romantic gesture.",
    category: "gift-sets"
  },
  {
    id: "13",
    name: "Yellow Roses & Wine Gift Set",
    price: 6500,
    image: lilyElegance,
    rating: 4.7,
    reviewCount: 98,
    isSameDay: true,
    description: "Elegant yellow roses paired with a premium wine bottle, perfect for anniversaries, birthdays, or as a thoughtful gift for any special occasion.",
    category: "gift-sets"
  },
  {
    id: "14",
    name: "Romantic Red Roses & Teddy Bear Set",
    price: 6300,
    image: chrysanthemumCluster, // Note: You might want to update the image import to match the new product
    rating: 4.8,
    reviewCount: 64,
    isSameDay: true,
    description: "A classic romantic gift set featuring a dozen red roses and a premium teddy bear, perfect for anniversaries, Valentine's Day, or to express your love.",
    category: "gift-sets"
  },
  {
    id: "15",
    name: "Exotic Red Roses Collection",
    price: 5500,
    originalPrice: 6800,
    image: exoticProtea,
    rating: 4.9,
    reviewCount: 56,
    isPopular: true,
    description: "Rare red roses flowers, dramatic and unique luxury arrangement.",
    category: "roses"
  },
  {
    id: "16",
    name: "Premium Red Roses & Fine Wine Set",
    price: 8000,
    image: peaceLily, // Note: You might want to update the image import to match the new product
    rating: 4.9,
    reviewCount: 48,
    isPopular: true,
    isSameDay: true,
    description: "An exquisite gift set featuring a dozen premium red roses paired with a fine bottle of wine, elegantly presented in a luxury gift box. Perfect for anniversaries, romantic occasions, or to make a lasting impression.",
    category: "gift-sets"
  },
  {
    id: "17",
    name: "Luxury Gold Money Bouquet",
    price: 10500,
    image: moneyBouquetGold,
    rating: 5.0,
    reviewCount: 73,
    isPopular: true,
    isSameDay: true,
    description: "A stunning money bouquet featuring crisp Kenyan shilling notes artfully arranged like flower petals, decorated with golden ribbons and elegant wrapping. Perfect for graduations, promotions, weddings, or any celebration where you want to give the gift of cash in style.",
    category: "gift-sets"
  },
  {
    id: "18",
    name: "Premium Money Rose Bouquet",
    price: 8500,
    image: moneyBouquetPremium,
    rating: 4.9,
    reviewCount: 61,
    isPopular: true,
    isSameDay: true,
    description: "An elegant money bouquet with Kenyan currency notes expertly folded into beautiful rose shapes, tied with red satin ribbons. A unique and creative way to gift money for birthdays, housewarmings, or special achievements.",
    category: "gift-sets"
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