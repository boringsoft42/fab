"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Loader2,
  Mail,
  Lock,
  AlertCircle,
  LogIn,
  User,
  Building,
  Target,
  Users,
  LucideIcon,
} from "lucide-react";
import { useMockAuth } from "@/context/mock-auth-context";

type UserRole = "YOUTH" | "COMPANIES" | "MUNICIPAL_GOVERNMENTS";

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  examples: string[];
}

const roleOptions: RoleOption[] = [
  {
    value: "YOUTH",
    label: "Youth",
    description:
      "Para jóvenes y adolescentes que buscan empleo y oportunidades de desarrollo",
    icon: User,
    color: "bg-blue-500",
    examples: ["Estudiantes", "Jóvenes profesionales", "Adolescentes"],
  },
  {
    value: "COMPANIES",
    label: "Company",
    description:
      "Para empresas que buscan talento y publican ofertas de trabajo",
    icon: Building,
    color: "bg-purple-500",
    examples: ["Startups", "PYMEs", "Grandes empresas"],
  },
  {
    value: "MUNICIPAL_GOVERNMENTS",
    label: "Municipality, NGO, or Center",
    description:
      "Para gobiernos municipales, ONGs, centros de capacitación y fundaciones",
    icon: Target,
    color: "bg-green-500",
    examples: ["Alcaldías", "ONGs", "Centros de formación", "Fundaciones"],
  },
];

export function MockLoginScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("YOUTH");
  const { signIn, signUp, updateUserRole, isLoading, error } = useMockAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        await signUp(email, password, name, selectedRole);
      } else {
        await signIn(email, password, selectedRole);
      }

      // Redirect to dashboard (role is already set during sign-in)
      router.replace("/dashboard");
    } catch (err) {
      // Error is handled by the context
    }
  };

  const demoUsers = [
    { email: "youth@demo.com", role: "YOUTH" as UserRole, label: "Demo Youth" },
    {
      email: "company@demo.com",
      role: "COMPANIES" as UserRole,
      label: "Demo Company",
    },
    {
      email: "municipality@demo.com",
      role: "MUNICIPAL_GOVERNMENTS" as UserRole,
      label: "Demo Municipality",
    },
  ];

  const handleDemoLogin = async (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword("demo123");
    setSelectedRole(demoRole);

    try {
      await signIn(demoEmail, "demo123", demoRole);
      router.replace("/dashboard");
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">CEMSE</h1>
          <p className="text-gray-600">
            Centro de Empleabilidad y Emprendimiento
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "Crea tu cuenta y selecciona tu tipo de usuario"
                : "Accede a tu cuenta y selecciona tu tipo de usuario"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">
                    Tipo de Usuario
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Selecciona el tipo que mejor te describe
                  </p>
                </div>

                <RadioGroup
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                  className="space-y-3"
                  disabled={isLoading}
                >
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div key={option.value} className="relative">
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={option.value}
                          className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all"
                        >
                          <div
                            className={`w-10 h-10 ${option.color} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {option.description}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              Ejemplos: {option.examples.join(", ")}
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isSignUp ? "Creando cuenta..." : "Iniciando sesión..."}
                  </>
                ) : (
                  <>{isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}</>
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isLoading}
                className="text-sm"
              >
                {isSignUp
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              Usuarios Demo
            </CardTitle>
            <CardDescription className="text-xs">
              Haz clic para probar diferentes tipos de usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {demoUsers.map((demo) => (
                <Button
                  key={demo.email}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(demo.email, demo.role)}
                  disabled={isLoading}
                  className="justify-start h-auto py-2"
                >
                  <div className="text-left">
                    <div className="font-medium text-xs">{demo.label}</div>
                    <div className="text-xs text-gray-600">{demo.email}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
