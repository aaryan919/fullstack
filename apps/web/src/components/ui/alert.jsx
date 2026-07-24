import * as React from "react";
import { cn } from "@/lib/utils";

const alertVariants = {
  default: "alert-default",
  destructive: "alert-destructive",
};

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <div ref={ref} role="alert" className={cn("alert", alertVariants[variant], className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("alert-title", className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("alert-description", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
