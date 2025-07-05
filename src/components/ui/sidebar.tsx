&ldquo;use client&rdquo;

import * as React from &ldquo;react&rdquo;
import { Slot } from &ldquo;@radix-ui/react-slot&rdquo;
import { VariantProps, cva } from &ldquo;class-variance-authority&rdquo;
import { PanelLeft } from &ldquo;lucide-react&rdquo;

import { useIsMobile } from &ldquo;@/hooks/use-mobile&rdquo;
import { cn } from &ldquo;@/lib/utils&rdquo;
import { Button } from &ldquo;@/components/ui/button&rdquo;
import { Input } from &ldquo;@/components/ui/input&rdquo;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;
import { Sheet, SheetContent } from &ldquo;@/components/ui/sheet&rdquo;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from &ldquo;@/components/ui/tooltip&rdquo;

const SIDEBAR_COOKIE_NAME = &ldquo;sidebar_state&rdquo;
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = &ldquo;16rem&rdquo;
const SIDEBAR_WIDTH_MOBILE = &ldquo;18rem&rdquo;
const SIDEBAR_WIDTH_ICON = &ldquo;3rem&rdquo;
const SIDEBAR_KEYBOARD_SHORTCUT = &ldquo;b&rdquo;

type SidebarContext = {
  state: &ldquo;expanded&rdquo; | &ldquo;collapsed&rdquo;
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error(&ldquo;useSidebar must be used within a SidebarProvider.&rdquo;)
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<&ldquo;div&rdquo;> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === &ldquo;function&rdquo; ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener(&ldquo;keydown&rdquo;, handleKeyDown)
      return () => window.removeEventListener(&ldquo;keydown&rdquo;, handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state=&ldquo;expanded&rdquo; or &ldquo;collapsed&rdquo;.
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? &ldquo;expanded&rdquo; : &ldquo;collapsed&rdquo;

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                &ldquo;--sidebar-width&rdquo;: SIDEBAR_WIDTH,
                &ldquo;--sidebar-width-icon&rdquo;: SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              &ldquo;group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar&rdquo;,
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = &ldquo;SidebarProvider&rdquo;

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<&ldquo;div&rdquo;> & {
    side?: &ldquo;left&rdquo; | &ldquo;right&rdquo;
    variant?: &ldquo;sidebar&rdquo; | &ldquo;floating&rdquo; | &ldquo;inset&rdquo;
    collapsible?: &ldquo;offcanvas&rdquo; | &ldquo;icon&rdquo; | &ldquo;none&rdquo;
  }
>(
  (
    {
      side = &ldquo;left&rdquo;,
      variant = &ldquo;sidebar&rdquo;,
      collapsible = &ldquo;offcanvas&rdquo;,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === &ldquo;none&rdquo;) {
      return (
        <div
          className={cn(
            &ldquo;flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground&rdquo;,
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar=&ldquo;sidebar&rdquo;
            data-mobile=&ldquo;true&rdquo;
            className=&ldquo;w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden&rdquo;
            style={
              {
                &ldquo;--sidebar-width&rdquo;: SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className=&ldquo;flex h-full w-full flex-col&rdquo;>{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className=&ldquo;group peer hidden text-sidebar-foreground md:block&rdquo;
        data-state={state}
        data-collapsible={state === &ldquo;collapsed&rdquo; ? collapsible : &ldquo;&rdquo;}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            &ldquo;relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear&rdquo;,
            &ldquo;group-data-[collapsible=offcanvas]:w-0&rdquo;,
            &ldquo;group-data-[side=right]:rotate-180&rdquo;,
            variant === &ldquo;floating&rdquo; || variant === &ldquo;inset&rdquo;
              ? &ldquo;group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]&rdquo;
              : &ldquo;group-data-[collapsible=icon]:w-[--sidebar-width-icon]&rdquo;
          )}
        />
        <div
          className={cn(
            &ldquo;fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex&rdquo;,
            side === &ldquo;left&rdquo;
              ? &ldquo;left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]&rdquo;
              : &ldquo;right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]&rdquo;,
            // Adjust the padding for floating and inset variants.
            variant === &ldquo;floating&rdquo; || variant === &ldquo;inset&rdquo;
              ? &ldquo;p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]&rdquo;
              : &ldquo;group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l&rdquo;,
            className
          )}
          {...props}
        >
          <div
            data-sidebar=&ldquo;sidebar&rdquo;
            className=&ldquo;flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow&rdquo;
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = &ldquo;Sidebar&rdquo;

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar=&ldquo;trigger&rdquo;
      variant=&ldquo;ghost&rdquo;
      size=&ldquo;icon&rdquo;
      className={cn(&ldquo;h-7 w-7&rdquo;, className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className=&ldquo;sr-only&rdquo;>Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = &ldquo;SidebarTrigger&rdquo;

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<&ldquo;button&rdquo;>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar=&ldquo;rail&rdquo;
      aria-label=&ldquo;Toggle Sidebar&rdquo;
      tabIndex={-1}
      onClick={toggleSidebar}
      title=&ldquo;Toggle Sidebar&rdquo;
      className={cn(
        &ldquo;absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex&rdquo;,
        &ldquo;[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize&rdquo;,
        &ldquo;[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize&rdquo;,
        &ldquo;group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar&rdquo;,
        &ldquo;[[data-side=left][data-collapsible=offcanvas]_&]:-right-2&rdquo;,
        &ldquo;[[data-side=right][data-collapsible=offcanvas]_&]:-left-2&rdquo;,
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = &ldquo;SidebarRail&rdquo;

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<&ldquo;main&rdquo;>
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        &ldquo;relative flex min-h-svh flex-1 flex-col bg-background&rdquo;,
        &ldquo;peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow&rdquo;,
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = &ldquo;SidebarInset&rdquo;

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar=&ldquo;input&rdquo;
      className={cn(
        &ldquo;h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring&rdquo;,
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = &ldquo;SidebarInput&rdquo;

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<&ldquo;div&rdquo;>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar=&ldquo;header&rdquo;
      className={cn(&ldquo;flex flex-col gap-2 p-2&rdquo;, className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = &ldquo;SidebarHeader&rdquo;

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<&ldquo;div&rdquo;>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar=&ldquo;footer&rdquo;
      className={cn(&ldquo;flex flex-col gap-2 p-2&rdquo;, className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = &ldquo;SidebarFooter&rdquo;

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar=&ldquo;separator&rdquo;
      className={cn(&ldquo;mx-2 w-auto bg-sidebar-border&rdquo;, className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = &ldquo;SidebarSeparator&rdquo;

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<&ldquo;div&rdquo;>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar=&ldquo;content&rdquo;
      className={cn(
        &ldquo;flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden&rdquo;,
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = &ldquo;SidebarContent&rdquo;

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<&ldquo;div&rdquo;>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar=&ldquo;group&rdquo;
      className={cn(&ldquo;relative flex w-full min-w-0 flex-col p-2&rdquo;, className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = &ldquo;SidebarGroup&rdquo;

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<&ldquo;div&rdquo;> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : &ldquo;div&rdquo;

  return (
    <Comp
      ref={ref}
      data-sidebar=&ldquo;group-label&rdquo;
      className={cn(
        &ldquo;flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0&rdquo;,
        &ldquo;group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0&rdquo;,
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = &ldquo;SidebarGroupLabel&rdquo;

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<&ldquo;button&rdquo;> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : &ldquo;button&rdquo;

  return (
    <Comp
      ref={ref}
      data-sidebar=&ldquo;group-action&rdquo;
      className={cn(
        &ldquo;absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0&rdquo;,
        // Increases the hit area of the button on mobile.
        &ldquo;after:absolute after:-inset-2 after:md:hidden&rdquo;,
        &ldquo;group-data-[collapsible=icon]:hidden&rdquo;,
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = &ldquo;SidebarGroupAction&rdquo;

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<&ldquo;div&rdquo;>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar=&ldquo;group-content&rdquo;
    className={cn(&ldquo;w-full text-sm&rdquo;, className)}
    {...props}
  />
))
SidebarGroupContent.displayName = &ldquo;SidebarGroupContent&rdquo;

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<&ldquo;ul&rdquo;>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar=&ldquo;menu&rdquo;
    className={cn(&ldquo;flex w-full min-w-0 flex-col gap-1&rdquo;, className)}
    {...props}
  />
))
SidebarMenu.displayName = &ldquo;SidebarMenu&rdquo;

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<&ldquo;li&rdquo;>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar=&ldquo;menu-item&rdquo;
    className={cn(&ldquo;group/menu-item relative&rdquo;, className)}
    {...props}
  />
))
SidebarMenuItem.displayName = &ldquo;SidebarMenuItem&rdquo;

const sidebarMenuButtonVariants = cva(
  &ldquo;peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0&rdquo;,
  {
    variants: {
      variant: {
        default: &ldquo;hover:bg-sidebar-accent hover:text-sidebar-accent-foreground&rdquo;,
        outline:
          &ldquo;bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]&rdquo;,
      },
      size: {
        default: &ldquo;h-8 text-sm&rdquo;,
        sm: &ldquo;h-7 text-xs&rdquo;,
        lg: &ldquo;h-12 text-sm group-data-[collapsible=icon]:!p-0&rdquo;,
      },
    },
    defaultVariants: {
      variant: &ldquo;default&rdquo;,
      size: &ldquo;default&rdquo;,
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<&ldquo;button&rdquo;> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = &ldquo;default&rdquo;,
      size = &ldquo;default&rdquo;,
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : &ldquo;button&rdquo;
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar=&ldquo;menu-button&rdquo;
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === &ldquo;string&rdquo;) {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side=&ldquo;right&rdquo;
          align=&ldquo;center&rdquo;
          hidden={state !== &ldquo;collapsed&rdquo; || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = &ldquo;SidebarMenuButton&rdquo;

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<&ldquo;button&rdquo;> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : &ldquo;button&rdquo;

  return (
    <Comp
      ref={ref}
      data-sidebar=&ldquo;menu-action&rdquo;
      className={cn(
        &ldquo;absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0&rdquo;,
        // Increases the hit area of the button on mobile.
        &ldquo;after:absolute after:-inset-2 after:md:hidden&rdquo;,
        &ldquo;peer-data-[size=sm]/menu-button:top-1&rdquo;,
        &ldquo;peer-data-[size=default]/menu-button:top-1.5&rdquo;,
        &ldquo;peer-data-[size=lg]/menu-button:top-2.5&rdquo;,
        &ldquo;group-data-[collapsible=icon]:hidden&rdquo;,
        showOnHover &&
          &ldquo;group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0&rdquo;,
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = &ldquo;SidebarMenuAction&rdquo;

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<&ldquo;div&rdquo;>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar=&ldquo;menu-badge&rdquo;
    className={cn(
      &ldquo;pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground&rdquo;,
      &ldquo;peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground&rdquo;,
      &ldquo;peer-data-[size=sm]/menu-button:top-1&rdquo;,
      &ldquo;peer-data-[size=default]/menu-button:top-1.5&rdquo;,
      &ldquo;peer-data-[size=lg]/menu-button:top-2.5&rdquo;,
      &ldquo;group-data-[collapsible=icon]:hidden&rdquo;,
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = &ldquo;SidebarMenuBadge&rdquo;

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<&ldquo;div&rdquo;> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar=&ldquo;menu-skeleton&rdquo;
      className={cn(&ldquo;flex h-8 items-center gap-2 rounded-md px-2&rdquo;, className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className=&ldquo;size-4 rounded-md&rdquo;
          data-sidebar=&ldquo;menu-skeleton-icon&rdquo;
        />
      )}
      <Skeleton
        className=&ldquo;h-4 max-w-[--skeleton-width] flex-1&rdquo;
        data-sidebar=&ldquo;menu-skeleton-text&rdquo;
        style={
          {
            &ldquo;--skeleton-width&rdquo;: width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = &ldquo;SidebarMenuSkeleton&rdquo;

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<&ldquo;ul&rdquo;>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar=&ldquo;menu-sub&rdquo;
    className={cn(
      &ldquo;mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5&rdquo;,
      &ldquo;group-data-[collapsible=icon]:hidden&rdquo;,
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = &ldquo;SidebarMenuSub&rdquo;

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<&ldquo;li&rdquo;>
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = &ldquo;SidebarMenuSubItem&rdquo;

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<&ldquo;a&rdquo;> & {
    asChild?: boolean
    size?: &ldquo;sm&rdquo; | &ldquo;md&rdquo;
    isActive?: boolean
  }
>(({ asChild = false, size = &ldquo;md&rdquo;, isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : &ldquo;a&rdquo;

  return (
    <Comp
      ref={ref}
      data-sidebar=&ldquo;menu-sub-button&rdquo;
      data-size={size}
      data-active={isActive}
      className={cn(
        &ldquo;flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground&rdquo;,
        &ldquo;data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground&rdquo;,
        size === &ldquo;sm&rdquo; && &ldquo;text-xs&rdquo;,
        size === &ldquo;md&rdquo; && &ldquo;text-sm&rdquo;,
        &ldquo;group-data-[collapsible=icon]:hidden&rdquo;,
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = &ldquo;SidebarMenuSubButton&rdquo;

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
