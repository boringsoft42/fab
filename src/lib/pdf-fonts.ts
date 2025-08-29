import { Font } from '@react-pdf/renderer';

// Registrar todas las fuentes necesarias para los certificados
export const registerPDFFonts = () => {
    // Fuente principal - Helvetica
    Font.register({
        family: 'Helvetica',
        fonts: [
            { src: 'Helvetica', fontWeight: 'normal' },
            { src: 'Helvetica-Bold', fontWeight: 'bold' },
        ],
    });

    // Fuente monospace para códigos y firmas digitales
    Font.register({
        family: 'Courier',
        fonts: [
            { src: 'Courier', fontWeight: 'normal' },
            { src: 'Courier-Bold', fontWeight: 'bold' },
        ],
    });

    // Fuente de respaldo - Arial
    Font.register({
        family: 'Arial',
        fonts: [
            { src: 'Arial', fontWeight: 'normal' },
            { src: 'Arial-Bold', fontWeight: 'bold' },
        ],
    });

    // Fuente de respaldo adicional - Times
    Font.register({
        family: 'Times',
        fonts: [
            { src: 'Times-Roman', fontWeight: 'normal' },
            { src: 'Times-Bold', fontWeight: 'bold' },
        ],
    });

    console.log('✅ PDF fonts registered successfully');
};

// Función para obtener la fuente principal con fallbacks
export const getMainFont = () => 'Helvetica';

// Función para obtener la fuente monospace con fallbacks
export const getMonospaceFont = () => 'Courier';

// Función para obtener la fuente de respaldo
export const getFallbackFont = () => 'Arial'; 