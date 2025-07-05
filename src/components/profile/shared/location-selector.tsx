&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { MapPin, Building } from &ldquo;lucide-react&rdquo;;

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
    &ldquo;Cochabamba&rdquo;,
    &ldquo;Aiquile&rdquo;,
    &ldquo;Anzaldo&rdquo;,
    &ldquo;Arani&rdquo;,
    &ldquo;Arque&rdquo;,
    &ldquo;Bolívar&rdquo;,
    &ldquo;Campero&rdquo;,
    &ldquo;Capinota&rdquo;,
    &ldquo;Carrasco&rdquo;,
    &ldquo;Chapare&rdquo;,
    &ldquo;Chimoré&rdquo;,
    &ldquo;Cliza&rdquo;,
    &ldquo;Colcapirhua&rdquo;,
    &ldquo;Colomi&rdquo;,
    &ldquo;Cuchumuela&rdquo;,
    &ldquo;Entre Ríos&rdquo;,
    &ldquo;Esteban Arze&rdquo;,
    &ldquo;Independencia&rdquo;,
    &ldquo;Jordán&rdquo;,
    &ldquo;Mizque&rdquo;,
    &ldquo;Morochata&rdquo;,
    &ldquo;Omereque&rdquo;,
    &ldquo;Pasorapa&rdquo;,
    &ldquo;Pocona&rdquo;,
    &ldquo;Punata&rdquo;,
    &ldquo;Quillacollo&rdquo;,
    &ldquo;Sacaba&rdquo;,
    &ldquo;San Benito&rdquo;,
    &ldquo;Shinahota&rdquo;,
    &ldquo;Sipe Sipe&rdquo;,
    &ldquo;Tacopaya&rdquo;,
    &ldquo;Tapacarí&rdquo;,
    &ldquo;Tiquipaya&rdquo;,
    &ldquo;Tiraque&rdquo;,
    &ldquo;Tolata&rdquo;,
    &ldquo;Totora&rdquo;,
    &ldquo;Valle Hermoso&rdquo;,
    &ldquo;Vila Vila&rdquo;,
    &ldquo;Vinto&rdquo;,
  ],
  &ldquo;La Paz&rdquo;: [
    &ldquo;La Paz&rdquo;,
    &ldquo;Achacachi&rdquo;,
    &ldquo;Ancoraimes&rdquo;,
    &ldquo;Batallas&rdquo;,
    &ldquo;Calamarca&rdquo;,
    &ldquo;Caranavi&rdquo;,
    &ldquo;Colquencha&rdquo;,
    &ldquo;Copacabana&rdquo;,
    &ldquo;Desaguadero&rdquo;,
    &ldquo;El Alto&rdquo;,
    &ldquo;Guaqui&rdquo;,
    &ldquo;Huatajata&rdquo;,
    &ldquo;Irupana&rdquo;,
    &ldquo;La Asunta&rdquo;,
    &ldquo;Laja&rdquo;,
    &ldquo;Luribay&rdquo;,
    &ldquo;Malla&rdquo;,
    &ldquo;Mecapaca&rdquo;,
    &ldquo;Mocomoco&rdquo;,
    &ldquo;Palca&rdquo;,
    &ldquo;Palos Blancos&rdquo;,
    &ldquo;Pedro Domingo Murillo&rdquo;,
    &ldquo;Puerto Acosta&rdquo;,
    &ldquo;Puerto Carabuco&rdquo;,
    &ldquo;Pucarani&rdquo;,
    &ldquo;Sapahaqui&rdquo;,
    &ldquo;Sorata&rdquo;,
    &ldquo;Teoponte&rdquo;,
    &ldquo;Tiahuanacu&rdquo;,
    &ldquo;Umala&rdquo;,
    &ldquo;Viacha&rdquo;,
    &ldquo;Yanacachi&rdquo;,
  ],
  &ldquo;Santa Cruz&rdquo;: [
    &ldquo;Santa Cruz de la Sierra&rdquo;,
    &ldquo;Ascensión de Guarayos&rdquo;,
    &ldquo;Boyuibe&rdquo;,
    &ldquo;Cabezas&rdquo;,
    &ldquo;Camiri&rdquo;,
    &ldquo;Charagua&rdquo;,
    &ldquo;Colpa Bélgica&rdquo;,
    &ldquo;Comarapa&rdquo;,
    &ldquo;Concepción&rdquo;,
    &ldquo;Cotoca&rdquo;,
    &ldquo;Cuevo&rdquo;,
    &ldquo;El Puente&rdquo;,
    &ldquo;El Torno&rdquo;,
    &ldquo;Fernández Alonso&rdquo;,
    &ldquo;General Saavedra&rdquo;,
    &ldquo;Gutiérrez&rdquo;,
    &ldquo;Hardeman&rdquo;,
    &ldquo;Lagunillas&rdquo;,
    &ldquo;La Guardia&rdquo;,
    &ldquo;Las Mercedes&rdquo;,
    &ldquo;Mairana&rdquo;,
    &ldquo;Mineros&rdquo;,
    &ldquo;Montero&rdquo;,
    &ldquo;Moro Moro&rdquo;,
    &ldquo;Okinawa Uno&rdquo;,
    &ldquo;Pailón&rdquo;,
    &ldquo;Pampa Grande&rdquo;,
    &ldquo;Portachuelo&rdquo;,
    &ldquo;Postrer Valle&rdquo;,
    &ldquo;Puerto Quijarro&rdquo;,
    &ldquo;Puerto Suárez&rdquo;,
    &ldquo;Quirusillas&rdquo;,
    &ldquo;Roboré&rdquo;,
    &ldquo;Saipina&rdquo;,
    &ldquo;San Antonio del Lomerío&rdquo;,
    &ldquo;San Carlos&rdquo;,
    &ldquo;San Ignacio&rdquo;,
    &ldquo;San Javier&rdquo;,
    &ldquo;San José de Chiquitos&rdquo;,
    &ldquo;San Juan&rdquo;,
    &ldquo;San Lorenzo&rdquo;,
    &ldquo;San Matías&rdquo;,
    &ldquo;San Miguel&rdquo;,
    &ldquo;San Pedro&rdquo;,
    &ldquo;San Rafael&rdquo;,
    &ldquo;San Ramón&rdquo;,
    &ldquo;Santa Rosa del Sara&rdquo;,
    &ldquo;Samaipata&rdquo;,
    &ldquo;Urubichá&rdquo;,
    &ldquo;Vallegrande&rdquo;,
    &ldquo;Warnes&rdquo;,
    &ldquo;Yapacaní&rdquo;,
  ],
  Potosí: [
    &ldquo;Potosí&rdquo;,
    &ldquo;Acasio&rdquo;,
    &ldquo;Arampampa&rdquo;,
    &ldquo;Belén de Urmiri&rdquo;,
    &ldquo;Betanzos&rdquo;,
    &ldquo;Caiza&rdquo;,
    &ldquo;Caripuyo&rdquo;,
    &ldquo;Colcha&rdquo;,
    &ldquo;Colquechaca&rdquo;,
    &ldquo;Cotagaita&rdquo;,
    &ldquo;Llallagua&rdquo;,
    &ldquo;Llica&rdquo;,
    &ldquo;Mojinete&rdquo;,
    &ldquo;Ocurí&rdquo;,
    &ldquo;Pocoata&rdquo;,
    &ldquo;Puna&rdquo;,
    &ldquo;Sacaca&rdquo;,
    &ldquo;San Agustín&rdquo;,
    &ldquo;San Antonio de Esmoruco&rdquo;,
    &ldquo;San Pablo de Lípez&rdquo;,
    &ldquo;Tinguipaya&rdquo;,
    &ldquo;Tomave&rdquo;,
    &ldquo;Tupiza&rdquo;,
    &ldquo;Uyuni&rdquo;,
    &ldquo;Villazón&rdquo;,
    &ldquo;Vitichi&rdquo;,
  ],
  Chuquisaca: [
    &ldquo;Sucre&rdquo;,
    &ldquo;Azurduy&rdquo;,
    &ldquo;Boeto&rdquo;,
    &ldquo;Camargo&rdquo;,
    &ldquo;Culpina&rdquo;,
    &ldquo;El Villar&rdquo;,
    &ldquo;Huacaya&rdquo;,
    &ldquo;Huacareta&rdquo;,
    &ldquo;Icla&rdquo;,
    &ldquo;Incahuasi&rdquo;,
    &ldquo;Macharetí&rdquo;,
    &ldquo;Monteagudo&rdquo;,
    &ldquo;Padilla&rdquo;,
    &ldquo;Poroma&rdquo;,
    &ldquo;Presto&rdquo;,
    &ldquo;San Lucas&rdquo;,
    &ldquo;Sopachuy&rdquo;,
    &ldquo;Tarabuco&rdquo;,
    &ldquo;Tarvita&rdquo;,
    &ldquo;Tomina&rdquo;,
    &ldquo;Villa Abecia&rdquo;,
    &ldquo;Villa Charcas&rdquo;,
    &ldquo;Villa Serrano&rdquo;,
    &ldquo;Villa Vaca Guzmán&rdquo;,
    &ldquo;Yamparáez&rdquo;,
    &ldquo;Zudáñez&rdquo;,
  ],
  Oruro: [
    &ldquo;Oruro&rdquo;,
    &ldquo;Antequera&rdquo;,
    &ldquo;Belén de Andamarca&rdquo;,
    &ldquo;Caracollo&rdquo;,
    &ldquo;Challapata&rdquo;,
    &ldquo;Chipaya&rdquo;,
    &ldquo;Choque Cota&rdquo;,
    &ldquo;Corque&rdquo;,
    &ldquo;Cruz de Machacamarca&rdquo;,
    &ldquo;Escara&rdquo;,
    &ldquo;Esmeralda&rdquo;,
    &ldquo;Eucaliptus&rdquo;,
    &ldquo;Huayllamarca&rdquo;,
    &ldquo;Huanuni&rdquo;,
    &ldquo;La Rivera&rdquo;,
    &ldquo;Machacamarca&rdquo;,
    &ldquo;Nor Carangas&rdquo;,
    &ldquo;Pampa Aullagas&rdquo;,
    &ldquo;Pazña&rdquo;,
    &ldquo;Poopó&rdquo;,
    &ldquo;Sabaya&rdquo;,
    &ldquo;Salinas de Garci Mendoza&rdquo;,
    &ldquo;Santiago de Andamarca&rdquo;,
    &ldquo;Santiago de Huari&rdquo;,
    &ldquo;Sur Carangas&rdquo;,
    &ldquo;Toledo&rdquo;,
    &ldquo;Turco&rdquo;,
    &ldquo;Villa Huanuni&rdquo;,
  ],
  Tarija: [
    &ldquo;Tarija&rdquo;,
    &ldquo;Bermejo&rdquo;,
    &ldquo;Caraparí&rdquo;,
    &ldquo;Entre Ríos&rdquo;,
    &ldquo;Padcaya&rdquo;,
    &ldquo;San Lorenzo&rdquo;,
    &ldquo;Uriondo&rdquo;,
    &ldquo;Villa Montes&rdquo;,
    &ldquo;Villamontes&rdquo;,
    &ldquo;Yacuiba&rdquo;,
  ],
  Beni: [
    &ldquo;Trinidad&rdquo;,
    &ldquo;Baures&rdquo;,
    &ldquo;Exaltación&rdquo;,
    &ldquo;Guayaramerín&rdquo;,
    &ldquo;Huacaraje&rdquo;,
    &ldquo;Iténez&rdquo;,
    &ldquo;Loreto&rdquo;,
    &ldquo;Magdalena&rdquo;,
    &ldquo;Reyes&rdquo;,
    &ldquo;Riberalta&rdquo;,
    &ldquo;Rurrenabaque&rdquo;,
    &ldquo;San Andrés&rdquo;,
    &ldquo;San Borja&rdquo;,
    &ldquo;San Ignacio&rdquo;,
    &ldquo;San Javier&rdquo;,
    &ldquo;San Joaquín&rdquo;,
    &ldquo;San Ramón&rdquo;,
    &ldquo;Santa Ana&rdquo;,
    &ldquo;Santa Rosa&rdquo;,
  ],
  Pando: [
    &ldquo;Cobija&rdquo;,
    &ldquo;Bella Flor&rdquo;,
    &ldquo;Bolpebra&rdquo;,
    &ldquo;Filadelfia&rdquo;,
    &ldquo;Nueva Esperanza&rdquo;,
    &ldquo;Porvenir&rdquo;,
    &ldquo;Puerto Gonzalo Moreno&rdquo;,
    &ldquo;Puerto Rico&rdquo;,
    &ldquo;San Lorenzo&rdquo;,
    &ldquo;Santa Rosa del Abuná&rdquo;,
    &ldquo;Santos Mercado&rdquo;,
    &ldquo;Sena&rdquo;,
    &ldquo;Villa Nueva&rdquo;,
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
      onLocationChange(department, &ldquo;&rdquo;);
    } else {
      onLocationChange(department, selectedMunicipality || &ldquo;&rdquo;);
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
        <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
          <MapPin className=&ldquo;h-5 w-5&rdquo; />
          Ubicación Geográfica
        </CardTitle>
        <CardDescription>
          Selecciona tu departamento y municipio en Bolivia
        </CardDescription>
      </CardHeader>

      <CardContent className=&ldquo;space-y-4&rdquo;>
        {/* Department Selection */}
        <div className=&ldquo;space-y-2&rdquo;>
          <Label htmlFor=&ldquo;department&rdquo;>
            Departamento {required && <span className=&ldquo;text-red-500&rdquo;>*</span>}
          </Label>
          <Select
            value={selectedDepartment || &ldquo;&rdquo;}
            onValueChange={handleDepartmentChange}
            disabled={disabled}
          >
            <SelectTrigger id=&ldquo;department&rdquo;>
              <SelectValue placeholder=&ldquo;Selecciona un departamento&rdquo; />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  <div className=&ldquo;flex items-center gap-2&rdquo;>
                    <Building className=&ldquo;h-4 w-4&rdquo; />
                    {department}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Municipality Selection */}
        <div className=&ldquo;space-y-2&rdquo;>
          <Label htmlFor=&ldquo;municipality&rdquo;>
            Municipio {required && <span className=&ldquo;text-red-500&rdquo;>*</span>}
          </Label>
          <Select
            value={selectedMunicipality || &ldquo;&rdquo;}
            onValueChange={handleMunicipalityChange}
            disabled={
              disabled ||
              !selectedDepartment ||
              availableMunicipalities.length === 0
            }
          >
            <SelectTrigger id=&ldquo;municipality&rdquo;>
              <SelectValue
                placeholder={
                  !selectedDepartment
                    ? &ldquo;Primero selecciona un departamento&rdquo;
                    : &ldquo;Selecciona un municipio&rdquo;
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableMunicipalities.map((municipality) => (
                <SelectItem key={municipality} value={municipality}>
                  <div className=&ldquo;flex items-center gap-2&rdquo;>
                    <MapPin className=&ldquo;h-4 w-4&rdquo; />
                    {municipality}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Summary */}
        {selectedDepartment && selectedMunicipality && (
          <div className=&ldquo;mt-4 p-3 bg-muted rounded-lg&rdquo;>
            <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
              Ubicación seleccionada:
            </p>
            <p className=&ldquo;font-medium&rdquo;>
              {selectedMunicipality}, {selectedDepartment}, Bolivia
            </p>
          </div>
        )}

        {/* Helper Text */}
        <div className=&ldquo;text-xs text-muted-foreground&rdquo;>
          <p>
            💡 Si no encuentras tu municipio, selecciona el más cercano o
            contacta al soporte para agregarlo.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
