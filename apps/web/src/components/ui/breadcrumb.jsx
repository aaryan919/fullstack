import * as React from "react";
import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef(({ className, ...props }, ref) => (
  <nav ref={ref} aria-label="breadcrumb" className={cn("breadcrumb", className)} {...props} />
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn("breadcrumb-list", className)} {...props} />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("breadcrumb-item", className)} {...props} />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef(({ className, ...props }, ref) => (
  <a ref={ref} className={cn("breadcrumb-link", className)} {...props} />
));
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbSeparator = ({ className, ...props }) => (
  <li className={cn("breadcrumb-separator", className)} role="presentation" aria-hidden="true" {...props}>
    /
  </li>
);

const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("breadcrumb-page", className)} role="link" aria-current="page" {...props} />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage };
