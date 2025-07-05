&ldquo;use client&rdquo;;

import { Search as SearchIcon } from &ldquo;lucide-react&rdquo;;
import { cn } from &ldquo;@/lib/utils&rdquo;;
import { useSearch } from &ldquo;@/context/search-context&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;

interface Props {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
}

export function Search({ className = &ldquo;&rdquo;, placeholder = &ldquo;Search&rdquo; }: Props) {
  const { setOpen } = useSearch();
  return (
    <Button
      variant=&ldquo;outline&rdquo;
      className={cn(
        &ldquo;relative h-8 w-full flex-1 justify-start rounded-md bg-muted/25 text-sm font-normal text-muted-foreground shadow-none hover:bg-muted/50 sm:pr-12 md:w-40 md:flex-none lg:w-56 xl:w-64&rdquo;,
        className
      )}
      onClick={() => setOpen(true)}
    >
      <SearchIcon
        aria-hidden=&ldquo;true&rdquo;
        className=&ldquo;absolute left-1.5 top-1/2 -translate-y-1/2 h-4 w-4&rdquo;
      />
      <span className=&ldquo;ml-3&rdquo;>{placeholder}</span>
      <kbd className=&ldquo;pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex&rdquo;>
        <span className=&ldquo;text-xs&rdquo;>⌘</span>K
      </kbd>
    </Button>
  );
}
