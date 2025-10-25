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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createAdminAsociacionAction } from "@/app/(dashboard)/users/admins/actions"
import { generateTempPassword } from "@/lib/password-utils"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, RefreshCw } from "lucide-react"

const createAdminSchema = z.object({
  email: z.string().email("Email inválido"),
  nombre: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "Apellido debe tener al menos 2 caracteres"),
  asociacion_id: z.string().min(1, "Debes seleccionar una asociación"),
  tempPassword: z.string().min(8, "Contraseña debe tener al menos 8 caracteres"),
})

type CreateAdminFormData = z.infer<typeof createAdminSchema>

type Asociacion = {
  id: string
  nombre: string
}

export function CreateAdminForm({ asociaciones }: { asociaciones: Asociacion[] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      email: "",
      nombre: "",
      apellido: "",
      asociacion_id: "",
      tempPassword: generateTempPassword(),
    },
  })

  const handleGeneratePassword = () => {
    const newPassword = generateTempPassword()
    form.setValue("tempPassword", newPassword)
    toast({
      title: "Contraseña generada",
      description: "Se ha generado una nueva contraseña temporal",
    })
  }

  async function onSubmit(data: CreateAdminFormData) {
    setIsLoading(true)
    try {
      const result = await createAdminAsociacionAction(data)

      if (result.success) {
        toast({
          title: "Éxito",
          description: result.message,
        })
        router.push("/users/admins")
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
        description: "Error al crear administrador",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nuevo Administrador de Asociación</CardTitle>
        <CardDescription>
          El administrador será creado con estado "activo" y podrá acceder inmediatamente al sistema.
          Se enviará un email con las credenciales de acceso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@asociacion.bo"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    El email será usado para acceder al sistema
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="asociacion_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asociación Departamental</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una asociación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {asociaciones.map((asoc) => (
                        <SelectItem key={asoc.id} value={asoc.id}>
                          {asoc.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    El administrador solo podrá gestionar esta asociación
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tempPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña Temporal</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGeneratePassword}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Generar
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Esta contraseña será enviada por email. El administrador debe cambiarla en su primer acceso.
                  </FormDescription>
                  <FormMessage />
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
                {isLoading ? "Creando..." : "Crear Administrador"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
