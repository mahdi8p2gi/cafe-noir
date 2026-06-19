"use client";

import { useNavStore } from "@/stores/nav-store";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { HomeView } from "@/components/views/home-view";
import { ShopView } from "@/components/views/shop-view";
import { ProductView } from "@/components/views/product-view";
import { CartView } from "@/components/views/cart-view";
import { CheckoutView } from "@/components/views/checkout-view";
import { AuthView } from "@/components/views/auth-view";
import { ProfileView } from "@/components/views/profile-view";
import { AboutView } from "@/components/views/about-view";
import { ContactView } from "@/components/views/contact-view";
import { WishlistView } from "@/components/views/wishlist-view";
import { AdminView } from "@/components/views/admin-view";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const page = useNavStore((s) => s.page);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomeView />;
      case "shop": return <ShopView />;
      case "product": return <ProductView />;
      case "cart": return <CartView />;
      case "checkout": return <CheckoutView />;
      case "auth": return <AuthView />;
      case "profile": return <ProfileView />;
      case "about": return <AboutView />;
      case "contact": return <ContactView />;
      case "wishlist": return <WishlistView />;
      case "admin": return <AdminView />;
      default: return <HomeView />;
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
