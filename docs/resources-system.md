# Sistema de Recursos Educativos - CEMSE

## 📋 Descripción General

El Sistema de Recursos Educativos permite a las organizaciones (municipios, empresas, centros de capacitación, ONGs) crear y compartir recursos educativos con los jóvenes de la comunidad. Los jóvenes pueden explorar, buscar, descargar y calificar estos recursos.

## 🏗️ Arquitectura del Sistema

### Backend (API Routes)
- `/api/resources` - Gestión principal de recursos
- `/api/resources/[id]` - Operaciones específicas por recurso
- `/api/resources/search` - Búsqueda de recursos
- `/api/resources/categories` - Categorías disponibles
- `/api/resources/types` - Tipos de recursos
- `/api/resources/[id]/download` - Descarga de recursos
- `/api/resources/[id]/rate` - Calificación de recursos
- `/api/resources/[id]/stats` - Estadísticas de recursos

### Frontend (Páginas)
- `/resources` - Vista principal para explorar recursos
- `/resources/create` - Formulario para crear nuevos recursos

### Componentes
- `ResourceCard` - Tarjeta reutilizable para mostrar recursos
- `ResourceService` - Servicio para operaciones de API
- `ResourceController` - Controlador con lógica de negocio

## 🔐 Sistema de Permisos

### Roles con Permisos de Creación/Edición
- **SuperAdmin** (`SUPERADMIN`) - Control total
- **Empresas** (`EMPRESAS`) - Crear y editar recursos
- **Gobiernos Municipales** (`GOBIERNOS_MUNICIPALES`) - Crear y editar recursos
- **Centros de Capacitación** (`CENTROS_DE_FORMACION`) - Crear y editar recursos
- **ONGs y Fundaciones** (`ONGS_Y_FUNDACIONES`) - Crear y editar recursos

### Roles con Permisos de Eliminación
- **Solo SuperAdmin** (`SUPERADMIN`) - Eliminar recursos

### Roles con Permisos de Visualización
- **Todos los usuarios** - Ver recursos públicos
- **Usuarios autenticados** - Calificar y descargar recursos

## 📊 Tipos de Recursos

| Tipo | Descripción |
|------|-------------|
| `TEMPLATE` | Plantillas reutilizables |
| `GUIDE` | Guías y manuales |
| `VIDEO` | Contenido audiovisual |
| `TOOL` | Herramientas y aplicaciones |
| `COURSE` | Cursos completos |

## 🏷️ Categorías de Recursos

| Categoría | Descripción |
|-----------|-------------|
| `EMPRENDIMIENTO` | Recursos para emprendedores |
| `TECNOLOGIA` | Tecnología e innovación |
| `EDUCACION` | Material educativo |
| `SALUD` | Salud y bienestar |
| `FINANZAS` | Finanzas personales y empresariales |
| `DESARROLLO_PERSONAL` | Crecimiento personal |
| `LIDERAZGO` | Habilidades de liderazgo |
| `MARKETING` | Marketing y publicidad |

## 📁 Formatos Soportados

| Formato | Descripción |
|---------|-------------|
| `PDF` | Documentos PDF |
| `DOCX` | Documentos Word |
| `PPTX` | Presentaciones PowerPoint |
| `XLSX` | Hojas de cálculo Excel |
| `MP4` | Videos MP4 |
| `MP3` | Audio MP3 |
| `ZIP` | Archivos comprimidos |
| `LINK` | Enlaces web |

## 🚀 Endpoints de la API

### GET /api/resources
Obtiene todos los recursos con filtros opcionales.

**Parámetros de consulta:**
- `type` - Filtrar por tipo
- `category` - Filtrar por categoría
- `isPublic` - Solo recursos públicos
- `featured` - Recursos destacados
- `authorId` - Recursos por autor
- `limit` - Límite de resultados
- `page` - Página para paginación
- `q` - Búsqueda por texto

**Ejemplo:**
```bash
GET /api/resources?type=GUIDE&category=EMPRENDIMIENTO&isPublic=true
```

### POST /api/resources
Crea un nuevo recurso (requiere autenticación y permisos de organización).

**Headers requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Manual de Emprendimiento",
  "description": "Guía completa para emprendedores",
  "type": "GUIDE",
  "category": "EMPRENDIMIENTO",
  "format": "PDF",
  "url": "https://example.com/manual.pdf",
  "fileUrl": "https://example.com/manual.pdf",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "tags": ["emprendimiento", "negocios"],
  "isPublic": true
}
```

### PUT /api/resources/[id]
Actualiza un recurso existente (requiere autenticación y permisos).

### DELETE /api/resources/[id]
Elimina un recurso (requiere permisos de SuperAdmin).

### GET /api/resources/search?q=query
Busca recursos por texto.

### GET /api/resources/[id]/download
Descarga un recurso e incrementa el contador de descargas.

### POST /api/resources/[id]/rate
Califica un recurso (requiere autenticación).

**Body:**
```json
{
  "rating": 5
}
```

### GET /api/resources/[id]/stats
Obtiene estadísticas de un recurso.

**Respuesta:**
```json
{
  "totalDownloads": 150,
  "averageRating": 4.5,
  "totalRatings": 25,
  "views": 300,
  "shares": 10
}
```

## 🎨 Componentes del Frontend

### ResourceCard
Componente reutilizable para mostrar recursos.

**Props:**
- `resource` - Objeto Resource
- `onDownload` - Función para manejar descargas
- `onRate` - Función para manejar calificaciones
- `showActions` - Mostrar botones de acción

**Ejemplo:**
```tsx
<ResourceCard
  resource={resource}
  onDownload={handleDownload}
  onRate={handleRate}
  showActions={true}
/>
```

## 🔧 Hooks de React Query

### usePublicResources()
Obtiene recursos públicos.

### useSearchResources()
Busca recursos por texto.

### useResourcesByType(type)
Obtiene recursos por tipo.

### useResourcesByCategory(category)
Obtiene recursos por categoría.

### useCreateResource()
Crea un nuevo recurso.

### useUpdateResource()
Actualiza un recurso existente.

### useDeleteResource()
Elimina un recurso.

## 📱 Navegación en el Sidebar

### Para Jóvenes
- **Centro de Recursos** → `/resources`

### Para Organizaciones
- **Ver Recursos** → `/resources`
- **Crear Recurso** → `/resources/create`

## 🛡️ Validaciones

### Validaciones del Cliente
- Título requerido
- Descripción requerida
- Tipo requerido
- Categoría requerida
- Formato requerido
- Rating entre 1-5

### Validaciones del Servidor
- Autenticación requerida para operaciones sensibles
- Permisos de organización para crear/editar
- Permisos de SuperAdmin para eliminar
- Validación de datos antes de persistir

## 📈 Estadísticas y Métricas

El sistema rastrea:
- **Descargas** - Número de veces descargado
- **Calificaciones** - Promedio y total de calificaciones
- **Vistas** - Número de veces visto
- **Compartidos** - Número de veces compartido

## 🔄 Flujo de Trabajo

### Para Organizaciones
1. Acceder a `/resources/create`
2. Completar formulario con información del recurso
3. Subir archivo o proporcionar URL
4. Configurar visibilidad (público/privado)
5. Publicar recurso

### Para Jóvenes
1. Acceder a `/resources`
2. Explorar recursos por categoría o tipo
3. Buscar recursos específicos
4. Descargar recursos de interés
5. Calificar recursos utilizados

## 🚨 Manejo de Errores

### Errores Comunes
- **401 Unauthorized** - Token inválido o expirado
- **403 Forbidden** - Permisos insuficientes
- **404 Not Found** - Recurso no encontrado
- **422 Validation Error** - Datos inválidos
- **500 Internal Server Error** - Error del servidor

### Mensajes de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": ["Error específico 1", "Error específico 2"]
}
```

## 🔮 Próximas Mejoras

- [ ] Sistema de comentarios en recursos
- [ ] Recursos favoritos para usuarios
- [ ] Notificaciones de nuevos recursos
- [ ] Sistema de versionado de recursos
- [ ] Integración con MinIO para almacenamiento
- [ ] Sistema de moderación de contenido
- [ ] Analytics avanzados
- [ ] API para integración externa

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema de recursos, contactar al equipo de desarrollo de CEMSE.
