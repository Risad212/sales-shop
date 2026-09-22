import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value?: number;
  className?: string;
}

export default function Rating({ value = 0, className }: RatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < Math.round(value);
        return (
          <Star
            key={index}
            className={filled ? "h-4 w-4 fill-yellow-400 text-yellow-400" : "h-4 w-4 text-neutral-300"}
          />
        );
      })}
    </div>
  );
}
