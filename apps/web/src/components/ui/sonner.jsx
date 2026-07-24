import * as React from "react";
import { cn } from "@/lib/utils";

function Sonner({ className, ...props }) {
  return <div className={cn("sonner", className)} {...props} />;
}

export { Sonner };
