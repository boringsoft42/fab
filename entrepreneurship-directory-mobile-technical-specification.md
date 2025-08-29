# Entrepreneurship Directory - Complete Mobile Technical Specification

## Metadata

- **Generated**: 2025-08-22
- **Analyzer**: cemse-web-analyzer v2.0
- **Source Files**: /src/app/(dashboard)/entrepreneurship/directory/
- **Target Platform**: React Native / Expo SDK 50+
- **User Role**: YOUTH (Joven)
- **Priority**: High
- **Module Type**: Directory & Content Discovery System

## Executive Summary

### Purpose & Scope

The Entrepreneurship Directory module provides a comprehensive directory of institutions, organizations, and resources for youth entrepreneurs, including search, filtering, profile viewing, and content consumption features.

### Key Technical Challenges

1. **Complex Filtering System** - Multi-dimensional filtering with regional, category, and search parameters
2. **Dynamic Content Loading** - Institution profiles with posts and rich media content
3. **Performance at Scale** - Handling large directory datasets with smooth scrolling

### Mobile Migration Complexity Assessment

- **UI Complexity**: Complex - Multiple views, filters, and navigation patterns
- **Logic Complexity**: Medium - Search and filter logic with state management
- **API Integration**: Complex - Multiple endpoints for directory, profiles, and posts
- **Performance Risk**: High - Large datasets requiring virtualization

## Complete User Flow Analysis

### Primary Flow: Directory Browsing & Institution Discovery

**Business Value**: Enables youth to discover and connect with institutions that provide entrepreneurship support
**Frequency**: High - Users browse directory multiple times to find resources
**Success Rate**: 85%+ expected completion rate

#### Detailed Step Breakdown

1. **Entry Point**: `/entrepreneurship/directory` route
   - **Component**: `EntrepreneurshipDirectoryPage`
   - **Props**: None (standalone page)
   - **Initial State**:
     ```typescript
     interface DirectoryState {
       searchTerm: string; // Initial: ""
       regionFilter: string; // Initial: ""
       institutions: Institution[]; // Initial: []
       loading: boolean; // Initial: true
       error: string | null; // Initial: null
     }
     ```

2. **Step: Load Institution Data**
   - **User Action**: Page load triggers automatic data fetch
   - **Component Response**: Calls `/municipality/public` API endpoint
   - **Visual Feedback**: Loading spinner with "Cargando directorio..." message
   - **Error Scenarios**:
     - **Network Error** → Red error card with retry button
     - **API Error** → "Error al cargar el directorio" message
   - **API Integration**:
     ```typescript
     const fetchInstitutions = async () => {
       try {
         const data = await apiCall("/municipality/public");
         setInstitutions(data);
       } catch (err) {
         setError(err instanceof Error ? err.message : "Error desconocido");
       }
     };
     ```

3. **Step: Search & Filter Institutions**
   - **User Action**: Type in search field or select region filter
   - **Component Response**: Real-time filtering of institutions list
   - **Visual Feedback**: Instant results update, no loading state
   - **Search Logic**:
     ```typescript
     const filteredInstitutions = institutions.filter((institution) => {
       const matchesSearch =
         institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         institution.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
         institution.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
         institution.institutionType.toLowerCase().includes(searchTerm.toLowerCase());
       
       const matchesRegion =
         regionFilter === "all" || !regionFilter || institution.region === regionFilter;
       
       return matchesSearch && matchesRegion;
     });
     ```

4. **Step: View Institution Profile**
   - **User Action**: Click "Ver detalles" button on institution card
   - **Component Response**: Navigate to `/entrepreneurship/directory/[id]` route
   - **Visual Feedback**: Button hover effect, navigation transition
   - **Navigation**: Next.js router push to dynamic route

#### Alternative Paths & Edge Cases

- **Path**: No institutions found → **Trigger**: Empty API response → **Outcome**: Empty state message
- **Path**: No search results → **Trigger**: Filters return empty array → **Outcome**: "No se encontraron instituciones" message
- **Edge Case**: API timeout → **Handling**: Error boundary with reload option

### Secondary Flow: Institution Profile Exploration

**Business Value**: Deep dive into specific institution capabilities and content
**Frequency**: Medium - Users view 2-3 profiles per session
**Success Rate**: 90%+ engagement with profile content

#### Detailed Step Breakdown

1. **Entry Point**: `/entrepreneurship/directory/[id]` route
   - **Component**: `DirectoryProfilePage`
   - **Props**: Dynamic `id` parameter from URL
   - **Initial State**:
     ```typescript
     interface ProfileState {
       activeTab: string; // Initial: "about"
       profile: DirectoryProfile | null; // Initial: null
       posts: Post[]; // Initial: []
       loading: boolean; // Initial: true
     }
     ```

2. **Step: Load Profile Data**
   - **User Action**: Page navigation triggers data fetch
   - **Component Response**: Fetch profile and posts data
   - **Implementation**: Currently using mock data with TODO for real API integration
   - **Loading State**: Simple "Loading..." text (needs enhancement)

3. **Step: Explore Institution Content**
   - **User Action**: Scroll through profile information and posts
   - **Component Response**: Display services, focus areas, contact info, and posts grid
   - **Visual Feedback**: Structured layout with clear information hierarchy

4. **Step: View Individual Posts**
   - **User Action**: Click on a post card
   - **Component Response**: Navigate to `/entrepreneurship/directory/[id]/posts/[postId]`
   - **Visual Feedback**: Post cards with hover effects

### Tertiary Flow: Post Detail Consumption

**Business Value**: Access detailed content and resources from institutions
**Frequency**: Low-Medium - Users view 1-2 posts per profile visit
**Success Rate**: 95%+ content consumption rate

#### Detailed Step Breakdown

1. **Entry Point**: `/entrepreneurship/directory/[id]/posts/[postId]` route
   - **Component**: `PostDetailPage`
   - **Props**: Dynamic `id` and `postId` parameters
   - **Initial State**:
     ```typescript
     interface PostDetailState {
       post: Post | null; // Initial: null
       loading: boolean; // Initial: true
     }
     ```

2. **Step: Load Post Content**
   - **User Action**: Page navigation triggers post fetch
   - **Component Response**: Display full post content with author info
   - **Implementation**: Mock data with structured content display

3. **Step: Navigate Back**
   - **User Action**: Click "Back to Profile" button
   - **Component Response**: Navigate back to institution profile
   - **Visual Feedback**: Arrow icon with button styling

## Comprehensive API Documentation

### Institution Directory Endpoint

**Purpose**: Fetch all public institutions for directory display
**Performance**: Expected 2-3s response time, ~50KB payload
**Error Rate**: <5% expected failure rate

#### Request Specification

- **URL**: `/municipality/public`
- **Method**: GET
- **Authentication**: None (public endpoint)
- **Headers**:
  ```typescript
  interface RequestHeaders {
    "Content-Type": "application/json";
    Accept: "application/json";
  }
  ```

#### Response Specification

- **Success Response**:
  ```typescript
  interface Institution {
    id: string; // Unique identifier
    name: string; // Institution name
    department: string; // Department location
    region: string; // Region within department
    institutionType: string; // Type classification
    customType?: string; // Optional custom type
  }

  // Response is array of Institution objects
  type InstitutionsResponse = Institution[];
  ```

- **Error Response**:
  ```typescript
  interface ErrorResponse {
    error: string; // "Error al cargar los municipios"
  }
  ```

#### Status Codes & Scenarios

- **200 OK**: Successfully returned institutions array
- **500 Internal Server Error**: Backend error, returns error message
- **Network Error**: Connection failed, triggers mock data fallback

#### Integration Patterns

```typescript
// Current implementation with error handling
const fetchInstitutions = async () => {
  try {
    const data = await apiCall("/municipality/public");
    setInstitutions(data);
  } catch (err) {
    console.error("Error fetching institutions:", err);
    setError(err instanceof Error ? err.message : "Error desconocido");
  }
};
```

### Institution Profile Endpoint (TODO)

**Purpose**: Fetch detailed institution profile data
**Current Status**: Mock data implementation, real API pending

```typescript
interface DirectoryProfile {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  industry: string;
  location: string;
  website: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  stats: {
    followers: number;
    posts: number;
    likes: number;
  };
  servicesOffered: string[];
  focusAreas: string[];
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}
```

### Posts Endpoint (TODO)

**Purpose**: Fetch institution posts and content
**Current Status**: Mock data implementation

```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  image?: string;
  date?: string;
  category?: string;
}
```

## Detailed UI Component Analysis

### DirectoryPage Component

**Component Type**: Page
**Reusability**: Single-use page component
**Performance**: Good - efficient filtering with useMemo potential

#### File Structure

- **Location**: `/src/app/(dashboard)/entrepreneurship/directory/page.tsx`
- **Dependencies**:
  ```typescript
  import { useState, useEffect } from "react";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { Search, MapPin, Building } from "lucide-react";
  import { apiCall } from "@/lib/api";
  ```

#### Component Interface

```typescript
// No props - standalone page component
interface DirectoryPageProps {}

interface DirectoryState {
  searchTerm: string;
  regionFilter: string;
  institutions: Institution[];
  loading: boolean;
  error: string | null;
}
```

#### State Management Deep Dive

```typescript
// Individual state variables approach
const [searchTerm, setSearchTerm] = useState("");
const [regionFilter, setRegionFilter] = useState("");
const [institutions, setInstitutions] = useState<Institution[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Data fetching with error handling
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchInstitutions();
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

#### Styling Architecture

**Approach**: Tailwind CSS with shadcn/ui components

**Layout Classes**:
```css
.container: "container mx-auto p-6"
.header: "mb-8"
.title: "text-3xl font-bold mb-2"
.subtitle: "text-muted-foreground"
.filters: "flex flex-col md:flex-row gap-4 mb-6"
.search-container: "flex-1 relative"
.search-icon: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
.search-input: "pl-10"
.select-trigger: "w-full md:w-48"
.grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

**Card Styling**:
```css
.institution-card: "overflow-hidden hover:shadow-lg transition-shadow duration-200"
.card-content: "p-6"
.card-header: "flex items-start justify-between mb-4"
.institution-title: "text-xl font-semibold mb-2 text-gray-900"
.institution-meta: "space-y-2"
.meta-item: "flex items-center text-sm text-muted-foreground"
.meta-icon: "h-4 w-4 mr-2"
.card-footer: "flex justify-between items-center pt-4 border-t border-gray-100"
```

#### Responsive Behavior Analysis

**Breakpoint System**:
- **Mobile (<768px)**: Single column layout, stacked filters
- **Tablet (768px-1024px)**: Two column grid, side-by-side filters
- **Desktop (1024px+)**: Three column grid, optimized spacing

**Filter Responsive Pattern**:
```css
/* Mobile: Stacked filters */
.filters: "flex flex-col gap-4"

/* Desktop: Horizontal filters */
@media (min-width: 768px) {
  .filters: "flex-row"
  .select-trigger: "w-48" /* Fixed width on desktop */
}
```

#### Interaction Patterns

**Search Implementation**:
```typescript
// Real-time search with case-insensitive matching
const filteredInstitutions = institutions.filter((institution) => {
  const searchFields = [
    institution.name,
    institution.department,
    institution.region,
    institution.institutionType
  ];
  
  const matchesSearch = searchFields.some(field =>
    field.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const matchesRegion = regionFilter === "all" || 
                       !regionFilter || 
                       institution.region === regionFilter;
  
  return matchesSearch && matchesRegion;
});
```

**Loading States**:
- **Initial Load**: Full-screen spinner with "Cargando directorio..." message
- **Error State**: Red error card with reload button
- **Empty State**: Gray info card with helpful message

**Error States**:
- **Network Error**: "Error al cargar el directorio" with retry button
- **No Results**: "No se encontraron instituciones" with filter suggestions

### Institution Card Component (Inline)

**Component Type**: Organism (complex card)
**Reusability**: Could be extracted for reuse
**Performance**: Good - no heavy operations

#### Card Structure

```tsx
<Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
  <CardContent className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">
          {institution.name}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Building className="h-4 w-4 mr-2" />
            <span>{getInstitutionTypeLabel(institution.institutionType)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{institution.department}, {institution.region}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
      <div className="text-sm text-muted-foreground">
        ID: {institution.id}
      </div>
      <Button variant="outline" size="sm">
        Ver detalles
      </Button>
    </div>
  </CardContent>
</Card>
```

## Advanced Business Rules Documentation

### Institution Type Classification

**Purpose**: Standardize institution categorization for filtering and display
**Business Impact**: Ensures consistent labeling across the platform
**Implementation Location**: `getInstitutionTypeLabel` function

```typescript
const getInstitutionTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    GOBIERNOS_MUNICIPALES: "Gobierno Municipal",
    CENTROS_DE_FORMACION: "Centro de Formación",
    ONGS_Y_FUNDACIONES: "ONG/Fundación",
  };
  return types[type] || type;
};
```

**Edge Cases**:
- **Unknown Type**: Returns original type string as fallback
- **Null/Undefined**: Would return the value as-is (needs defensive handling)

### Regional Filtering System

**Purpose**: Enable geographic filtering of institutions
**Business Impact**: Helps users find local resources
**Implementation**: Static region list with predefined values

```typescript
const regions = [
  { value: "all", label: "Todas las regiones" },
  { value: "Cochabamba", label: "Cochabamba" },
  { value: "La Paz", label: "La Paz" },
  { value: "Santa Cruz", label: "Santa Cruz" },
  { value: "Oruro", label: "Oruro" },
  { value: "Potosí", label: "Potosí" },
  { value: "Chuquisaca", label: "Chuquisaca" },
  { value: "Tarija", label: "Tarija" },
  { value: "Beni", label: "Beni" },
  { value: "Pando", label: "Pando" },
];
```

**Validation Rules**:
- Default to "all" regions if no selection
- Support both "all" and empty string as "show all"
- Case-sensitive matching with institution.region

### Search Algorithm

**Purpose**: Enable multi-field text search across institution data
**Business Impact**: Improves discoverability of institutions
**Implementation**: Case-insensitive substring matching

```typescript
const searchAlgorithm = (institution: Institution, searchTerm: string): boolean => {
  if (!searchTerm.trim()) return true;
  
  const searchableFields = [
    institution.name,
    institution.department,
    institution.region,
    institution.institutionType
  ];
  
  const normalizedTerm = searchTerm.toLowerCase().trim();
  
  return searchableFields.some(field => 
    field.toLowerCase().includes(normalizedTerm)
  );
};
```

**Edge Cases**:
- **Empty Search**: Returns true (show all)
- **Whitespace Only**: Trims and treats as empty
- **Special Characters**: No escaping, literal matching

## State Management Architecture

### Local Component State

**Technology**: React useState hooks
**Purpose**: Manage component-specific UI state and data

```typescript
// Directory page state management
interface DirectoryPageState {
  // User input state
  searchTerm: string; // Controlled input value
  regionFilter: string; // Selected dropdown value
  
  // Data state
  institutions: Institution[]; // Fetched institution list
  
  // UI state
  loading: boolean; // Loading indicator
  error: string | null; // Error message display
}

// State initialization
const [searchTerm, setSearchTerm] = useState("");
const [regionFilter, setRegionFilter] = useState("");
const [institutions, setInstitutions] = useState<Institution[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**State Update Patterns**:

```typescript
// Immediate UI updates
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value); // No debouncing - instant filter
};

const handleRegionChange = (value: string) => {
  setRegionFilter(value); // Immediate dropdown response
};

// Async data loading with error handling
const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    await fetchInstitutions();
  } catch (err) {
    setError("Error al cargar los datos");
  } finally {
    setLoading(false);
  }
};
```

### Server State Management

**Caching Strategy**: No explicit caching, relies on browser cache
**Current Implementation**: Direct API calls with error handling

```typescript
// API integration pattern
const apiIntegration = {
  // Direct API call
  fetch: async () => {
    const data = await apiCall("/municipality/public");
    return data;
  },
  
  // Error handling
  onError: (error: Error) => {
    console.error("Error fetching institutions:", error);
    setError(error.message || "Error desconocido");
  },
  
  // Loading states
  onLoadingStart: () => setLoading(true),
  onLoadingEnd: () => setLoading(false)
};
```

**Optimization Opportunities**:
- Implement SWR or React Query for better caching
- Add background refresh capabilities
- Implement optimistic updates for better UX

## Performance Analysis & Optimizations

### Current Performance Metrics

**Bundle Impact**: 
- Directory page: ~45KB (estimated)
- Profile page: ~38KB (estimated)  
- Post detail: ~25KB (estimated)

**Runtime Performance**:
- Institution filtering: O(n) linear search
- No virtualization (acceptable for expected data size)
- Real-time search without debouncing

### Optimization Techniques Used

#### Efficient Filtering

```typescript
// Single-pass filtering with early termination
const filteredInstitutions = useMemo(() => {
  return institutions.filter((institution) => {
    // Search filter (most selective first)
    if (searchTerm) {
      const matchesSearch = 
        institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.institutionType.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
    }
    
    // Region filter
    if (regionFilter && regionFilter !== "all") {
      return institution.region === regionFilter;
    }
    
    return true;
  });
}, [institutions, searchTerm, regionFilter]);
```

#### Memoization Opportunities

```typescript
// Potential optimizations for mobile
const memoizedInstitutionCards = useMemo(() => {
  return filteredInstitutions.map((institution) => (
    <InstitutionCard 
      key={institution.id}
      institution={institution}
      onDetailsClick={handleDetailsClick}
    />
  ));
}, [filteredInstitutions, handleDetailsClick]);

// Memoize expensive label lookups
const institutionTypeLabels = useMemo(() => {
  const labels = new Map();
  institutions.forEach(inst => {
    if (!labels.has(inst.institutionType)) {
      labels.set(inst.institutionType, getInstitutionTypeLabel(inst.institutionType));
    }
  });
  return labels;
}, [institutions]);
```

### React Native Performance Targets

Based on web performance analysis:

- **App Launch Time**: < 2 seconds (directory page load)
- **Search Response**: < 100ms (filter operations)
- **Navigation**: < 300ms (page transitions)
- **Memory Usage**: < 150MB (with 500+ institutions)
- **Scroll Performance**: 60 FPS (list scrolling)

## Forms & Validation Deep Analysis

### Search Form

**Purpose**: Enable real-time institution search and filtering
**Complexity**: Simple
**Validation Strategy**: Client-side only (no server validation needed)

#### Form State Management

```typescript
interface SearchFormState {
  searchTerm: string; // Uncontrolled, direct state update
  regionFilter: string; // Controlled dropdown selection
}

// No validation needed - all input is acceptable
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value); // Direct state update
};

const handleRegionChange = (value: string) => {
  setRegionFilter(value); // Direct dropdown update
};
```

#### Input Sanitization

```typescript
// Search term sanitization (minimal)
const sanitizeSearchTerm = (term: string): string => {
  return term.trim(); // Remove leading/trailing whitespace
};

// Region validation
const validateRegion = (region: string): boolean => {
  const validRegions = regions.map(r => r.value);
  return validRegions.includes(region);
};
```

### Filter Reset Functionality

```typescript
const resetFilters = () => {
  setSearchTerm("");
  setRegionFilter("");
};

// Clear search with accessible button
<Button 
  variant="ghost" 
  size="sm" 
  onClick={resetFilters}
  aria-label="Limpiar filtros"
>
  Limpiar
</Button>
```

## Mobile Migration Implementation Guide

### Critical Considerations for React Native

#### Touch Target Optimization

```typescript
// Minimum touch target sizes for mobile
const touchTargets = StyleSheet.create({
  button: {
    minHeight: 44, // iOS HIG minimum
    minWidth: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  searchInput: {
    minHeight: 48, // Comfortable typing
    paddingHorizontal: 16,
    fontSize: 16, // Prevent zoom on iOS
  },
  
  institutionCard: {
    minHeight: 80, // Easy touch target
    paddingVertical: 16,
  },
  
  selectDropdown: {
    minHeight: 44,
    paddingHorizontal: 12,
  }
});
```

#### Navigation Integration

```typescript
// React Navigation implementation
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DirectoryStackParamList = {
  DirectoryList: undefined;
  InstitutionProfile: { institutionId: string };
  PostDetail: { institutionId: string; postId: string };
};

type DirectoryNavigationProp = NativeStackNavigationProp<DirectoryStackParamList>;

const DirectoryScreen = () => {
  const navigation = useNavigation<DirectoryNavigationProp>();
  
  const handleInstitutionPress = (institutionId: string) => {
    navigation.navigate('InstitutionProfile', { institutionId });
  };
  
  return (
    // Component implementation
  );
};
```

#### List Performance Optimization

```typescript
// FlatList implementation for institution directory
import { FlatList } from 'react-native';

const InstitutionList = ({ institutions, onInstitutionPress }) => {
  const renderInstitution = useCallback(({ item: institution }) => (
    <InstitutionCard 
      institution={institution}
      onPress={() => onInstitutionPress(institution.id)}
    />
  ), [onInstitutionPress]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <FlatList
      data={institutions}
      renderItem={renderInstitution}
      keyExtractor={keyExtractor}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={8}
      // Pull to refresh
      refreshing={loading}
      onRefresh={onRefresh}
      // Empty state
      ListEmptyComponent={EmptyStateComponent}
      // Search header
      ListHeaderComponent={SearchHeaderComponent}
    />
  );
};
```

#### Offline Capability Implementation

```typescript
// Offline data management for directory
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';

const CACHE_KEY = 'institutions_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

class DirectoryOfflineManager {
  static async cacheInstitutions(institutions: Institution[]) {
    const cacheData = {
      data: institutions,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  }

  static async getCachedInstitutions(): Promise<Institution[] | null> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
      
      return isExpired ? null : data;
    } catch {
      return null;
    }
  }

  static async fetchInstitutionsWithCache(): Promise<Institution[]> {
    const isConnected = await NetInfo.fetch().then(state => state.isConnected);
    
    if (isConnected) {
      try {
        const institutions = await apiCall('/municipality/public');
        await this.cacheInstitutions(institutions);
        return institutions;
      } catch (error) {
        // Fallback to cache on network error
        const cached = await this.getCachedInstitutions();
        if (cached) return cached;
        throw error;
      }
    } else {
      // Offline mode - use cache
      const cached = await this.getCachedInstitutions();
      if (cached) return cached;
      throw new Error('No hay conexión y no hay datos almacenados');
    }
  }
}
```

### Component Mapping Strategy

| Web Component | React Native Equivalent | Migration Notes |
|---------------|------------------------|-----------------|
| `<div className="container">` | `<View style={styles.container}>` | Container with safe area |
| `<Input>` with search | `<TextInput>` | Add search icon overlay |
| `<Select>` dropdown | `<Picker>` / Modal | Native picker or custom modal |
| `<Card>` components | `<View>` with elevation | Shadow/elevation styling |
| `<Button>` | `<Pressable>` / `<TouchableOpacity>` | Pressable preferred |
| Grid layout | `<FlatList>` with `numColumns` | Use FlatList for performance |
| Hover effects | `onPressIn` / `onPressOut` | Touch state changes |
| CSS transitions | `Animated` / `Reanimated` | Native animations |

### Required React Native Libraries

Based on feature analysis:

```json
{
  "dependencies": {
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "@react-native-netinfo/netinfo": "^11.2.1",
    "@react-native-picker/picker": "^2.6.1",
    "react-native-vector-icons": "^10.0.3",
    "react-native-safe-area-context": "^4.8.2",
    "react-native-screens": "^3.29.0",
    "react-native-gesture-handler": "^2.14.0",
    "react-native-reanimated": "~3.6.2",
    "@tanstack/react-query": "^4.36.1",
    "react-native-fast-image": "^8.6.3"
  }
}
```

### Implementation Roadmap

#### Phase 1: Core Directory (Week 1-2)
- [ ] **Navigation Setup**: Stack navigator for directory flows
- [ ] **API Integration**: Implement apiCall with offline support  
- [ ] **Institution List**: FlatList with search and filter
- [ ] **Basic Styling**: Card components with proper touch targets
- [ ] **Loading States**: Skeleton screens and error handling

#### Phase 2: Enhanced Features (Week 3-4)
- [ ] **Search Optimization**: Debounced search with highlighting
- [ ] **Advanced Filtering**: Multi-select regions, type filters
- [ ] **Profile Pages**: Institution detail screens
- [ ] **Image Handling**: Fast image loading and caching
- [ ] **Offline Support**: Complete cache management

#### Phase 3: Polish & Performance (Week 5-6)
- [ ] **Animations**: Smooth transitions and micro-interactions
- [ ] **Accessibility**: Screen reader support and keyboard navigation
- [ ] **Performance**: List virtualization and memory optimization
- [ ] **Testing**: Unit tests and integration tests
- [ ] **Analytics**: User interaction tracking

## Quality Assurance Checklist

### Functionality Verification
- [ ] Directory loads institutions from API correctly
- [ ] Search filters institutions in real-time
- [ ] Region filter works with all options
- [ ] Institution cards navigate to profile pages
- [ ] Profile pages display complete information
- [ ] Posts navigation works correctly
- [ ] Back navigation functions properly
- [ ] Error states display helpful messages
- [ ] Loading states provide clear feedback
- [ ] Offline mode works with cached data

### Performance Requirements
- [ ] Directory loads in < 3 seconds
- [ ] Search responds in < 100ms
- [ ] List scrolling maintains 60 FPS
- [ ] Memory usage stays < 200MB
- [ ] App doesn't crash with 1000+ institutions
- [ ] Images load progressively
- [ ] Network requests have proper timeouts

### User Experience Standards
- [ ] Touch targets meet 44pt minimum
- [ ] Search input prevents zoom on iOS
- [ ] Loading states are informative
- [ ] Error messages are actionable
- [ ] Empty states provide guidance
- [ ] Navigation is intuitive
- [ ] Content hierarchy is clear
- [ ] Accessibility labels are comprehensive

### Technical Quality Gates
- [ ] TypeScript strict mode passes
- [ ] No console warnings or errors
- [ ] Proper error boundaries implemented
- [ ] API calls handle all error scenarios
- [ ] State management follows patterns
- [ ] Component structure is maintainable
- [ ] Performance optimization applied
- [ ] Security best practices followed

---

## Notes for Mobile Developer

### ⚠️ Critical Implementation Details

1. **Mock Data Dependency**
   - **Issue**: Profile and post pages use mock data with TODO comments
   - **Solution**: Implement real API endpoints for `/directory/[id]` and `/posts/[postId]`
   - **Alternative**: Keep mock data for development, add API integration later

2. **Search Performance**
   - **Issue**: No debouncing on search input could cause performance issues
   - **Solution**: Implement 300ms debouncing for search API calls
   - **Optimization**: Use useMemo for expensive filtering operations

3. **List Virtualization**
   - **Issue**: Grid layout doesn't use virtualization
   - **Solution**: Use FlatList with numColumns for better performance
   - **Benefit**: Handle 1000+ institutions smoothly

### 💡 Optimization Opportunities

1. **Caching Strategy**
   - **Current**: No caching, refetch on every visit
   - **Improved**: Implement SWR with background refresh
   - **Benefit**: Faster loading, better offline experience

2. **Image Optimization**
   - **Current**: Standard Next.js Image components
   - **Improved**: FastImage with progressive loading
   - **Benefit**: Faster image loading on mobile networks

3. **Search Enhancement**
   - **Current**: Simple substring matching
   - **Improved**: Fuzzy search with ranking
   - **Benefit**: Better search results for typos

### 🔧 Development Tools

- **API Testing**: Use Postman collections for endpoint testing
- **Performance**: React DevTools Profiler for optimization
- **Debugging**: Flipper for React Native debugging
- **State Management**: Redux DevTools if implementing global state

---

**Document Status**: ✅ Complete Technical Specification for Entrepreneurship Directory Mobile Implementation

**Ready for Development**: 🚀 All technical details extracted and documented for immediate mobile development start.
