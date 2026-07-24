import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  default: "btn-default",
  destructive: "btn-destructive",
  outline: "btn-outline",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  link: "btn-link",
};

const buttonSizes = {
  default: "btn-md",
  sm: "btn-sm",
  lg: "btn-lg",
  icon: "btn-icon",
};

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => (
  <button ref={ref} className={cn("btn", buttonVariants[variant], buttonSizes[size], className)} {...props} />
));
Button.displayName = "Button";

export { Button, buttonVariants };
