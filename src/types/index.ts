export type Page =
  | "home"
  | "shop"
  | "product"
  | "cart"
  | "checkout"
  | "auth"
  | "profile"
  | "about"
  | "contact"
  | "admin"
  | "wishlist";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string | null;
  price: number;
  discountPrice?: number | null;
  image: string;
  roastLevel?: string | null;
  origin?: string | null;
  weight?: string | null;
  stock: number;
  sku?: string | null;
  rating: number;
  reviewCount: number;
  featured: boolean;
  isActive: boolean;
  categoryId: string;
  category?: Category;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  quantity: number;
  stock: number;
};

export type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { name?: string | null };
};

export type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  address: string;
  city: string;
  phone: string;
  notes?: string | null;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    product?: { image: string };
  }[];
};

export const ROAST_LEVELS: Record<string, string> = {
  LIGHT: "روشن",
  MEDIUM: "متوسط",
  DARK: "تیره",
};

export const ORDER_STATUS: Record<string, string> = {
  PENDING: "در انتظار",
  PROCESSING: "در حال پردازش",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل شده",
  CANCELLED: "لغو شده",
};

export function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}
