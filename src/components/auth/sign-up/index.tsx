import Link from &ldquo;next/link&rdquo;;
import { Card } from &ldquo;@/components/ui/card&rdquo;;
import AuthLayout from &ldquo;../auth-layout&rdquo;;
import { SignUpForm } from &ldquo;./components/sign-up-form&rdquo;;

export default function SignUp() {
  return (
    <AuthLayout>
      <Card className=&ldquo;p-6&rdquo;>
        <div className=&ldquo;mb-2 flex flex-col space-y-2 text-left&rdquo;>
          <h1 className=&ldquo;text-lg font-semibold tracking-tight&rdquo;>
            Create an account
          </h1>
          <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
            Enter your email and password to create an account. <br />
            Already have an account?{&ldquo; &rdquo;}
            <Link
              href=&ldquo;/sign-in&rdquo;
              className=&ldquo;underline underline-offset-4 hover:text-primary&rdquo;
            >
              Sign In
            </Link>
          </p>
        </div>
        <SignUpForm />
        <p className=&ldquo;mt-4 px-8 text-center text-sm text-muted-foreground&rdquo;>
          By creating an account, you agree to our{&ldquo; &rdquo;}
          <a
            href=&ldquo;/terms&rdquo;
            className=&ldquo;underline underline-offset-4 hover:text-primary&rdquo;
          >
            Terms of Service
          </a>{&ldquo; &rdquo;}
          and{&ldquo; &rdquo;}
          <a
            href=&ldquo;/privacy&rdquo;
            className=&ldquo;underline underline-offset-4 hover:text-primary&rdquo;
          >
            Privacy Policy
          </a>
          .
        </p>
      </Card>
    </AuthLayout>
  );
}
