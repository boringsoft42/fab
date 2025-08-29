"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NewsArticleService } from "@/services/newsarticle.service";

export default function TestNewsArticlePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "Test News Article",
    summary: "This is a test summary",
    content: "This is test content for the news article",
    category: "General",
    status: "DRAFT",
    priority: "MEDIUM",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach(key => {
        formDataObj.append(key, formData[key as keyof typeof formData]);
      });
      
      console.log("📤 Enviando FormData a /api/newsarticle:", formDataObj);
      for (let [key, value] of formDataObj.entries()) {
        console.log(`📤 FormData entry: ${key} = ${value}`);
      }
      
      const result = await NewsArticleService.createWithImage(formDataObj);
      console.log("✅ Resultado:", result);
      toast({ title: "Éxito", description: "Noticia creada correctamente con FormData" });
    } catch (error) {
      console.error("❌ Error:", error);
      toast({ 
        title: "Error", 
        description: `Error al crear noticia: ${error instanceof Error ? error.message : 'Error desconocido'}`, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test NewsArticle Endpoint - FormData</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                placeholder="Título de la noticia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Resumen</label>
              <Textarea 
                value={formData.summary} 
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))} 
                placeholder="Resumen de la noticia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contenido</label>
              <Textarea 
                value={formData.content} 
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} 
                placeholder="Contenido completo" 
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Categoría</label>
              <Input 
                value={formData.category} 
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} 
                placeholder="Categoría"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Crear Noticia con FormData"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
