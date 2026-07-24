import * as React from "react";
import { cn } from "@/lib/utils";

const Dialog = ({ children, ...props }) => <div {...props}>{children}</div>;

const DialogTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("dialog-trigger", className)} {...props} />
));
DialogTrigger.displayName = "DialogTrigger";

const DialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("dialog-content", className)} {...props} />
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("dialog-header", className)} {...props} />
);

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("dialog-footer", className)} {...props} />
);

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("dialog-title", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("dialog-description", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
