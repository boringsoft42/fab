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
import { ArrowRight, DollarSign, FileText } from "lucide-react";
import type { PendingPayment } from "@/lib/actions/dashboard/admin-fab-actions";

interface PendingPaymentsTableProps {
  payments: PendingPayment[];
}

export function PendingPaymentsTable({ payments }: PendingPaymentsTableProps) {
  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pagos Pendientes</CardTitle>
          <CardDescription>No hay pagos pendientes de verificación</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pagos Pendientes de Verificación</CardTitle>
          <CardDescription>Los 5 pagos más recientes esperando verificación</CardDescription>
        </div>
        <Link href="/dashboard/pagos/pending">
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
              <TableHead>Asociación</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Fecha Pago</TableHead>
              <TableHead>Comprobante</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.asociacion_nombre}</TableCell>
                <TableCell className="text-muted-foreground">{payment.evento_nombre}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-semibold text-green-600">
                    <DollarSign className="h-4 w-4" />
                    {payment.monto.toLocaleString("es-BO", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    {payment.metodo_pago || "No especificado"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {payment.fecha_pago
                    ? new Date(payment.fecha_pago).toLocaleDateString("es-BO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "No registrado"}
                </TableCell>
                <TableCell>
                  {payment.comprobante_url ? (
                    <Link href={payment.comprobante_url} target="_blank">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </Link>
                  ) : (
                    <span className="text-muted-foreground text-sm">Sin comprobante</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
