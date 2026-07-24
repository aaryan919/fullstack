import * as React from "react";
import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }) => (
  <nav className={cn("pagination", className)} role="navigation" aria-label="pagination" {...props} />
);

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("pagination-content", className)} {...props} />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("pagination-item", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ className, isActive, ...props }) => (
  <a className={cn("pagination-link", isActive && "pagination-link-active", className)} aria-current={isActive ? "page" : undefined} {...props} />
);

const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink className={cn("pagination-previous", className)} aria-label="Go to previous page" {...props} />
);

const PaginationNext = ({ className, ...props }) => (
  <PaginationLink className={cn("pagination-next", className)} aria-label="Go to next page" {...props} />
);

const PaginationEllipsis = ({ className, ...props }) => (
  <span className={cn("pagination-ellipsis", className)} aria-hidden {...props}>…</span>
);

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis };
