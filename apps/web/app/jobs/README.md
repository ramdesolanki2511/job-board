# RemoteLaunch - Jobs Listing Page

## Overview

The Jobs Listing Page is a complete Next.js implementation for browsing and filtering remote job listings. It provides a user-friendly interface with advanced filtering capabilities, pagination, and responsive design.

## Features

- **Job Search**: Search jobs by title, skills, and description
- **Advanced Filtering**:
  - Remote Type (Remote, Hybrid, Onsite)
  - Employment Type (Full Time, Part Time, Contract, Internship, Freelance)
  - Experience Level (Fresher, Junior, Mid, Senior, Lead)
  - Sort Options (Latest, Oldest)
- **Pagination**: Navigate through job listings with intelligent page number generation
- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **Real-time URL State**: All filter state is reflected in URL query parameters for shareable links

## Project Structure

```
apps/web/
├── app/
│   ├── jobs/
│   │   ├── page.tsx              # Main jobs listing page (client component)
│   │   ├── page.module.css        # Page styling
│   │   └── components/
│   │       ├── job-card.tsx       # Individual job card display
│   │       ├── job-card.module.css
│   │       ├── job-filters.tsx    # Filter controls
│   │       ├── job-filters.module.css
│   │       ├── pagination.tsx     # Pagination controls
│   │       ├── pagination.module.css
│   │       └── index.ts           # Component exports
│   ├── layout.tsx                 # Root layout with navigation
│   └── globals.css
├── lib/
│   └── api/
│       └── jobs.ts               # API client for job endpoints
├── .env.local                     # Environment configuration
└── package.json
```

## Component Details

### JobFilters Component

Interactive filter UI with:
- Search input for job queries
- Dropdown selectors for remote type, employment type, experience level
- Sort options (latest/oldest)
- Clear Filters button
- URL-based state management using Next.js `useRouter` and `useSearchParams`

**Props:**
```typescript
interface JobFiltersProps {
  onFilterChange?: (filters: FilterValues) => void;
}
```

### JobCard Component

Displays individual job listing with:
- Job title and company name
- Short description (clamped to 2 lines)
- Tags (remote type color-coded)
- Location and salary information
- Published date
- Save button with heart icon
- Link to job detail page

**Props:**
```typescript
interface JobCardProps {
  job: Job;
  onSave?: (job: Job) => void;
}
```

### Pagination Component

Smart pagination with:
- Previous/Next buttons
- Page number buttons with ellipsis for large result sets
- Job count display
- Smooth scroll to top on page change
- Disabled state for edge pages

**Props:**
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
}
```

## API Integration

The jobs listing uses the typed API client (`lib/api/jobs.ts`) with the following endpoints:

### List Jobs
```typescript
const response = await jobsApi.listJobs({
  page: 1,
  limit: 20,
  search?: "typescript",
  remoteType?: "Remote",
  employmentType?: "Full Time",
  experienceLevel?: "Senior",
  sort?: "latest"
});
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    jobs: Job[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Environment Setup

### Prerequisites
- Node.js 18+
- Backend API running on `http://localhost:3001/api/v1`
- MongoDB instance (for backend)

### Configuration

Create or update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

For production:
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The jobs page will be available at `http://localhost:3000/jobs`

## URL Query Parameters

The page uses URL query parameters to maintain filter state:

```
/jobs?search=typescript&remoteType=Remote&employmentType=Full%20Time&experienceLevel=Senior&sort=latest&page=1&limit=20
```

**Supported Parameters:**
- `search` - Job search query
- `remoteType` - Filter by location type
- `employmentType` - Filter by employment type
- `experienceLevel` - Filter by experience level
- `sort` - Sort order (latest/oldest)
- `page` - Current page number (default: 1)
- `limit` - Results per page (default: 20)

## Styling

All components use CSS Modules for scoped styling:
- **job-card.module.css** - Card layout, tags, hover effects
- **job-filters.module.css** - Filter form grid, inputs, responsive layout
- **pagination.module.css** - Pagination controls, active states
- **page.module.css** - Page layout, grid, loading/error states

### Responsive Breakpoints
- **1024px**: Tablet layout adjustments
- **640px**: Mobile layout with single-column grid

## Features to Implement

- [ ] **Save Jobs**: Integrate with saved-jobs API endpoint
- [ ] **Job Detail Page**: Create `/jobs/[slug]` page
- [ ] **Authentication**: User login for save functionality
- [ ] **Favorites Page**: Display saved jobs
- [ ] **Email Notifications**: Subscribe to job alerts
- [ ] **Job Recommendations**: AI-powered job suggestions
- [ ] **Analytics**: Track popular searches and views

## Performance Considerations

- **Pagination**: Limits requests to 20 items per page by default
- **Lazy Loading**: Consider implementing image lazy loading for job images
- **Caching**: Can implement SWR or React Query for API response caching
- **Debouncing**: Search input is already optimized, consider debouncing for production

## Accessibility

- Semantic HTML structure
- ARIA labels on form controls
- Keyboard navigation support
- Color contrast meets WCAG standards
- Responsive text sizing

## Known Issues & Future Improvements

- [ ] Add loading state for individual filter changes
- [ ] Implement infinite scroll alternative to pagination
- [ ] Add advanced search builder
- [ ] Implement saved searches
- [ ] Add company filters and job category filters
- [ ] Salary range slider filter

## Related Documentation

- [Backend Jobs API](../api/README.md)
- [Saved Jobs Module](../api/src/modules/saved-jobs/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
