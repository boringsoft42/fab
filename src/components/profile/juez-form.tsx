"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { DocumentUpload } from "@/components/shared/document-upload"
import { juezCompleteSchema, type JuezComplete } from "@/lib/validations/juez"
import { createJuezProfileAction } from "./actions"

/**
 * Multi-step Juez Profile Form
 * Task 3.7.1, REQ-2.3.x
 *
 * 7 Steps (similar to entrenador but with judge-specific fields):
 * 1. Datos Personales
 * 2. Datos de Contacto
 * 3. Datos Profesionales (nivel_juez, eventos_juzgados)
 * 4. Datos Físicos
 * 5. Contacto de Emergencia
 * 6. Documentos
 * 7. Revisión y Envío
 */

interface JuezFormProps {
  userId: string
  asociaciones: Array<{ id: string; nombre: string }>
  existingData?: Partial<JuezComplete> | null
}

const STEPS = [
  { id: 1, title: "Datos Personales", description: "Información básica" },
  { id: 2, title: "Contacto", description: "Información de contacto" },
  { id: 3, title: "Datos Profesionales", description: "Experiencia como juez" },
  { id: 4, title: "Datos Físicos", description: "Información física" },
  { id: 5, title: "Emergencia", description: "Contacto de emergencia" },
  { id: 6, title: "Documentos", description: "Subir documentos" },
  { id: 7, title: "Revisión", description: "Confirmar y enviar" },
]

export function JuezForm({ userId, asociaciones, existingData }: JuezFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<JuezComplete>({
    resolver: zodResolver(juezCompleteSchema),
    defaultValues: {
      user_id: userId,
      estado: "pendiente",
      ...existingData,
    },
  })

  const selectedAsociacionId = form.watch("asociacion_id")
  const selectedAsociacion = asociaciones.find((a) => a.id === selectedAsociacionId)

  const onSubmit = async (data: JuezComplete) => {
    setIsSubmitting(true)

    try {
      const result = await createJuezProfileAction(data)

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "No se pudo crear el perfil",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Éxito",
        description: "Perfil creado correctamente. Pendiente de aprobación por FAB.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Submit error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el perfil",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await form.trigger(fieldsToValidate as any)

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const isPersonalDataLocked = !!existingData?.nombre

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  currentStep === step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep > step.id
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-muted bg-background"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-12 mx-2 transition-colors ${
                  currentStep > step.id ? "bg-green-500" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Datos Personales */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Datos Personales</CardTitle>
                <CardDescription>
                  {isPersonalDataLocked
                    ? "Estos datos están bloqueados y no se pueden modificar"
                    : "Esta información no podrá modificarse después"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPersonalDataLocked} />
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
                        <FormLabel>Apellido *</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPersonalDataLocked} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ci"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CI *</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPersonalDataLocked} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fecha_nacimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Nacimiento *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            disabled={isPersonalDataLocked}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="genero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Género *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isPersonalDataLocked}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="M">Masculino</SelectItem>
                            <SelectItem value="F">Femenino</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nacionalidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nacionalidad *</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPersonalDataLocked} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estado_civil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado Civil</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPersonalDataLocked} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Datos de Contacto */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Datos de Contacto</CardTitle>
                <CardDescription>
                  Podrás actualizar esta información en cualquier momento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ciudad_residencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="departamento_residencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departamento *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Datos Profesionales */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Datos Profesionales</CardTitle>
                <CardDescription>
                  Experiencia como juez y certificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="asociacion_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asociación *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="especialidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especialidad *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ej: Pista, Campo, Fondo"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="anios_experiencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Años de Experiencia *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="nivel_juez"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel de Juez *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="nacional">Nacional</SelectItem>
                          <SelectItem value="internacional">Internacional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certificaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificaciones</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          placeholder="Lista de certificaciones obtenidas"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventos_juzgados"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eventos Juzgados</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          placeholder="Lista de eventos importantes donde ha participado como juez"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 4: Datos Físicos */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Datos Físicos</CardTitle>
                <CardDescription>Información física básica</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="altura_cm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altura (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="peso_kg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipo_sangre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Sangre *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ej: O+, A-, B+" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Contacto de Emergencia */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Contacto de Emergencia</CardTitle>
                <CardDescription>Persona a contactar en caso de emergencia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contacto_emergencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telefono_emergencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parentesco_emergencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parentesco *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ej: Padre, Madre, Hermano" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Documentos */}
          {currentStep === 6 && (
            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
                <CardDescription>
                  Sube los documentos requeridos. Todos los campos con * son obligatorios.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="foto_url"
                  render={({ field }) => (
                    <FormItem>
                      <DocumentUpload
                        label="Foto de Perfil"
                        description="Foto tipo carnet, fondo blanco"
                        accept="image/*"
                        currentUrl={field.value}
                        onUploadComplete={field.onChange}
                        onRemove={() => field.onChange("")}
                        folder={`${selectedAsociacionId}/${userId}`}
                        required
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ci_frente_url"
                  render={({ field }) => (
                    <FormItem>
                      <DocumentUpload
                        label="CI - Frente"
                        description="Cédula de identidad lado frontal"
                        accept="image/*,.pdf"
                        currentUrl={field.value}
                        onUploadComplete={field.onChange}
                        onRemove={() => field.onChange("")}
                        folder={`${selectedAsociacionId}/${userId}`}
                        required
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ci_reverso_url"
                  render={({ field }) => (
                    <FormItem>
                      <DocumentUpload
                        label="CI - Reverso"
                        description="Cédula de identidad lado posterior"
                        accept="image/*,.pdf"
                        currentUrl={field.value}
                        onUploadComplete={field.onChange}
                        onRemove={() => field.onChange("")}
                        folder={`${selectedAsociacionId}/${userId}`}
                        required
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certificado_medico_url"
                  render={({ field }) => (
                    <FormItem>
                      <DocumentUpload
                        label="Certificado Médico (Opcional)"
                        description="Certificado médico vigente"
                        accept="image/*,.pdf"
                        currentUrl={field.value || undefined}
                        onUploadComplete={field.onChange}
                        onRemove={() => field.onChange(null)}
                        folder={`${selectedAsociacionId}/${userId}`}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certificaciones_juez_url"
                  render={({ field }) => (
                    <FormItem>
                      <DocumentUpload
                        label="Certificaciones de Juez (Opcional)"
                        description="Certificados de cursos para jueces"
                        accept="image/*,.pdf"
                        currentUrl={field.value || undefined}
                        onUploadComplete={field.onChange}
                        onRemove={() => field.onChange(null)}
                        folder={`${selectedAsociacionId}/${userId}`}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="licencia_juez_url"
                  render={({ field }) => (
                    <FormItem>
                      <DocumentUpload
                        label="Licencia de Juez (Opcional)"
                        description="Licencia oficial de juez"
                        accept="image/*,.pdf"
                        currentUrl={field.value || undefined}
                        onUploadComplete={field.onChange}
                        onRemove={() => field.onChange(null)}
                        folder={`${selectedAsociacionId}/${userId}`}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 7: Revisión */}
          {currentStep === 7 && (
            <Card>
              <CardHeader>
                <CardTitle>Revisión Final</CardTitle>
                <CardDescription>
                  Revisa toda la información antes de enviar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Datos Personales</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Nombre:</span> {form.getValues("nombre")} {form.getValues("apellido")}</div>
                      <div><span className="text-muted-foreground">CI:</span> {form.getValues("ci")}</div>
                      <div><span className="text-muted-foreground">Fecha Nac:</span> {form.getValues("fecha_nacimiento")}</div>
                      <div><span className="text-muted-foreground">Género:</span> {form.getValues("genero")}</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Contacto</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Email:</span> {form.getValues("email")}</div>
                      <div><span className="text-muted-foreground">Teléfono:</span> {form.getValues("telefono")}</div>
                      <div className="col-span-2"><span className="text-muted-foreground">Dirección:</span> {form.getValues("direccion")}</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Datos Profesionales</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Asociación:</span> {selectedAsociacion?.nombre}</div>
                      <div><span className="text-muted-foreground">Especialidad:</span> {form.getValues("especialidad")}</div>
                      <div><span className="text-muted-foreground">Nivel:</span> {form.getValues("nivel_juez")}</div>
                      <div><span className="text-muted-foreground">Años Exp:</span> {form.getValues("anios_experiencia")}</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Documentos</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Foto de perfil</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>CI - Frente</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>CI - Reverso</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Al enviar este formulario, tu perfil quedará en estado{" "}
                    <span className="font-semibold">pendiente</span> y será revisado
                    por la administración de FAB.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {currentStep < STEPS.length ? (
              <Button type="button" onClick={nextStep}>
                Siguiente
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Enviar Perfil
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

function getFieldsForStep(step: number): string[] {
  switch (step) {
    case 1:
      return ["nombre", "apellido", "ci", "fecha_nacimiento", "genero", "nacionalidad"]
    case 2:
      return ["telefono", "email", "direccion", "ciudad_residencia", "departamento_residencia"]
    case 3:
      return ["asociacion_id", "especialidad", "anios_experiencia", "nivel_juez"]
    case 4:
      return ["tipo_sangre"]
    case 5:
      return ["contacto_emergencia", "telefono_emergencia", "parentesco_emergencia"]
    case 6:
      return ["foto_url", "ci_frente_url", "ci_reverso_url"]
    default:
      return []
  }
}
