import * as React from "react";
import { cn } from "@/lib/utils";

const HoverCard = ({ children, ...props }) => <div {...props}>{children}</div>;

const HoverCardTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("hover-card-trigger", className)} {...props} />
));
HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("hover-card-content", className)} {...props} />
));
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
