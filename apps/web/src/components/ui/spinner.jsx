import * as React from "react";
import { cn } from "@/lib/utils";

function Spinner({ className, size = "md", ...props }) {
  const sizeClasses = {
    sm: "spinner-sm",
    md: "spinner-md",
    lg: "spinner-lg",
  };

  return <div className={cn("spinner", sizeClasses[size], className)} role="status" aria-label="Loading" {...props} />;
}

export { Spinner };
