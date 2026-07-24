import * as React from "react";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} type="range" className={cn("slider", className)} {...props} />
));
Slider.displayName = "Slider";

export { Slider };
