import { z } from "zod";

// REQ-1.1.2, REQ-10.2.1: Public registration ONLY for atleta, entrenador, juez
// Admin roles (admin_fab, admin_asociacion) are NOT available in public registration
export const publicRoles = ['atleta', 'entrenador', 'juez'] as const;

export const signUpFormSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    firstName: z.string().min(2, "First name must be at least 2 characters").max(30),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(30),
    birthDate: z.date().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    rol: z.enum(publicRoles, {
      required_error: "Please select a role",
    }),
    asociacion_id: z.string().uuid({ message: "Please select an asociacion" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export type SignUpFormProps = React.HTMLAttributes<HTMLDivElement>;
