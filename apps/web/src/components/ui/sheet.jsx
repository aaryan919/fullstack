import * as React from "react";
import { cn } from "@/lib/utils";

const Sheet = ({ children, ...props }) => <div {...props}>{children}</div>;

const SheetTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("sheet-trigger", className)} {...props} />
));
SheetTrigger.displayName = "SheetTrigger";

const SheetContent = React.forwardRef(({ className, side = "right", ...props }, ref) => (
  <div ref={ref} className={cn("sheet-content", `sheet-${side}`, className)} {...props} />
));
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }) => (
  <div className={cn("sheet-header", className)} {...props} />
);

const SheetFooter = ({ className, ...props }) => (
  <div className={cn("sheet-footer", className)} {...props} />
);

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("sheet-title", className)} {...props} />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("sheet-description", className)} {...props} />
));
SheetDescription.displayName = "SheetDescription";

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
