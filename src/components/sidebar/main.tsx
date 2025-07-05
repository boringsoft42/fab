import type { HTMLAttributes, Ref } from &ldquo;react&rdquo;;
import { cn } from &ldquo;@/lib/utils&rdquo;;

interface MainProps extends HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: Ref<HTMLElement>;
}

export const Main = ({ fixed, ...props }: MainProps) => {
  return (
    <main
      className={cn(
        &ldquo;peer-[.header-fixed]/header:mt-16&rdquo;,
        &ldquo;px-4 py-6&rdquo;,
        fixed && &ldquo;fixed-main flex flex-grow flex-col overflow-hidden&rdquo;
      )}
      {...props}
    />
  );
};

Main.displayName = &ldquo;Main&rdquo;;
