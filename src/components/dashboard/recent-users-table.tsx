"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, User } from "lucide-react";
import type { RecentUser } from "@/lib/actions/dashboard/admin-fab-actions";

interface RecentUsersTableProps {
  users: RecentUser[];
}

const estadoColors = {
  pendiente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  activo: "bg-green-500/10 text-green-500 border-green-500/20",
  inactivo: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  rechazado: "bg-red-500/10 text-red-500 border-red-500/20",
};

const rolColors = {
  atleta: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  entrenador: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  juez: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  admin_asociacion: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  admin_fab: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
};

export function RecentUsersTable({ users }: RecentUsersTableProps) {
  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Últimos Usuarios Registrados</CardTitle>
          <CardDescription>No hay usuarios recientes</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Últimos Usuarios Registrados</CardTitle>
          <CardDescription>Los 5 usuarios más recientes del sistema</CardDescription>
        </div>
        <Link href="/dashboard/users/pending">
          <Button variant="ghost" size="sm">
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Asociación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Registro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      {user.nombre} {user.apellido}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={rolColors[user.rol as keyof typeof rolColors]}>
                    {user.rol.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.asociacion_nombre}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={estadoColors[user.estado as keyof typeof estadoColors]}>
                    {user.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.fecha_registro).toLocaleDateString("es-BO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
