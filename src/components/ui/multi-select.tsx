import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"

interface MultiSelectProps {
  options: { label: string; value: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Auswählen...",
  disabled = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="relative" ref={ref}>
      <div
        className={cn(
          "flex min-h-[40px] w-full cursor-pointer items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isOpen && "ring-2 ring-ring"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="flex-1 text-muted-foreground">
          {selected.length === 0
            ? placeholder
            : selected.length === 1
              ? options.find((o) => o.value === selected[0])?.label
              : `${selected.length} ausgewählt`}
        </span>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onChange([])
              }}
              className="rounded-full bg-transparent p-1 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-[200px] w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center px-3 py-2 text-sm",
                selected.includes(option.value)
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => !disabled && toggleOption(option.value)}
            >
              <div className="mr-2">
                {selected.includes(option.value) && <Check className="h-4 w-4" />}
              </div>
              {option.label}
            </div>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.map((value) => {
            const option = options.find((o) => o.value === value)
            if (!option) return null
            return (
              <Badge
                key={value}
                variant="secondary"
                className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs"
              >
                {option.label}
                <button
                  onClick={() => toggleOption(value)}
                  className="ml-1 hover:text-accent-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
