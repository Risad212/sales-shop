import { cn } from "@/lib/utils";

interface TitleBorderProps {
  className?: string;
}

export default function TitleBorder({ className }: TitleBorderProps) {
  return (
    <div className={cn("m-auto mb-[35px] h-[4px] w-[100px] bg-[#6BB42F]", className)} />
  );
}
