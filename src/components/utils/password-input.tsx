import * as React from &ldquo;react&rdquo;;
import { Eye, EyeOff } from &ldquo;lucide-react&rdquo;;
import { cn } from &ldquo;@/lib/utils&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  &ldquo;type&rdquo;
>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className={cn(&ldquo;relative rounded-md&rdquo;, className)}>
        <input
          type={showPassword ? &ldquo;text&rdquo; : &ldquo;password&rdquo;}
          className=&ldquo;flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50&rdquo;
          ref={ref}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />
        <Button
          type=&ldquo;button&rdquo;
          size=&ldquo;icon&rdquo;
          variant=&ldquo;ghost&rdquo;
          disabled={disabled}
          className=&ldquo;absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md text-muted-foreground&rdquo;
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={
            showPassword ? &ldquo;Ocultar contraseña&rdquo; : &ldquo;Mostrar contraseña&rdquo;
          }
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </Button>
      </div>
    );
  }
);
PasswordInput.displayName = &ldquo;PasswordInput&rdquo;;

export { PasswordInput };
