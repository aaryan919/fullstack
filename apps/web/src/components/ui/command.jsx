import * as React from "react";
import { cn } from "@/lib/utils";

const Command = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("command", className)} {...props} />
));
Command.displayName = "Command";

const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("command-input", className)} {...props} />
));
CommandInput.displayName = "CommandInput";

const CommandList = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("command-list", className)} {...props} />
));
CommandList.displayName = "CommandList";

const CommandEmpty = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("command-empty", className)} {...props} />
));
CommandEmpty.displayName = "CommandEmpty";

const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("command-group", className)} {...props} />
));
CommandGroup.displayName = "CommandGroup";

const CommandItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("command-item", className)} {...props} />
));
CommandItem.displayName = "CommandItem";

const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("command-separator", className)} {...props} />
));
CommandSeparator.displayName = "CommandSeparator";

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator };
