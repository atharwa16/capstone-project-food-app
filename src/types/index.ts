// ─── User Types ─────────────────────────────────────────────────────────────

export type UserRole = 'USER' | 'ADMIN';

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  password: string;
  addresses: Address[];
  favoriteRestaurants: string[];
  favoriteDishes: string[];
  createdAt: string;
}

// ─── Restaurant Types ────────────────────────────────────────────────────────

export interface Offer {
  id: string;
  label: string;
  description: string;
  code?: string;
  discount: number;
  type: 'percent' | 'flat';
  minOrder?: number;
}

export interface OpeningHours {
  open: string;
  close: string;
  days: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  logo: string;
  cuisines: string[];
  rating: number;
  reviewCount: number;
  priceForTwo: number;
  deliveryTime: number;
  deliveryFee: number;
  distance: string;
  address: string;
  city: string;
  openingHours: OpeningHours;
  offers: Offer[];
  isVegetarian: boolean;
  isOpen: boolean;
  categories: string[];
}

// ─── Menu Types ──────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian: boolean;
  isPopular: boolean;
  isAvailable: boolean;
  tags?: string[];
}

// ─── Review Types ────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

// ─── Cart Types ──────────────────────────────────────────────────────────────

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Cart {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
}

// ─── Order Types ─────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  address: Address;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  notes?: string;
}

// ─── Refund Types ────────────────────────────────────────────────────────────

export type RefundStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED';

export type RefundReason =
  | 'ORDER_NEVER_ARRIVED'
  | 'WRONG_ITEM'
  | 'MISSING_ITEM'
  | 'FOOD_QUALITY'
  | 'FOOD_DAMAGED'
  | 'RESTAURANT_CANCELLED'
  | 'DUPLICATE_PAYMENT'
  | 'OTHER';

export interface RefundTimelineEntry {
  status: RefundStatus;
  date: string;
  note?: string;
}

export interface Refund {
  id: string;
  orderId: string;
  userId: string;
  restaurantId: string;
  amount: number;
  reason: RefundReason;
  description: string;
  status: RefundStatus;
  timeline: RefundTimelineEntry[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  adminNote?: string;
}

// ─── AI Analysis Types ───────────────────────────────────────────────────────

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface DetectedItem {
  name: string;
  confidence: number;
}

export interface AnalysisResult {
  id: string;
  userId?: string;
  imageUrl: string;
  foodName: string;
  confidence: number;
  detectedItems: DetectedItem[];
  ingredients: string[];
  nutrition: NutritionInfo;
  authenticityResult: 'AUTHENTIC' | 'SUSPICIOUS' | 'UNCERTAIN';
  authenticityScore: number;
  aiInsights: string;
  cuisineType: string;
  analysedAt: string;
}

// ─── Filter & Sort Types ─────────────────────────────────────────────────────

export interface RestaurantFilters {
  rating?: number;
  maxCost?: number;
  minCost?: number;
  cuisines?: string[];
  dietary?: ('vegetarian' | 'vegan' | 'eggless')[];
  hasOffers?: boolean;
  freeDelivery?: boolean;
  isOpen?: boolean;
}

export type SortOption =
  | 'relevance'
  | 'rating'
  | 'delivery_time'
  | 'cost_low'
  | 'cost_high';

// ─── Auth Types ──────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
