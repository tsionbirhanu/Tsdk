import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium font-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] shadow-warm",
        destructive:
          "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90",
        outline:
          "border border-[var(--color-border)] bg-white hover:bg-[var(--color-surface)] text-[var(--color-primary)]",
        secondary:
          "bg-[var(--color-surface-2)] text-[var(--color-text)] hover:bg-[var(--color-surface-2)]/80",
        ghost: "hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
        accent:
          "bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent)]/90 font-medium",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
        wide: "h-12 px-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
