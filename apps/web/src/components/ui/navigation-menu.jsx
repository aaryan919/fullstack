import * as React from "react";
import { cn } from "@/lib/utils";

const NavigationMenu = React.forwardRef(({ className, ...props }, ref) => (
  <nav ref={ref} className={cn("navigation-menu", className)} {...props} />
));
NavigationMenu.displayName = "NavigationMenu";

const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("navigation-menu-list", className)} {...props} />
));
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("navigation-menu-item", className)} {...props} />
));
NavigationMenuItem.displayName = "NavigationMenuItem";

const NavigationMenuTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("navigation-menu-trigger", className)} {...props} />
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("navigation-menu-content", className)} {...props} />
));
NavigationMenuContent.displayName = "NavigationMenuContent";

const NavigationMenuLink = React.forwardRef(({ className, ...props }, ref) => (
  <a ref={ref} className={cn("navigation-menu-link", className)} {...props} />
));
NavigationMenuLink.displayName = "NavigationMenuLink";

export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink };
