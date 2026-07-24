import * as React from "react";
import { cn } from "@/lib/utils";

const Drawer = ({ children, ...props }) => <div {...props}>{children}</div>;

const DrawerTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("drawer-trigger", className)} {...props} />
));
DrawerTrigger.displayName = "DrawerTrigger";

const DrawerContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("drawer-content", className)} {...props} />
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }) => (
  <div className={cn("drawer-header", className)} {...props} />
);

const DrawerFooter = ({ className, ...props }) => (
  <div className={cn("drawer-footer", className)} {...props} />
);

const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("drawer-title", className)} {...props} />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("drawer-description", className)} {...props} />
));
DrawerDescription.displayName = "DrawerDescription";

export { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription };
