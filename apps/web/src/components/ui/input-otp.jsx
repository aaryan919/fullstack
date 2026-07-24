import * as React from "react";
import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef(({ className, length = 6, ...props }, ref) => (
  <div ref={ref} className={cn("input-otp", className)} {...props} />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("input-otp-group", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef(({ className, index, ...props }, ref) => (
  <div ref={ref} className={cn("input-otp-slot", className)} {...props} />
));
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("input-otp-separator", className)} role="separator" {...props}>
    -
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
