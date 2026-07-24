import * as React from "react";
import { cn } from "@/lib/utils";

const Item = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("item", className)} {...props} />
));
Item.displayName = "Item";

export { Item };
