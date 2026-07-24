import * as React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => (
  <div ref={ref} className={cn("progress", className)} {...props}>
    <div className="progress-indicator" style={{ transform: `translateX(-${100 - value}%)` }} />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
