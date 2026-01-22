import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  as?: "h1" | "h2" | "h3" | "h4";
  align?: "left" | "center" | "right";
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, description, as = "h2", align = "left", ...props }, ref) => {
    const HeadingTag = as;
    
    return (
      <div
        ref={ref}
        className={cn(
          "mb-8",
          {
            "text-left": align === "left",
            "text-center": align === "center",
            "text-right": align === "right",
          },
          className
        )}
        {...props}
      >
        <HeadingTag
          className={cn(
            "font-bold text-foreground tracking-tight",
            {
              "text-3xl md:text-4xl": as === "h1",
              "text-2xl md:text-3xl": as === "h2",
              "text-xl md:text-2xl": as === "h3",
              "text-lg md:text-xl": as === "h4",
            }
          )}
        >
          {title}
        </HeadingTag>
        {description && (
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = "SectionHeader";

export { SectionHeader };
