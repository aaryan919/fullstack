import * as React from "react";
import { cn } from "@/lib/utils";

const Form = React.forwardRef(({ className, ...props }, ref) => (
  <form ref={ref} className={cn("form", className)} {...props} />
));
Form.displayName = "Form";

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("form-item", className)} {...props} />
));
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("form-label", className)} {...props} />
));
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("form-control", className)} {...props} />
));
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("form-description", className)} {...props} />
));
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("form-message", className)} {...props} />
));
FormMessage.displayName = "FormMessage";

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage };
