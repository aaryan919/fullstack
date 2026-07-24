import * as React from "react";
import { cn } from "@/lib/utils";

const ResizablePanelGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("resizable-panel-group", className)} {...props} />
));
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("resizable-panel", className)} {...props} />
));
ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("resizable-handle", className)} {...props} />
));
ResizableHandle.displayName = "ResizableHandle";

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
