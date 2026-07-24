import * as React from "react";
import { cn } from "@/lib/utils";

const InputGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("input-group", className)} {...props} />
));
InputGroup.displayName = "InputGroup";

const InputGroupAddon = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("input-group-addon", className)} {...props} />
));
InputGroupAddon.displayName = "InputGroupAddon";

export { InputGroup, InputGroupAddon };
