import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] text-white shadow-[0_18px_40px_-24px_rgba(255,107,74,0.75)] hover:translate-y-[-1px]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-[var(--line-soft)] bg-white text-[var(--ink-strong)] hover:bg-[var(--sand)]",
        secondary:
          "bg-[var(--sand)] text-[var(--ink-strong)] hover:bg-[#e9ddd2]",
        ghost:
          "hover:bg-[var(--sand)] hover:text-[var(--ink-strong)]",
        link: "text-[var(--brand)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
