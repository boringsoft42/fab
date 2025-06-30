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
import { Loader2, Mail, Lock, Users, AlertCircle, LogIn } from "lucide-react";
import { useMockAuth } from "@/context/mock-auth-context";

export function MockLoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { signIn, signUp, isLoading, error } = useMockAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }

      // After successful login, redirect to role selection
      router.replace("/select-role");
    } catch (err) {
      // Error is handled by the context
    }
  };

  const demoUsers = [
    { email: "joven@demo.com", role: "YOUTH", label: "Demo Joven" },
    {
      email: "adolescente@demo.com",
      role: "ADOLESCENTS",
      label: "Demo Adolescente",
    },
    { email: "empresa@demo.com", role: "COMPANIES", label: "Demo Empresa" },
    {
      email: "municipio@demo.com",
      role: "MUNICIPAL_GOVERNMENTS",
      label: "Demo Municipio",
    },
    {
      email: "centro@demo.com",
      role: "TRAINING_CENTERS",
      label: "Demo Centro",
    },
    { email: "ong@demo.com", role: "NGOS_AND_FOUNDATIONS", label: "Demo ONG" },
  ];

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo123");

    try {
      await signIn(demoEmail, "demo123");
      router.replace("/select-role");
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
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
                ? "Crea tu cuenta para acceder a CEMSE"
                : "Accede a tu cuenta de CEMSE"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="grid grid-cols-2 gap-2">
              {demoUsers.map((demo) => (
                <Button
                  key={demo.email}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(demo.email)}
                  disabled={isLoading}
                  className="text-xs h-8"
                >
                  {demo.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Note */}
        <div className="text-center text-xs text-gray-500">
          <p>🚀 Sistema de demostración - Solo frontend</p>
          <p>Cualquier email y contraseña funcionará</p>
        </div>
      </div>
    </div>
  );
}
