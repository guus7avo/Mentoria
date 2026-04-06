import { ReactNode } from "react";
import clsx from "clsx";

type IconBadgeProps = {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function IconBadge({ children, size = "md", className }: IconBadgeProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-xl",
  };

  return (
    <div
      className={clsx(
        "rounded-xl flex items-center justify-center",
        "bg-linear-to-br from-purple-500 to-blue-600 text-white font-bold",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
