# Subscription Management - Frontend

## Overview

The frontend subscription system provides a user interface for browsing subscription plans and managing active subscriptions. It includes:

- **Plan Selector Component**: Browse and select from available subscription plans
- **Subscription Manager Component**: View and manage active subscriptions
- **Subscriptions Page**: Main entry point combining both components with tab navigation

## Files Structure

```
apps/web/
├── lib/
│   └── api/
│       └── subscriptions.ts         # API client
├── types/
│   └── subscription.ts              # TypeScript types
└── app/
    └── subscriptions/
        ├── page.tsx                 # Main page component
        ├── page.module.css          # Page styling
        ├── README.md                # This file
        └── components/
            ├── index.ts             # Component exports
            ├── plan-selector.tsx    # Plan browsing component
            ├── plan-selector.module.css
            ├── subscription-manager.tsx  # Subscription management
            └── subscription-manager.module.css
```

## Components

### PlanSelector Component

Browse and select from available subscription plans.

**Features:**
- Display all 4 subscription plans (Free, Basic, Pro, Enterprise)
- Toggle between monthly and annual billing
- Show pricing and features for each plan
- Visual highlighting of currently selected plan
- Responsive grid layout

**Props:**
```typescript
interface PlanSelectorProps {
  onPlanSelect?: (plan: SubscriptionPlan, frequency: SubscriptionFrequency) => void;
  selectedPlan?: SubscriptionPlan;
  loading?: boolean;
}
```

**Usage:**
```tsx
<PlanSelector
  selectedPlan="pro"
  onPlanSelect={(plan, frequency) => {
    console.log(`Selected ${plan} (${frequency})`);
    // Handle plan selection
  }}
/>
```

### SubscriptionManager Component

Manage active subscriptions, upgrade/downgrade plans, and handle cancellations.

**Features:**
- Display current subscription details
- View billing status and renewal date
- Upgrade to higher plans
- Downgrade to lower plans
- Cancel subscription with reason feedback
- Real-time status updates

**Props:**
```typescript
interface SubscriptionManagerProps {
  token?: string;
  onSubscriptionUpdate?: (subscription: CurrentSubscription) => void;
}
```

**Usage:**
```tsx
<SubscriptionManager
  token={authToken}
  onSubscriptionUpdate={(subscription) => {
    console.log("Subscription updated:", subscription);
  }}
/>
```

## API Client

The subscription API client provides methods for all subscription operations:

```typescript
// Get all available plans
await subscriptionsApi.getPlans();

// Get specific plan details
await subscriptionsApi.getPlanDetails("pro");

// Get current user's subscription
await subscriptionsApi.getCurrentSubscription(token);

// Create new subscription
await subscriptionsApi.createSubscription("user", "pro", "monthly", token);

// Upgrade subscription
await subscriptionsApi.upgradeSubscription("enterprise", token);

// Downgrade subscription
await subscriptionsApi.downgradeSubscription("basic", token);

// Cancel subscription
await subscriptionsApi.cancelSubscription(subscriptionId, "Too expensive", token);
```

## Pages

### Subscriptions Page (`/subscriptions`)

Main entry point for subscription management with tabbed interface.

**Features:**
- Tab navigation between "Browse Plans" and "Manage Subscription"
- Requires authentication
- Persists current subscription state
- Responsive design

**Query Parameters:**
- `tab` (optional): `plans` or `manage` - which tab to show by default

**Examples:**
```
/subscriptions              # Shows Browse Plans tab by default
/subscriptions?tab=manage   # Shows Manage Subscription tab
```

## Types

### TypeScript Definitions

```typescript
type SubscriptionPlan = "free" | "basic" | "pro" | "enterprise";
type SubscriptionFrequency = "monthly" | "annually";
type SubscriptionStatus = "active" | "past_due" | "cancelled" | "expired" | "trialing";

interface CurrentSubscription {
  id: string;
  subscriberId: string;
  subscriberType: "user" | "company";
  plan: SubscriptionPlan;
  frequency: SubscriptionFrequency;
  billingStatus: SubscriptionStatus;
  amount: number;
  currency: string;
  autoRenew: boolean;
  stripeCurrentPeriodEnd?: string;
  createdAt: string;
  updatedAt: string;
}

interface PlanFeature {
  plan: SubscriptionPlan;
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  description: string;
  features: string[];
  jobPostingLimit: number;
  analyticsFeature: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
}
```

## Styling

All components use CSS Modules for scoped styling:

- **plan-selector.module.css**: Plan browsing UI
- **subscription-manager.module.css**: Subscription management UI
- **page.module.css**: Main page layout and tabs

### Responsive Design

Components are fully responsive:
- **Desktop**: Full-width layout with optimal spacing
- **Tablet**: Adjusted grid and font sizes
- **Mobile**: Single-column layout with touch-friendly controls

### Design System

- **Colors**: Blue (#3b82f6) for primary actions, red (#dc2626) for destructive actions
- **Spacing**: 8px base unit with multiples (8px, 16px, 24px, 32px, 40px)
- **Shadows**: Subtle shadows for depth (0 1px 3px for cards, 0 4px 12px for hover)
- **Radius**: 8px standard border radius, 12px for larger cards

## Usage Examples

### Browse Plans and Create Subscription

```tsx
import { PlanSelector } from '@/app/subscriptions/components';
import subscriptionsApi from '@/lib/api/subscriptions';

export function SubscriptionFlow() {
  const handlePlanSelect = async (plan, frequency) => {
    try {
      const response = await subscriptionsApi.createSubscription(
        'user',
        plan,
        frequency,
        authToken
      );

      if (response.success) {
        console.log('Subscription created:', response.data);
        // Redirect to confirmation or payment
      }
    } catch (error) {
      console.error('Failed to create subscription:', error);
    }
  };

  return <PlanSelector onPlanSelect={handlePlanSelect} />;
}
```

### Manage Existing Subscription

```tsx
import { SubscriptionManager } from '@/app/subscriptions/components';

export function MyAccount() {
  const handleSubscriptionUpdate = (subscription) => {
    console.log('Subscription changed:', subscription);
    // Update user context or state
  };

  return (
    <SubscriptionManager
      token={authToken}
      onSubscriptionUpdate={handleSubscriptionUpdate}
    />
  );
}
```

### Full Subscriptions Page Integration

```tsx
import SubscriptionsPage from '@/app/subscriptions/page';

// Navigate to /subscriptions
// User will see tabs for browsing plans or managing current subscription
```

## State Management

Components handle their own state using React hooks:

- **Loading states** for API calls
- **Error states** with user-friendly messages
- **Success messages** for completed actions
- **Modal dialogs** for confirmations (e.g., cancellation)

## Error Handling

Comprehensive error handling with user feedback:

```typescript
// API errors
- 400: Invalid request (invalid plan, missing fields)
- 401: Unauthorized (missing/invalid authentication)
- 404: Subscription not found
- 409: Conflict (already has active subscription)
- 500: Server error

// User-facing errors
- Loading failures with retry button
- API errors with descriptive messages
- Form validation errors
- Network timeouts
```

## Authentication

All protected operations require authentication:

1. **Token Storage**: Auth token stored in localStorage
2. **Token Passing**: Token included in API headers as `Authorization: Bearer <token>`
3. **Token Validation**: Backend verifies token and matches subscriber ID

```typescript
// Example: Getting auth token
const token = localStorage.getItem('authToken');
await subscriptionsApi.getCurrentSubscription(token);
```

## Integration with Backend

### API Endpoints Used

**Public Endpoints:**
```
GET /api/v1/subscriptions/plans
GET /api/v1/subscriptions/plans/:plan
```

**Protected Endpoints:**
```
GET /api/v1/subscriptions/current
POST /api/v1/subscriptions
POST /api/v1/subscriptions/upgrade
POST /api/v1/subscriptions/downgrade
DELETE /api/v1/subscriptions/:id
GET /api/v1/subscriptions (admin only)
```

### Response Format

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "data": object | array,
  "error": string,
  "message": string,
  "total": number,
  "page": number,
  "limit": number,
  "totalPages": number
}
```

## Features

### Current Implementation

✅ Browse subscription plans with pricing
✅ Toggle between monthly and annual billing
✅ View current subscription details
✅ Upgrade to higher plans
✅ Downgrade to lower plans
✅ Cancel subscription with reason
✅ Real-time status updates
✅ Full responsive design
✅ Error handling and loading states
✅ Tab-based navigation

### Future Enhancements

- [ ] Stripe checkout integration
- [ ] Payment method management
- [ ] Invoice history and downloads
- [ ] Subscription renewal reminders
- [ ] Coupon/discount code application
- [ ] Usage analytics dashboard
- [ ] Team member management
- [ ] Billing address management
- [ ] Email notification preferences
- [ ] Export subscription data

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

## Performance

- **Lazy Loading**: Components load only when needed
- **Code Splitting**: Subscription route code split from main bundle
- **Caching**: API responses cached where appropriate
- **Optimized Renders**: Memoized components prevent unnecessary re-renders

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management for modals
- Color contrast meets WCAG AA standards
- Screen reader friendly

## Testing

### Manual Testing Checklist

- [ ] Load plans from public endpoint
- [ ] Toggle between monthly/annual pricing
- [ ] Create subscription without auth (should show auth required)
- [ ] Get current subscription with auth
- [ ] Upgrade subscription to higher plan
- [ ] Downgrade subscription to lower plan
- [ ] Cancel subscription with confirmation modal
- [ ] View error states on API failures
- [ ] Test responsive design on mobile/tablet
- [ ] Tab navigation works correctly

### Example Test Cases

```typescript
// Test: Plan selector loads plans
const { getByText } = render(<PlanSelector />);
await waitFor(() => {
  expect(getByText("Pro")).toBeInTheDocument();
});

// Test: Frequency toggle changes displayed price
const annualButton = screen.getByText("Annually");
fireEvent.click(annualButton);
expect(screen.getByText("$990")).toBeInTheDocument();

// Test: Subscription manager shows auth required
render(<SubscriptionManager />);
expect(screen.getByText(/authentication required/i)).toBeInTheDocument();
```

## Troubleshooting

### Common Issues

**Plans Not Loading**
- Check API URL in environment variables
- Verify backend is running
- Check browser console for CORS errors

**Subscription Not Found**
- Verify user is authenticated
- Confirm token is valid
- Check that user has created a subscription

**Changes Not Reflecting**
- Clear browser cache
- Check for network errors in DevTools
- Verify backend updated subscription

### Debug Mode

Enable debug logging:

```typescript
// In api/subscriptions.ts
if (process.env.NODE_ENV === 'development') {
  console.log('API Call:', endpoint, response);
}
```

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify backend API is running
3. Check network requests in DevTools
4. Review backend logs for more details

## References

- [Backend Subscriptions Module](../api/src/modules/subscriptions/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
