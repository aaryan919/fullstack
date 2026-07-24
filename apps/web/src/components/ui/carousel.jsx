import * as React from "react";
import { cn } from "@/lib/utils";

const Carousel = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("carousel", className)} role="region" aria-roledescription="carousel" {...props} />
));
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("carousel-content", className)} {...props} />
));
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("carousel-item", className)} role="group" aria-roledescription="slide" {...props} />
));
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("carousel-previous", className)} {...props} />
));
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn("carousel-next", className)} {...props} />
));
CarouselNext.displayName = "CarouselNext";

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
