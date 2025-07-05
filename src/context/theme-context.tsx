&ldquo;use client&rdquo;;

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from &ldquo;react&rdquo;;

type Theme = &ldquo;dark&rdquo; | &ldquo;light&rdquo; | &ldquo;system&rdquo;;

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: &ldquo;system&rdquo;,
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = &ldquo;system&rdquo;,
  storageKey = &ldquo;ui-theme&rdquo;,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setTheme(stored as Theme);
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(&ldquo;light&rdquo;, &ldquo;dark&rdquo;);

    if (theme === &ldquo;system&rdquo;) {
      const systemTheme = window.matchMedia(&ldquo;(prefers-color-scheme: dark)&rdquo;)
        .matches
        ? &ldquo;dark&rdquo;
        : &ldquo;light&rdquo;;
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error(&ldquo;useTheme must be used within a ThemeProvider&rdquo;);
  }
  return context;
};
