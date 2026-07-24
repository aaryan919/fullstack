import * as React from "react";
import { cn } from "@/lib/utils";

const Field = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("field", className)} {...props}>
    {children}
  </div>
));
Field.displayName = "Field";

const FieldLabel = React.forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("field-label", className)} {...props} />
));
FieldLabel.displayName = "FieldLabel";

const FieldMessage = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("field-message", className)} {...props} />
));
FieldMessage.displayName = "FieldMessage";

export { Field, FieldLabel, FieldMessage };
