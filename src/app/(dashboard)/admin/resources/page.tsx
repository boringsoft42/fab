'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, List, Settings } from 'lucide-react';
import { ResourceUploadForm } from '@/components/resources/ResourceUploadForm';
import { ResourceManagementList } from '@/components/resources/ResourceManagementList';
import { ResourceSettings } from '@/components/resources/ResourceSettings';

export default function AdminResourcesPage() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Recursos</h1>
        <p className="text-gray-600">
          Administra los recursos educativos disponibles para los jóvenes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Subir Recurso
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Gestionar Recursos
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Subir Nuevo Recurso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceUploadForm 
                onSuccess={() => {
                  // Opcional: cambiar a la pestaña de gestión después de subir
                  setActiveTab('manage');
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestionar Recursos Existentes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceManagementList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
