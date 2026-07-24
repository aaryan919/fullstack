import * as React from "react";
import { cn } from "@/lib/utils";

const Menubar = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("menubar", className)} {...props} />
));
Menubar.displayName = "Menubar";

const MenubarMenu = ({ children, ...props }) => <div {...props}>{children}</div>;

const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("menubar-trigger", className)} {...props} />
));
MenubarTrigger.displayName = "MenubarTrigger";

const MenubarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("menubar-content", className)} {...props} />
));
MenubarContent.displayName = "MenubarContent";

const MenubarItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("menubar-item", className)} {...props} />
));
MenubarItem.displayName = "MenubarItem";

const MenubarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("menubar-separator", className)} {...props} />
));
MenubarSeparator.displayName = "MenubarSeparator";

export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator };
