"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE } from "@/lib/api";

export default function TestBackendPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResults(null);

    try {
      console.log('🔍 Testing backend connection...');
      console.log('🔍 API_BASE:', API_BASE);
      
      // Test 1: Simple GET request to check if server is running
      const healthCheck = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Test 2: Try login endpoint
      const loginTest = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'test',
          password: 'test'
        })
      });

      const results = {
        apiBase: API_BASE,
        healthCheck: {
          status: healthCheck.status,
          ok: healthCheck.ok,
          statusText: healthCheck.statusText
        },
        loginTest: {
          status: loginTest.status,
          ok: loginTest.ok,
          statusText: loginTest.statusText
        },
        timestamp: new Date().toISOString()
      };

      console.log('🔍 Test results:', results);
      setTestResults(results);

    } catch (error) {
      console.error('🔍 Test failed:', error);
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        apiBase: API_BASE,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Backend Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testBackendConnection} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? 'Testing...' : 'Test Backend Connection'}
          </Button>

          {testResults && (
            <div className="space-y-4">
              <h3 className="font-semibold">Test Results:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
