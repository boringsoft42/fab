import type { HTMLAttributes } from &ldquo;react&rdquo;;
import type { z } from &ldquo;zod&rdquo;;
import { string, object } from &ldquo;zod&rdquo;;

export type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

export const signInFormSchema = object({
  email: string()
    .min(1, { message: &ldquo;Please enter your email&rdquo; })
    .email({ message: &ldquo;Invalid email address&rdquo; }),
  password: string()
    .min(1, { message: &ldquo;Please enter your password&rdquo; })
    .min(7, { message: &ldquo;Password must be at least 7 characters long&rdquo; }),
});

export type SignInFormData = z.infer<typeof signInFormSchema>; 