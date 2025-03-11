
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex touch-none select-none",
      orientation === "horizontal" ? "w-full h-2" : "h-full w-2 flex-col",
      className
    )}
    orientation={orientation}
    {...props}
  >
    <SliderPrimitive.Track 
      className={cn(
        "relative grow overflow-hidden rounded-full bg-[#1A1A1A]",
        orientation === "horizontal" ? "h-2" : "w-2"
      )}
    >
      <SliderPrimitive.Range className="absolute bg-gradient-to-r from-dreamaker-purple to-[#00D1FF] rounded-full h-full w-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className={cn(
        "block h-10 w-5 rounded-full bg-[#1A1A1A] border border-[#00D1FF] shadow-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:border-dreamaker-purple hover:scale-110 transition-transform",
        orientation === "vertical" ? "-ml-1.5" : "-mt-4",
        "after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:w-3 after:h-[1px] after:bg-[#00D1FF] after:rounded-full"
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
