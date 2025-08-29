import { Request, Response } from "express";
// import { prisma } from "../lib/prisma";

// Buscar jóvenes para conectar
export async function searchYouthUsers(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { query, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Construir filtros de búsqueda - solo traer jóvenes existentes
    const whereClause: any = {
      role: "YOUTH", // Solo usuarios jóvenes
      userId: { not: user.id }, // Excluir al usuario actual
      active: true,
      status: "ACTIVE"
    };

    if (query) {
      whereClause.OR = [
        { firstName: { contains: String(query), mode: 'insensitive' } },
        { lastName: { contains: String(query), mode: 'insensitive' } },
        { email: { contains: String(query), mode: 'insensitive' } },
        { skills: { hasSome: [String(query)] } }
      ];
    }

    // Buscar usuarios jóvenes existentes
    const [users, total] = await Promise.all([
      prisma.profile.findMany({
        where: whereClause,
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
          currentInstitution: true,
          skills: true,
          department: true,
          municipality: true,
          createdAt: true
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.profile.count({ where: whereClause })
    ]);

    // Verificar si ya hay solicitudes enviadas o recibidas
    const userIds = users.map(u => u.userId);
    const existingContacts = await prisma.contact.findMany({
      where: {
        OR: [
          { userId: user.id, contactId: { in: userIds } },
          { userId: { in: userIds }, contactId: user.id }
        ]
      }
    });

    // Filtrar usuarios que ya son contactos (ACCEPTED)
    const acceptedContactIds = existingContacts
      .filter(c => c.status === "ACCEPTED")
      .map(c => c.userId === user.id ? c.contactId : c.userId);

    // Excluir usuarios que ya son contactos de la lista
    const availableUsers = users.filter(u => !acceptedContactIds.includes(u.userId));

    // Agregar estado de contacto a cada usuario disponible
    const usersWithContactStatus = availableUsers.map(user => {
      // Buscar si el usuario actual envió una solicitud a este usuario
      const sentContact = existingContacts.find(c =>
        c.userId === user.id && c.contactId === user.userId
      );

      // Buscar si el usuario actual recibió una solicitud de este usuario
      const receivedContact = existingContacts.find(c =>
        c.userId === user.userId && c.contactId === user.id
      );

      let contactStatus = null;
      if (sentContact) {
        contactStatus = { type: 'sent', status: sentContact.status };
      } else if (receivedContact) {
        contactStatus = { type: 'received', status: receivedContact.status };
      }

      return {
        ...user,
        contactStatus
      };
    });

    return res.json({
      users: usersWithContactStatus,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: availableUsers.length,
        pages: Math.ceil(availableUsers.length / Number(limit))
      }
    });

  } catch (error: any) {
    console.error("Error searching youth users:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Enviar solicitud de contacto
export async function sendContactRequest(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { contactId, message } = req.body;

    if (!contactId) {
      return res.status(400).json({ message: "Contact ID is required" });
    }

    // Verificar que el usuario objetivo existe y es joven
    const targetUser = await prisma.profile.findUnique({
      where: { userId: contactId },
      select: { role: true, active: true, status: true }
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.role !== "YOUTH") {
      return res.status(400).json({ message: "Can only connect with youth users" });
    }

    if (!targetUser.active || targetUser.status !== "ACTIVE") {
      return res.status(400).json({ message: "User is not available for connections" });
    }

    // Verificar que no se está enviando solicitud a sí mismo
    if (user.id === contactId) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    // Verificar si ya existe una solicitud
    const existingContact = await prisma.contact.findUnique({
      where: {
        userId_contactId: {
          userId: user.id,
          contactId: contactId
        }
      }
    });

    if (existingContact) {
      return res.status(400).json({ message: "Contact request already exists" });
    }

    // Crear la solicitud de conexión
    const contact = await prisma.contact.create({
      data: {
        userId: user.id,
        contactId: contactId,
        message: message || null
      }
    });

    return res.json({
      message: "Contact request sent successfully",
      contact
    });

  } catch (error: any) {
    console.error("Error sending contact request:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Obtener solicitudes recibidas
export async function getReceivedRequests(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [requests, total] = await Promise.all([
      prisma.contact.findMany({
        where: {
          contactId: user.id,
          status: "PENDING"
        },
        include: {
          user: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
              currentInstitution: true,
              skills: true,
              department: true,
              municipality: true
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contact.count({
        where: {
          contactId: user.id,
          status: "PENDING"
        }
      })
    ]);

    return res.json({
      requests,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error: any) {
    console.error("Error getting received requests:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Aceptar solicitud de contacto
export async function acceptContactRequest(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { id } = req.params;

    // Verificar que la solicitud existe y pertenece al usuario
    const contact = await prisma.contact.findFirst({
      where: {
        id: id,
        contactId: user.id,
        status: "PENDING"
      }
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact request not found" });
    }

    // Actualizar el estado a aceptado
    const updatedContact = await prisma.contact.update({
      where: { id: id },
      data: { status: "ACCEPTED" }
    });

    return res.json({
      message: "Contact request accepted successfully",
      contact: updatedContact
    });

  } catch (error: any) {
    console.error("Error accepting contact request:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Rechazar solicitud de contacto
export async function rejectContactRequest(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { id } = req.params;

    // Verificar que la solicitud existe y pertenece al usuario
    const contact = await prisma.contact.findFirst({
      where: {
        id: id,
        contactId: user.id,
        status: "PENDING"
      }
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact request not found" });
    }

    // Actualizar el estado a rechazado
    const updatedContact = await prisma.contact.update({
      where: { id: id },
      data: { status: "REJECTED" }
    });

    return res.json({
      message: "Contact request rejected successfully",
      contact: updatedContact
    });

  } catch (error: any) {
    console.error("Error rejecting contact request:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Obtener lista de contactos conectados
export async function getContacts(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Obtener contactos aceptados (enviados y recibidos)
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: {
          OR: [
            { userId: user.id, status: "ACCEPTED" },
            { contactId: user.id, status: "ACCEPTED" }
          ]
        },
        include: {
          user: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
              currentInstitution: true,
              skills: true,
              department: true,
              municipality: true,
              birthDate: true
            }
          },
          contact: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
              currentInstitution: true,
              skills: true,
              department: true,
              municipality: true,
              birthDate: true
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.contact.count({
        where: {
          OR: [
            { userId: user.id, status: "ACCEPTED" },
            { contactId: user.id, status: "ACCEPTED" }
          ]
        }
      })
    ]);

    // Formatear la respuesta para mostrar el contacto (no el usuario actual)
    const formattedContacts = contacts.map(contact => {
      const isSender = contact.userId === user.id;
      const contactUser = isSender ? contact.contact : contact.user;

      return {
        id: contact.id,
        contact: contactUser,
        connectionDate: contact.updatedAt,
        isSender
      };
    });

    return res.json({
      contacts: formattedContacts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error: any) {
    console.error("Error getting contacts:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Eliminar contacto
export async function deleteContact(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { id } = req.params;

    // Verificar que el contacto existe y pertenece al usuario
    const contact = await prisma.contact.findFirst({
      where: {
        id: id,
        OR: [
          { userId: user.id },
          { contactId: user.id }
        ],
        status: "ACCEPTED"
      }
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // Eliminar el contacto
    await prisma.contact.delete({
      where: { id: id }
    });

    return res.json({
      message: "Contact deleted successfully"
    });

  } catch (error: any) {
    console.error("Error deleting contact:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Obtener estadísticas de la red
export async function getContactStats(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const [
      totalContacts,
      pendingSent,
      pendingReceived,
      totalSent,
      totalReceived
    ] = await Promise.all([
      // Total de contactos conectados
      prisma.contact.count({
        where: {
          OR: [
            { userId: user.id, status: "ACCEPTED" },
            { contactId: user.id, status: "ACCEPTED" }
          ]
        }
      }),
      // Solicitudes enviadas pendientes
      prisma.contact.count({
        where: {
          userId: user.id,
          status: "PENDING"
        }
      }),
      // Solicitudes recibidas pendientes
      prisma.contact.count({
        where: {
          contactId: user.id,
          status: "PENDING"
        }
      }),
      // Total de solicitudes enviadas
      prisma.contact.count({
        where: { userId: user.id }
      }),
      // Total de solicitudes recibidas
      prisma.contact.count({
        where: { contactId: user.id }
      })
    ]);

    return res.json({
      stats: {
        totalContacts,
        pendingSent,
        pendingReceived,
        totalSent,
        totalReceived,
        totalRequests: totalSent + totalReceived
      }
    });

  } catch (error: any) {
    console.error("Error getting contact stats:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
