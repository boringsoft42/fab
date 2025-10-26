import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Only redirect if user has valid session AND exists in database
  if (session) {
    const { data: userRecord } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .single();

    // If user exists in database, redirect to dashboard
    // If not, let them see the sign-in page with error message
    if (userRecord) {
      redirect("/dashboard");
    }
  }

  return <>{children}</>;
}
