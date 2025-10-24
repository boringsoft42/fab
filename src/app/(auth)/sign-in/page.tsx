import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AuthLayout from "@/components/auth/auth-layout";
import { UserAuthForm } from "@/components/auth/sign-in/components/user-auth-form";
import Link from "next/link";
import { AlertCircle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In - FAB Management System",
  description: "Sign in to your account",
};

interface SignInPageProps {
  searchParams?: Promise<{ error?: string; status?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const error = params?.error;
  const status = params?.status;

  // REQ-1.3.6, REQ-1.3.5: Display estado-based error messages
  const errorMessages: Record<string, { title: string; description: string }> = {
    account_rejected: {
      title: "Account Rejected",
      description: "Your account has been rejected by an administrator. Please contact FAB support if you believe this is an error.",
    },
    account_inactive: {
      title: "Account Inactive",
      description: "Your account is inactive. Please contact FAB support to reactivate your account.",
    },
    invalid_user: {
      title: "Invalid User",
      description: "Your user account is invalid. Please contact support.",
    },
  };

  const statusMessages: Record<string, { title: string; description: string }> = {
    pending: {
      title: "Registration Successful",
      description: "Your account has been created and is pending approval. You will receive an email once an administrator approves your account.",
    },
  };

  return (
    <AuthLayout>
      <Card className="p-6">
        {/* Display error alerts */}
        {error && errorMessages[error] && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{errorMessages[error].title}</AlertTitle>
            <AlertDescription>{errorMessages[error].description}</AlertDescription>
          </Alert>
        )}

        {/* Display status alerts */}
        {status && statusMessages[status] && (
          <Alert className="mb-4 border-green-500 bg-green-50 text-green-900 dark:border-green-700 dark:bg-green-950 dark:text-green-100">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>{statusMessages[status].title}</AlertTitle>
            <AlertDescription>{statusMessages[status].description}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password below <br />
            to log into your account.{" "}
            <Link
              href="/sign-up"
              className="underline underline-offset-4 hover:text-primary"
            >
              Don&apos;t have an account?
            </Link>
          </p>
        </div>
        <UserAuthForm />
        <div className="mt-4 text-center text-sm">
          <p className="text-muted-foreground">
            Prefer to sign in without a password?{" "}
            <Link
              href="/magic-link"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in with a magic link
            </Link>
          </p>
        </div>
        <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
          By clicking login, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </Card>
    </AuthLayout>
  );
}
