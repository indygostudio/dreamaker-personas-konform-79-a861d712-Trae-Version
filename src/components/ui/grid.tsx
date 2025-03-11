import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Grid = ({ children, className, ...props }: GridProps) => {
  return (
    <div className={cn("grid", className)} {...props}>
      {children}
    </div>
  );
};