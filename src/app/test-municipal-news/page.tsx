"use client";

import { useNewsByAuthor } from "@/hooks/useNewsArticleApi";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestMunicipalNewsPage() {
  const { profile } = useCurrentUser();
  const {
    data: newsData,
    isLoading,
    error,
  } = useNewsByAuthor(profile?.municipality?.id || profile?.id || "");

  console.log("🔍 TestMunicipalNewsPage - Profile:", profile);
  console.log(
    "🔍 TestMunicipalNewsPage - Municipality ID:",
    profile?.municipality?.id
  );
  console.log("🔍 TestMunicipalNewsPage - User ID:", profile?.id);
  console.log("🔍 TestMunicipalNewsPage - News Data:", newsData);
  console.log("🔍 TestMunicipalNewsPage - Is Loading:", isLoading);
  console.log("🔍 TestMunicipalNewsPage - Error:", error);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Test Municipal News</h1>

      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Profile:</strong>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>

            <div>
              <strong>Municipality ID:</strong>{" "}
              {profile?.municipality?.id || "No municipality ID"}
            </div>

            <div>
              <strong>User ID:</strong> {profile?.id || "No user ID"}
            </div>

            <div>
              <strong>Is Loading:</strong> {isLoading ? "Yes" : "No"}
            </div>

            <div>
              <strong>Error:</strong>
              <pre className="mt-2 p-2 bg-red-100 rounded text-sm">
                {error ? JSON.stringify(error, null, 2) : "No error"}
              </pre>
            </div>

            <div>
              <strong>News Count:</strong> {newsData?.length || 0}
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">Loading municipal news...</div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading news: {error.message}
            </div>
          </CardContent>
        </Card>
      )}

      {newsData && newsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Municipal News ({newsData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newsData.map((news) => (
                <div key={news.id} className="border p-4 rounded">
                  <h3 className="font-semibold">{news.title}</h3>
                  <p className="text-sm text-gray-600">{news.summary}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    <span>Status: {news.status}</span> |
                    <span> Author: {news.authorName}</span> |
                    <span> Type: {news.authorType}</span> |
                    <span> Author ID: {news.authorId}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {newsData && newsData.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-600">
              No municipal news found for this user.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
