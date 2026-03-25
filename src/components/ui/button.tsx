/**
 * Button component — the single source of truth for all button styles.
 *
 * VARIANTS (change here → reflects everywhere):
 *   - default   : solid primary background
 *   - destructive: red/danger actions
 *   - outline   : bordered, transparent fill
 *   - secondary : muted background for less emphasis
 *   - ghost     : no background until hover
 *   - link      : looks like a hyperlink
 *   - gradient  : hero-gradient fill — used for primary CTAs (e.g. "Get Started")
 *   - success   : green confirmation actions
 *   - warning   : amber/caution actions
 *
 * SIZES:
 *   - default (h-10), sm (h-9), lg (h-11), icon (square h-10)
 *
 * To add a new variant or size, add an entry in the `variants` object below
 * and it will be available project-wide via <Button variant="yourVariant" />.
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  /* ── Base styles shared by every button ── */
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* Solid primary — most common action button */
        default: "bg-primary text-primary-foreground hover:bg-primary/90",

        /* Danger / destructive — delete, remove, cancel */
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",

        /* Bordered — secondary importance, pairs well next to a solid button */
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",

        /* Muted fill — low-emphasis actions */
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        /* Transparent — toolbar / icon actions */
        ghost: "hover:bg-accent hover:text-accent-foreground",

        /* Text-only link style */
        link: "text-primary underline-offset-4 hover:underline",

        /* ✨ NEW: Gradient — hero CTAs, sign-up, donate */
        gradient: "hero-gradient text-primary-foreground border-0 hover:opacity-90",

        /* ✅ NEW: Success — confirm, approve, mark-done */
        success: "bg-success text-success-foreground hover:bg-success/90",

        /* ⚠️ NEW: Warning — caution actions */
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
