# 💬 Sistema de Chat para Postulaciones de Jóvenes

## 📋 Resumen

Se ha implementado un sistema completo de mensajería en tiempo real para las postulaciones de jóvenes, permitiendo la comunicación directa entre jóvenes y empresas. El sistema incluye chat en tiempo real, indicadores de mensajes no leídos, y una interfaz moderna y responsiva.

---

## 🚀 **FUNCIONALIDADES IMPLEMENTADAS**

### 1. **Chat en Tiempo Real**

- ✅ Mensajería bidireccional entre jóvenes y empresas
- ✅ Actualización automática de mensajes cada 30 segundos
- ✅ Optimistic updates para mejor experiencia de usuario
- ✅ Indicadores de estado de mensajes (enviado, entregado, leído)

### 2. **Indicadores de Mensajes No Leídos**

- ✅ Badge rojo en botones de chat con conteo de mensajes no leídos
- ✅ Actualización automática del conteo
- ✅ Límite visual de "9+" para más de 9 mensajes

### 3. **Interfaz de Usuario**

- ✅ Modal de chat responsivo y moderno
- ✅ Avatares y nombres de usuarios
- ✅ Formateo de fechas y horas
- ✅ Separadores de días en la conversación
- ✅ Scroll automático a nuevos mensajes

---

## 🛠️ **ARQUITECTURA TÉCNICA**

### **Endpoints de API**

```typescript
// Obtener mensajes de una postulación
GET / api / youthapplication / { id } / messages;

// Enviar mensaje en una postulación
POST / api / youthapplication / { id } / message;
```

### **Servicios Implementados**

#### **YouthApplicationService**

```typescript
// Obtener mensajes
static async getMessages(applicationId: string): Promise<YouthApplicationMessage[]>

// Enviar mensaje
static async sendMessage(applicationId: string, data: SendMessageRequest): Promise<YouthApplicationMessage>
```

#### **Hooks de React Query**

```typescript
// Hook para obtener mensajes
export const useYouthApplicationMessages = (applicationId: string)

// Hook para enviar mensajes con optimistic updates
export const useOptimisticMessage = ()

// Hook para conteo de mensajes no leídos
export const useUnreadMessagesCount = (applicationId: string)

// Hook para conteo total de mensajes no leídos
export const useTotalUnreadMessagesCount = ()
```

---

## 📱 **COMPONENTES IMPLEMENTADOS**

### 1. **YouthApplicationChat**

```typescript
interface YouthApplicationChatProps {
  applicationId: string;
  youthProfile?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}
```

**Características:**

- Chat en tiempo real con auto-scroll
- Formateo inteligente de fechas (Hoy, Ayer, fecha)
- Indicadores de estado de mensajes
- Avatares y nombres de usuarios
- Interfaz responsiva

### 2. **UnreadMessagesBadge**

```typescript
interface UnreadMessagesBadgeProps {
  applicationId: string;
}
```

**Características:**

- Badge rojo con conteo de mensajes no leídos
- Actualización automática cada 30 segundos
- Límite visual de "9+" para más de 9 mensajes
- Posicionamiento absoluto sobre botones

---

## 🔄 **FLUJO DE MENSAJES**

### **Para Jóvenes:**

1. **Ver Mensajes:** Los jóvenes pueden ver todos los mensajes de sus postulaciones
2. **Enviar Respuestas:** Pueden responder a mensajes de empresas
3. **Indicadores:** Ven badges rojos en postulaciones con mensajes no leídos

### **Para Empresas:**

1. **Ver Postulaciones:** Las empresas ven postulaciones públicas de jóvenes
2. **Enviar Mensajes:** Pueden enviar mensajes a jóvenes que les interesan
3. **Seguimiento:** Pueden hacer seguimiento de las conversaciones

---

## 📊 **ESTRUCTURA DE DATOS**

### **YouthApplicationMessage**

```typescript
interface YouthApplicationMessage {
  id: string;
  applicationId: string;
  senderId: string;
  senderType: "YOUTH" | "COMPANY";
  content: string;
  messageType: "TEXT" | "FILE";
  status: "SENT" | "DELIVERED" | "READ";
  createdAt: string;
  readAt?: string;
}
```

### **SendMessageRequest**

```typescript
interface SendMessageRequest {
  content: string;
  messageType?: "TEXT" | "FILE";
}
```

---

## 🎨 **INTERFAZ DE USUARIO**

### **Modal de Chat**

- **Tamaño:** max-w-4xl h-[90vh]
- **Header:** Título de la postulación y descripción
- **Chat:** Componente YouthApplicationChat integrado
- **Responsive:** Se adapta a diferentes tamaños de pantalla

### **Badges de Mensajes No Leídos**

- **Posición:** Absolute -top-1 -right-1
- **Color:** Rojo (destructive variant)
- **Tamaño:** h-5 w-5 rounded-full
- **Texto:** Blanco, tamaño xs

---

## ⚡ **OPTIMIZACIONES IMPLEMENTADAS**

### **React Query**

- **Stale Time:** 30 segundos para mensajes
- **Refetch Interval:** 30 segundos para actualizaciones automáticas
- **Optimistic Updates:** Mensajes aparecen inmediatamente
- **Error Handling:** Reversión automática en caso de error

### **Performance**

- **Lazy Loading:** Mensajes se cargan solo cuando se abre el chat
- **Debouncing:** Evita múltiples requests simultáneos
- **Caching:** Mensajes se cachean localmente

---

## 🔐 **SEGURIDAD**

### **Autenticación**

- Todos los endpoints requieren token de autenticación
- Validación de permisos por tipo de usuario
- Protección contra acceso no autorizado

### **Validación**

- Validación de contenido de mensajes
- Sanitización de datos de entrada
- Límites de tamaño de mensajes

---

## 📱 **USO EN LA APLICACIÓN**

### **Página: Mis Postulaciones de Jóvenes**

```typescript
// Ubicación: /my-youth-applications
// Archivo: src/app/(dashboard)/my-youth-applications/page.tsx

// Botón de chat con badge
<Button
  variant="outline"
  size="sm"
  onClick={() => handleOpenChat(application)}
  className="relative"
>
  <MessageSquare className="w-4 h-4 mr-2" />
  Chat
  <UnreadMessagesBadge applicationId={application.id} />
</Button>

// Modal de chat
<Dialog open={showChatModal} onOpenChange={setShowChatModal}>
  <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
    <DialogHeader>
      <DialogTitle>Chat de Postulación</DialogTitle>
      <DialogDescription>{selectedApplication?.title}</DialogDescription>
    </DialogHeader>
    <div className="flex-1 p-6">
      {selectedApplication && (
        <YouthApplicationChat
          applicationId={selectedApplication.id}
          youthProfile={{
            firstName: selectedApplication.youthProfile?.firstName || "Joven",
            lastName: selectedApplication.youthProfile?.lastName || "Desarrollador",
            avatarUrl: selectedApplication.youthProfile?.avatarUrl
          }}
        />
      )}
    </div>
  </DialogContent>
</Dialog>
```

---

## 🚀 **PRÓXIMAS MEJORAS**

### **Funcionalidades Futuras**

- [ ] Notificaciones push en tiempo real
- [ ] Soporte para archivos adjuntos
- [ ] Emojis y reacciones
- [ ] Búsqueda en mensajes
- [ ] Exportación de conversaciones
- [ ] Mensajes de voz
- [ ] Videollamadas integradas

### **Optimizaciones Técnicas**

- [ ] WebSockets para tiempo real completo
- [ ] Compresión de mensajes
- [ ] Paginación de mensajes antiguos
- [ ] Sincronización offline
- [ ] Backup automático de conversaciones

---

## 📞 **SOPORTE**

Para cualquier pregunta o problema con el sistema de chat:

1. **Documentación:** Revisar este documento
2. **Código:** Verificar implementación en los archivos mencionados
3. **Logs:** Revisar console.log para debugging
4. **API:** Verificar endpoints en el backend

---

## ✅ **ESTADO DE IMPLEMENTACIÓN**

- ✅ **Chat Funcional:** Completamente implementado y funcional
- ✅ **Badges de Notificación:** Implementados y funcionando
- ✅ **Interfaz de Usuario:** Moderna y responsiva
- ✅ **Optimizaciones:** React Query y optimistic updates
- ✅ **Seguridad:** Autenticación y validación implementadas
- ✅ **Documentación:** Completa y actualizada

**El sistema está listo para producción y uso en el entorno de desarrollo.**
