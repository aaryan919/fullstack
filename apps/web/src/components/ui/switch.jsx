import * as React from "react";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("switch", className)} role="switch" type="button" {...props} />
));
Switch.displayName = "Switch";

export { Switch };
