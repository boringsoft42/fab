"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";

interface MunicipalitySelectorProps {
  onMunicipalityChange: (municipality: string) => void;
}

const municipalities = [
  {
    id: "cercado",
    name: "Cercado",
    description: "Centro urbano principal de Cochabamba",
    color: "blue",
    gradient: "from-blue-600 to-blue-700",
    bgGradient: "from-blue-50 to-blue-100",
    accentColor: "blue",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    hoverColor: "hover:bg-blue-50",
  },
  {
    id: "tiquipaya",
    name: "Tiquipaya",
    description: "Municipio con enfoque en desarrollo sostenible",
    color: "green",
    gradient: "from-green-600 to-green-700",
    bgGradient: "from-green-50 to-green-100",
    accentColor: "green",
    borderColor: "border-green-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    hoverColor: "hover:bg-green-50",
  },
  {
    id: "quillacollo",
    name: "Quillacollo",
    description: "Municipio histórico y comercial",
    color: "purple",
    gradient: "from-purple-600 to-purple-700",
    bgGradient: "from-purple-50 to-purple-100",
    accentColor: "purple",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    hoverColor: "hover:bg-purple-50",
  },
];

export function MunicipalitySelector({ onMunicipalityChange }: MunicipalitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState("cercado");

  useEffect(() => {
    // Mostrar el popup al cargar la página
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMunicipalitySelect = (municipalityId: string) => {
    setSelectedMunicipality(municipalityId);
    onMunicipalityChange(municipalityId);
    setIsOpen(false);
  };

  const getMunicipalityData = (id: string) => {
    return municipalities.find(m => m.id === id) || municipalities[0];
  };

  const currentMunicipality = getMunicipalityData(selectedMunicipality);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              Selecciona tu Municipio
            </DialogTitle>
            <DialogDescription className="text-center">
              Elige tu municipio para personalizar la experiencia y ver contenido relevante para tu área
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {municipalities.map((municipality) => (
              <Button
                key={municipality.id}
                variant="outline"
                className={`w-full h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all ${
                  selectedMunicipality === municipality.id
                    ? `${municipality.borderColor} ${municipality.bgColor}`
                    : "border-gray-200"
                }`}
                onClick={() => handleMunicipalitySelect(municipality.id)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${municipality.gradient} flex items-center justify-center`}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">{municipality.name}</h3>
                    <p className="text-sm text-gray-600">{municipality.description}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Puedes cambiar esta selección en cualquier momento
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Botón flotante para cambiar municipio */}
      <Button
        variant="outline"
        size="sm"
        className={`fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur-sm ${currentMunicipality.borderColor} ${currentMunicipality.textColor} ${currentMunicipality.hoverColor}`}
        onClick={() => setIsOpen(true)}
      >
        <MapPin className="w-4 h-4 mr-2" />
        {currentMunicipality.name}
      </Button>
    </>
  );
}
