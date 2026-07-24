import * as React from "react";
import { cn } from "@/lib/utils";

function Empty({ className, title, description, children, ...props }) {
  return (
    <div className={cn("empty", className)} {...props}>
      {title && <h3 className="empty-title">{title}</h3>}
      {description && <p className="empty-description">{description}</p>}
      {children}
    </div>
  );
}

export { Empty };
