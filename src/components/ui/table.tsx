import * as React from &ldquo;react&rdquo;;

import { cn } from &ldquo;@/lib/utils&rdquo;;

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className=&ldquo;relative w-full overflow-auto&rdquo;>
    <table
      ref={ref}
      className={cn(&ldquo;w-full caption-bottom text-sm&rdquo;, className)}
      {...props}
    />
  </div>
));
Table.displayName = &ldquo;Table&rdquo;;

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn(&ldquo;[&_tr]:border-b&rdquo;, className)} {...props} />
));
TableHeader.displayName = &ldquo;TableHeader&rdquo;;

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(&ldquo;[&_tr:last-child]:border-0&rdquo;, className)}
    {...props}
  />
));
TableBody.displayName = &ldquo;TableBody&rdquo;;

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      &ldquo;border-t bg-muted/50 font-medium [&>tr]:last:border-b-0&rdquo;,
      className
    )}
    {...props}
  />
));
TableFooter.displayName = &ldquo;TableFooter&rdquo;;

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      &ldquo;border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted&rdquo;,
      className
    )}
    {...props}
  />
));
TableRow.displayName = &ldquo;TableRow&rdquo;;

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      &ldquo;h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0&rdquo;,
      className
    )}
    {...props}
  />
));
TableHead.displayName = &ldquo;TableHead&rdquo;;

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(&ldquo;p-4 align-middle [&:has([role=checkbox])]:pr-0&rdquo;, className)}
    {...props}
  />
));
TableCell.displayName = &ldquo;TableCell&rdquo;;

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(&ldquo;mt-4 text-sm text-muted-foreground&rdquo;, className)}
    {...props}
  />
));
TableCaption.displayName = &ldquo;TableCaption&rdquo;;

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
