import clsx from "clsx";
import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-border bg-surface p-4 text-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
