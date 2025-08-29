"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  Download,
  Edit3,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCVStatus } from "@/hooks/use-cv-status";
import { buildFileUrl, downloadFileWithAuth } from "@/lib/utils";

interface CVCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  jobOfferId: string;
}

export default function CVCheckModal({
  isOpen,
  onClose,
  onContinue,
  jobOfferId,
}: CVCheckModalProps) {
  // Debug log inmediato cuando se renderiza el componente
  console.log("🎯 CV Check Modal - Component rendered:", {
    isOpen,
    jobOfferId,
  });

  const router = useRouter();
  const { toast } = useToast();
  const {
    hasCV,
    hasCoverLetter,
    cvUrl,
    coverLetterUrl,
    loading,
    error,
    uploadCVFile,
    uploadCoverLetterFile,
    deleteCVFile,
    deleteCoverLetterFile,
    deleteCVBuilder,
    cvSource,
  } = useCVStatus();

  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadingCoverLetter, setUploadingCoverLetter] = useState(false);
  const [deletingCV, setDeletingCV] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const handleCVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
    } else {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo PDF",
        variant: "destructive",
      });
    }
  };

  const handleCoverLetterFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setCoverLetterFile(file);
    } else {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo PDF",
        variant: "destructive",
      });
    }
  };

  const handleUploadCV = async () => {
    if (!cvFile) return;

    console.log("🎯 CV Check Modal - Uploading CV file:", cvFile.name);
    alert(`Subiendo CV: ${cvFile.name}`);

    setUploadingCV(true);
    try {
      const result = await uploadCVFile(cvFile);
      console.log("🎯 CV Check Modal - CV upload result:", result);
      alert(`CV subido exitosamente: ${result.cvUrl}`);

      toast({
        title: "¡CV subido exitosamente!",
        description: "Tu CV ha sido guardado correctamente",
      });
      setCvFile(null);
    } catch (error) {
      console.error("Error subiendo CV:", error);
      toast({
        title: "Error",
        description: "No se pudo subir el CV. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setUploadingCV(false);
    }
  };

  const handleUploadCoverLetter = async () => {
    if (!coverLetterFile) return;

    setUploadingCoverLetter(true);
    try {
      await uploadCoverLetterFile(coverLetterFile);
      toast({
        title: "¡Carta de presentación subida exitosamente!",
        description: "Tu carta de presentación ha sido guardada correctamente",
      });
      setCoverLetterFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "No se pudo subir la carta de presentación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setUploadingCoverLetter(false);
    }
  };

  const handleReplaceCV = async () => {
    if (!cvFile) return;

    setUploadingCV(true);
    try {
      await uploadCVFile(cvFile);
      toast({
        title: "¡CV actualizado exitosamente!",
        description: "Tu nuevo CV ha sido guardado correctamente",
      });
      setCvFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el CV. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setUploadingCV(false);
    }
  };

  const handleDeleteCV = async () => {
    setDeletingCV(true);
    try {
      if (cvSource === "builder") {
        await deleteCVBuilder();
        toast({
          title: "¡CV del builder eliminado exitosamente!",
          description: "Tu CV del builder ha sido eliminado correctamente",
        });
      } else {
        await deleteCVFile();
        toast({
          title: "¡CV eliminado exitosamente!",
          description: "Tu CV ha sido eliminado correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el CV. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setDeletingCV(false);
    }
  };

  const handleClearAll = async () => {
    try {
      // Eliminar CV si existe
      if (hasCV) {
        if (cvSource === "builder") {
          await deleteCVBuilder();
        } else {
          await deleteCVFile();
        }
      }

      // Eliminar carta de presentación si existe
      if (hasCoverLetter) {
        await deleteCoverLetterFile();
      }

      toast({
        title: "¡Documentos eliminados!",
        description:
          "Todos los documentos han sido eliminados. Puedes subir nuevos archivos.",
      });
    } catch (error) {
      console.error("Error en handleClearAll:", error);
      toast({
        title: "Error",
        description: "No se pudieron eliminar todos los documentos.",
        variant: "destructive",
      });
    }
  };

  const goToCVBuilder = () => {
    router.push("/cv-builder");
    onClose();
  };

  const goToCoverLetterBuilder = () => {
    router.push("/cover-letter-builder");
    onClose();
  };

  const canContinue = hasCV || hasCoverLetter;

  // Debug logs - más visibles
  console.log("🎯 CV Check Modal - Debug State:", {
    hasCV,
    hasCoverLetter,
    canContinue,
    cvUrl,
    coverLetterUrl,
    cvSource,
    loading,
    error,
  });

  // Log adicional para verificar que el componente se está ejecutando
  console.log("🎯 CV Check Modal - Component state check:", {
    isOpen,
    canContinue,
    buttonText: canContinue
      ? "Continuar con la Aplicación"
      : "Necesitas al menos un documento",
  });

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Verificando documentos...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Verificación de Documentos
          </DialogTitle>
          <DialogDescription>
            Para aplicar a este empleo, necesitas tener un CV y/o carta de
            presentación. Puedes crear estos documentos o subir archivos PDF
            existentes.
          </DialogDescription>

          {/* Error de autenticación */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div className="text-sm text-red-800">
                  <strong>Error de autenticación:</strong> {error}
                </div>
              </div>
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    router.push("/login");
                  }}
                  className="text-red-700 border-red-300 hover:bg-red-100"
                >
                  Ir al Login
                </Button>
              </div>
            </div>
          )}

          {(hasCV || hasCoverLetter) && !error && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Si ves documentos que no has subido,
                  puedes limpiar todo y empezar de nuevo.
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearAll}
                  className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                >
                  Limpiar Todo
                </Button>
              </div>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* CV Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {hasCV ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                )}
                CV / Currículum Vitae
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasCV ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <span className="text-green-800 font-medium">
                        CV disponible
                      </span>
                      <div className="text-xs text-green-600">
                        {cvSource === "builder"
                          ? "Creado con CV Builder"
                          : "Archivo PDF subido"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (cvUrl) {
                          try {
                            await downloadFileWithAuth(cvUrl, "cv.pdf");
                          } catch (error) {
                            toast({
                              title: "Error al descargar CV",
                              description:
                                error instanceof Error
                                  ? error.message
                                  : "No se pudo descargar el CV",
                              variant: "destructive",
                            });
                          }
                        } else {
                          toast({
                            title: "Error",
                            description: "No se encontró la URL del CV",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Ver CV
                    </Button>
                    {cvSource === "file" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteCV}
                        disabled={deletingCV}
                      >
                        {deletingCV ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    {cvSource === "builder" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteCV}
                        disabled={deletingCV}
                      >
                        {deletingCV ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-orange-800 font-medium">
                        CV no encontrado
                      </span>
                    </div>
                    <p className="text-orange-700 text-sm">
                      Necesitas crear un CV o subir un archivo PDF para
                      continuar.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Create CV */}
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={goToCVBuilder}
                    >
                      <Edit3 className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-medium">Crear CV</div>
                        <div className="text-xs text-muted-foreground">
                          Usar el CV Builder
                        </div>
                      </div>
                    </Button>

                    {/* Upload CV */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="cv-upload"
                        className="text-sm font-medium"
                      >
                        Subir CV (PDF)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="cv-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleCVFileChange}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={
                            hasCV && cvSource === "file"
                              ? handleReplaceCV
                              : handleUploadCV
                          }
                          disabled={!cvFile || uploadingCV || !!error}
                        >
                          {uploadingCV ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cover Letter Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {hasCoverLetter ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                )}
                Carta de Presentación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasCoverLetter ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-800">
                      Carta de presentación disponible
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (coverLetterUrl) {
                          try {
                            await downloadFileWithAuth(
                              coverLetterUrl,
                              "cover-letter.pdf"
                            );
                          } catch (error) {
                            toast({
                              title: "Error al descargar carta",
                              description:
                                error instanceof Error
                                  ? error.message
                                  : "No se pudo descargar la carta",
                              variant: "destructive",
                            });
                          }
                        } else {
                          toast({
                            title: "Error",
                            description:
                              "No se encontró la URL de la carta de presentación",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Ver Carta
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          await deleteCoverLetterFile();
                          toast({
                            title: "¡Carta eliminada exitosamente!",
                            description:
                              "Tu carta de presentación ha sido eliminada correctamente",
                          });
                        } catch (error) {
                          toast({
                            title: "Error",
                            description:
                              "No se pudo eliminar la carta de presentación.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-orange-800 font-medium">
                        Carta de presentación no encontrada
                      </span>
                    </div>
                    <p className="text-orange-700 text-sm">
                      Puedes subir una carta de presentación en PDF (opcional).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Create Cover Letter */}
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={goToCoverLetterBuilder}
                    >
                      <Edit3 className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-medium">Crear Carta</div>
                        <div className="text-xs text-muted-foreground">
                          Usar el Builder
                        </div>
                      </div>
                    </Button>

                    {/* Upload Cover Letter */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="cover-letter-upload"
                        className="text-sm font-medium"
                      >
                        Subir Carta de Presentación (PDF)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="cover-letter-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleCoverLetterFileChange}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={handleUploadCoverLetter}
                          disabled={
                            !coverLetterFile || uploadingCoverLetter || !!error
                          }
                        >
                          {uploadingCoverLetter ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                console.log("🎯 CV Check Modal - Continue clicked:", {
                  canContinue,
                  hasCV,
                  hasCoverLetter,
                });
                alert(
                  `Debug: canContinue=${canContinue}, hasCV=${hasCV}, hasCoverLetter=${hasCoverLetter}`
                );
                onContinue();
              }}
              disabled={!canContinue}
              className="flex-1"
            >
              {canContinue
                ? "Continuar con la Aplicación"
                : "Necesitas al menos un documento"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
