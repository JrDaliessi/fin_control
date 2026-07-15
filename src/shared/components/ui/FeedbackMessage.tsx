import clsx from "clsx";
import type { HTMLAttributes } from "react";

type FeedbackVariant = "status" | "error";

export type FeedbackMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  variant: FeedbackVariant;
};

export function FeedbackMessage({
  className,
  variant,
  ...props
}: FeedbackMessageProps) {
  return (
    <p
      className={clsx(
        "rounded-md px-3 py-2 text-sm",
        variant === "error"
          ? "bg-danger-surface text-danger-foreground"
          : "bg-success-surface text-primary",
        className,
      )}
      role={variant === "error" ? "alert" : "status"}
      {...props}
    />
  );
}
