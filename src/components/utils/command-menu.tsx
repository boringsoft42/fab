import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Laptop, Moon, Sun } from "lucide-react";
import { useSearch } from "@/context/search-context";
import { useTheme } from "@/context/theme-context";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { sidebarData } from "@/components/sidebar/data/sidebar-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogTitle } from "@/components/ui/dialog";

export function CommandMenu() {
  const router = useRouter();
  const { open, setOpen } = useSearch();
  const { theme, setTheme } = useTheme();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Command Menu</DialogTitle>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <ScrollArea className="h-[300px]">
            {sidebarData.navGroups.map((group) => (
              <React.Fragment key={group.title}>
                {group.items?.map((item) => {
                  // Only render items that have a direct URL (not collapsible items)
                  if ("url" in item && item.url) {
                    return (
                      <CommandItem
                        key={item.title}
                        value={item.title}
                        onSelect={() => {
                          runCommand(() => router.push(item.url));
                        }}
                      >
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        <span>{item.title}</span>
                        <ArrowRight className="ml-auto h-4 w-4" />
                      </CommandItem>
                    );
                  }
                  return null;
                })}
              </React.Fragment>
            ))}
          </ScrollArea>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            Light
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Laptop className="mr-2 h-4 w-4" />
            System
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
