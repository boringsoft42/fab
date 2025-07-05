&ldquo;use client&rdquo;;

import { Loader2 } from &ldquo;lucide-react&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import { useEffect, useState } from &ldquo;react&rdquo;;
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from &ldquo;@/components/ui/card&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;

export function SettingsLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(30);
    }, 200);

    const timer2 = setTimeout(() => {
      setProgress(60);
    }, 600);

    const timer3 = setTimeout(() => {
      setProgress(90);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className=&ldquo;space-y-6 animate-in fade-in-50 duration-300&rdquo;>
      <div className=&ldquo;space-y-2&rdquo;>
        <Skeleton className=&ldquo;h-8 w-64&rdquo; />
        <Skeleton className=&ldquo;h-4 w-96&rdquo; />
      </div>

      <Tabs defaultValue=&ldquo;profile&rdquo; className=&ldquo;space-y-6&rdquo;>
        <TabsList className=&ldquo;grid w-full grid-cols-2&rdquo;>
          <TabsTrigger value=&ldquo;profile&rdquo; disabled>
            Perfil
          </TabsTrigger>
          <TabsTrigger value=&ldquo;security&rdquo; disabled>
            Seguridad
          </TabsTrigger>
        </TabsList>

        <TabsContent value=&ldquo;profile&rdquo; className=&ldquo;space-y-6&rdquo;>
          {/* Account Section Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className=&ldquo;h-6 w-48&rdquo; />
              <Skeleton className=&ldquo;h-4 w-64&rdquo; />
            </CardHeader>
            <CardContent>
              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className=&ldquo;space-y-2&rdquo;>
                    <Skeleton className=&ldquo;h-4 w-24&rdquo; />
                    <Skeleton className=&ldquo;h-4 w-32&rdquo; />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings Form Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className=&ldquo;h-6 w-48&rdquo; />
              <Skeleton className=&ldquo;h-4 w-64&rdquo; />
            </CardHeader>
            <CardContent>
              <div className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                  <div className=&ldquo;space-y-2&rdquo;>
                    <Skeleton className=&ldquo;h-4 w-24&rdquo; />
                    <Skeleton className=&ldquo;h-10 w-full&rdquo; />
                  </div>
                  <div className=&ldquo;space-y-2&rdquo;>
                    <Skeleton className=&ldquo;h-4 w-24&rdquo; />
                    <Skeleton className=&ldquo;h-10 w-full&rdquo; />
                  </div>
                </div>
                <Skeleton className=&ldquo;h-24 w-full rounded-full&rdquo; />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className=&ldquo;h-10 w-32&rdquo; />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className=&ldquo;fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none&rdquo;>
        <div className=&ldquo;flex flex-col items-center gap-4 w-full max-w-sm p-6&rdquo;>
          <Loader2 className=&ldquo;h-10 w-10 animate-spin text-primary&rdquo; />
          <p className=&ldquo;text-base font-medium&rdquo;>Cargando configuración...</p>
          <Progress value={progress} className=&ldquo;w-full h-2&rdquo; />
        </div>
      </div>
    </div>
  );
}
