# CV Builder - Mobile Development Specification

## Metadata

- Generated: 2025-08-22
- Source: src/app/(dashboard)/cv-builder/, src/components/profile/cv-manager.tsx
- Target Platform: React Native / Expo
- User Role: YOUTH (Joven)
- Priority: Critical
- Dependencies: Profile Module, Authentication Module, File Upload Module
- Estimated Development Time: 3-4 weeks

## Overview

- Purpose: Comprehensive CV and Cover Letter builder with multiple templates, allowing youth users to create, edit, preview, and download professional resumes and cover letters
- User Role: YOUTH
- Priority: Critical
- Dependencies:
  - Authentication system for user identification
  - Profile data for pre-filling CV information
  - File upload service for profile images
  - PDF generation capabilities
- Key Features:
  - Multi-template CV generation
  - Cover letter creation
  - Real-time preview
  - PDF export
  - Profile image upload
  - Collapsible sections for better mobile UX

## User Flows

### CV Creation/Editing Flow

1. Entry Point: `/cv-builder` route or sidebar navigation
2. Steps:
   - User lands on CV Builder page with CVManager component
   - System fetches existing CV data via GET /api/cv
   - Three main tabs displayed: "Editar Datos", "Curriculum Vitae", "Carta de Presentación"
   - User starts in "Editar Datos" tab by default
   - User can edit personal information in collapsible sections
   - Changes are auto-saved via PUT /api/cv endpoint
   - User can upload profile image via drag-and-drop or file picker
   - User can navigate to CV preview tab to see live preview
   - User can select from 3 templates: Modern Professional, Creative Portfolio, Minimalist
   - User can download CV as PDF or print directly
3. Success Criteria: CV data saved successfully, PDF generated and downloaded
4. Error Scenarios:
   - Network failure: Show error message, retain local changes
   - Invalid data: Show validation errors inline
   - Upload failure: Show upload error with retry option

### Profile Image Upload Flow

1. Entry Point: "Foto de Perfil" card in Edit Data tab
2. Steps:
   - User clicks on upload area or drags image
   - File validation (type, size <5MB)
   - Preview shown immediately
   - Upload to server via POST /api/files/upload/profile-image
   - Update avatar via PUT /api/profile/avatar
   - Success message displayed
3. Success Criteria: Image uploaded and displayed in CV
4. Error Scenarios:
   - File too large: "El archivo es demasiado grande. Máximo 5MB"
   - Invalid format: "Por favor selecciona un archivo de imagen válido"
   - Upload failure: "Error al subir la imagen. Intenta de nuevo."

### Cover Letter Generation Flow

1. Entry Point: "Carta de Presentación" tab
2. Steps:
   - System fetches existing cover letter via GET /api/cv/cover-letter
   - User selects template from available options
   - User edits recipient information
   - User customizes letter content
   - Save via POST /api/cv/cover-letter
   - Preview updates in real-time
   - Download as PDF option available
3. Success Criteria: Cover letter saved and downloadable
4. Error Scenarios:
   - Content too short: Minimum 100 characters required
   - Save failure: Show error with retry option

## API Specifications

### Get CV Data

- URL: `/api/cv`
- Method: GET
- Headers:
  ```json
  {
    "Authorization": "Bearer [token]",
    "Content-Type": "application/json"
  }
  ```
- Request Body: None
- Response (Success):
  ```typescript
  interface CVResponse {
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      addressLine?: string;
      city?: string;
      state?: string;
      municipality: string;
      department: string;
      country: string;
      birthDate?: Date;
      gender?: string;
      profileImage?: string;
    };
    jobTitle?: string;
    professionalSummary?: string;
    education: {
      level: string;
      currentInstitution: string;
      graduationYear: number;
      isStudying: boolean;
      educationHistory: EducationHistoryItem[];
      currentDegree: string;
      universityName: string;
      universityStartDate: string;
      universityEndDate: string | null;
      universityStatus: string;
      gpa: number;
      academicAchievements: AcademicAchievement[];
    };
    skills: {
      name: string;
      experienceLevel?: string;
    }[];
    interests: string[];
    languages: {
      name: string;
      proficiency: string;
    }[];
    socialLinks: {
      platform: string;
      url: string;
    }[];
    workExperience: {
      jobTitle: string;
      company: string;
      startDate: string;
      endDate: string;
      description: string;
    }[];
    projects: {
      title: string;
      location?: string;
      startDate: string;
      endDate: string;
      description: string;
    }[];
    activities: {
      title: string;
      organization?: string;
      startDate: string;
      endDate: string;
      description: string;
    }[];
    achievements: any[];
    certifications: any[];
    targetPosition?: string;
    targetCompany?: string;
    relevantSkills?: string[];
  }
  ```
- Response (Error):
  ```typescript
  interface ErrorResponse {
    error: string;
  }
  ```
- Status Codes:
  - 200: Success
  - 401: Unauthorized (no token or invalid token)
  - 404: Profile not found
  - 500: Internal server error

### Update CV Data

- URL: `/api/cv`
- Method: PUT
- Headers:
  ```json
  {
    "Authorization": "Bearer [token]",
    "Content-Type": "application/json"
  }
  ```
- Request Body:
  ```typescript
  interface UpdateCVRequest {
    personalInfo?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      address?: string;
      addressLine?: string;
      city?: string;
      state?: string;
      municipality?: string;
      department?: string;
      country?: string;
      birthDate?: Date;
      gender?: string;
    };
    jobTitle?: string;
    professionalSummary?: string;
    education?: {
      level?: string;
      currentInstitution?: string;
      graduationYear?: number;
      isStudying?: boolean;
      educationHistory?: EducationHistoryItem[];
      currentDegree?: string;
      universityName?: string;
      universityStartDate?: string;
      universityEndDate?: string | null;
      universityStatus?: string;
      gpa?: number;
      academicAchievements?: AcademicAchievement[];
    };
    skills?: { name: string; experienceLevel?: string; }[];
    interests?: string[];
    languages?: { name: string; proficiency: string; }[];
    socialLinks?: { platform: string; url: string; }[];
    workExperience?: {
      jobTitle: string;
      company: string;
      startDate: string;
      endDate: string;
      description: string;
    }[];
    projects?: {
      title: string;
      location?: string;
      startDate: string;
      endDate: string;
      description: string;
    }[];
  }
  ```
- Response (Success):
  ```typescript
  {
    message: "CV actualizado exitosamente",
    profile: UpdatedProfileObject
  }
  ```
- Status Codes:
  - 200: Successfully updated
  - 401: Unauthorized
  - 500: Internal server error

### Upload Profile Image

- URL: `/api/files/upload/profile-image`
- Method: POST
- Headers:
  ```json
  {
    "Authorization": "Bearer [token]"
  }
  ```
- Request Body: FormData with 'image' field containing file
- Response (Success):
  ```typescript
  {
    imageUrl: string; // URL of uploaded image
  }
  ```
- Status Codes:
  - 200: Upload successful
  - 400: Invalid file
  - 401: Unauthorized
  - 500: Upload failed

### Update Profile Avatar

- URL: `/api/profile/avatar`
- Method: PUT
- Headers:
  ```json
  {
    "Authorization": "Bearer [token]",
    "Content-Type": "application/json"
  }
  ```
- Request Body:
  ```typescript
  {
    avatarUrl: string | null; // null to remove avatar
  }
  ```
- Response (Success):
  ```typescript
  {
    message: "Avatar updated successfully",
    avatarUrl: string | null
  }
  ```

### Get Cover Letter

- URL: `/api/cv/cover-letter`
- Method: GET
- Headers:
  ```json
  {
    "Authorization": "Bearer [token]",
    "Content-Type": "application/json"
  }
  ```
- Response (Success):
  ```typescript
  interface CoverLetterResponse {
    template: string;
    content: string;
    recipient: {
      department: string;
      companyName: string;
      address: string;
      city: string;
      country: string;
    };
    subject: string;
  }
  ```

### Save Cover Letter

- URL: `/api/cv/cover-letter`
- Method: POST
- Headers:
  ```json
  {
    "Authorization": "Bearer [token]",
    "Content-Type": "application/json"
  }
  ```
- Request Body:
  ```typescript
  interface SaveCoverLetterRequest {
    content: string; // Minimum 100 characters
    template?: string;
    recipient?: {
      department: string;
      companyName: string;
      address: string;
      city: string;
      country: string;
    };
    subject?: string;
  }
  ```
- Response (Success):
  ```typescript
  {
    message: "Carta de presentación guardada exitosamente",
    coverLetter: CoverLetterObject
  }
  ```
- Status Codes:
  - 200: Success
  - 400: Content too short (< 100 chars)
  - 401: Unauthorized
  - 500: Server error

## UI Components

### CVManager Component

- File Location: `src/components/profile/cv-manager.tsx`
- Component Type: Page-level Organism
- Props Interface: None (uses hooks internally)
- State Management:
  - Type: Local state with React hooks + React Query for server state
  - State Shape:
    ```typescript
    {
      activeTab: "edit" | "cv" | "cover-letter";
      isEditing: boolean;
      newSkill: string;
      newInterest: string;
      uploading: boolean;
      profileImage: string;
      showImageUpload: boolean;
      uploadError: string;
      collapsedSections: {
        education: boolean;
        languages: boolean;
        socialLinks: boolean;
        workExperience: boolean;
        projects: boolean;
        skills: boolean;
        interests: boolean;
      };
    }
    ```
- Key Features:
  - Three-tab interface for data editing, CV preview, and cover letter
  - Collapsible sections for better mobile experience
  - Real-time data updates
  - Drag-and-drop image upload
  - Dynamic skill and interest management
  - Quick Actions toolbar for direct PDF operations
- Implementation Notes:
  - Uses `localStorage.getItem('token')` for authentication
  - Direct DOM manipulation for tab switching in Quick Actions
  - No React.memo or useMemo optimizations implemented
  - Synchronous state updates without debouncing

### ImageUpload Component

- File Location: `src/components/profile/image-upload.tsx`
- Component Type: Molecule
- Props Interface:
  ```typescript
  interface ImageUploadProps {
    currentImage?: string;
    onImageUpload: (file: File) => Promise<void>;
    onImageRemove: () => Promise<void>;
    className?: string;
  }
  ```
- Features:
  - Drag-and-drop support
  - File validation (type and size)
  - Image preview
  - Upload progress indicator
  - Error handling with messages
  - File constraints: Max 5MB, image formats only

### CVTemplateSelector Component

- File Location: `src/components/profile/templates/cv-templates/index.tsx`
- Component Type: Organism
- Features:
  - Three template options: Modern Professional, Creative Portfolio, Minimalist
  - PDF generation using @react-pdf/renderer
  - Print functionality
  - Download as PDF
  - Template preview with live data

### Styling Details

- Approach: Tailwind CSS classes
- Key Color Scheme:
  - Primary Blue: #1e40af (blue-700)
  - Secondary Blue: #3b82f6 (blue-500)
  - Hover Blue: #2563eb (blue-600)
  - Success Green: #16a34a (green-600)
  - Error Red: #dc2626 (red-600)
  - Gray Scale: gray-50 to gray-900
  - Background: white (#ffffff)
  
- Typography:
  - Font Family: System default (no custom fonts loaded)
  - Heading Sizes:
    - Page Title: text-3xl font-bold
    - Section Title: text-xl font-semibold
    - Card Title: text-lg font-medium
  - Body Text: text-base (16px)
  - Small Text: text-sm (14px)
  - Extra Small: text-xs (12px)

- Spacing:
  - Container padding: py-8 px-4
  - Card spacing: space-y-6
  - Form field spacing: space-y-4
  - Button gaps: gap-2
  
- Border Radius:
  - Cards: rounded-lg
  - Buttons: rounded-md
  - Badges: rounded-full
  - Input fields: rounded-md

### Responsive Behavior

- Mobile (<768px):
  - Single column layout for all sections
  - Collapsible sections enabled by default
  - Full-width buttons and inputs
  - Simplified navigation with tabs
  - Touch-optimized tap targets (min 44px)

- Tablet (768px-1024px):
  - Two-column grid for some sections
  - Side-by-side form fields where appropriate
  - Expanded navigation options

- Desktop (>1024px):
  - Three-column grid for main edit sections
  - Two-column layout for education history
  - Inline action buttons
  - All sections expanded by default

### Component Interactions

- Hover States:
  - Buttons: Darker shade or border color change
  - Cards: Light gray background on collapsible headers
  - Drag zone: Border color changes to blue

- Click Behaviors:
  - Section headers: Toggle collapse/expand
  - Tabs: Switch between edit/preview/cover letter
  - Add buttons: Create new array items inline
  - Remove buttons (X): Delete array items with confirmation

- Loading States:
  - Spinner animation during data fetch
  - Disabled state for buttons during operations
  - Progress indication for file uploads

- Error States:
  - Red border on invalid inputs
  - Error message below fields
  - Toast notifications for API errors

## Business Rules

### CV Data Validation

- **Personal Information**:
  - First name and last name: Required
  - Email: Required, must be valid email format
  - Phone: Optional, but if provided must be valid format
  - Address fields: Optional
  
- **Education**:
  - Education level: Required, from predefined list (PRIMARY, SECONDARY, TECHNICAL, UNIVERSITY, POSTGRADUATE, OTHER)
  - Institution name: Required if education level selected
  - Graduation year: Must be between 1950-2030
  - GPA: If provided, must be between 0-4
  
- **Professional Summary**:
  - Recommended length: 2-4 sentences
  - No minimum requirement but suggested for completeness
  
- **Skills**:
  - No duplicates allowed
  - Experience level optional (defaults to "Skillful")
  - Maximum recommended: 15 skills
  
- **Languages**:
  - Proficiency levels: Native speaker, Highly proficient, Proficient, Intermediate, Basic
  - At least one language recommended
  
- **Work Experience**:
  - Start date required
  - End date optional (for current positions)
  - Description recommended minimum: 50 characters
  
- **Cover Letter**:
  - Minimum content length: 100 characters
  - Template selection required
  - Recipient information optional but recommended

### File Upload Rules

- **Profile Image**:
  - Maximum size: 5MB
  - Supported formats: JPG, PNG, GIF
  - Recommended dimensions: 400x400px or larger
  - Aspect ratio: Square preferred
  - Auto-resize on server side

### Data Persistence

- All changes are persisted to server immediately
- No local drafts - direct server updates
- Failed updates show error but retain form data
- Optimistic updates with rollback on failure

## PDF Generation & Templates

### CV Templates Available

1. **Modern Professional Template**
   - Primary color: #1e40af (blue-700)
   - Two-column layout (30% left, 70% right)
   - Header with blue background and white text
   - Left sidebar for skills, languages, interests
   - Right column for experience, education, projects
   - Custom StyleSheet with @react-pdf/renderer

2. **Creative Portfolio Template**
   - Visual-focused design
   - Large header section for profile image
   - Color-coded sections
   - Grid layout for projects

3. **Minimalist Template**
   - Clean, simple design
   - Single column layout
   - Black and white color scheme
   - Focus on typography

### PDF Generation Implementation

- Library: `@react-pdf/renderer`
- Method: Client-side generation using `pdf()` function
- Export format: PDF document
- Features:
  - Custom fonts (Helvetica)
  - Responsive text sizing
  - Page breaks handling
  - Image embedding support

### Cover Letter Templates

1. **Professional Template**
   - Formal business letter format
   - Sender info header with border
   - Recipient block
   - Subject line
   - Justified text content
   - Signature section

## Quick Actions Feature

### Implementation Details

- Location: Bottom toolbar in CVManager component
- Actions Available:
  1. Print CV - Triggers browser print dialog
  2. Print Cover Letter - Switches tab and prints
  3. Download CV PDF - Generates and downloads PDF
  4. Download Cover Letter PDF - Generates letter PDF
  5. Download All (ZIP) - Bundles all documents

### Tab Navigation Logic

```typescript
// Tab switching implementation
const cvTab = document.querySelector('[data-value="cv"]') as HTMLElement;
if (cvTab) cvTab.click();

// Delayed action after tab switch
setTimeout(() => {
  const downloadBtn = document.querySelector('[data-cv-download]') as HTMLElement;
  if (downloadBtn) downloadBtn.click();
}, 100);
```

## State Management Details

### Hook Architecture

The module uses a custom `useCV` hook that wraps React Query mutations:

```typescript
// Expected hook interface (implementation may vary)
interface UseCVReturn {
  cvData: CVData | null;
  coverLetterData: CoverLetterData | null;
  loading: boolean;
  error: Error | null;
  updateCVData: (data: Partial<CVData>) => Promise<void>;
  saveCoverLetterData: (data: CoverLetterData) => Promise<void>;
}
```

### React Query Configuration

- Query Keys:
  - `['cv']` - Main CV data
  - `['coverLetter']` - Cover letter data
- Invalidation: Automatic on successful mutations
- Caching: Default React Query cache settings
- Refetch: On window focus and mount

## Authentication & Security

### Token Management

- Storage: `localStorage.getItem('token')`
- Header Format: `Authorization: Bearer [token]`
- Token refresh: Not implemented in CV module
- Logout handling: Relies on global auth context

### File Upload Security

- Client-side validation:
  - File type check: `file.type.startsWith('image/')`
  - Size limit: 5MB max
  - Format restrictions: JPG, PNG, GIF only
- Server-side validation: Assumed but not visible in client code

## Error Handling Patterns

### User-Facing Error Messages

```typescript
// Upload errors
"Por favor selecciona un archivo de imagen válido"
"El archivo es demasiado grande. Máximo 5MB"
"Error al subir la imagen. Intenta de nuevo."
"Error al actualizar el avatar"

// Loading states
"Cargando datos del CV..."
"Error al cargar los datos del CV"
```

### Error Recovery

- Form data retention on API failure
- Retry mechanism: Manual user action
- Error boundaries: Not implemented
- Fallback UI: Basic error message display

## Performance Considerations

### Current Implementation

- **No lazy loading** for components
- **No code splitting** at module level
- **No memoization** (no useMemo, useCallback, React.memo)
- **Synchronous updates** without debouncing
- **Full re-renders** on state changes

### Potential Optimizations for Mobile

1. Implement lazy loading for template components
2. Add debouncing for text input fields
3. Memoize expensive computations
4. Virtualize long lists (education history, work experience)
5. Implement progressive image loading
6. Add service worker for offline PDF generation

## Integration Points

### Dashboard Layout

- Parent: `src/app/(dashboard)/layout.tsx`
- Wrapper: `DashboardLayoutClient` component
- Route: `/cv-builder`
- Navigation: Sidebar menu item

### Shared Components

- UI Library: Custom components in `/components/ui/`
- Icons: Lucide React icons
- Form controls: Input, Textarea, Select, Button
- Layout: Card, Tabs, Badge components

### Backend Configuration

- Config file: `src/lib/backend-config.ts`
- Base URL: `process.env.NEXT_PUBLIC_BACKEND_URL`
- Endpoints defined in `BACKEND_ENDPOINTS` object

## Edge Cases & Limitations

### Known Limitations

1. No offline support - requires constant internet
2. No draft saving - direct server updates only
3. No version history or undo functionality
4. No collaborative editing features
5. Limited to 15 skills recommendation
6. No bulk operations for array fields

### Browser Compatibility

- Modern browsers required for:
  - PDF generation (@react-pdf/renderer)
  - Drag-and-drop file upload
  - FormData API
  - Flexbox/Grid layouts

### Data Constraints

- GPA: 0-4 scale only
- Graduation year: 1950-2030
- Profile image: 5MB max
- Cover letter: 100 char minimum
- No rich text formatting in text areas