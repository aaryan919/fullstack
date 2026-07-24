import * as React from "react";
import { cn } from "@/lib/utils";

const Separator = React.forwardRef(({ className, orientation = "horizontal", ...props }, ref) => (
  <div ref={ref} className={cn("separator", `separator-${orientation}`, className)} role="separator" {...props} />
));
Separator.displayName = "Separator";

export { Separator };
