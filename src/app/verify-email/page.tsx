import Link from &ldquo;next/link&rdquo;;

export default function VerifyEmailPage() {
  return (
    <div className=&ldquo;flex flex-col items-center justify-center min-h-screen px-4&rdquo;>
      <div className=&ldquo;max-w-md w-full p-8 bg-white rounded-lg shadow-lg&rdquo;>
        <h1 className=&ldquo;text-2xl font-bold text-center mb-6&rdquo;>
          Check Your Email
        </h1>

        <div className=&ldquo;text-center mb-8&rdquo;>
          <p className=&ldquo;mb-4&rdquo;>
            We&apos;ve sent you a verification link to your email address.
          </p>
          <p className=&ldquo;text-sm text-gray-600&rdquo;>
            Please check your inbox and click the link to verify your account.
            If you don&apos;t see the email, check your spam folder.
          </p>
        </div>

        <div className=&ldquo;text-center&rdquo;>
          <Link
            href=&ldquo;/sign-in&rdquo;
            className=&ldquo;inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500&rdquo;
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
