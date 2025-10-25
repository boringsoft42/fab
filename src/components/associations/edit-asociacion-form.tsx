"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateAsociacionAction } from "@/app/(dashboard)/associations/actions"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const asociacionSchema = z.object({
  nombre: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  departamento: z.string().min(2, "Departamento es obligatorio"),
  ciudad: z.string().optional(),
  contacto: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
  estado: z.boolean(),
})

type AsociacionFormData = z.infer<typeof asociacionSchema>

type Asociacion = {
  id: string
  nombre: string
  departamento: string
  ciudad: string | null
  contacto: string | null
  email: string | null
  telefono: string | null
  estado: boolean
}

export function EditAsociacionForm({ asociacion }: { asociacion: Asociacion }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AsociacionFormData>({
    resolver: zodResolver(asociacionSchema),
    defaultValues: {
      nombre: asociacion.nombre,
      departamento: asociacion.departamento,
      ciudad: asociacion.ciudad || "",
      contacto: asociacion.contacto || "",
      email: asociacion.email || "",
      telefono: asociacion.telefono || "",
      estado: asociacion.estado,
    },
  })

  async function onSubmit(data: AsociacionFormData) {
    setIsLoading(true)
    try {
      const result = await updateAsociacionAction({
        id: asociacion.id,
        ...data,
      })

      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        })
        router.push("/associations")
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
        description: "Error al actualizar asociación",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de la Asociación</CardTitle>
        <CardDescription>
          Actualiza los datos de contacto y estado de la asociación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Asociación de Atletismo..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Nombre oficial de la asociación departamental
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Input placeholder="La Paz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ciudad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="La Paz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contacto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persona de Contacto (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contacto@asociacion.bo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="591 2 1234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Estado de la Asociación
                    </FormLabel>
                    <FormDescription>
                      Asociaciones inactivas no pueden tener nuevos usuarios registrados
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
