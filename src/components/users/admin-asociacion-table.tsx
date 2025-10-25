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
import { Switch } from "@/components/ui/switch"
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
import { toggleAdminEstadoAction } from "@/app/(dashboard)/users/admins/actions"
import { toast } from "@/components/ui/use-toast"

type AdminAsociacion = {
  user_id: string
  email: string
  estado: string
  asociacion_nombre: string
  created_at: string
}

export function AdminAsociacionTable({ data }: { data: AdminAsociacion[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAsociacion | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const columns: ColumnDef<AdminAsociacion>[] = [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "asociacion_nombre",
      header: "Asociación",
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("estado") as string
        const colors: Record<string, string> = {
          activo: "bg-green-100 text-green-800",
          inactivo: "bg-gray-100 text-gray-800",
        }
        return (
          <Badge className={colors[estado] || "bg-gray-100 text-gray-800"}>
            {estado}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Fecha Creación",
      cell: ({ row }) => {
        const fecha = new Date(row.getValue("created_at"))
        return <div>{fecha.toLocaleDateString()}</div>
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const admin = row.original
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {admin.estado === "activo" ? "Activo" : "Inactivo"}
              </span>
              <Switch
                checked={admin.estado === "activo"}
                onCheckedChange={() => handleToggleEstado(admin)}
              />
            </div>
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

  const handleToggleEstado = (admin: AdminAsociacion) => {
    setSelectedAdmin(admin)
    setDialogOpen(true)
  }

  const handleConfirmToggle = async () => {
    if (!selectedAdmin) return

    setIsLoading(true)
    try {
      const result = await toggleAdminEstadoAction(
        selectedAdmin.user_id,
        selectedAdmin.estado
      )

      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        })
        setDialogOpen(false)
        setSelectedAdmin(null)
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
        description: "Error al cambiar estado",
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
          placeholder="Buscar por email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={(table.getColumn("estado")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("estado")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
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
                  No hay administradores de asociación.
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

      {/* Toggle Estado Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cambiar Estado</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de cambiar el estado de{" "}
              <span className="font-semibold">{selectedAdmin?.email}</span>{" "}
              a{" "}
              <span className="font-semibold">
                {selectedAdmin?.estado === "activo" ? "inactivo" : "activo"}
              </span>
              ?
              {selectedAdmin?.estado === "activo" && (
                <span className="block mt-2 text-red-600">
                  El administrador no podrá acceder al sistema mientras esté inactivo.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggle} disabled={isLoading}>
              {isLoading ? "Cambiando..." : "Cambiar Estado"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
