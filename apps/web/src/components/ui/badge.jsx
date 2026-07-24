import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "badge-default",
  secondary: "badge-secondary",
  destructive: "badge-destructive",
  outline: "badge-outline",
};

function Badge({ className, variant = "default", ...props }) {
  return <div className={cn("badge", badgeVariants[variant], className)} {...props} />;
}

export { Badge, badgeVariants };
