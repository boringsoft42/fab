import { z } from &ldquo;zod&rdquo;;

export const signUpFormSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(2).max(30).optional(),
    lastName: z.string().min(2).max(30).optional(),
    birthDate: z.date().optional(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: &ldquo;Passwords don't match&rdquo;,
    path: [&ldquo;confirmPassword&rdquo;],
  });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export type SignUpFormProps = React.HTMLAttributes<HTMLDivElement>;
