"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getToken, getAuthHeaders } from "@/lib/api";
import { YouthApplicationService } from "@/services/youth-application.service";

export default function TestYouthApplicationPage() {
  const { profile } = useCurrentUser();
  const [testResult, setTestResult] = useState<string>("");

  const testAuth = () => {
    const token = getToken();
    const headers = getAuthHeaders();

    const result = `
🔐 TOKEN TEST RESULTS:
- Token exists: ${!!token}
- Token value: ${token ? `${token.substring(0, 20)}...` : "null"}
- Full token: ${token || "null"}

🔐 HEADERS TEST:
- Headers: ${JSON.stringify(headers, null, 2)}
- Authorization header: ${headers.Authorization || "missing"}

🔐 USER PROFILE:
- Profile exists: ${!!profile}
- Profile ID: ${profile?.id || "null"}
- Profile role: ${profile?.role || "null"}
    `;

    setTestResult(result);
    console.log("🔐 Test result:", result);
  };

  const testCreateApplication = async () => {
    if (!profile?.id) {
      setTestResult("❌ No profile ID available");
      return;
    }

    try {
      setTestResult("🔄 Creating test application...");

      console.log("🔐 Test - Profile ID:", profile.id);
      console.log("🔐 Test - Starting application creation...");

      const result = await YouthApplicationService.createYouthApplication({
        title: "Test Application",
        description: "This is a test application",
        youthProfileId: profile.id,
        isPublic: true,
      });

      setTestResult(
        `✅ Application created successfully!\nID: ${result.id}\nTitle: ${result.title}`
      );
      console.log("🔐 Test - Application created successfully:", result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setTestResult(`❌ Error creating application:\n${errorMessage}`);
      console.error("🔐 Test - Error creating application:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Test Youth Application Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testAuth}>Test Authentication</Button>
            <Button onClick={testCreateApplication} variant="outline">
              Test Create Application
            </Button>
          </div>

          {testResult && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {testResult}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
