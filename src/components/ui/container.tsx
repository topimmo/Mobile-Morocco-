import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg" | "full";
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full px-4 sm:px-6",
          {
            "max-w-7xl": size === "default",
            "max-w-4xl": size === "sm",
            "max-w-[1400px]": size === "lg",
            "max-w-full": size === "full",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Container.displayName = "Container";

export { Container };
