&ldquo;use client&rdquo;

import * as React from &ldquo;react&rdquo;
import { ChevronLeft, ChevronRight } from &ldquo;lucide-react&rdquo;
import { DayPicker } from &ldquo;react-day-picker&rdquo;

import { cn } from &ldquo;@/lib/utils&rdquo;
import { buttonVariants } from &ldquo;@/components/ui/button&rdquo;

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(&ldquo;p-3&rdquo;, className)}
      classNames={{
        months: &ldquo;flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0&rdquo;,
        month: &ldquo;space-y-4&rdquo;,
        caption: &ldquo;flex justify-center pt-1 relative items-center&rdquo;,
        caption_label: &ldquo;text-sm font-medium&rdquo;,
        nav: &ldquo;space-x-1 flex items-center&rdquo;,
        nav_button: cn(
          buttonVariants({ variant: &ldquo;outline&rdquo; }),
          &ldquo;h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100&rdquo;
        ),
        nav_button_previous: &ldquo;absolute left-1&rdquo;,
        nav_button_next: &ldquo;absolute right-1&rdquo;,
        table: &ldquo;w-full border-collapse space-y-1&rdquo;,
        head_row: &ldquo;flex&rdquo;,
        head_cell:
          &ldquo;text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]&rdquo;,
        row: &ldquo;flex w-full mt-2&rdquo;,
        cell: cn(
          &ldquo;relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md&rdquo;,
          props.mode === &ldquo;range&rdquo;
            ? &ldquo;[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md&rdquo;
            : &ldquo;[&:has([aria-selected])]:rounded-md&rdquo;
        ),
        day: cn(
          buttonVariants({ variant: &ldquo;ghost&rdquo; }),
          &ldquo;h-8 w-8 p-0 font-normal aria-selected:opacity-100&rdquo;
        ),
        day_range_start: &ldquo;day-range-start&rdquo;,
        day_range_end: &ldquo;day-range-end&rdquo;,
        day_selected:
          &ldquo;bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground&rdquo;,
        day_today: &ldquo;bg-accent text-accent-foreground&rdquo;,
        day_outside:
          &ldquo;day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground&rdquo;,
        day_disabled: &ldquo;text-muted-foreground opacity-50&rdquo;,
        day_range_middle:
          &ldquo;aria-selected:bg-accent aria-selected:text-accent-foreground&rdquo;,
        day_hidden: &ldquo;invisible&rdquo;,
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn(&ldquo;h-4 w-4&rdquo;, className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn(&ldquo;h-4 w-4&rdquo;, className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = &ldquo;Calendar&rdquo;

export { Calendar }
