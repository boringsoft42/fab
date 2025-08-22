"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugProfilePage() {
  const { profile, user, isLoading, error } = useCurrentUser();

  console.log("🔍 DebugProfilePage - Full data:", {
    profile,
    user,
    isLoading,
    error,
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug Profile Data</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Is Loading:</strong> {isLoading ? "Yes" : "No"}
            </div>

            <div>
              <strong>Has Error:</strong> {error ? "Yes" : "No"}
            </div>

            <div>
              <strong>Has Profile:</strong> {profile ? "Yes" : "No"}
            </div>

            <div>
              <strong>Has User:</strong> {user ? "Yes" : "No"}
            </div>

            {profile && (
              <div>
                <strong>Profile ID:</strong> {profile.id}
              </div>
            )}

            {profile?.municipality && (
              <div>
                <strong>Municipality ID:</strong> {profile.municipality.id}
              </div>
            )}

            {user && (
              <div>
                <strong>User ID:</strong> {user.id}
              </div>
            )}

            {user?.municipality && (
              <div>
                <strong>User Municipality ID:</strong> {user.municipality.id}
              </div>
            )}

            <div>
              <strong>Full Profile Data:</strong>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>

            <div>
              <strong>Full User Data:</strong>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
