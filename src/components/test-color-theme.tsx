"use client";

import { useUserColors } from "@/hooks/use-user-colors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TestColorTheme() {
  // Usar el hook para aplicar las variables CSS
  useUserColors();

  return (
    <div className="p-4">
     
    </div>
  );
}
