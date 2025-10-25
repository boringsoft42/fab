"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle } from "lucide-react"
import { approveUserAction, rejectUserAction } from "@/app/(dashboard)/users/pending/actions"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function ApproveRejectActions({
  userId,
  userName,
}: {
  userId: string
  userName: string
}) {
  const router = useRouter()
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [observaciones, setObservaciones] = useState("")
  const [motivo, setMotivo] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      const result = await approveUserAction(userId, observaciones)

      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        })
        setApproveDialogOpen(false)
        router.push("/users/pending")
        router.refresh()
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
    if (!motivo.trim()) {
      toast({
        title: "Error",
        description: "El motivo del rechazo es obligatorio",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await rejectUserAction(userId, motivo)

      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        })
        setRejectDialogOpen(false)
        router.push("/users/pending")
        router.refresh()
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
    <div className="flex gap-2">
      {/* Approve Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Aprobar Usuario
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aprobar Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de aprobar a{" "}
              <span className="font-semibold">{userName}</span>?
              El usuario podrá acceder al sistema completamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="observaciones-approve">Observaciones (opcional)</Label>
            <Textarea
              id="observaciones-approve"
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
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <XCircle className="h-4 w-4 mr-2" />
            Rechazar Usuario
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rechazar Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de rechazar a{" "}
              <span className="font-semibold">{userName}</span>?
              El usuario no podrá acceder al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="motivo-reject">
              Motivo del rechazo <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="motivo-reject"
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
