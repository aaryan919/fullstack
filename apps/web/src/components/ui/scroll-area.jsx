import * as React from "react";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("scroll-area", className)} {...props}>
    <div className="scroll-area-viewport">{children}</div>
  </div>
));
ScrollArea.displayName = "ScrollArea";

const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => (
  <div ref={ref} className={cn("scroll-bar", `scroll-bar-${orientation}`, className)} {...props} />
));
ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
