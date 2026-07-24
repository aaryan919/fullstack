import * as React from "react";
import { cn } from "@/lib/utils";

const Collapsible = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("collapsible", className)} {...props} />
));
Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("collapsible-trigger", className)} {...props} />
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("collapsible-content", className)} {...props} />
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
