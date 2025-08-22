"use client";

import { MunicipalityIdentifierDisplay } from "@/components/admin/MunicipalityIdentifierDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Info } from "lucide-react";

export default function MunicipalityProfilePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Perfil del Municipio</h1>
          <p className="text-muted-foreground">
            Información del municipio con identificadores alternativos
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Identificadores Alternativos
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Municipality Information */}
        <MunicipalityIdentifierDisplay showAlternativeId={true} />

        {/* Usage Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Cómo usar los Identificadores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">ID Principal (CUID)</h4>
              <p className="text-sm text-muted-foreground">
                Es el identificador único generado automáticamente por la base
                de datos. Formato:{" "}
                <code className="bg-muted px-1 rounded">c[a-z0-9]{24}</code>
              </p>
              <p className="text-sm text-muted-foreground">
                Ejemplo:{" "}
                <code className="bg-muted px-1 rounded">
                  cmemo5inx00019ybpwv3fu7bk
                </code>
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">ID Alternativo (Username)</h4>
              <p className="text-sm text-muted-foreground">
                Es el nombre de usuario del municipio, más fácil de recordar y
                usar. Formato:{" "}
                <code className="bg-muted px-1 rounded">[a-z0-9_]+</code>
              </p>
              <p className="text-sm text-muted-foreground">
                Ejemplo:{" "}
                <code className="bg-muted px-1 rounded">cochabamba_muni</code>
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Ventajas del ID Alternativo</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Más fácil de recordar y escribir</li>
                <li>• Más legible en URLs y logs</li>
                <li>• Mejor para debugging y desarrollo</li>
                <li>• Compatible con sistemas externos</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Uso en APIs</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Puedes usar cualquiera de los dos identificadores:</p>
                <div className="space-y-1">
                  <code className="bg-muted px-1 rounded block">
                    GET /api/municipality/{"{id}"}
                  </code>
                  <code className="bg-muted px-1 rounded block">
                    GET /api/municipality/by-identifier/{"{username}"}
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
