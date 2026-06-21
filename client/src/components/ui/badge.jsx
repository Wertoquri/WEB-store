import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] text-white",
        secondary:
          "border-transparent bg-[var(--sand)] text-[var(--ink-strong)]",
        destructive:
          "border-transparent bg-red-600 text-white",
        outline: "border-[var(--line-soft)] text-[var(--ink-strong)]",
        success:
          "border-transparent bg-emerald-600 text-white",
        warning:
          "border-transparent bg-[var(--gold)] text-[var(--ink-strong)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
