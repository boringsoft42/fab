import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Laptop, Moon, Sun } from 'lucide-react'
import { useSearch } from '@/context/search-context'
import { useTheme } from '@/context/theme-context'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { sidebarData } from '@/components/sidebar/data/sidebar-data'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DialogTitle } from '@/components/ui/dialog'

export function CommandMenu() {
  