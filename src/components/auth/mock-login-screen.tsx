&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { Alert, AlertDescription } from &ldquo;@/components/ui/alert&rdquo;;
import { RadioGroup, RadioGroupItem } from &ldquo;@/components/ui/radio-group&rdquo;;
import {
  Loader2,
  Mail,
  Lock,
  Users,
  AlertCircle,
  LogIn,
  User,
  Building,
  Target,
} from &ldquo;lucide-react&rdquo;;
import { useMockAuth } from &ldquo;@/context/mock-auth-context&rdquo;;

type UserRole = &ldquo;YOUTH&rdquo; | &ldquo;COMPANIES&rdquo; | &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;;

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: unknown;
  color: string;
  examples: string[];
}

const roleOptions: RoleOption[] = [
  {
    value: &ldquo;YOUTH&rdquo;,
    label: &ldquo;Youth&rdquo;,
    description:
      &ldquo;Para jóvenes y adolescentes que buscan empleo y oportunidades de desarrollo&rdquo;,
    icon: User,
    color: &ldquo;bg-blue-500&rdquo;,
    examples: [&ldquo;Estudiantes&rdquo;, &ldquo;Jóvenes profesionales&rdquo;, &ldquo;Adolescentes&rdquo;],
  },
  {
    value: &ldquo;COMPANIES&rdquo;,
    label: &ldquo;Company&rdquo;,
    description:
      &ldquo;Para empresas que buscan talento y publican ofertas de trabajo&rdquo;,
    icon: Building,
    color: &ldquo;bg-purple-500&rdquo;,
    examples: [&ldquo;Startups&rdquo;, &ldquo;PYMEs&rdquo;, &ldquo;Grandes empresas&rdquo;],
  },
  {
    value: &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;,
    label: &ldquo;Municipality, NGO, or Center&rdquo;,
    description:
      &ldquo;Para gobiernos municipales, ONGs, centros de capacitación y fundaciones&rdquo;,
    icon: Target,
    color: &ldquo;bg-green-500&rdquo;,
    examples: [&ldquo;Alcaldías&rdquo;, &ldquo;ONGs&rdquo;, &ldquo;Centros de formación&rdquo;, &ldquo;Fundaciones&rdquo;],
  },
];

export function MockLoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState(&ldquo;&rdquo;);
  const [password, setPassword] = useState(&ldquo;&rdquo;);
  const [name, setName] = useState(&ldquo;&rdquo;);
  const [selectedRole, setSelectedRole] = useState<UserRole>(&ldquo;YOUTH&rdquo;);
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
      router.replace(&ldquo;/dashboard&rdquo;);
    } catch (err) {
      // Error is handled by the context
    }
  };

  const demoUsers = [
    { email: &ldquo;youth@demo.com&rdquo;, role: &ldquo;YOUTH&rdquo; as UserRole, label: &ldquo;Demo Youth&rdquo; },
    {
      email: &ldquo;company@demo.com&rdquo;,
      role: &ldquo;COMPANIES&rdquo; as UserRole,
      label: &ldquo;Demo Company&rdquo;,
    },
    {
      email: &ldquo;municipality@demo.com&rdquo;,
      role: &ldquo;MUNICIPAL_GOVERNMENTS&rdquo; as UserRole,
      label: &ldquo;Demo Municipality&rdquo;,
    },
  ];

  const handleDemoLogin = async (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword(&ldquo;demo123&rdquo;);
    setSelectedRole(demoRole);

    try {
      await signIn(demoEmail, &ldquo;demo123&rdquo;, demoRole);
      router.replace(&ldquo;/dashboard&rdquo;);
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className=&ldquo;min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4&rdquo;>
      <div className=&ldquo;max-w-lg w-full space-y-6&rdquo;>
        {/* Header */}
        <div className=&ldquo;text-center space-y-2&rdquo;>
          <h1 className=&ldquo;text-3xl font-bold text-gray-900&rdquo;>CEMSE</h1>
          <p className=&ldquo;text-gray-600&rdquo;>
            Centro de Empleabilidad y Emprendimiento
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className=&ldquo;text-center&rdquo;>
            <CardTitle className=&ldquo;flex items-center justify-center gap-2&rdquo;>
              <LogIn className=&ldquo;w-5 h-5&rdquo; />
              {isSignUp ? &ldquo;Crear Cuenta&rdquo; : &ldquo;Iniciar Sesión&rdquo;}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? &ldquo;Crea tu cuenta y selecciona tu tipo de usuario&rdquo;
                : &ldquo;Accede a tu cuenta y selecciona tu tipo de usuario&rdquo;}
            </CardDescription>
          </CardHeader>

          <CardContent className=&ldquo;space-y-6&rdquo;>
            {error && (
              <Alert variant=&ldquo;destructive&rdquo;>
                <AlertCircle className=&ldquo;h-4 w-4&rdquo; />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className=&ldquo;space-y-6&rdquo;>
              {/* Personal Information */}
              <div className=&ldquo;space-y-4&rdquo;>
                {isSignUp && (
                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label htmlFor=&ldquo;name&rdquo;>Nombre Completo</Label>
                    <Input
                      id=&ldquo;name&rdquo;
                      type=&ldquo;text&rdquo;
                      placeholder=&ldquo;Tu nombre completo&rdquo;
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;email&rdquo;>Correo Electrónico</Label>
                  <div className=&ldquo;relative&rdquo;>
                    <Mail className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4&rdquo; />
                    <Input
                      id=&ldquo;email&rdquo;
                      type=&ldquo;email&rdquo;
                      placeholder=&ldquo;tu@correo.com&rdquo;
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className=&ldquo;pl-10&rdquo;
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;password&rdquo;>Contraseña</Label>
                  <div className=&ldquo;relative&rdquo;>
                    <Lock className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4&rdquo; />
                    <Input
                      id=&ldquo;password&rdquo;
                      type=&ldquo;password&rdquo;
                      placeholder=&ldquo;Tu contraseña&rdquo;
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className=&ldquo;pl-10&rdquo;
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className=&ldquo;space-y-4&rdquo;>
                <div>
                  <Label className=&ldquo;text-base font-medium&rdquo;>
                    Tipo de Usuario
                  </Label>
                  <p className=&ldquo;text-sm text-gray-600 mt-1&rdquo;>
                    Selecciona el tipo que mejor te describe
                  </p>
                </div>

                <RadioGroup
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                  className=&ldquo;space-y-3&rdquo;
                  disabled={isLoading}
                >
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div key={option.value} className=&ldquo;relative&rdquo;>
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className=&ldquo;peer sr-only&rdquo;
                        />
                        <Label
                          htmlFor={option.value}
                          className=&ldquo;flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all&rdquo;
                        >
                          <div
                            className={`w-10 h-10 ${option.color} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
                          >
                            <Icon className=&ldquo;w-5 h-5 text-white&rdquo; />
                          </div>
                          <div className=&ldquo;flex-1 min-w-0&rdquo;>
                            <div className=&ldquo;font-medium text-gray-900&rdquo;>
                              {option.label}
                            </div>
                            <div className=&ldquo;text-sm text-gray-600 mt-1&rdquo;>
                              {option.description}
                            </div>
                            <div className=&ldquo;text-xs text-gray-500 mt-2&rdquo;>
                              Ejemplos: {option.examples.join(&ldquo;, &rdquo;)}
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              <Button type=&ldquo;submit&rdquo; className=&ldquo;w-full&rdquo; disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className=&ldquo;w-4 h-4 mr-2 animate-spin&rdquo; />
                    {isSignUp ? &ldquo;Creando cuenta...&rdquo; : &ldquo;Iniciando sesión...&rdquo;}
                  </>
                ) : (
                  <>{isSignUp ? &ldquo;Crear Cuenta&rdquo; : &ldquo;Iniciar Sesión&rdquo;}</>
                )}
              </Button>
            </form>

            <div className=&ldquo;text-center&rdquo;>
              <Button
                variant=&ldquo;link&rdquo;
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isLoading}
                className=&ldquo;text-sm&rdquo;
              >
                {isSignUp
                  ? &ldquo;¿Ya tienes cuenta? Inicia sesión&rdquo;
                  : &ldquo;¿No tienes cuenta? Regístrate&rdquo;}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Users */}
        <Card>
          <CardHeader>
            <CardTitle className=&ldquo;flex items-center gap-2 text-sm&rdquo;>
              <Users className=&ldquo;w-4 h-4&rdquo; />
              Usuarios Demo
            </CardTitle>
            <CardDescription className=&ldquo;text-xs&rdquo;>
              Haz clic para probar diferentes tipos de usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=&ldquo;grid grid-cols-1 gap-2&rdquo;>
              {demoUsers.map((demo) => (
                <Button
                  key={demo.email}
                  variant=&ldquo;outline&rdquo;
                  size=&ldquo;sm&rdquo;
                  onClick={() => handleDemoLogin(demo.email, demo.role)}
                  disabled={isLoading}
                  className=&ldquo;justify-start h-auto py-2&rdquo;
                >
                  <div className=&ldquo;text-left&rdquo;>
                    <div className=&ldquo;font-medium text-xs&rdquo;>{demo.label}</div>
                    <div className=&ldquo;text-xs text-gray-600&rdquo;>{demo.email}</div>
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
