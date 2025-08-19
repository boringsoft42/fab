# CEMSE Youth Dashboard Technical Specification

## Executive Summary

The CEMSE (Centro de Empleo, Micro-emprendimiento y Servicios Especializados) youth dashboard is a comprehensive web application designed specifically for young people (Jóvenes) in Bolivia. It provides integrated access to employment opportunities, educational courses, entrepreneurship resources, and professional development tools. This specification documents all technical aspects for mobile application replication.

**Key Features:**
- Job search and application management
- Course enrollment and learning management
- Entrepreneurship resource center
- Professional profile and CV management
- News and communication systems
- Real-time messaging and notifications

## Project Architecture Overview

### Technology Stack
- **Frontend:** Next.js 14 with TypeScript
- **UI Framework:** React with Tailwind CSS
- **State Management:** TanStack Query (React Query) + Context API
- **Authentication:** JWT-based with role-based access control
- **API Communication:** RESTful APIs with proxy layer
- **Real-time Features:** WebSocket connections for messaging
- **File Handling:** Multipart form data uploads

### Directory Structure
```
src/
├── app/                           # Next.js App Router pages
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── jobs/                 # Job-related pages
│   │   ├── my-applications/      # Job applications management
│   │   ├── courses/              # Course catalog
│   │   ├── entrepreneurship/     # Business resources
│   │   ├── cv-builder/           # CV management
│   │   ├── profile/              # User profile
│   │   └── dashboard/            # Main dashboard
│   └── api/                      # API proxy routes
├── components/                   # Reusable UI components
│   ├── dashboard/role-specific/  # Role-based components
│   ├── jobs/                     # Job-related components
│   ├── profile/                  # Profile components
│   └── ui/                       # Base UI components
├── hooks/                        # Custom React hooks
├── services/                     # API service classes
├── types/                        # TypeScript definitions
└── lib/                          # Utility functions
```

## 1. UI/UX Component Inventory

### 1.1 Youth Dashboard Components

#### Primary Dashboard (`dashboard-youth.tsx`)
**Location:** `src/components/dashboard/role-specific/dashboard-youth.tsx`

**Visual Specifications:**
- **Layout:** Grid-based responsive layout with 3-column card system
- **Color Scheme:** 
  - Primary: Blue gradient (#3b82f6 to #8b5cf6)
  - Secondary: Green (#10b981), Purple (#8b5cf6), Orange (#f97316)
- **Typography:** Inter font family, responsive sizing (text-4xl to text-sm)
- **Animation:** Framer Motion with stagger animations and hover effects

**Key Features:**
- Welcome section with animated greeting
- News carousel with company/government news filtering
- Quick action cards for core functions (Jobs, Courses, Entrepreneurship)
- Statistics overview with animated counters
- Recent activity feed with timestamp formatting

**Interactive Behaviors:**
- Hover animations on cards (scale: 1.05)
- Staggered loading animations (0.1s delays)
- Auto-rotating news carousel
- Smooth transitions between sections

#### Sidebar Navigation (`role-based-sidebar-data.ts`)
**Location:** `src/components/sidebar/data/role-based-sidebar-data.ts`

**Youth-Specific Navigation Structure:**
```typescript
const youthSidebarData = {
  navGroups: [
    {
      title: "Principal",
      items: ["Dashboard", "Buscar Empleos", "Mis Postulaciones"]
    },
    {
      title: "Desarrollo", 
      items: ["Capacitación", "Emprendimiento"]
    },
    {
      title: "Recursos de Emprendimiento",
      items: ["Directorio de Instituciones", "Red de Contactos", "Mensajería"]
    },
    {
      title: "Personal",
      items: ["Mi Perfil", "CV Builder"]
    }
  ]
}
```

### 1.2 Job Management Components

#### Job Search Interface (`jobs/page.tsx`)
**Location:** `src/app/(dashboard)/jobs/page.tsx`

**Layout Specifications:**
- **Header Section:** Search bar with filters toggle
- **View Modes:** Grid (2-3 columns) and List view options
- **Filters Sidebar:** Collapsible 300px width sidebar
- **Results Area:** Responsive grid/list layout

**Search Features:**
- Real-time search with 300ms debounce
- Advanced filters: Location, Contract Type, Experience Level, Salary Range
- Sort options: Popularity, Rating, Date, Title, Duration
- Active filter chips with removal capability

#### Job Application Management (`my-applications/page.tsx`)
**Location:** `src/app/(dashboard)/my-applications/page.tsx`

**Statistics Cards:**
- Total, Sent, Under Review, Pre-selected, Rejected applications
- Color-coded status indicators:
  - Sent: Blue (#3b82f6)
  - Under Review: Orange (#f97316)
  - Pre-selected: Green (#10b981)
  - Rejected: Red (#ef4444)

**Application Details:**
- Company information display
- Application status workflow
- File management (CV, Cover Letter)
- Real-time chat integration
- Withdrawal functionality

### 1.3 Course Management Components

#### Course Catalog (`courses/page.tsx`)
**Location:** `src/app/(dashboard)/courses/page.tsx`

**Filter System:**
- Category-based filtering
- Difficulty level selection
- Free/Paid course filtering
- Mandatory course identification

**Course Card Design:**
- Thumbnail image (16:9 aspect ratio)
- Progress indicators
- Rating display (star system)
- Enrollment status badges
- Duration and lesson count

### 1.4 Profile Components

#### Youth Profile (`youth-adolescent-profile.tsx`)
**Location:** `src/components/profile/role-specific/youth-adolescent-profile.tsx`

**Section Navigation:**
- Overview, Personal Info, Education, Work Experience, Skills, Location
- Dynamic section availability based on user role
- Completion percentage tracking

**Profile Features:**
- Avatar upload functionality
- Skills selector with proficiency levels
- Location picker (Department/Municipality)
- CV generation capability

## 2. API Endpoint Documentation

### 2.1 Authentication Endpoints

#### GET `/api/auth/me`
- **Purpose:** Get current user profile
- **Response:** User object with role and profile data
- **Authentication:** Bearer token required

### 2.2 Job Management Endpoints

#### GET `/api/joboffer`
- **Purpose:** Search and filter job offers
- **Parameters:**
  ```typescript
  {
    query?: string;
    location?: string[];
    contractType?: ContractType[];
    workModality?: WorkModality[];
    experienceLevel?: ExperienceLevel[];
    salaryMin?: number;
    salaryMax?: number;
  }
  ```
- **Response:** Array of JobOffer objects

#### GET `/api/my-applications`
- **Purpose:** Get user's job applications
- **Response:** Array of JobApplication objects with nested job and company data

#### DELETE `/api/my-applications?applicationId={id}`
- **Purpose:** Withdraw job application
- **Parameters:** Application ID in query string

### 2.3 Course Endpoints

#### GET `/api/course`
- **Purpose:** Get available courses
- **Filters:** Category, level, price, mandatory status
- **Response:** Array of Course objects

#### GET `/api/course-enrollments`
- **Purpose:** Get user's course enrollments
- **Response:** Array of enrollment objects with progress data

### 2.4 Profile Management

#### GET `/api/profile`
- **Purpose:** Get user profile data
- **Response:** Complete profile object

#### POST `/api/profile/avatar`
- **Purpose:** Upload profile avatar
- **Format:** Multipart form data
- **Response:** Updated profile with avatar URL

### 2.5 File Management

#### POST `/api/files/upload/cv`
- **Purpose:** Upload CV document
- **Format:** Multipart form data (PDF)
- **Response:** File URL and metadata

#### POST `/api/files/upload/cover-letter`
- **Purpose:** Upload cover letter
- **Format:** Multipart form data (PDF)

## 3. Data Flow Analysis

### 3.1 State Management Architecture

#### React Query Integration
```typescript
// Query keys pattern
const QUERY_KEYS = {
  jobs: ['jobs'],
  applications: ['applications'],
  courses: ['courses'],
  profile: ['profile']
}

// Hook usage pattern
const { data, isLoading, error } = useQuery({
  queryKey: QUERY_KEYS.jobs,
  queryFn: () => JobOfferService.getJobOffers()
})
```

#### Authentication Flow
1. User login → JWT token storage
2. Token validation on protected routes
3. Role-based component rendering
4. Automatic token refresh handling

### 3.2 Real-time Features

#### Job Application Messaging
- WebSocket connection for real-time chat
- Message status tracking (sent/delivered/read)
- File sharing capabilities
- Company-applicant communication

#### Notification System
- Application status updates
- Course enrollment confirmations
- News article publications

### 3.3 Data Transformation Patterns

#### API Response Normalization
```typescript
const normalizeUser = (userData: any): User => ({
  id: userData.id,
  username: userData.username,
  role: mapBackendRoleToFrontend(userData.role),
  firstName: userData.firstName || userData.first_name || '',
  // ... additional field mapping
})
```

## 4. Feature Functionality Matrix

| Feature | Description | Components | API Endpoints | Priority |
|---------|-------------|------------|---------------|----------|
| **Dashboard Overview** | Main landing page with statistics and quick actions | `DashboardYouth`, `NewsCarousel` | `/api/auth/me`, `/api/news` | High |
| **Job Search** | Browse and filter job opportunities | `JobsPage`, `JobCard`, `JobSearchFilters` | `/api/joboffer` | High |
| **Job Applications** | Apply and track job applications | `MyApplicationsPage`, `JobApplicationForm` | `/api/my-applications`, `/api/jobapplication` | High |
| **Course Catalog** | Browse available courses | `CoursesPage`, `CourseCard`, `CourseFilters` | `/api/course`, `/api/course-enrollments` | High |
| **Profile Management** | User profile and CV management | `YouthAdolescentProfile`, `CVManager` | `/api/profile`, `/api/cv` | High |
| **Entrepreneurship Hub** | Business resources and tools | `EntrepreneurshipPage` | `/api/entrepreneurship` | Medium |
| **Messaging System** | Chat with employers | `MessagingInterface`, `Chat` | `/api/messages` | Medium |
| **News Center** | Latest news and updates | `NewsCarousel`, `NewsCard` | `/api/news` | Medium |
| **CV Builder** | Generate professional CV | `CVManager`, `CVTemplate` | `/api/cv/generate-for-application` | Medium |
| **Business Plan Simulator** | Create business plans | `BusinessPlanSimulator` | `/api/business-plan` | Low |
| **Networking** | Connect with other users | `NetworkingInterface` | `/api/contacts` | Low |

## 5. Business Logic Documentation

### 5.1 Role-Based Access Control

#### Youth Role Permissions (`JOVENES`)
```typescript
const YOUTH_PERMISSIONS = [
  Permission.VIEW_COURSES,
  Permission.VIEW_LESSONS, 
  Permission.VIEW_QUIZZES,
  Permission.VIEW_JOB_OFFERS
]
```

#### Youth vs Adolescent Differences
- **Youth (JOVENES):** Full access to job applications, CV building, work experience
- **Adolescents (ADOLESCENTES):** Limited job access, parental consent required, no work experience section

### 5.2 Application Status Workflow

```typescript
type ApplicationStatus = 
  | "SENT"           // Initial application
  | "UNDER_REVIEW"   // HR reviewing
  | "PRE_SELECTED"   // Shortlisted for interview
  | "REJECTED"       // Application declined
  | "HIRED"          // Successfully hired
```

### 5.3 Course Enrollment Logic

#### Enrollment Rules
- Cannot enroll in same course twice
- Mandatory courses must be completed first
- Prerequisites validation
- Progress tracking (0-100%)

#### Completion Criteria
- All lessons viewed
- Minimum quiz score (varies by course)
- Final assessment passed

### 5.4 Search and Filtering Logic

#### Job Search Algorithm
1. Text search across title, description, skills
2. Location matching (municipality/department)
3. Salary range filtering
4. Contract type and modality filtering
5. Experience level matching
6. Client-side caching for performance

## 6. Mobile Implementation Recommendations

### 6.1 Architecture Adaptations

#### Recommended Mobile Stack
- **Framework:** React Native or Flutter
- **State Management:** Redux Toolkit + RTK Query (React Native) or Bloc (Flutter)
- **Navigation:** React Navigation or Flutter Navigator
- **UI Components:** Native UI components with consistent design system
- **Local Storage:** AsyncStorage/SQLite for offline capabilities

### 6.2 API Integration Strategy

#### Direct API Usage
```typescript
// Mobile can directly call existing endpoints
const jobOfferService = {
  async getJobs(filters: JobFilters) {
    return await fetch(`${API_BASE}/joboffer`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }
}
```

#### Real-time Features
- WebSocket connections for chat functionality
- Push notifications for application updates
- Background sync for offline data

### 6.3 UI/UX Mobile Adaptations

#### Navigation Patterns
- Bottom tab navigation for main sections
- Stack navigation within each section
- Drawer navigation for settings/profile

#### Responsive Design Elements
- Touch-friendly button sizing (44px minimum)
- Swipe gestures for card interactions
- Pull-to-refresh functionality
- Infinite scroll for lists

#### Mobile-Specific Features
- Camera integration for profile photos
- File picker for CV/document uploads
- Biometric authentication support
- Offline mode for critical functions

### 6.4 Performance Considerations

#### Data Management
- Implement pagination for large lists
- Image optimization and lazy loading
- Local caching of frequently accessed data
- Background data synchronization

#### Network Optimization
- Request batching and caching
- Retry mechanisms for failed requests
- Graceful offline mode handling
- Compressed image uploads

### 6.5 Platform-Specific Recommendations

#### iOS Development
- SwiftUI for native iOS feel
- Core Data for local storage
- Push notifications via APNs
- Deep linking support

#### Android Development
- Jetpack Compose for modern UI
- Room database for local storage
- Firebase Cloud Messaging
- App shortcuts integration

## 7. Migration Priority List

### Phase 1: Core Features (High Priority)
1. **Authentication System**
   - User login/registration
   - Role-based access control
   - JWT token management

2. **Job Management**
   - Job search and filtering
   - Application submission
   - Application status tracking

3. **Profile Management**
   - User profile creation/editing
   - Basic CV functionality
   - Avatar upload

### Phase 2: Learning Features (Medium Priority)
1. **Course System**
   - Course catalog browsing
   - Enrollment management
   - Progress tracking

2. **Messaging System**
   - Real-time chat with employers
   - Message history
   - File sharing

### Phase 3: Advanced Features (Low Priority)
1. **Entrepreneurship Tools**
   - Business plan simulator
   - Resource center
   - Networking features

2. **Enhanced Features**
   - Advanced analytics
   - Social features
   - Notification system

### Implementation Timeline
- **Phase 1:** 4-6 months
- **Phase 2:** 3-4 months  
- **Phase 3:** 2-3 months
- **Testing & Deployment:** 2 months

## 8. Technical Requirements

### Minimum System Requirements
- **iOS:** iOS 13.0+ (React Native) / iOS 14.0+ (SwiftUI)
- **Android:** API 21+ (Android 5.0)
- **Storage:** 100MB minimum, 500MB recommended
- **Network:** 3G/WiFi connectivity required
- **RAM:** 2GB minimum, 4GB recommended

### Development Environment
- Node.js 18+ for API compatibility
- React Native CLI or Flutter SDK
- Xcode (iOS development)
- Android Studio (Android development)
- Git version control

### Security Considerations
- JWT token secure storage
- API rate limiting implementation
- Input validation and sanitization
- File upload security scanning
- HTTPS/TLS encryption
- Biometric authentication integration

---

**Document Version:** 1.0  
**Last Updated:** August 18, 2025  
**Prepared For:** CEMSE Mobile Development Team

This specification provides a complete technical foundation for replicating the CEMSE youth dashboard functionality in a mobile application while maintaining feature parity and user experience consistency.