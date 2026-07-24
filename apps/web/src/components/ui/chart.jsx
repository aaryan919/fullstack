import * as React from "react";
import { cn } from "@/lib/utils";

const ChartContainer = React.forwardRef(({ className, children, config, ...props }, ref) => (
  <div ref={ref} className={cn("chart-container", className)} {...props}>
    {children}
  </div>
));
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = ({ children, ...props }) => <div {...props}>{children}</div>;

const ChartTooltipContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("chart-tooltip-content", className)} {...props} />
));
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = ({ children, ...props }) => <div {...props}>{children}</div>;

const ChartLegendContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("chart-legend-content", className)} {...props} />
));
ChartLegendContent.displayName = "ChartLegendContent";

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent };
