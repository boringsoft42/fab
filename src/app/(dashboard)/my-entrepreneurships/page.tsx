"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  MapPin, 
  Mail, 
  Phone,
  Calendar,
  Building2
} from "lucide-react";
import { useMyEntrepreneurships, useDeleteEntrepreneurship } from "@/hooks/useEntrepreneurshipApi";
import { useToast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/hooks/use-auth";

export default function MyEntrepreneurshipsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const { entrepreneurships, loading, error, fetchMyEntrepreneurships } = useMyEntrepreneurships();
  const { deleteEntrepreneurship, loading: deleteLoading } = useDeleteEntrepreneurship();

  useEffect(() => {
    if (user) {
      fetchMyEntrepreneurships();
    }
  }, [user, fetchMyEntrepreneurships]);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Acceso requerido",
        description: "Debes iniciar sesión para ver tus emprendimientos",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [user, router, toast]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${name}"?`)) {
      try {
        await deleteEntrepreneurship(id);
        toast({
          title: "Emprendimiento eliminado",
          description: "El emprendimiento ha sido eliminado exitosamente",
        });
        fetchMyEntrepreneurships(); // Refresh the list
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el emprendimiento",
          variant: "destructive",
        });
      }
    }
  };

  const getBusinessStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'idea':
        return 'bg-blue-100 text-blue-800';
      case 'startup':
        return 'bg-green-100 text-green-800';
      case 'growing':
        return 'bg-yellow-100 text-yellow-800';
      case 'established':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'tecnologia': 'Tecnología',
      'ecommerce': 'E-commerce',
      'alimentacion': 'Alimentación',
      'educacion': 'Educación',
      'servicios': 'Servicios',
      'manufactura': 'Manufactura'
    };
    return categories[category] || category;
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Cargando tus emprendimientos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchMyEntrepreneurships}>Intentar nuevamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Emprendimientos</h1>
          <p className="text-muted-foreground">
            Gestiona y visualiza todos tus emprendimientos
          </p>
        </div>
        <Button onClick={() => router.push("/publish-entrepreneurship")}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Emprendimiento
        </Button>
      </div>

      {entrepreneurships.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tienes emprendimientos</h3>
            <p className="text-muted-foreground mb-6">
              Comienza creando tu primer emprendimiento para mostrarlo al mundo
            </p>
            <Button onClick={() => router.push("/publish-entrepreneurship")}>
              <Plus className="h-4 w-4 mr-2" />
              Crear mi primer emprendimiento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entrepreneurships.map((entrepreneurship) => (
            <Card key={entrepreneurship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{entrepreneurship.name}</CardTitle>
                    <Badge className={getBusinessStageColor(entrepreneurship.businessStage)}>
                      {entrepreneurship.businessStage}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {entrepreneurship.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-2" />
                    {getCategoryLabel(entrepreneurship.category)}
                  </div>
                  {entrepreneurship.municipality && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {entrepreneurship.municipality}
                    </div>
                  )}
                  {entrepreneurship.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      {entrepreneurship.email}
                    </div>
                  )}
                  {entrepreneurship.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      {entrepreneurship.phone}
                    </div>
                  )}
                  {entrepreneurship.founded && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Fundado en {new Date(entrepreneurship.founded).getFullYear()}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/entrepreneurship/${entrepreneurship.id}`)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/entrepreneurship/${entrepreneurship.id}/edit`)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(entrepreneurship.id, entrepreneurship.name)}
                    disabled={deleteLoading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
