import * as React from "react";
import { cn } from "@/lib/utils";

const Sidebar = React.forwardRef(({ className, ...props }, ref) => (
  <aside ref={ref} className={cn("sidebar", className)} {...props} />
));
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sidebar-header", className)} {...props} />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sidebar-content", className)} {...props} />
));
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sidebar-footer", className)} {...props} />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sidebar-group", className)} {...props} />
));
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sidebar-group-label", className)} {...props} />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sidebar-group-content", className)} {...props} />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("sidebar-menu-item", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("sidebar-menu-button", className)} {...props} />
));
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
};
