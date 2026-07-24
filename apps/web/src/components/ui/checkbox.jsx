import * as React from "react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} type="checkbox" className={cn("checkbox", className)} {...props} />
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
