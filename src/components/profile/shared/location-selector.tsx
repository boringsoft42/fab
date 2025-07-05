"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Building } from "lucide-react";

interface LocationSelectorProps {
  selectedDepartment?: string;
  selectedMunicipality?: string;
  onLocationChange: (department: string, municipality: string) => void;
  disabled?: boolean;
  required?: boolean;
}

// Bolivian departments and municipalities data
const BOLIVIA_LOCATIONS = {
  Cochabamba: [
    "Cochabamba",
    "Aiquile",
    "Anzaldo",
    "Arani",
    "Arque",
    "Bolívar",
    "Campero",
    "Capinota",
    "Carrasco",
    "Chapare",
    "Chimoré",
    "Cliza",
    "Colcapirhua",
    "Colomi",
    "Cuchumuela",
    "Entre Ríos",
    "Esteban Arze",
    "Independencia",
    "Jordán",
    "Mizque",
    "Morochata",
    "Omereque",
    "Pasorapa",
    "Pocona",
    "Punata",
    "Quillacollo",
    "Sacaba",
    "San Benito",
    "Shinahota",
    "Sipe Sipe",
    "Tacopaya",
    "Tapacarí",
    "Tiquipaya",
    "Tiraque",
    "Tolata",
    "Totora",
    "Valle Hermoso",
    "Vila Vila",
    "Vinto",
  ],
  "La Paz": [
    "La Paz",
    "Achacachi",
    "Ancoraimes",
    "Batallas",
    "Calamarca",
    "Caranavi",
    "Colquencha",
    "Copacabana",
    "Desaguadero",
    "El Alto",
    "Guaqui",
    "Huatajata",
    "Irupana",
    "La Asunta",
    "Laja",
    "Luribay",
    "Malla",
    "Mecapaca",
    "Mocomoco",
    "Palca",
    "Palos Blancos",
    "Pedro Domingo Murillo",
    "Puerto Acosta",
    "Puerto Carabuco",
    "Pucarani",
    "Sapahaqui",
    "Sorata",
    "Teoponte",
    "Tiahuanacu",
    "Umala",
    "Viacha",
    "Yanacachi",
  ],
  "Santa Cruz": [
    "Santa Cruz de la Sierra",
    "Ascensión de Guarayos",
    "Boyuibe",
    "Cabezas",
    "Camiri",
    "Charagua",
    "Colpa Bélgica",
    "Comarapa",
    "Concepción",
    "Cotoca",
    "Cuevo",
    "El Puente",
    "El Torno",
    "Fernández Alonso",
    "General Saavedra",
    "Gutiérrez",
    "Hardeman",
    "Lagunillas",
    "La Guardia",
    "Las Mercedes",
    "Mairana",
    "Mineros",
    "Montero",
    "Moro Moro",
    "Okinawa Uno",
    "Pailón",
    "Pampa Grande",
    "Portachuelo",
    "Postrer Valle",
    "Puerto Quijarro",
    "Puerto Suárez",
    "Quirusillas",
    "Roboré",
    "Saipina",
    "San Antonio del Lomerío",
    "San Carlos",
    "San Ignacio",
    "San Javier",
    "San José de Chiquitos",
    "San Juan",
    "San Lorenzo",
    "San Matías",
    "San Miguel",
    "San Pedro",
    "San Rafael",
    "San Ramón",
    "Santa Rosa del Sara",
    "Samaipata",
    "Urubichá",
    "Vallegrande",
    "Warnes",
    "Yapacaní",
  ],
  Potosí: [
    "Potosí",
    "Acasio",
    "Arampampa",
    "Belén de Urmiri",
    "Betanzos",
    "Caiza",
    "Caripuyo",
    "Colcha",
    "Colquechaca",
    "Cotagaita",
    "Llallagua",
    "Llica",
    "Mojinete",
    "Ocurí",
    "Pocoata",
    "Puna",
    "Sacaca",
    "San Agustín",
    "San Antonio de Esmoruco",
    "San Pablo de Lípez",
    "Tinguipaya",
    "Tomave",
    "Tupiza",
    "Uyuni",
    "Villazón",
    "Vitichi",
  ],
  Chuquisaca: [
    "Sucre",
    "Azurduy",
    "Boeto",
    "Camargo",
    "Culpina",
    "El Villar",
    "Huacaya",
    "Huacareta",
    "Icla",
    "Incahuasi",
    "Macharetí",
    "Monteagudo",
    "Padilla",
    "Poroma",
    "Presto",
    "San Lucas",
    "Sopachuy",
    "Tarabuco",
    "Tarvita",
    "Tomina",
    "Villa Abecia",
    "Villa Charcas",
    "Villa Serrano",
    "Villa Vaca Guzmán",
    "Yamparáez",
    "Zudáñez",
  ],
  Oruro: [
    "Oruro",
    "Antequera",
    "Belén de Andamarca",
    "Caracollo",
    "Challapata",
    "Chipaya",
    "Choque Cota",
    "Corque",
    "Cruz de Machacamarca",
    "Escara",
    "Esmeralda",
    "Eucaliptus",
    "Huayllamarca",
    "Huanuni",
    "La Rivera",
    "Machacamarca",
    "Nor Carangas",
    "Pampa Aullagas",
    "Pazña",
    "Poopó",
    "Sabaya",
    "Salinas de Garci Mendoza",
    "Santiago de Andamarca",
    "Santiago de Huari",
    "Sur Carangas",
    "Toledo",
    "Turco",
    "Villa Huanuni",
  ],
  Tarija: [
    "Tarija",
    "Bermejo",
    "Caraparí",
    "Entre Ríos",
    "Padcaya",
    "San Lorenzo",
    "Uriondo",
    "Villa Montes",
    "Villamontes",
    "Yacuiba",
  ],
  Beni: [
    "Trinidad",
    "Baures",
    "Exaltación",
    "Guayaramerín",
    "Huacaraje",
    "Iténez",
    "Loreto",
    "Magdalena",
    "Reyes",
    "Riberalta",
    "Rurrenabaque",
    "San Andrés",
    "San Borja",
    "San Ignacio",
    "San Javier",
    "San Joaquín",
    "San Ramón",
    "Santa Ana",
    "Santa Rosa",
  ],
  Pando: [
    "Cobija",
    "Bella Flor",
    "Bolpebra",
    "Filadelfia",
    "Nueva Esperanza",
    "Porvenir",
    "Puerto Gonzalo Moreno",
    "Puerto Rico",
    "San Lorenzo",
    "Santa Rosa del Abuná",
    "Santos Mercado",
    "Sena",
    "Villa Nueva",
  ],
};

export function LocationSelector({
  selectedDepartment,
  selectedMunicipality,
  onLocationChange,
  disabled = false,
  required = false,
}: LocationSelectorProps) {
  const [availableMunicipalities, setAvailableMunicipalities] = useState<
    string[]
  >([]);

  // Update available municipalities when department changes
  useEffect(() => {
    if (
      selectedDepartment &&
      BOLIVIA_LOCATIONS[selectedDepartment as keyof typeof BOLIVIA_LOCATIONS]
    ) {
      setAvailableMunicipalities(
        BOLIVIA_LOCATIONS[selectedDepartment as keyof typeof BOLIVIA_LOCATIONS]
      );
    } else {
      setAvailableMunicipalities([]);
    }
  }, [selectedDepartment]);

  const handleDepartmentChange = (department: string) => {
    // Reset municipality when department changes
    if (selectedMunicipality) {
      onLocationChange(department, "");
    } else {
      onLocationChange(department, selectedMunicipality || "");
    }
  };

  const handleMunicipalityChange = (municipality: string) => {
    if (selectedDepartment) {
      onLocationChange(selectedDepartment, municipality);
    }
  };

  const departments = Object.keys(BOLIVIA_LOCATIONS);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Ubicación Geográfica
        </CardTitle>
        <CardDescription>
          Selecciona tu departamento y municipio en Bolivia
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Department Selection */}
        <div className="space-y-2">
          <Label htmlFor="department">
            Departamento {required && <span className="text-red-500">*</span>}
          </Label>
          <Select
            value={selectedDepartment || ""}
            onValueChange={handleDepartmentChange}
            disabled={disabled}
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="Selecciona un departamento" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {department}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Municipality Selection */}
        <div className="space-y-2">
          <Label htmlFor="municipality">
            Municipio {required && <span className="text-red-500">*</span>}
          </Label>
          <Select
            value={selectedMunicipality || ""}
            onValueChange={handleMunicipalityChange}
            disabled={
              disabled ||
              !selectedDepartment ||
              availableMunicipalities.length === 0
            }
          >
            <SelectTrigger id="municipality">
              <SelectValue
                placeholder={
                  !selectedDepartment
                    ? "Primero selecciona un departamento"
                    : "Selecciona un municipio"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableMunicipalities.map((municipality) => (
                <SelectItem key={municipality} value={municipality}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {municipality}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Summary */}
        {selectedDepartment && selectedMunicipality && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Ubicación seleccionada:
            </p>
            <p className="font-medium">
              {selectedMunicipality}, {selectedDepartment}, Bolivia
            </p>
          </div>
        )}

        {/* Helper Text */}
        <div className="text-xs text-muted-foreground">
          <p>
            💡 Si no encuentras tu municipio, selecciona el más cercano o
            contacta al soporte para agregarlo.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
