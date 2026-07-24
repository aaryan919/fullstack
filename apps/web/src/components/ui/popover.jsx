import * as React from "react";
import { cn } from "@/lib/utils";

const Popover = ({ children, ...props }) => <div {...props}>{children}</div>;

const PopoverTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("popover-trigger", className)} {...props} />
));
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("popover-content", className)} {...props} />
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
