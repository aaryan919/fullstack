import * as React from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children, ...props }) => <div {...props}>{children}</div>;

const DropdownMenuTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("dropdown-menu-trigger", className)} {...props} />
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("dropdown-menu-content", className)} {...props} />
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("dropdown-menu-item", className)} {...props} />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("dropdown-menu-separator", className)} {...props} />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("dropdown-menu-label", className)} {...props} />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel };
