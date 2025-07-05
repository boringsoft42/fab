&ldquo;use client&rdquo;;

export default function SkipToMain() {
  return (
    <a
      href=&ldquo;#content&rdquo;
      className=&ldquo;sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground&rdquo;
    >
      Skip to main content
    </a>
  );
} 