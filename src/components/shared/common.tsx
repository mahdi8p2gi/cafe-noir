"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  size = "md",
  onChange,
  readOnly = false,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  onChange?: (v: number) => void;
  readOnly?: boolean;
}) {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-7 w-7" };
  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(s)}
          className={cn(!readOnly && "cursor-pointer transition-transform hover:scale-110")}
          aria-label={`${s} ستاره`}
        >
          <Star
            className={cn(
              sizes[size],
              s <= Math.round(value)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  action,
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "right";
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-8 flex flex-col gap-2",
        align === "center" ? "items-center text-center" : "items-start text-right",
        action && "md:flex-row md:items-end md:justify-between"
      )}
    >
      <div className={align === "center" ? "max-w-2xl" : ""}>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground md:text-base">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
        <Icon className="h-9 w-9 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CoffeeBean({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse cx="12" cy="12" rx="6" ry="9" transform="rotate(45 12 12)" fill="currentColor" />
      <path d="M8 8 L16 16" stroke="var(--background)" strokeWidth="1" />
    </svg>
  );
}
