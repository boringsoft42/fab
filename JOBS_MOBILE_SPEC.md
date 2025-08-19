# CEMSE Jobs & My Applications - Mobile Technical Specification

## Executive Summary
This document provides a comprehensive technical specification for implementing the CEMSE jobs and my-applications features in React Native, based on the analysis of the existing Next.js web application.

## Table of Contents
1. [Feature Overview](#feature-overview)
2. [System Architecture](#system-architecture)
3. [API Integration](#api-integration)
4. [Data Models & Types](#data-models--types)
5. [User Interface Components](#user-interface-components)
6. [Navigation Flow](#navigation-flow)
7. [State Management](#state-management)
8. [Key Features Implementation](#key-features-implementation)
9. [Authentication & Authorization](#authentication--authorization)
10. [Mobile-Specific Considerations](#mobile-specific-considerations)
11. [Implementation Roadmap](#implementation-roadmap)

## Feature Overview

### Jobs System
The jobs system allows youth users to:
- Browse and search job opportunities
- Filter jobs by multiple criteria
- View detailed job information
- Apply to jobs with CV and cover letters
- Save/bookmark jobs for later

### My Applications System
The applications system allows youth users to:
- View all their job applications
- Filter applications by status
- Chat with employers
- Track application progress
- Withdraw applications
- View application documents

## System Architecture

### Directory Structure Analysis
```
src/
├── app/(dashboard)/
│   ├── jobs/                    # Main jobs section
│   │   ├── page.tsx            # Jobs listing page
│   │   ├── [id]/               # Job detail pages
│   │   │   ├── page.tsx        # Job detail view
│   │   │   ├── edit/           # Job editing (company only)
│   │   │   ├── candidates/     # Candidates view (company only)
│   │   │   └── questions/      # Job questions management
│   │   ├── create/             # Job creation (company only)
│   │   └── manage/             # Job management (company only)
│   └── my-applications/        # Applications management
│       ├── page.tsx           # Applications listing
│       ├── layout.tsx         # Applications layout
│       └── new/               # Manual application creation
│           └── page.tsx
└── components/
    └── jobs/                   # Job-related components
        ├── job-card.tsx        # Job listing card
        ├── job-search-filters.tsx # Search & filter UI
        ├── job-application-form.tsx # Application form
        ├── job-application-modal.tsx # Application modal
        ├── cv-check-modal.tsx  # CV management modal
        └── company-gallery.tsx # Company image gallery
```

### Mobile Architecture Recommendation
```
src/
├── screens/
│   ├── jobs/
│   │   ├── JobsListScreen.tsx
│   │   ├── JobDetailScreen.tsx
│   │   ├── JobFiltersScreen.tsx
│   │   └── JobApplicationScreen.tsx
│   └── applications/
│       ├── MyApplicationsScreen.tsx
│       ├── ApplicationDetailScreen.tsx
│       └── ApplicationChatScreen.tsx
├── components/
│   ├── jobs/
│   │   ├── JobCard.tsx
│   │   ├── JobSearchBar.tsx
│   │   ├── JobFilters.tsx
│   │   └── ApplicationForm.tsx
│   └── applications/
│       ├── ApplicationCard.tsx
│       ├── ApplicationStatusBadge.tsx
│       └── ChatMessage.tsx
├── services/
│   ├── jobService.ts
│   ├── applicationService.ts
│   └── messageService.ts
├── hooks/
│   ├── useJobSearch.ts
│   ├── useApplications.ts
│   └── useJobMessages.ts
└── types/
    ├── job.types.ts
    └── application.types.ts
```

## API Integration

### Base API Configuration
```typescript
const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001/api';

// Authentication headers
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});
```

### Job Offer Endpoints

#### GET `/api/joboffer` - Get All Job Offers
**Purpose**: Fetch job listings with optional filters
**Method**: GET
**Headers**: Authorization Bearer token
**Query Parameters**:
- `page`: number (pagination)
- `limit`: number (results per page)
- `search`: string (text search)
- `location`: string[] (location filters)
- `contractType`: string[] (contract type filters)
- `workModality`: string[] (work modality filters)
- `experienceLevel`: string[] (experience filters)
- `salaryMin`: number (minimum salary)
- `salaryMax`: number (maximum salary)
- `exclude`: string (exclude specific job ID)

**Response**:
```typescript
interface JobOfferResponse {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  contractType: ContractType;
  workSchedule: string;
  workModality: WorkModality;
  location: string;
  municipality: string;
  department: string;
  experienceLevel: ExperienceLevel;
  skillsRequired: string[];
  desiredSkills: string[];
  applicationDeadline?: string;
  publishedAt: string;
  expiresAt?: string;
  viewsCount: number;
  applicationsCount: number;
  featured: boolean;
  isActive: boolean;
  status: JobStatus;
  companyId: string;
  company?: {
    id: string;
    name: string;
    logo?: string;
    description?: string;
    website?: string;
    sector?: string;
    size?: string;
    rating?: number;
    reviewCount?: number;
    images?: string[];
  };
}
```

#### GET `/api/joboffer/{id}` - Get Job Detail
**Purpose**: Fetch detailed job information
**Method**: GET
**Headers**: Authorization Bearer token
**Response**: Same as above but single object

### Job Application Endpoints

#### GET `/api/jobapplication/my` - Get User's Applications
**Purpose**: Fetch current user's job applications
**Method**: GET
**Headers**: Authorization Bearer token
**Response**:
```typescript
interface JobApplicationResponse {
  items: JobApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### POST `/api/jobapplication` - Create Application
**Purpose**: Submit job application
**Method**: POST
**Headers**: Authorization Bearer token
**Body**:
```typescript
interface CreateApplicationRequest {
  jobOfferId: string;
  cvUrl?: string;
  coverLetterUrl?: string;
  status: 'PENDING';
  message?: string;
  questionAnswers?: Array<{
    questionId: string;
    question: string;
    answer: string;
  }>;
}
```

#### DELETE `/api/my-applications?applicationId={id}` - Withdraw Application
**Purpose**: Withdraw/cancel job application
**Method**: DELETE
**Headers**: Authorization Bearer token

### Job Messages Endpoints

#### GET `/api/jobmessage/{applicationId}` - Get Chat Messages
**Purpose**: Fetch chat messages for job application
**Method**: GET
**Headers**: Authorization Bearer token

#### POST `/api/jobmessage/{applicationId}` - Send Message
**Purpose**: Send chat message
**Method**: POST
**Headers**: Authorization Bearer token
**Body**:
```typescript
interface SendMessageRequest {
  content: string;
  messageType: 'TEXT' | 'FILE';
}
```

### Job Questions Endpoint

#### GET `/api/jobquestion?jobOfferId={id}` - Get Job Questions
**Purpose**: Fetch custom questions for specific job
**Method**: GET
**Headers**: Authorization Bearer token

## Data Models & Types

### Core Types
```typescript
// Job status enumeration
export type JobStatus = "ACTIVE" | "PAUSED" | "CLOSED" | "DRAFT";

// Contract types
export type ContractType = "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "VOLUNTEER" | "FREELANCE";

// Work modalities
export type WorkModality = "ON_SITE" | "REMOTE" | "HYBRID";

// Experience levels
export type ExperienceLevel = "NO_EXPERIENCE" | "ENTRY_LEVEL" | "MID_LEVEL" | "SENIOR_LEVEL";

// Application statuses
export type ApplicationStatus = "SENT" | "UNDER_REVIEW" | "PRE_SELECTED" | "REJECTED" | "HIRED";
```

### Job Offer Model
```typescript
export interface JobOffer {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  contractType: ContractType;
  workSchedule: string;
  workModality: WorkModality;
  location: string;
  latitude?: number;
  longitude?: number;
  municipality: string;
  department: string;
  experienceLevel: ExperienceLevel;
  educationRequired?: string;
  skillsRequired: string[];
  desiredSkills: string[];
  applicationDeadline?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  status: JobStatus;
  viewsCount: number;
  applicationsCount: number;
  featured: boolean;
  expiresAt?: string;
  publishedAt: string;
  companyId: string;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}
```

### Job Application Model
```typescript
export interface JobApplication {
  id: string;
  status: ApplicationStatus;
  appliedAt: string;
  reviewedAt?: string;
  coverLetter?: string;
  rating?: number;
  notes?: string;
  cvFile?: string;
  coverLetterFile?: string;
  applicant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
    location?: string;
    phone?: string;
  };
  jobOffer: {
    id: string;
    title: string;
    company?: {
      name: string;
      email: string;
    };
  };
  questionAnswers?: JobQuestionAnswer[];
}
```

### Search Filters Model
```typescript
export interface JobSearchFilters {
  query?: string;
  location?: string[];
  contractType?: ContractType[];
  workModality?: WorkModality[];
  experienceLevel?: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  publishedInDays?: number;
  sector?: string[];
}
```

## User Interface Components

### JobCard Component
**Purpose**: Display job listing in grid/list format
**Key Features**:
- Company logo and name
- Job title and description
- Location and work modality
- Salary range
- Contract type badge
- Application count
- Save/bookmark functionality
- Apply button

**Props**:
```typescript
interface JobCardProps {
  job: JobOffer;
  viewMode: "grid" | "list";
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
}
```

### JobSearchFilters Component
**Purpose**: Advanced filtering interface
**Key Features**:
- Location selection with municipalities
- Contract type multi-select
- Work modality multi-select
- Experience level multi-select
- Salary range slider
- Date posted filter
- Sector filter
- Expandable sections
- Active filters counter

**Mobile Adaptation**:
- Bottom sheet or modal presentation
- Touch-friendly filter controls
- Clear visual hierarchy
- Sticky apply/clear buttons

### JobApplicationForm Component
**Purpose**: Job application submission form
**Key Features**:
- CV/Resume upload and management
- Cover letter upload
- Custom job questions
- Additional notes section
- Document validation
- Progress indicator
- Save draft capability

**Mobile Considerations**:
- File picker integration
- Camera/gallery access for documents
- Form validation with clear error states
- Auto-save functionality
- Offline draft storage

### ApplicationCard Component
**Purpose**: Display application status in my-applications
**Key Features**:
- Job title and company
- Application status badge with colors
- Application date
- Company contact information
- Action buttons (chat, view documents, withdraw)
- Status-specific information display

## Navigation Flow

### Job Discovery Flow
```
Jobs List Screen
    ↓ (tap job card)
Job Detail Screen
    ↓ (tap apply)
Application Form Screen
    ↓ (submit)
Application Confirmation
    ↓ (view applications)
My Applications Screen
```

### Application Management Flow
```
My Applications Screen
    ↓ (tap application)
Application Detail Screen
    ↓ (tap chat)
Chat Screen
    ↓ (back)
Application Detail Screen
```

### Job Search Flow
```
Jobs List Screen
    ↓ (tap filters)
Filter Bottom Sheet/Modal
    ↓ (apply filters)
Filtered Jobs List
    ↓ (search text)
Search Results
```

## State Management

### Recommended State Management Pattern
Use React Query (TanStack Query) for server state and React Context for UI state, following the web application pattern.

### Job Search State
```typescript
// Hook for job search with caching
export function useJobOfferSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cachedResults, setCachedResults] = useState<{ [key: string]: JobOffer[] }>({});

  const search = async (filters: JobSearchFilters): Promise<JobOffer[]> => {
    const searchKey = JSON.stringify(filters);
    
    if (cachedResults[searchKey]) {
      return cachedResults[searchKey];
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await jobService.searchJobs(filters);
      setCachedResults(prev => ({
        ...prev,
        [searchKey]: response
      }));
      return response;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { search, loading, error };
}
```

### Application State
```typescript
// Hook for managing applications
export function useMyJobApplications() {
  const [data, setData] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ApplicationService.getMyApplications()
      .then((result) => {
        let applicationsArray: JobApplication[] = [];
        
        if (Array.isArray(result)) {
          applicationsArray = result;
        } else if (result && Array.isArray(result.items)) {
          applicationsArray = result.items;
        }
        
        setData(applicationsArray);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
```

## Key Features Implementation

### Job Search & Filtering

#### Search Implementation
```typescript
// Client-side filtering with caching
const filterJobs = (jobs: JobOffer[], filters: JobSearchFilters) => {
  return jobs.filter(job => {
    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchableText = [
        job.title,
        job.description,
        job.company?.name,
        ...(job.skillsRequired || [])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) return false;
    }
    
    // Location filter
    if (filters.location?.length) {
      const hasMatchingLocation = filters.location.some(loc => 
        job.location.toLowerCase().includes(loc.toLowerCase())
      );
      if (!hasMatchingLocation) return false;
    }
    
    // Contract type filter
    if (filters.contractType?.length) {
      if (!filters.contractType.includes(job.contractType)) return false;
    }
    
    // Work modality filter
    if (filters.workModality?.length) {
      if (!filters.workModality.includes(job.workModality)) return false;
    }
    
    // Experience level filter
    if (filters.experienceLevel?.length) {
      if (!filters.experienceLevel.includes(job.experienceLevel)) return false;
    }
    
    // Salary filters
    if (filters.salaryMin && job.salaryMin && job.salaryMin < filters.salaryMin) {
      return false;
    }
    
    if (filters.salaryMax && job.salaryMax && job.salaryMax > filters.salaryMax) {
      return false;
    }
    
    return true;
  });
};
```

### Job Application Process

#### Application Validation
```typescript
const validateApplication = (application: CreateApplicationRequest) => {
  const errors: string[] = [];
  
  // Document validation
  if (!application.cvUrl && !application.coverLetterUrl) {
    errors.push("Necesitas al menos un CV o carta de presentación PDF");
  }
  
  // Required questions validation
  const requiredQuestions = questions.filter(q => q.required);
  for (const question of requiredQuestions) {
    const answer = application.questionAnswers?.find(qa => qa.questionId === question.id);
    if (!answer || !answer.answer.trim()) {
      errors.push(`Debes responder: "${question.question}"`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

### Chat Functionality

#### Real-time Messaging
```typescript
export function useJobMessages(applicationId: string) {
  const [messages, setMessages] = useState<JobMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const refreshMessages = async () => {
    if (!applicationId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/jobmessage/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageData: { content: string; messageType: string }) => {
    setSending(true);
    try {
      const response = await fetch(`/api/jobmessage/${applicationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        await refreshMessages(); // Refresh to get the new message
      } else {
        throw new Error('Failed to send message');
      }
    } finally {
      setSending(false);
    }
  };

  return { messages, loading, sending, sendMessage, refreshMessages };
}
```

### Document Management

#### CV & Cover Letter Handling
```typescript
export function useCVStatus() {
  const [hasCV, setHasCV] = useState(false);
  const [hasCoverLetter, setHasCoverLetter] = useState(false);
  const [cvUrl, setCvUrl] = useState<string>('');
  const [coverLetterUrl, setCoverLetterUrl] = useState<string>('');
  const [cvData, setCvData] = useState<any>(null);

  const checkCVStatus = async () => {
    try {
      const token = getToken();
      const response = await fetch('/api/profile/cv-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const status = await response.json();
        setHasCV(status.hasCV);
        setHasCoverLetter(status.hasCoverLetter);
        setCvUrl(status.cvUrl || '');
        setCoverLetterUrl(status.coverLetterUrl || '');
        setCvData(status.cvData);
      }
    } catch (error) {
      console.error('Error checking CV status:', error);
    }
  };

  return {
    hasCV,
    hasCoverLetter,
    cvUrl,
    coverLetterUrl,
    cvData,
    checkCVStatus
  };
}
```

## Authentication & Authorization

### Authentication Flow
The application uses JWT token-based authentication:

```typescript
// Token storage and retrieval
const getToken = () => {
  return localStorage.getItem('token'); // Use AsyncStorage for React Native
};

// Protected API calls
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};
```

### Role-Based Access
Youth users ('JOVENES') have access to:
- Browse and search jobs
- Apply to jobs
- Manage applications
- Chat with employers
- View job details

## Mobile-Specific Considerations

### Performance Optimizations
1. **Lazy Loading**: Implement virtualized lists for job listings
2. **Image Optimization**: Company logos and images should be cached
3. **Search Debouncing**: 300ms delay for search queries
4. **Pagination**: Implement infinite scroll for job listings
5. **Offline Support**: Cache job data for offline viewing

### UI/UX Adaptations
1. **Touch Targets**: Minimum 44pt touch targets
2. **Gestures**: Pull-to-refresh, swipe actions
3. **Navigation**: Stack-based navigation with proper back button handling
4. **Loading States**: Skeleton screens for better perceived performance
5. **Error Handling**: User-friendly error messages with retry options

### File Upload Considerations
1. **Document Picker**: Native file picker integration
2. **Camera Integration**: Photo capture for documents
3. **File Validation**: Size and format validation
4. **Progress Indicators**: Upload progress feedback
5. **Compression**: Image compression before upload

### Push Notifications
Implement push notifications for:
- Application status updates
- New job matches
- Chat messages
- Application deadlines

## Implementation Roadmap

### Phase 1: Core Job Features (2-3 weeks)
- [ ] Job listing screen with search
- [ ] Job detail screen
- [ ] Basic filtering
- [ ] Job application form
- [ ] Document upload functionality

### Phase 2: Application Management (1-2 weeks)
- [ ] My Applications screen
- [ ] Application detail view
- [ ] Status tracking
- [ ] Application withdrawal

### Phase 3: Advanced Features (2-3 weeks)
- [ ] Chat functionality
- [ ] Advanced filtering
- [ ] Job bookmarking
- [ ] Push notifications
- [ ] Offline support

### Phase 4: Polish & Testing (1 week)
- [ ] Performance optimization
- [ ] UI/UX refinements
- [ ] Error handling improvements
- [ ] Testing and bug fixes

## Testing Strategy

### Unit Tests
- API service functions
- Utility functions
- State management hooks
- Form validation logic

### Integration Tests
- Job search flow
- Application submission flow
- Chat functionality
- Document upload

### E2E Tests
- Complete job application process
- Application status updates
- Search and filtering workflow

## Conclusion

This specification provides a comprehensive blueprint for implementing the CEMSE jobs and my-applications features in React Native. The mobile implementation should maintain feature parity with the web version while optimizing for mobile-specific patterns and user experience.

Key success factors:
1. **Faithful Replication**: Maintain all existing functionality
2. **Mobile Optimization**: Adapt UI/UX patterns for mobile
3. **Performance**: Ensure smooth performance with large job datasets
4. **Offline Support**: Provide reasonable offline functionality
5. **User Experience**: Intuitive navigation and clear feedback

The provided code examples and architectural patterns should guide the development team in creating a robust, scalable mobile application that serves the youth demographic effectively.