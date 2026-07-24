import * as React from "react";
import { cn } from "@/lib/utils";

const Accordion = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("accordion", className)} {...props} />
));
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("accordion-item", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <button ref={ref} className={cn("accordion-trigger", className)} {...props}>
    {children}
  </button>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("accordion-content", className)} {...props}>
    {children}
  </div>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
