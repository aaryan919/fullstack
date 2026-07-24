import * as React from "react";
import { cn } from "@/lib/utils";

const AlertDialog = ({ children, ...props }) => <div {...props}>{children}</div>;

const AlertDialogTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("alert-dialog-trigger", className)} {...props} />
));
AlertDialogTrigger.displayName = "AlertDialogTrigger";

const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("alert-dialog-content", className)} {...props} />
));
AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn("alert-dialog-header", className)} {...props} />
);

const AlertDialogFooter = ({ className, ...props }) => (
  <div className={cn("alert-dialog-footer", className)} {...props} />
);

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("alert-dialog-title", className)} {...props} />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("alert-dialog-description", className)} {...props} />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("alert-dialog-action", className)} {...props} />
));
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("alert-dialog-cancel", className)} {...props} />
));
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
