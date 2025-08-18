import type { HTMLAttributes } from "react";
import type { z } from "zod";
import { string, object } from "zod";

export type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

export const signInFormSchema = object({
  email: string()
    .min(1, { message: "Por favor ingresa tu usuario" })
    .min(3, { message: "El usuario debe tener al menos 3 caracteres" }),
  password: string()
    .min(1, { message: "Por favor ingresa tu contraseña" })
    .min(1, { message: "La contraseña es requerida" }),
});

export type SignInFormData = z.infer<typeof signInFormSchema>; 