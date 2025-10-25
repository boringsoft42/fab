import { toast } from "@/hooks/use-toast"

export const toastUtils = {
  success: (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "default",
    })
  },

  error: (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "destructive",
    })
  },

  info: (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "default",
    })
  },

  // Specific success messages for FAB system
  userApproved: () => {
    toast({
      title: "Usuario aprobado",
      description: "El usuario ha sido aprobado exitosamente",
    })
  },

  userRejected: () => {
    toast({
      title: "Usuario rechazado",
      description: "El usuario ha sido rechazado",
      variant: "destructive",
    })
  },

  inscriptionApproved: () => {
    toast({
      title: "Inscripción aprobada",
      description: "La inscripción ha sido aprobada exitosamente",
    })
  },

  inscriptionRejected: () => {
    toast({
      title: "Inscripción rechazada",
      description: "La inscripción ha sido rechazada",
      variant: "destructive",
    })
  },

  paymentVerified: () => {
    toast({
      title: "Pago verificado",
      description: "El pago ha sido verificado exitosamente",
    })
  },

  paymentObserved: () => {
    toast({
      title: "Pago observado",
      description: "El pago ha sido marcado con observaciones",
      variant: "destructive",
    })
  },

  eventCreated: () => {
    toast({
      title: "Evento creado",
      description: "El evento ha sido creado exitosamente",
    })
  },

  eventUpdated: () => {
    toast({
      title: "Evento actualizado",
      description: "El evento ha sido actualizado exitosamente",
    })
  },

  profileUpdated: () => {
    toast({
      title: "Perfil actualizado",
      description: "Tu perfil ha sido actualizado exitosamente",
    })
  },

  dorsalAssigned: () => {
    toast({
      title: "Dorsal asignado",
      description: "El dorsal ha sido asignado exitosamente",
    })
  },

  startlistFinalized: () => {
    toast({
      title: "Startlist finalizada",
      description: "La startlist ha sido finalizada y no puede ser editada",
    })
  },

  // Generic error messages
  unauthorized: () => {
    toast({
      title: "No autorizado",
      description: "No tienes permisos para realizar esta acción",
      variant: "destructive",
    })
  },

  serverError: () => {
    toast({
      title: "Error del servidor",
      description: "Ocurrió un error. Por favor, intenta nuevamente",
      variant: "destructive",
    })
  },

  validationError: (message?: string) => {
    toast({
      title: "Error de validación",
      description: message || "Por favor, verifica los datos ingresados",
      variant: "destructive",
    })
  },
}
