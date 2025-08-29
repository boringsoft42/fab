"use client";

import { useState, useEffect } from "react";
import {
  useCompanies,
  useCompaniesByMunicipality,
  useCompanyStats,
} from "@/hooks/useCompanyApi";
import { useCurrentMunicipality } from "@/hooks/useMunicipalityApi";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestCompanyApiPage() {
  const [testResults, setTestResults] = useState<any>({});
  const { profile } = useCurrentUser();
  const { data: currentMunicipality, isLoading: municipalityLoading } =
    useCurrentMunicipality();

  // Test hooks
  const {
    data: allCompanies,
    isLoading: allCompaniesLoading,
    error: allCompaniesError,
  } = useCompanies();
  const {
    data: companiesByMunicipality,
    isLoading: companiesByMunicipalityLoading,
    error: companiesByMunicipalityError,
  } = useCompaniesByMunicipality(currentMunicipality?.id || "");
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useCompanyStats();

  useEffect(() => {
    setTestResults({
      user: {
        profile: profile,
        role: profile?.role,
        isSuperAdmin:
          profile?.role === "SUPERADMIN" || profile?.role === "SUPER_ADMIN",
      },
      municipality: {
        data: currentMunicipality,
        loading: municipalityLoading,
        id: currentMunicipality?.id,
      },
      allCompanies: {
        data: allCompanies,
        loading: allCompaniesLoading,
        error: allCompaniesError,
        count: allCompanies?.length || 0,
      },
      companiesByMunicipality: {
        data: companiesByMunicipality,
        loading: companiesByMunicipalityLoading,
        error: companiesByMunicipalityError,
        count: companiesByMunicipality?.length || 0,
      },
      stats: {
        data: stats,
        loading: statsLoading,
        error: statsError,
      },
    });
  }, [
    profile,
    currentMunicipality,
    municipalityLoading,
    allCompanies,
    allCompaniesLoading,
    allCompaniesError,
    companiesByMunicipality,
    companiesByMunicipalityLoading,
    companiesByMunicipalityError,
    stats,
    statsLoading,
    statsError,
  ]);

  const refreshData = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Test Company API</h1>
        <Button onClick={refreshData} className="mb-4">
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(testResults.user, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Municipality Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(testResults.municipality, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(testResults.allCompanies, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Companies by Municipality</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(testResults.companiesByMunicipality, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(testResults.stats, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Raw Company Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(allCompanies, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
