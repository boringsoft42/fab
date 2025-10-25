import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  try {
    const supabase = await createServerClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("Session error:", sessionError);
      redirect("/sign-in");
    }

    console.log("🔍 Fetching user data for:", session.user.id);

    // Fetch user data to determine role and estado
    const { data: user, error } = await supabase
      .from("users")
      .select("rol, estado")
      .eq("user_id", session.user.id)
      .maybeSingle();

    console.log("📊 User query result:", { user, error, userId: session.user.id });

    if (error) {
      console.error("❌ Error fetching user:", error);
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-bold">Database Error</h2>
            <p className="text-muted-foreground">
              Could not fetch your user data: {error.message}
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/sign-out">
                <Button variant="outline">Sign Out</Button>
              </Link>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      );
    }

    if (!user) {
      console.error("❌ User not found in users table");
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-bold">Account Not Found</h2>
            <p className="text-muted-foreground">
              Your account is authenticated but not registered in the FAB system.
            </p>
            <p className="text-sm text-muted-foreground">
              User ID: {session.user.id}
            </p>
            <p className="text-sm text-muted-foreground">
              Email: {session.user.email}
            </p>
            <Link href="/sign-out">
              <Button>Sign Out</Button>
            </Link>
          </div>
        </div>
      );
    }

    // Redirect based on rol and estado
    const { rol, estado } = user;
    console.log("✅ User found:", { rol, estado });

  // Admin FAB
  if (rol === "admin_fab") {
    redirect("/dashboard/admin-fab");
  }

  // Admin Asociación
  if (rol === "admin_asociacion") {
    redirect("/dashboard/admin-asociacion");
  }

  // Atleta
  if (rol === "atleta") {
    if (estado === "pendiente") {
      redirect("/dashboard/atleta-pending");
    }
    redirect("/dashboard/atleta-activo");
  }

  // Entrenador
  if (rol === "entrenador") {
    if (estado === "pendiente") {
      redirect("/dashboard/entrenador-pending");
    }
    redirect("/dashboard/entrenador-activo");
  }

  // Juez
  if (rol === "juez") {
    if (estado === "pendiente") {
      redirect("/dashboard/juez-pending");
    }
    redirect("/dashboard/juez-activo");
  }

  // Default fallback
  return (
    <div className="space-y-8 p-6">
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          This is your protected dashboard page. You can start adding your content here.
        </p>
      </div>
    </div>
  );
  } catch (error) {
    console.error("❌ Dashboard error:", error);
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="text-muted-foreground">
            An unexpected error occurred: {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/sign-in">
              <Button>Back to Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
} 