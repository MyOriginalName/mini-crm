import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-red-500 focus-visible:ring-red-500",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea } 