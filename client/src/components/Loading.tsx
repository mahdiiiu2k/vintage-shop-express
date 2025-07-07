import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const Loading = ({ className, size = "md", text }: LoadingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

export const LoadingSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse bg-muted rounded-lg", className)} />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <LoadingSkeleton className="h-48 w-full" />
      <LoadingSkeleton className="h-6 w-3/4" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-2/3" />
      <LoadingSkeleton className="h-10 w-full" />
    </div>
  );
};