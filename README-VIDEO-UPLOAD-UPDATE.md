# 🎬 Sistema de Subida de Videos - Actualización

## ✅ **Cambios Implementados**

He actualizado el sistema de subida de videos para usar las rutas correctas de MinIO. Ahora el frontend automáticamente detecta si necesitas subir un archivo de video y usa la ruta apropiada.

## 🔧 **Cómo Funciona Ahora**

### **1. Detección Automática de Tipo de Video**

El sistema ahora detecta automáticamente si estás subiendo:
- **YouTube URL** → Usa `/api/lesson` (JSON)
- **Archivo de video** → Usa `/api/lesson/with-video` (MinIO)

### **2. Flujo de Creación de Lección**

```typescript
// El sistema detecta automáticamente:
if (formData.contentType === "VIDEO" && formData.videoType === "upload" && formData.videoFile) {
  // Usa MinIO para subir video
  await createLessonWithVideo.mutateAsync({...});
} else {
  // Usa JSON para YouTube o texto
  await createLesson.mutateAsync({...});
}
```

## 📝 **Ejemplo de Uso en el Frontend**

### **Crear Lección con Video Local**

1. **Selecciona "Upload"** en el tipo de video
2. **Haz clic en "Seleccionar Video"** 
3. **Elige tu archivo de video** (MP4, AVI, MOV)
4. **Completa los demás campos**
5. **Haz clic en "Crear Lección"**

El sistema automáticamente:
- ✅ Detecta que es un archivo de video
- ✅ Usa la ruta `/api/lesson/with-video`
- ✅ Sube el video a MinIO
- ✅ Crea la lección con la URL del video

### **Crear Lección con YouTube**

1. **Selecciona "YouTube"** en el tipo de video
2. **Pega la URL de YouTube**
3. **Completa los demás campos**
4. **Haz clic en "Crear Lección"**

El sistema automáticamente:
- ✅ Detecta que es una URL de YouTube
- ✅ Usa la ruta `/api/lesson` (JSON)
- ✅ Crea la lección con la URL de YouTube

## 🎯 **Rutas API Utilizadas**

| Escenario | Ruta | Content-Type | Uso |
|-----------|------|--------------|-----|
| **YouTube URL** | `/api/lesson` | `application/json` | URLs de YouTube |
| **Video Local** | `/api/lesson/with-video` | `multipart/form-data` | Archivos de video |
| **Múltiples Archivos** | `/api/lesson/with-files` | `multipart/form-data` | Video + thumbnail + attachments |

## 🔄 **Hooks Actualizados**

```typescript
// Hooks disponibles
const createLesson = useCreateLesson();                    // JSON only
const createLessonWithVideo = useCreateLessonWithVideo();  // MinIO video
const createLessonWithFiles = useCreateLessonWithFiles();  // MinIO multiple files
```

## 📊 **Interfaces TypeScript**

```typescript
// Para videos locales
interface CreateLessonWithVideoData {
  moduleId: string;
  title: string;
  description?: string;
  content: string;
  contentType: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE';
  duration?: number;
  orderIndex: number;
  isRequired?: boolean;
  isPreview?: boolean;
  video: File;  // ← Archivo de video
}

// Para múltiples archivos
interface CreateLessonWithFilesData {
  moduleId: string;
  title: string;
  description?: string;
  content: string;
  contentType: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE';
  duration?: number;
  orderIndex: number;
  isRequired?: boolean;
  isPreview?: boolean;
  video?: File;           // ← Video opcional
  thumbnail?: File;       // ← Thumbnail opcional
  attachments?: File[];   // ← Archivos adjuntos
}
```

## 🧪 **Prueba el Sistema**

### **1. Crear Lección con Video Local**

```javascript
// El frontend automáticamente hace esto:
const formData = new FormData();
formData.append('moduleId', 'tu-module-id');
formData.append('title', 'Mi Lección con Video');
formData.append('description', 'Descripción de la lección');
formData.append('content', 'Contenido de la lección');
formData.append('contentType', 'VIDEO');
formData.append('duration', '15');
formData.append('orderIndex', '1');
formData.append('isRequired', 'true');
formData.append('isPreview', 'false');
formData.append('video', videoFile);  // ← Tu archivo de video

fetch('/api/lesson/with-video', {
  method: 'POST',
  body: formData
});
```

### **2. Crear Lección con YouTube**

```javascript
// El frontend automáticamente hace esto:
fetch('/api/lesson', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    moduleId: 'tu-module-id',
    title: 'Mi Lección con YouTube',
    description: 'Descripción de la lección',
    content: 'Contenido de la lección',
    contentType: 'VIDEO',
    videoUrl: 'https://www.youtube.com/watch?v=...',  // ← URL de YouTube
    duration: 15,
    orderIndex: 1,
    isRequired: true,
    isPreview: false
  })
});
```

## ⚠️ **Requisitos**

1. **MinIO debe estar ejecutándose** (docker-compose up)
2. **Los buckets deben estar creados** (se crean automáticamente)
3. **El archivo de video debe ser válido** (MP4, AVI, MOV, máximo 500MB)

## 🎉 **Beneficios**

- ✅ **Detección automática** del tipo de video
- ✅ **Rutas correctas** según el tipo de contenido
- ✅ **Manejo de errores** mejorado
- ✅ **Estados de carga** correctos
- ✅ **Tipado TypeScript** completo
- ✅ **Integración transparente** con MinIO

## 🔍 **Debugging**

Si tienes problemas:

1. **Revisa la consola del navegador** para errores
2. **Verifica que MinIO esté ejecutándose** (`docker-compose ps`)
3. **Comprueba el tamaño del archivo** (máximo 500MB)
4. **Verifica el formato del archivo** (MP4, AVI, MOV)

El sistema ahora es completamente funcional y automático. ¡Solo selecciona tu tipo de video y el sistema se encarga del resto! 🚀
