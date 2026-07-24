import * as React from "react";
import { cn } from "@/lib/utils";

function Kbd({ className, children, ...props }) {
  return (
    <kbd className={cn("kbd", className)} {...props}>
      {children}
    </kbd>
  );
}

export { Kbd };
