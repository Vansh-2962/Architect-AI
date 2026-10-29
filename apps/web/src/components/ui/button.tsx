import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium",
    "transition-all duration-200 ease-out",
    // outline-based focus ring, because ring-* would be overridden by the custom box-shadows below
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-bright)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:translate-y-0 active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          // white text on the dark burnt orange (light mode), dark text on the lighter orange (dark mode)
          "text-white rounded-xl",
          "bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--accent-bright),white_16%),var(--accent-bright)_50%,color-mix(in_oklab,var(--accent-bright),black_18%))]",
          // inside: top highlight + bottom shade | outside: edge ring + contact shadow + orange glow
          "[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_-2px_4px_0_rgba(0,0,0,0.25),0_0_0_1px_color-mix(in_oklab,var(--accent-bright),black_35%),0_1px_2px_0_rgba(0,0,0,0.3),0_8px_20px_-4px_color-mix(in_oklab,var(--accent-bright)_55%,transparent)]",
          "hover:-translate-y-0.5 hover:brightness-110",
          "hover:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.45),inset_0_-2px_4px_0_rgba(0,0,0,0.25),0_0_0_1px_color-mix(in_oklab,var(--accent-bright),black_35%),0_2px_4px_0_rgba(0,0,0,0.3),0_14px_28px_-4px_color-mix(in_oklab,var(--accent-bright)_70%,transparent)]",
          "active:[box-shadow:inset_0_2px_5px_0_rgba(0,0,0,0.4),0_0_0_1px_color-mix(in_oklab,var(--accent-bright),black_35%)]",
        ].join(" "),

        destructive: [
          "text-white",
          "bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--error),white_16%),var(--error)_50%,color-mix(in_oklab,var(--error),black_18%))]",
          "[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_-2px_4px_0_rgba(0,0,0,0.25),0_0_0_1px_color-mix(in_oklab,var(--error),black_35%),0_1px_2px_0_rgba(0,0,0,0.3),0_8px_20px_-4px_color-mix(in_oklab,var(--error)_55%,transparent)]",
          "hover:-translate-y-0.5 hover:brightness-110",
          "hover:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.45),inset_0_-2px_4px_0_rgba(0,0,0,0.25),0_0_0_1px_color-mix(in_oklab,var(--error),black_35%),0_2px_4px_0_rgba(0,0,0,0.3),0_14px_28px_-4px_color-mix(in_oklab,var(--error)_70%,transparent)]",
          "active:[box-shadow:inset_0_2px_5px_0_rgba(0,0,0,0.4),0_0_0_1px_color-mix(in_oklab,var(--error),black_35%)]",
        ].join(" "),

        outline: [
          "text-[var(--text-primary)]",
          "bg-[linear-gradient(to_bottom,var(--bg-elevated),var(--bg-surface))]",
          "[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.15),inset_0_-1px_2px_0_rgba(0,0,0,0.05),0_0_0_1px_var(--border-default),0_1px_2px_0_rgba(0,0,0,0.08),0_4px_12px_-4px_rgba(0,0,0,0.15)]",
          "hover:-translate-y-0.5 hover:text-[var(--accent-primary)]",
          "hover:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_2px_0_rgba(0,0,0,0.05),0_0_0_1px_var(--accent-bright),0_8px_20px_-4px_var(--accent-glow)]",
          "active:[box-shadow:inset_0_2px_4px_0_rgba(0,0,0,0.15),0_0_0_1px_var(--border-strong)]",
        ].join(" "),

        secondary: [
          "text-[var(--text-primary)]",
          "bg-[linear-gradient(to_bottom,var(--bg-surface),var(--bg-surface-2))]",
          "[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-2px_4px_0_rgba(0,0,0,0.08),0_0_0_1px_var(--border-subtle),0_1px_2px_0_rgba(0,0,0,0.1),0_6px_14px_-4px_rgba(0,0,0,0.18)]",
          "hover:-translate-y-0.5 hover:brightness-105",
          "active:[box-shadow:inset_0_2px_4px_0_rgba(0,0,0,0.18),0_0_0_1px_var(--border-subtle)]",
        ].join(" "),

        ghost: [
          "text-[var(--text-secondary)]",
          "hover:text-[var(--text-primary)]",
          "hover:bg-[linear-gradient(to_bottom,var(--bg-surface),var(--bg-surface-2))]",
          "hover:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_0_1px_var(--border-subtle)]",
        ].join(" "),

        link: "text-[var(--accent-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
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
