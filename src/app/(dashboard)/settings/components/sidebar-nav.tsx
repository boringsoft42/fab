&ldquo;use client&rdquo;;

import Link from &ldquo;next/link&rdquo;;
import { usePathname } from &ldquo;next/navigation&rdquo;;
import { cn } from &ldquo;@/lib/utils&rdquo;;
import { buttonVariants } from &ldquo;@/components/ui/button&rdquo;;
import type { LucideIcon } from &ldquo;lucide-react&rdquo;;

interface SidebarNavProps {
  items: {
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className=&ldquo;flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1&rdquo;>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: &ldquo;ghost&rdquo; }),
            pathname === item.href
              ? &ldquo;bg-muted hover:bg-muted&rdquo;
              : &ldquo;hover:bg-transparent hover:underline&rdquo;,
            &ldquo;justify-start&rdquo;
          )}
        >
          <item.icon className=&ldquo;mr-2 h-4 w-4&rdquo; />
          {item.title}
        </Link>
      ))}
    </nav>
  );
} 