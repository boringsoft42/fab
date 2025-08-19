import { NextRequest, NextResponse } from 'next/server';

// Mock data for module certificates
const mockCertificates = [
  {
    id: '1',
    moduleId: '1',
    studentId: 'student_1',
    certificateUrl: 'https://example.com/certificates/module1-student1.pdf',
    issuedAt: new Date('2024-01-15T10:30:00Z'),
    grade: 95,
    completedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    moduleId: '2',
    studentId: 'student_1',
    certificateUrl: 'https://example.com/certificates/module2-student1.pdf',
    issuedAt: new Date('2024-01-20T14:20:00Z'),
    grade: 88,
    completedAt: new Date('2024-01-20T14:20:00Z')
  },
  {
    id: '3',
    moduleId: '1',
    studentId: 'student_2',
    certificateUrl: 'https://example.com/certificates/module1-student2.pdf',
    issuedAt: new Date('2024-01-18T16:45:00Z'),
    grade: 92,
    completedAt: new Date('2024-01-18T16:45:00Z')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get('id');
    const moduleId = searchParams.get('moduleId');
    const studentId = searchParams.get('studentId');

    if (certificateId) {
      const certificate = mockCertificates.find(c => c.id === certificateId);
      if (!certificate) {
        return NextResponse.json({ message: 'Certificado no encontrado' }, { status: 404 });
      }
      return NextResponse.json({ certificate });
    }

    if (moduleId) {
      const certificates = mockCertificates.filter(c => c.moduleId === moduleId);
      return NextResponse.json({ certificates });
    }

    if (studentId) {
      const certificates = mockCertificates.filter(c => c.studentId === studentId);
      return NextResponse.json({ certificates });
    }

    return NextResponse.json({ certificates: mockCertificates });
  } catch (error) {
    console.error('Error in module certificates route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      moduleId,
      studentId,
      certificateUrl,
      grade
    } = body;

    if (!moduleId || !studentId || !certificateUrl) {
      return NextResponse.json(
        { message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const existingCertificate = mockCertificates.find(
      c => c.moduleId === moduleId && c.studentId === studentId
    );

    if (existingCertificate) {
      return NextResponse.json(
        { message: 'El estudiante ya tiene un certificado para este módulo' },
        { status: 409 }
      );
    }

    const newCertificate = {
      id: Date.now().toString(),
      moduleId,
      studentId,
      certificateUrl,
      issuedAt: new Date(),
      grade: grade || null,
      completedAt: new Date()
    };

    mockCertificates.push(newCertificate);

    return NextResponse.json({ certificate: newCertificate }, { status: 201 });
  } catch (error) {
    console.error('Error creating module certificate:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: 'ID del certificado es requerido' },
        { status: 400 }
      );
    }

    const certificateIndex = mockCertificates.findIndex(c => c.id === id);
    if (certificateIndex === -1) {
      return NextResponse.json(
        { message: 'Certificado no encontrado' },
        { status: 404 }
      );
    }

    mockCertificates[certificateIndex] = {
      ...mockCertificates[certificateIndex],
      ...updateData
    };

    return NextResponse.json({ certificate: mockCertificates[certificateIndex] });
  } catch (error) {
    console.error('Error updating module certificate:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'ID del certificado es requerido' },
        { status: 400 }
      );
    }

    const certificateIndex = mockCertificates.findIndex(c => c.id === id);
    if (certificateIndex === -1) {
      return NextResponse.json(
        { message: 'Certificado no encontrado' },
        { status: 404 }
      );
    }

    mockCertificates.splice(certificateIndex, 1);

    return NextResponse.json({ message: 'Certificado eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting module certificate:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
