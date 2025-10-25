import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Verde: aprobado, activo, verificado
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        // Amarillo/Naranja: pendiente, en revisión
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        // Rojo: rechazado, observado, inactivo
        danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        // Azul: información, links
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        // Gris: neutral, deshabilitado
        neutral: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode
}

export function StatusBadge({
  className,
  variant,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </span>
  )
}

// Helper function to get badge variant based on status
export function getStatusVariant(status: string): "success" | "warning" | "danger" | "info" | "neutral" {
  const statusMap: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
    // Estados de usuario
    'activo': 'success',
    'pendiente': 'warning',
    'rechazado': 'danger',
    'inactivo': 'danger',

    // Estados de evento
    'aprobado': 'success',
    'borrador': 'neutral',
    'en_revision': 'warning',

    // Estados de pago
    'verificado': 'success',
    'observado': 'danger',

    // Estados de inscripción
    'aprobada': 'success',
    'rechazada': 'danger',

    // Estados generales
    'completado': 'success',
    'en_progreso': 'warning',
    'cancelado': 'danger',
    'finalizada': 'success',
  }

  return statusMap[status.toLowerCase()] || 'neutral'
}
