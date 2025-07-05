&ldquo;use client&rdquo;;

import React from &ldquo;react&rdquo;;
import { usePathname } from &ldquo;next/navigation&rdquo;;
import { cn } from &ldquo;@/lib/utils&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import { SidebarTrigger } from &ldquo;@/components/ui/sidebar&rdquo;;

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = React.useState(0);
  const pathname = usePathname();

  // Convert pathname to breadcrumb-like display
  const formattedPath = pathname
    .split(&ldquo;/&rdquo;)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(&ldquo; / &rdquo;);

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener(&ldquo;scroll&rdquo;, onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener(&ldquo;scroll&rdquo;, onScroll);
  }, []);

  return (
    <header
      className={cn(
        &ldquo;flex h-16 items-center gap-3 bg-background p-4 sm:gap-4&rdquo;,
        fixed && &ldquo;header-fixed peer/header fixed z-50 w-[inherit] rounded-md&rdquo;,
        offset > 10 && fixed ? &ldquo;shadow&rdquo; : &ldquo;shadow-none&rdquo;,
        className
      )}
      {...props}
    >
      <SidebarTrigger variant=&ldquo;outline&rdquo; className=&ldquo;scale-125 sm:scale-100&rdquo; />
      <Separator orientation=&ldquo;vertical&rdquo; className=&ldquo;h-6&rdquo; />
      <span className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
        {formattedPath || &ldquo;Dashboard&rdquo;}
      </span>

      {children}
    </header>
  );
}

Header.displayName = &ldquo;Header&rdquo;;
