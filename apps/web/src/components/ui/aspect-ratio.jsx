import * as React from "react";
import { cn } from "@/lib/utils";

const AspectRatio = React.forwardRef(({ className, ratio = 16 / 9, children, ...props }, ref) => (
  <div ref={ref} className={cn("aspect-ratio", className)} style={{ paddingBottom: `${100 / ratio}%` }} {...props}>
    <div className="aspect-ratio-content">{children}</div>
  </div>
));
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
