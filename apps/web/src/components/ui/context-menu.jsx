import * as React from "react";
import { cn } from "@/lib/utils";

const ContextMenu = ({ children, ...props }) => <div {...props}>{children}</div>;

const ContextMenuTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("context-menu-trigger", className)} {...props} />
));
ContextMenuTrigger.displayName = "ContextMenuTrigger";

const ContextMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("context-menu-content", className)} {...props} />
));
ContextMenuContent.displayName = "ContextMenuContent";

const ContextMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("context-menu-item", className)} {...props} />
));
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("context-menu-separator", className)} {...props} />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator };
