# 🎯 Sistema Completo de CV y Carta de Presentación

## 📋 Resumen del Sistema

Este sistema implementa una solución completa para la gestión de CV y cartas de presentación en la plataforma CEMSE, permitiendo a los jóvenes crear, editar y generar documentos profesionales personalizados para sus postulaciones laborales.

## 🏗️ Arquitectura del Sistema

### **Backend (API Routes)**

#### 1. **Controlador de CV** (`/api/cv`)
- **GET** `/api/cv` - Obtener datos del CV del usuario
- **PUT** `/api/cv` - Actualizar datos del CV

#### 2. **Controlador de Carta de Presentación** (`/api/cv/cover-letter`)
- **GET** `/api/cv/cover-letter` - Obtener carta de presentación
- **POST** `/api/cv/cover-letter` - Guardar carta de presentación

#### 3. **Generador de CV Personalizado** (`/api/cv/generate-for-application`)
- **POST** `/api/cv/generate-for-application` - Generar CV para postulación específica

### **Frontend (React Components)**

#### 1. **CVTemplate** (`/components/profile/cv/CVTemplate.tsx`)
- Editor visual del CV
- Generación de PDF con React PDF
- Vista previa en tiempo real
- Descarga de documentos

#### 2. **CoverLetterTemplate** (`/components/profile/cv/CoverLetterTemplate.tsx`)
- Editor de carta de presentación
- Generación de PDF profesional
- Personalización por empresa

#### 3. **JobApplicationForm** (`/components/jobs/JobApplicationForm.tsx`)
- Formulario de aplicación a trabajos
- Integración con CV personalizado
- Vista previa de aplicación completa

#### 4. **Hook useCV** (`/hooks/useCV.ts`)
- Gestión centralizada de datos del CV
- Operaciones CRUD
- Manejo de errores y estados

## 🎨 Características Visuales

### **Diseño del CV**
- **Header profesional** con nombre y título
- **Secciones organizadas**: Perfil, Educación, Habilidades, Experiencia
- **Colores corporativos**: Azul (#1e40af) para títulos
- **Tipografía clara**: Helvetica para mejor legibilidad
- **Badges visuales** para habilidades e intereses

### **Diseño de la Carta de Presentación**
- **Formato formal** con información del remitente y destinatario
- **Fecha automática** en formato español
- **Párrafos justificados** para mejor presentación
- **Firma profesional** con datos de contacto

## 🚀 Funcionalidades Principales

### **1. CV Dinámico y Personalizable**
```typescript
// Ejemplo de uso del CV
const { cvData, updateCVData } = useCV();

// Actualizar información personal
await updateCVData({
  personalInfo: {
    firstName: "Juan Carlos",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    // ... más datos
  }
});
```

### **2. Generación de PDF con React PDF**
```typescript
// Generar y descargar CV
const handleDownload = async () => {
  const blob = await pdf(<CVPDF cvData={cvData} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.pdf`;
  link.click();
};
```

### **3. CV Personalizado por Oferta**
```typescript
// Generar CV específico para una oferta
const applicationData = await generateCVForApplication(jobOfferId);
// Incluye:
// - Habilidades relevantes filtradas
// - Carta personalizada por empresa
// - Información específica del puesto
```

### **4. Carta de Presentación Inteligente**
```typescript
// Carta que se adapta automáticamente
const coverLetter = generatePersonalizedCoverLetter(profile, jobOffer);
// Características:
// - Saludo personalizado por empresa
// - Habilidades relevantes destacadas
// - Adaptación según modalidad de trabajo
// - Referencias específicas al puesto
```

## 📊 Estructura de Datos

### **CV Data Structure**
```typescript
interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    municipality: string;
    department: string;
    country: string;
  };
  education: {
    level: string;
    institution: string;
    graduationYear?: number;
    isStudying: boolean;
  };
  skills: string[];
  interests: string[];
  workExperience: any[];
  achievements: any[];
  targetPosition?: string;
  relevantSkills?: string[];
}
```

### **Cover Letter Data Structure**
```typescript
interface CoverLetterData {
  template: string;
  content: string;
  // Generado dinámicamente con:
  // - Información del remitente
  // - Datos de la empresa
  // - Habilidades relevantes
  // - Personalización por puesto
}
```

## 🔧 Configuración y Uso

### **1. Instalación de Dependencias**
```bash
npm install @react-pdf/renderer react-pdf
```

### **2. Configuración de Autenticación**
```typescript
// Asegúrate de que getAuthHeaders() esté configurado
import { getAuthHeaders } from "@/lib/api";
```

### **3. Uso en Componentes**
```typescript
// En cualquier componente
import { useCV } from "@/hooks/useCV";
import { CVTemplate } from "@/components/profile/cv/CVTemplate";
import { CoverLetterTemplate } from "@/components/profile/cv/CoverLetterTemplate";

function MyComponent() {
  const { cvData, loading, error } = useCV();
  
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <CVTemplate />
      <CoverLetterTemplate />
    </div>
  );
}
```

## 🎯 Flujo de Aplicación a Trabajos

### **1. Usuario ve oferta de trabajo**
### **2. Hace clic en "Aplicar"**
### **3. Sistema genera CV personalizado**
### **4. Usuario personaliza carta de presentación**
### **5. Vista previa de la aplicación completa**
### **6. Envío de la aplicación**
### **7. Descarga de documentos PDF**

## 🔄 Integración con el Sistema Existente

### **Con el Perfil de Usuario**
- Los datos del CV se extraen del perfil del usuario
- Actualizaciones del CV actualizan el perfil
- Habilidades e intereses sincronizados

### **Con las Ofertas de Trabajo**
- CV se personaliza según habilidades requeridas
- Carta se adapta a la empresa y puesto
- Información específica del trabajo incluida

### **Con las Aplicaciones**
- CV y carta se adjuntan a la aplicación
- Datos estructurados para el admin
- Historial de aplicaciones completo

## 🎨 Personalización Visual

### **Temas de CV**
- **Profesional**: Azul corporativo, diseño limpio
- **Creativo**: Colores vibrantes, diseño moderno
- **Clásico**: Negro y gris, formato tradicional

### **Templates de Carta**
- **Formal**: Lenguaje corporativo
- **Amigable**: Tono más cercano
- **Técnico**: Enfoque en habilidades específicas

## 📱 Responsive Design

- **Desktop**: Vista completa con todas las opciones
- **Tablet**: Layout adaptado con controles táctiles
- **Mobile**: Interfaz simplificada para edición rápida

## 🔒 Seguridad y Validación

### **Validación de Datos**
- Campos requeridos verificados
- Formato de email validado
- Longitud mínima para cartas

### **Autenticación**
- Todas las operaciones requieren token
- Verificación de permisos por usuario
- Protección contra acceso no autorizado

## 🚀 Próximas Mejoras

### **Funcionalidades Planificadas**
- [ ] Múltiples templates de CV
- [ ] Editor WYSIWYG para cartas
- [ ] Integración con LinkedIn
- [ ] Análisis de compatibilidad de habilidades
- [ ] Sugerencias de mejora automáticas
- [ ] Historial de versiones del CV

### **Mejoras Técnicas**
- [ ] Caché de PDFs generados
- [ ] Compresión de documentos
- [ ] Exportación a múltiples formatos
- [ ] Integración con servicios de almacenamiento

## 📞 Soporte

Para dudas o problemas con el sistema de CV:
- Revisar la documentación de React PDF
- Verificar la configuración de autenticación
- Comprobar que las dependencias estén instaladas
- Revisar los logs del servidor para errores

---

**Desarrollado para CEMSE - Sistema de Gestión de Empleos y Capacitación**
