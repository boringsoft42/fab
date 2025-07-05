&ldquo;use client&rdquo;

import * as React from &ldquo;react&rdquo;
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from &ldquo;embla-carousel-react&rdquo;
import { ArrowLeft, ArrowRight } from &ldquo;lucide-react&rdquo;

import { cn } from &ldquo;@/lib/utils&rdquo;
import { Button } from &ldquo;@/components/ui/button&rdquo;

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: &ldquo;horizontal&rdquo; | &ldquo;vertical&rdquo;
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error(&ldquo;useCarousel must be used within a <Carousel />&rdquo;)
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = &ldquo;horizontal&rdquo;,
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === &ldquo;horizontal&rdquo; ? &ldquo;x&rdquo; : &ldquo;y&rdquo;,
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === &ldquo;ArrowLeft&rdquo;) {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === &ldquo;ArrowRight&rdquo;) {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on(&ldquo;reInit&rdquo;, onSelect)
      api.on(&ldquo;select&rdquo;, onSelect)

      return () => {
        api?.off(&ldquo;select&rdquo;, onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === &ldquo;y&rdquo; ? &ldquo;vertical&rdquo; : &ldquo;horizontal&rdquo;),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn(&ldquo;relative&rdquo;, className)}
          role=&ldquo;region&rdquo;
          aria-roledescription=&ldquo;carousel&rdquo;
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = &ldquo;Carousel&rdquo;

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className=&ldquo;overflow-hidden&rdquo;>
      <div
        ref={ref}
        className={cn(
          &ldquo;flex&rdquo;,
          orientation === &ldquo;horizontal&rdquo; ? &ldquo;-ml-4&rdquo; : &ldquo;-mt-4 flex-col&rdquo;,
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = &ldquo;CarouselContent&rdquo;

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role=&ldquo;group&rdquo;
      aria-roledescription=&ldquo;slide&rdquo;
      className={cn(
        &ldquo;min-w-0 shrink-0 grow-0 basis-full&rdquo;,
        orientation === &ldquo;horizontal&rdquo; ? &ldquo;pl-4&rdquo; : &ldquo;pt-4&rdquo;,
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = &ldquo;CarouselItem&rdquo;

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = &ldquo;outline&rdquo;, size = &ldquo;icon&rdquo;, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        &ldquo;absolute  h-8 w-8 rounded-full&rdquo;,
        orientation === &ldquo;horizontal&rdquo;
          ? &ldquo;-left-12 top-1/2 -translate-y-1/2&rdquo;
          : &ldquo;-top-12 left-1/2 -translate-x-1/2 rotate-90&rdquo;,
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className=&ldquo;h-4 w-4&rdquo; />
      <span className=&ldquo;sr-only&rdquo;>Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = &ldquo;CarouselPrevious&rdquo;

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = &ldquo;outline&rdquo;, size = &ldquo;icon&rdquo;, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        &ldquo;absolute h-8 w-8 rounded-full&rdquo;,
        orientation === &ldquo;horizontal&rdquo;
          ? &ldquo;-right-12 top-1/2 -translate-y-1/2&rdquo;
          : &ldquo;-bottom-12 left-1/2 -translate-x-1/2 rotate-90&rdquo;,
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className=&ldquo;h-4 w-4&rdquo; />
      <span className=&ldquo;sr-only&rdquo;>Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = &ldquo;CarouselNext&rdquo;

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
