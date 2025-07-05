&ldquo;use client&rdquo;;

import { QueryClient, QueryClientProvider } from &ldquo;@tanstack/react-query&rdquo;;
import { ReactQueryDevtools } from &ldquo;@tanstack/react-query-devtools&rdquo;;
import { useState } from &ldquo;react&rdquo;;

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
