import { Resource, User } from '@/types/api';
import { ResourceService } from '@/services/resource.service';

export class ResourceController {
  private resourceService: ResourceService;

  constructor() {
    this.resourceService = new ResourceService();
  }

  // Obtener todos los recursos con paginación
  async getAllResources(options: { page?: number; limit?: number } = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const resources = await this.resourceService.getAll();
      
      // Simular paginación (en un backend real esto se haría en la base de datos)
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedResources = resources.slice(startIndex, endIndex);
      
      return {
        resources: paginatedResources,
        pagination: {
          page,
          limit,
          total: resources.length,
          totalPages: Math.ceil(resources.length / limit),
          hasNext: endIndex < resources.length,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error getting all resources:', error);
      throw error;
    }
  }

  // Obtener un recurso por ID
  async getResourceById(id: string): Promise<Resource | null> {
    try {
      return await this.resourceService.getById(id);
    } catch (error) {
      console.error('Error getting resource by ID:', error);
      return null;
    }
  }

  // Crear un nuevo recurso
  async createResource(data: Partial<Resource>, user: User): Promise<Resource> {
    try {
      // Validar permisos del usuario
      this.validateUserPermissions(user);

      // Validar datos del recurso
      this.validateResourceData(data);

      // Agregar información del autor
      const resourceData = {
        ...data,
        authorId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloads: 0,
        rating: 0,
        isPublic: data.isPublic ?? true
      };

      return await this.resourceService.create(resourceData);
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  }

  // Actualizar un recurso
  async updateResource(id: string, data: Partial<Resource>, user: User): Promise<Resource | null> {
    try {
      // Validar permisos del usuario
      this.validateUserPermissions(user);

      // Verificar que el recurso existe
      const existingResource = await this.getResourceById(id);
      if (!existingResource) {
        throw new Error('Resource not found');
      }

      // Verificar que el usuario puede editar este recurso
      this.validateResourceOwnership(existingResource, user);

      // Actualizar datos
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      return await this.resourceService.update(id, updateData);
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  }

  // Eliminar un recurso
  async deleteResource(id: string): Promise<void> {
    try {
      // Verificar que el recurso existe
      const existingResource = await this.getResourceById(id);
      if (!existingResource) {
        throw new Error('Resource not found');
      }

      await this.resourceService.delete(id);
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  }

  // Buscar recursos
  async searchResources(query: string): Promise<Resource[]> {
    try {
      return await this.resourceService.searchResources(query);
    } catch (error) {
      console.error('Error searching resources:', error);
      return [];
    }
  }

  // Obtener recursos destacados
  async getFeaturedResources(limit: number = 10): Promise<Resource[]> {
    try {
      const resources = await this.resourceService.getFeaturedResources();
      return resources.slice(0, limit);
    } catch (error) {
      console.error('Error getting featured resources:', error);
      return [];
    }
  }

  // Obtener recursos públicos
  async getPublicResources(): Promise<Resource[]> {
    try {
      return await this.resourceService.getPublicResources();
    } catch (error) {
      console.error('Error getting public resources:', error);
      return [];
    }
  }

  // Obtener recursos por tipo
  async getResourcesByType(type: string): Promise<Resource[]> {
    try {
      return await this.resourceService.getByType(type);
    } catch (error) {
      console.error('Error getting resources by type:', error);
      return [];
    }
  }

  // Obtener recursos por categoría
  async getResourcesByCategory(category: string): Promise<Resource[]> {
    try {
      return await this.resourceService.getByCategory(category);
    } catch (error) {
      console.error('Error getting resources by category:', error);
      return [];
    }
  }

  // Obtener recursos por autor
  async getResourcesByAuthor(authorId: string): Promise<Resource[]> {
    try {
      return await this.resourceService.getResourcesByAuthor(authorId);
    } catch (error) {
      console.error('Error getting resources by author:', error);
      return [];
    }
  }

  // Obtener recursos populares
  async getPopularResources(limit: number = 10): Promise<Resource[]> {
    try {
      return await this.resourceService.getPopularResources(limit);
    } catch (error) {
      console.error('Error getting popular resources:', error);
      return [];
    }
  }

  // Obtener recursos recientes
  async getRecentResources(limit: number = 10): Promise<Resource[]> {
    try {
      return await this.resourceService.getRecentResources(limit);
    } catch (error) {
      console.error('Error getting recent resources:', error);
      return [];
    }
  }

  // Descargar un recurso
  async downloadResource(id: string): Promise<Blob> {
    try {
      // Incrementar contador de descargas
      await this.resourceService.incrementDownloads(id);
      
      return await this.resourceService.downloadResource(id);
    } catch (error) {
      console.error('Error downloading resource:', error);
      throw error;
    }
  }

  // Calificar un recurso
  async rateResource(id: string, rating: number, user: User): Promise<Resource> {
    try {
      // Validar que el rating esté en el rango correcto
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      return await this.resourceService.rateResource(id, rating);
    } catch (error) {
      console.error('Error rating resource:', error);
      throw error;
    }
  }

  // Cambiar visibilidad pública de un recurso
  async togglePublic(id: string, user: User): Promise<Resource> {
    try {
      // Verificar que el usuario puede editar este recurso
      const existingResource = await this.getResourceById(id);
      if (!existingResource) {
        throw new Error('Resource not found');
      }

      this.validateResourceOwnership(existingResource, user);

      return await this.resourceService.togglePublic(id);
    } catch (error) {
      console.error('Error toggling resource public status:', error);
      throw error;
    }
  }

  // Obtener estadísticas de un recurso
  async getResourceStats(id: string): Promise<{
    totalDownloads: number;
    averageRating: number;
    totalRatings: number;
    views: number;
    shares: number;
  }> {
    try {
      return await this.resourceService.getResourceStats(id);
    } catch (error) {
      console.error('Error getting resource stats:', error);
      throw error;
    }
  }

  // Obtener categorías de recursos
  async getResourceCategories(): Promise<{ category: string; count: number }[]> {
    try {
      return await this.resourceService.getResourceCategories();
    } catch (error) {
      console.error('Error getting resource categories:', error);
      return [];
    }
  }

  // Obtener tipos de recursos
  async getResourceTypes(): Promise<{ type: string; count: number }[]> {
    try {
      return await this.resourceService.getResourceTypes();
    } catch (error) {
      console.error('Error getting resource types:', error);
      return [];
    }
  }

  // Validar permisos del usuario
  private validateUserPermissions(user: User): void {
    const allowedRoles = [
      'SUPERADMIN', 
      'EMPRESAS', 
      'GOBIERNOS_MUNICIPALES', 
      'CENTROS_DE_FORMACION', 
      'ONGS_Y_FUNDACIONES'
    ];
    
    const allowedTypes = ['municipality', 'company'];

    const hasValidRole = user.role && allowedRoles.includes(user.role);
    const hasValidType = user.type && allowedTypes.includes(user.type);

    if (!hasValidRole && !hasValidType) {
      throw new Error('Access denied. Only SuperAdmin and organizations can create resources');
    }
  }

  // Validar datos del recurso
  private validateResourceData(data: Partial<Resource>): void {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Resource title is required');
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new Error('Resource description is required');
    }

    if (!data.type) {
      throw new Error('Resource type is required');
    }

    if (!data.category || data.category.trim().length === 0) {
      throw new Error('Resource category is required');
    }

    if (!data.format || data.format.trim().length === 0) {
      throw new Error('Resource format is required');
    }
  }

  // Validar propiedad del recurso
  private validateResourceOwnership(resource: Resource, user: User): void {
    // SuperAdmin puede editar cualquier recurso
    if (user.role === 'SUPERADMIN') {
      return;
    }

    // El autor puede editar su propio recurso
    if (resource.authorId === user.id) {
      return;
    }

    // Verificar si el usuario pertenece a la misma organización que el autor
    // (esto requeriría lógica adicional basada en la estructura de tu aplicación)
    
    throw new Error('Access denied. You can only edit your own resources');
  }
}
