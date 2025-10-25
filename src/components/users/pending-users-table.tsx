"use client"

import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, Eye } from "lucide-react"
import { approveUserAction, rejectUserAction } from "@/app/(dashboard)/users/pending/actions"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

type PendingUser = {
  user_id: string
  rol: string
  asociacion_nombre: string
  fecha_registro: string
  // Profile-specific fields (from atletas/entrenadores/jueces)
  nombre?: string
  apellido?: string
  email?: string
  ci?: string
}

export function PendingUsersTable({ data }: { data: PendingUser[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null)
  const [dialogType, setDialogType] = useState<"approve" | "reject" | null>(null)
  const [observaciones, setObservaciones] = useState("")
  const [motivo, setMotivo] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const columns: ColumnDef<PendingUser>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => {
        const nombre = row.original.nombre || "N/A"
        const apellido = row.original.apellido || ""
        return <div className="font-medium">{`${nombre} ${apellido}`.trim()}</div>
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "ci",
      header: "CI",
    },
    {
      accessorKey: "rol",
      header: "Rol",
      cell: ({ row }) => {
        const rol = row.getValue("rol") as string
        const colors: Record<string, string> = {
          atleta: "bg-blue-100 text-blue-800",
          entrenador: "bg-green-100 text-green-800",
          juez: "bg-purple-100 text-purple-800",
        }
        return (
          <Badge className={colors[rol] || "bg-gray-100 text-gray-800"}>
            {rol}
          </Badge>
        )
      },
    },
    {
      accessorKey: "asociacion_nombre",
      header: "Asociación",
    },
    {
      accessorKey: "fecha_registro",
      header: "Fecha Registro",
      cell: ({ row }) => {
        const fecha = new Date(row.getValue("fecha_registro"))
        return <div>{fecha.toLocaleDateString()}</div>
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-2">
            <Link href={`/users/${user.user_id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => handleOpenDialog(user, "approve")}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleOpenDialog(user, "reject")}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  const handleOpenDialog = (user: PendingUser, type: "approve" | "reject") => {
    setSelectedUser(user)
    setDialogType(type)
    setObservaciones("")
    setMotivo("")
  }

  const handleApprove = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    try {
      const result = await approveUserAction(selectedUser.user_id, observaciones)

      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        })
        setDialogType(null)
        setSelectedUser(null)
        // Refresh page data
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al aprobar usuario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedUser || !motivo.trim()) {
      toast({
        title: "Error",
        description: "El motivo del rechazo es obligatorio",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await rejectUserAction(selectedUser.user_id, motivo)

      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        })
        setDialogType(null)
        setSelectedUser(null)
        // Refresh page data
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al rechazar usuario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar por nombre..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombre")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={(table.getColumn("rol")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("rol")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            <SelectItem value="atleta">Atleta</SelectItem>
            <SelectItem value="entrenador">Entrenador</SelectItem>
            <SelectItem value="juez">Juez</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay usuarios pendientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>

      {/* Approve Dialog */}
      <AlertDialog open={dialogType === "approve"} onOpenChange={() => setDialogType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aprobar Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de aprobar a{" "}
              <span className="font-semibold">
                {selectedUser?.nombre} {selectedUser?.apellido}
              </span>
              ? El usuario podrá acceder al sistema completamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones (opcional)</Label>
            <Textarea
              id="observaciones"
              placeholder="Agregar observaciones..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} disabled={isLoading}>
              {isLoading ? "Aprobando..." : "Aprobar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={dialogType === "reject"} onOpenChange={() => setDialogType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rechazar Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de rechazar a{" "}
              <span className="font-semibold">
                {selectedUser?.nombre} {selectedUser?.apellido}
              </span>
              ? El usuario no podrá acceder al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="motivo">
              Motivo del rechazo <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="motivo"
              placeholder="Especifica el motivo del rechazo (obligatorio)..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={isLoading || !motivo.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Rechazando..." : "Rechazar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
