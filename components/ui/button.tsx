import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center border border-transparent justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:shadow-lg transition-all hover:bg-transparent transition-500 hover:text-light-text dark:hover:text-dark-text  dark:hover:border-dark-border hover:border-light-border hover:bg-opacity-10 hover:text-light-heading text-dark-heading",
  {
    variants: {
      variant: {
        default: "bg-active",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-dark-border dark:border-light-border bg-dark-background hover:bg-opacity-10",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground text-light-heading dark:text-dark-heading hover:border-none border-none hover:underline hover:shadow-none",
        link: "text-primary underline-offset-4 hover:underline",
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
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), loading && "opacity-10 bg-slate-300 cursor-not-allowed")}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ?
        <div className="w-7 h-7 border-4 border-dashed rounded-full animate-spin border-gray-500"></div>
          : children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
