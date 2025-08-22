# CONTEXT-ENGINEERED PRODUCT REQUIREMENT PROMPT

# NEWS MODULE - REACT NATIVE/EXPO IMPLEMENTATION

## SYSTEM CONTEXT LAYER

### Role Definition

You are a Senior React Native/Expo Developer with expertise in:
- React Native 0.75+ and Expo SDK 51+
- TypeScript 5.0+ advanced patterns
- React Navigation 6.x with stack/tab navigation
- React Query v5 for state management
- Expo Image and Video components
- Performance optimization for mobile
- Cross-platform UI/UX patterns

### Domain Context

CEMSE Platform News Module for YOUTH role users. The web application currently has a fully functional news system that needs to be replicated in React Native/Expo with exact feature parity for Youth users. This includes news consumption, filtering, search, and social interactions.

### Technical Environment

- **Tech Stack**: React Native 0.75+, Expo SDK 51+, TypeScript 5.0+
- **Navigation**: React Navigation 6.x (Stack + Tab Navigator)
- **State Management**: React Query v5 + Zustand 4.x
- **UI Framework**: NativeBase 3.x or Tamagui
- **Image Handling**: Expo Image with lazy loading
- **HTTP Client**: Axios 1.x with interceptors
- **Architecture**: Clean Architecture with feature-based structure

## BUSINESS CONTEXT LAYER

### Goal

Implement a complete News module in React Native/Expo that provides YOUTH users with:
1. Browse and consume news articles with rich media
2. Search and filter news by categories, tags, and date
3. Read full articles with optimized mobile reading experience
4. Share articles via native sharing capabilities
5. Bookmark articles for offline reading
6. Receive push notifications for breaking news

### Why This Matters

- Youth engagement depends on relevant, timely news consumption
- Mobile-first experience is critical for target demographic
- Offline capabilities ensure accessibility regardless of connectivity
- Performance optimization directly impacts user retention

### Success Criteria

- [ ] 100% feature parity with web version for Youth role
- [ ] News list loads in <2 seconds on 3G connection
- [ ] Smooth scrolling with lazy loading (60 FPS)
- [ ] Offline reading capability for bookmarked articles
- [ ] Push notification delivery rate >95%
- [ ] Cross-platform UI consistency (iOS/Android)

## TECHNICAL CONTEXT LAYER

### All Needed Context

#### Documentation & References

- **url**: https://docs.expo.dev/versions/latest/sdk/image/
  **why**: Optimized image loading for news thumbnails and content
- **url**: https://reactnavigation.org/docs/stack-navigator/
  **why**: Navigation patterns for news list → detail flow
- **file**: `/src/app/news/page.tsx`
  **why**: Web implementation reference for news list functionality
- **file**: `/src/components/news/news-card.tsx`
  **why**: Card component structure and props interface
- **file**: `/src/types/news.ts`
  **why**: Complete TypeScript interfaces for news data models
- **file**: `/src/app/api/news/public/route.ts`
  **why**: API endpoint specifications and response formats

#### Known Gotchas & Constraints

```typescript
// CRITICAL: API expects municipality_id for filtering
// CRITICAL: Images must be optimized for mobile bandwidth
// CRITICAL: Offline storage limited to 50MB on mobile
// WARNING: Android back button handling in detail view
// WARNING: iOS safe area insets for navigation
```

#### Existing Patterns to Follow

```typescript
// From: src/types/news.ts:1-25
// Pattern: Complete news data model
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  publishedAt: string;
  category: string;
  tags: string[];
  municipality_id?: string;
  createdAt: string;
  updatedAt: string;
}

// From: src/components/news/news-card.tsx:15-30
// Pattern: Card component props interface
interface NewsCardProps {
  article: NewsArticle;
  onPress: (articleId: string) => void;
  showSummary?: boolean;
  compact?: boolean;
}
```

## IMPLEMENTATION BLUEPRINT

### Pseudocode Approach

```typescript
function NewsModule() {
  // Navigation structure
  const NewsStack = createStackNavigator();
  
  // Screens implementation flow
  return (
    <NewsStack.Navigator>
      <NewsStack.Screen 
        name="NewsList" 
        component={NewsListScreen}
        options={newsListOptions}
      />
      <NewsStack.Screen 
        name="NewsDetail" 
        component={NewsDetailScreen}
        options={newsDetailOptions}
      />
      <NewsStack.Screen 
        name="NewsSearch" 
        component={NewsSearchScreen}
        options={newsSearchOptions}
      />
    </NewsStack.Navigator>
  );
}

function NewsListScreen() {
  // 1: Initialize state and queries
  // 2: Implement infinite scrolling with FlatList
  // 3: Add pull-to-refresh functionality
  // 4: Handle loading and error states
  // 5: Navigate to detail on item press
}

function NewsDetailScreen() {
  // 1: Fetch article details with React Query
  // 2: Render article with optimized ScrollView
  // 3: Implement share functionality
  // 4: Add bookmark toggle
  // 5: Handle back navigation
}
```

### File Structure Required

```
src/features/news/
├── components/
│   ├── NewsCard.tsx
│   ├── NewsDetail.tsx
│   ├── NewsFilters.tsx
│   ├── NewsSearch.tsx
│   └── NewsSkeleton.tsx
├── hooks/
│   ├── useNews.ts
│   ├── useNewsDetail.ts
│   ├── useNewsSearch.ts
│   └── useNewsBookmarks.ts
├── screens/
│   ├── NewsListScreen.tsx
│   ├── NewsDetailScreen.tsx
│   └── NewsSearchScreen.tsx
├── services/
│   ├── newsApi.ts
│   └── newsStorage.ts
├── types/
│   └── news.types.ts
└── navigation/
    └── NewsNavigator.tsx
```

### Task Breakdown (Ordered)

**Task 1**: Setup News Navigation Structure
- Create NewsNavigator with Stack Navigator
- Configure screen options and transitions
- Implement proper TypeScript route params
- Add tab bar integration for main news access
- **Acceptance**: Navigation flows without errors, proper screen transitions

**Task 2**: Implement NewsCard Component
- Create reusable NewsCard with exact web functionality
- Add image optimization with Expo Image
- Implement compact and full card variants
- Add press handling with proper navigation
- **Acceptance**: Cards render correctly, images load optimally, navigation works

**Task 3**: Build NewsListScreen with Infinite Scroll
- Implement FlatList with React Query infinite query
- Add pull-to-refresh functionality
- Create loading states with skeleton screens
- Implement error handling with retry mechanism
- **Acceptance**: List scrolls smoothly, loads more content, handles errors gracefully

**Task 4**: Create NewsDetailScreen
- Build article detail view with ScrollView
- Implement rich text rendering for content
- Add share functionality with React Native Share
- Create bookmark toggle with local storage
- **Acceptance**: Article content renders properly, sharing works, bookmarks persist

**Task 5**: Implement Search and Filters
- Create search screen with debounced input
- Add category and tag filtering
- Implement date range filtering
- Add recent searches persistence
- **Acceptance**: Search returns accurate results, filters work correctly

**Task 6**: Add Offline Capabilities
- Implement article caching with React Query persistence
- Create offline indicator component
- Add bookmark offline reading
- Implement sync when connection restored
- **Acceptance**: Bookmarked articles readable offline, data syncs when online

## VALIDATION FRAMEWORK

### Level 1: Syntax & Style

```bash
# TypeScript compilation
npx tsc --noEmit

# ESLint checking
npx eslint src/features/news --ext .ts,.tsx

# Prettier formatting
npx prettier --check "src/features/news/**/*.{ts,tsx}"
```

### Level 2: Unit Testing

```bash
# Component testing with Jest + React Native Testing Library
npm test src/features/news/components
npm test src/features/news/hooks
npm test src/features/news/services
```

### Level 3: Integration Testing

```bash
# Navigation testing
npm test src/features/news/navigation

# API integration testing
npm test src/features/news/services/newsApi.test.ts

# End-to-end flow testing
npm test src/features/news/e2e
```

### Level 4: Business Logic Validation

- [ ] Youth users can browse all public news articles
- [ ] Search functionality returns relevant results
- [ ] Filtering by category and tags works correctly
- [ ] Article detail view displays all content properly
- [ ] Share functionality works on both iOS and Android
- [ ] Bookmark system persists across app sessions
- [ ] Offline reading works for saved articles
- [ ] Performance meets 60 FPS requirement

## ERROR HANDLING STRATEGY

### Expected Error Cases

**Network Error**:
- Trigger: No internet connection or API unavailable
- Response: Show cached content with offline indicator
- Recovery: Auto-retry when connection restored

**Article Not Found**:
- Trigger: Navigating to deleted or invalid article ID
- Response: Show "Article not available" with back button
- Recovery: Navigate back to news list

**Image Load Failure**:
- Trigger: News image fails to load
- Response: Show fallback placeholder image
- Recovery: Retry loading on user interaction

### Fallback Strategies

**Plan A**: Real-time API data with React Query caching
**Plan B**: Cached data with stale-while-revalidate pattern
**Plan C**: Offline-first with local storage fallback

## COMPLETION CHECKLIST

- [ ] All NewsNavigator screens implemented and working
- [ ] NewsCard component matches web design exactly
- [ ] Infinite scroll news list with proper performance
- [ ] Article detail view with full functionality
- [ ] Search and filtering capabilities working
- [ ] Share functionality implemented for both platforms
- [ ] Bookmark system with offline reading
- [ ] Error handling for all identified scenarios
- [ ] Performance optimization completed (60 FPS)
- [ ] TypeScript strict mode compliance
- [ ] Unit tests covering 80%+ code coverage
- [ ] Integration tests for critical flows
- [ ] Cross-platform testing completed

## CONFIDENCE SCORE

**Implementation Confidence**: 9/10
- Clear requirements extracted from existing web implementation
- Well-defined component structure and data flow
- Proven React Native patterns and libraries
- Comprehensive error handling strategy

**One-pass Success Probability**: 85%
- Complex infinite scroll and offline capabilities may require iteration
- Cross-platform share functionality testing needed
- Performance optimization might need fine-tuning