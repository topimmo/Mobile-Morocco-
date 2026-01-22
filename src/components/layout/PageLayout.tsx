import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className="min-h-screen flex flex-col" {...props}>
        {children}
      </div>
    );
  }
);
PageLayout.displayName = "PageLayout";

const PageMain = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn("flex-1", className)}
        {...props}
      >
        {children}
      </main>
    );
  }
);
PageMain.displayName = "PageMain";

export { PageLayout, PageMain };
