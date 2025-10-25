"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "@/components/utils/password-input";
import { PasswordStrengthIndicator } from "@/components/utils/password-strength-indicator";
import type { SignUpFormProps, SignUpFormData } from "@/types/auth/sign-up";
import { signUpFormSchema, publicRoles } from "@/types/auth/sign-up";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface Asociacion {
  id: string;
  nombre: string;
  departamento: string;
}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [asociaciones, setAsociaciones] = useState<Asociacion[]>([]);
  const [loadingAsociaciones, setLoadingAsociaciones] = useState(true);
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Fetch asociaciones on mount
  useEffect(() => {
    async function fetchAsociaciones() {
      try {
        setLoadingAsociaciones(true);
        console.log('🔍 Fetching asociaciones...');

        const { data, error } = await supabase
          .from('asociaciones')
          .select('id, nombre, departamento')
          .eq('estado', true)
          .order('nombre');

        console.log('📊 Asociaciones result:', { data, error });

        if (error) {
          console.error('❌ Error fetching asociaciones:', error);
          toast({
            title: "Error al cargar asociaciones",
            description: `No se pudieron cargar las asociaciones: ${error.message}`,
            variant: "destructive",
          });
        } else {
          console.log(`✅ Loaded ${data?.length || 0} asociaciones`);
          setAsociaciones(data || []);
        }
      } catch (err) {
        console.error('❌ Unexpected error:', err);
      } finally {
        setLoadingAsociaciones(false);
      }
    }

    fetchAsociaciones();
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    form.setValue("password", e.target.value);
  };

  async function onSubmit(data: SignUpFormData) {
    try {
      setIsLoading(true);

      // Import the Server Action dynamically
      const { registerUser } = await import("@/app/actions/auth/register");

      // Call Server Action for FAB user registration
      // REQ-1.1.1 through REQ-1.1.7: Public registration flow
      const result = await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        rol: data.rol,
        asociacion_id: data.asociacion_id,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to create account");
      }

      // Success! User created with estado="pendiente"
      toast({
        title: "Account Created",
        description:
          "Your account has been created and is pending approval. Please check your email to verify your address. You will receive another email once an administrator approves your account.",
      });

      // Redirect to a pending approval page or login
      router.push("/auth/login?status=pending");

    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="rol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {publicRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the role that best describes you
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="asociacion_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asociación</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loadingAsociaciones}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        loadingAsociaciones
                          ? "Cargando asociaciones..."
                          : "Selecciona tu asociación"
                      } />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {asociaciones.length === 0 ? (
                      <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                        {loadingAsociaciones ? "Cargando..." : "No hay asociaciones disponibles"}
                      </div>
                    ) : (
                      asociaciones.map((asoc) => (
                        <SelectItem key={asoc.id} value={asoc.id}>
                          {asoc.nombre} - {asoc.departamento}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the asociación you belong to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="********"
                    {...field}
                    onChange={handlePasswordChange}
                  />
                </FormControl>
                <PasswordStrengthIndicator password={password} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
