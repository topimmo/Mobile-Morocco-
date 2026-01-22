import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          "relative animate-spin rounded-full border-2 border-gray-200",
          "border-t-blue-500",
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <p className="mt-3 text-sm font-medium text-gray-500">{text}</p>
      )}
    </div>
  );
}

interface LoadingScreenProps {
  text?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({ text, fullScreen = false }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl",
        fullScreen ? "fixed inset-0 z-50" : "h-full w-full"
      )}
    >
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-gray-100 border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-blue-500/20 animate-pulse" />
        </div>
      </div>
      {text && (
        <p className="mt-6 text-base font-medium text-gray-700">{text}</p>
      )}
    </div>
  );
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1.5", className)}>
      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
    </div>
  );
}

export function LoadingPulse({ className }: { className?: string }) {
  return (
    <div className="flex justify-center">
      <div className={cn("relative", className)}>
        <div className="h-12 w-12 rounded-full border-2 border-gray-200" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-blue-500 animate-ping opacity-75" />
        </div>
      </div>
    </div>
  );
}
