"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee } from "lucide-react";

export function Preloader() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          {/* ambient glow */}
          <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-[var(--coffee-caramel)] opacity-20 blur-3xl animate-pulse" />

          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              {/* steam */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="steam block h-6 w-1 rounded-full bg-[var(--coffee-caramel)]"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>

              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-[var(--coffee-mocha)] to-[var(--coffee-espresso)] shadow-glow"
              >
                <Coffee className="h-10 w-10 text-[var(--coffee-gold)]" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-lg font-semibold tracking-tight">
                کافه‌نویر
              </p>
              <div className="h-px w-24 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full w-1/2 bg-[var(--coffee-caramel)]"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
