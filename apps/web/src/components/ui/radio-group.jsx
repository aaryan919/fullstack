import * as React from "react";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("radio-group", className)} role="radiogroup" {...props} />
));
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} type="radio" className={cn("radio-group-item", className)} {...props} />
));
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
