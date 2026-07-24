import * as React from "react";
import { cn } from "@/lib/utils";

const Select = ({ children, ...props }) => <div {...props}>{children}</div>;

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <button ref={ref} className={cn("select-trigger", className)} {...props}>{children}</button>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef(({ className, placeholder, ...props }, ref) => (
  <span ref={ref} className={cn("select-value", className)} {...props}>{placeholder}</span>
));
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("select-content", className)} {...props} />
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("select-item", className)} {...props} />
));
SelectItem.displayName = "SelectItem";

const SelectGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("select-group", className)} {...props} />
));
SelectGroup.displayName = "SelectGroup";

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("select-label", className)} {...props} />
));
SelectLabel.displayName = "SelectLabel";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel };
