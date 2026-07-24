import * as React from "react";
import { cn } from "@/lib/utils";

const ButtonGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("button-group", className)} role="group" {...props} />
));
ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
