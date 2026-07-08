# Subscription Module

## Overview

The Subscription module manages user and company subscription plans in the job board platform. It supports multiple subscription tiers (Free, Basic, Pro, Enterprise) with both monthly and annual billing options.

## Features

- **Multiple Subscription Tiers**: Free, Basic, Pro, Enterprise plans
- **Flexible Billing**: Monthly and annual billing frequencies
- **User & Company Subscriptions**: Support for both individual and company subscriptions
- **Plan Management**: Create, upgrade, downgrade, and cancel subscriptions
- **Feature Limits**: Job posting limits, analytics, and support tier features
- **Stripe Integration Ready**: Pre-configured fields for Stripe integration

## Architecture

```
subscription.routes.ts      - API endpoint definitions
    ↓
subscription.controller.ts  - Request handlers
    ↓
subscription.service.ts     - Business logic
    ↓
subscription.repository.ts  - Data access
    ↓
subscription.model.ts       - MongoDB schema
```

## Data Model

### Subscription Schema

```typescript
{
  subscriberId: ObjectId,          // Reference to user or company
  subscriberType: "user" | "company",
  plan: "free" | "basic" | "pro" | "enterprise",
  frequency: "monthly" | "annually",
  billingStatus: "active" | "past_due" | "cancelled" | "expired" | "trialing",
  stripeCustomerId?: string,       // For Stripe integration
  stripeSubscriptionId?: string,   // For Stripe integration
  stripeCurrentPeriodStart?: Date,
  stripeCurrentPeriodEnd?: Date,
  amount: number,                  // Price in cents
  currency: string,                // Default: "usd"
  trialStart?: Date,
  trialEnd?: Date,
  cancelledAt?: Date,
  cancelReason?: string,
  metadata?: Record<string, any>,  // Additional data
  autoRenew: boolean,              // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

### Unique Constraints

- Unique index on `(subscriberId, subscriberType)` - One active subscription per subscriber
- Unique on `stripeCustomerId` and `stripeSubscriptionId` (sparse)

## Subscription Plans

### Free Plan
- **Price**: $0/month or $0/year
- **Features**:
  - Up to 5 job postings
  - Basic analytics
  - Email support
- **Best For**: Trying out the platform

### Basic Plan
- **Price**: $29/month or $290/year (saves $58)
- **Features**:
  - Up to 20 job postings
  - Advanced analytics
  - Priority email support
  - Custom job application form
- **Best For**: Small companies

### Pro Plan
- **Price**: $99/month or $990/year (saves $198)
- **Features**:
  - Unlimited job postings
  - Advanced analytics
  - 24/7 priority support
  - Custom job application form
  - Team collaboration tools
  - API access
- **Best For**: Growing companies

### Enterprise Plan
- **Price**: Custom pricing
- **Features**:
  - Everything in Pro
  - Custom integrations
  - Dedicated account manager
  - SLA guarantee
  - White-label options
- **Best For**: Large organizations

Access plan configurations:
```
GET /api/v1/subscriptions/plans
GET /api/v1/subscriptions/plans/:plan
```

## API Endpoints

### Public Endpoints

#### Get All Plans
```
GET /api/v1/subscriptions/plans

Response:
{
  "success": true,
  "data": [
    {
      "plan": "free",
      "name": "Free",
      "monthlyPrice": 0,
      "annualPrice": 0,
      "description": "Get started with basic features",
      "features": ["Up to 5 job postings", ...],
      "jobPostingLimit": 5,
      "analyticsFeature": true,
      "prioritySupport": false,
      "customBranding": false
    },
    ...
  ]
}
```

#### Get Plan Details
```
GET /api/v1/subscriptions/plans/:plan

Response:
{
  "success": true,
  "data": {
    "plan": "pro",
    "name": "Pro",
    "monthlyPrice": 99,
    "annualPrice": 990,
    ...
  }
}
```

### Protected Endpoints (Auth Required)

#### Create Subscription
```
POST /api/v1/subscriptions
Content-Type: application/json
Authorization: Bearer <token>

Request:
{
  "subscriberType": "user",
  "plan": "pro",
  "frequency": "monthly"
}

Response:
{
  "success": true,
  "data": {
    "id": "subscription_id",
    "subscriberId": "user_id",
    "subscriberType": "user",
    "plan": "pro",
    "frequency": "monthly",
    "billingStatus": "active",
    "amount": 9900,
    "currency": "usd",
    "autoRenew": true,
    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-01-15T10:30:00Z"
  }
}
```

#### Get Current Subscription
```
GET /api/v1/subscriptions/current
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { subscription object }
}
```

#### Get Subscription by ID
```
GET /api/v1/subscriptions/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { subscription object }
}
```

#### Update Subscription
```
PUT /api/v1/subscriptions/:id
Content-Type: application/json
Authorization: Bearer <token>

Request:
{
  "frequency": "annually",
  "autoRenew": false
}

Response:
{
  "success": true,
  "data": { updated subscription object }
}
```

#### Cancel Subscription
```
DELETE /api/v1/subscriptions/:id
Content-Type: application/json
Authorization: Bearer <token>

Request:
{
  "reason": "Too expensive"
}

Response:
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "data": { cancelled subscription object }
}
```

#### Upgrade Subscription
```
POST /api/v1/subscriptions/upgrade
Content-Type: application/json
Authorization: Bearer <token>

Request:
{
  "newPlan": "pro"
}

Response:
{
  "success": true,
  "message": "Subscription upgraded successfully",
  "data": { updated subscription object }
}
```

#### Downgrade Subscription
```
POST /api/v1/subscriptions/downgrade
Content-Type: application/json
Authorization: Bearer <token>

Request:
{
  "newPlan": "basic"
}

Response:
{
  "success": true,
  "message": "Subscription downgraded successfully",
  "data": { updated subscription object }
}
```

#### List All Subscriptions (Admin)
```
GET /api/v1/subscriptions?page=1&limit=20&plan=pro&billingStatus=active&subscriberType=user
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": [ subscription objects ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

## Error Handling

### Common Error Responses

```json
{
  "success": false,
  "error": "Subscriber already has an active subscription"
}
```

**Status Codes**:
- `400` - Invalid request (invalid plan, missing required fields)
- `401` - Unauthorized (missing or invalid authentication)
- `404` - Resource not found
- `409` - Conflict (subscriber already has active subscription)
- `500` - Server error

## Query Parameters

### List Subscriptions
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Results per page
- `plan` (string) - Filter by plan (free, basic, pro, enterprise)
- `billingStatus` (string) - Filter by status (active, past_due, cancelled, expired, trialing)
- `subscriberType` (string) - Filter by type (user, company)

## Validation Rules

### Create Subscription
- `subscriberType` - Required, must be "user" or "company"
- `plan` - Required, must be valid plan (free, basic, pro, enterprise)
- `frequency` - Optional, must be "monthly" or "annually" (default: monthly)

### Update Subscription
- `plan` - Optional, must be valid plan
- `frequency` - Optional, must be "monthly" or "annually"
- `autoRenew` - Optional, must be boolean

## Integration with Stripe (Future)

The schema is pre-configured for Stripe integration:

```typescript
// When creating a subscription with Stripe
const subscription = await subscriptionService.createSubscription({
  subscriberId: userId,
  subscriberType: "user",
  plan: "pro",
  stripeCustomerId: stripeCustomer.id,
  stripeSubscriptionId: stripeSubscription.id,
});
```

### Webhook Integration Fields
- `stripeCustomerId` - For webhook lookup
- `stripeSubscriptionId` - For webhook updates
- `stripeCurrentPeriodStart` - Update on invoice.payment_succeeded
- `stripeCurrentPeriodEnd` - Update on invoice.payment_succeeded
- `billingStatus` - Sync with Stripe invoice status

## Usage Examples

### JavaScript/TypeScript

```typescript
// Get all plans
const response = await fetch('http://localhost:3001/api/v1/subscriptions/plans');
const { data: plans } = await response.json();

// Create a subscription
const response = await fetch('http://localhost:3001/api/v1/subscriptions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    subscriberType: 'user',
    plan: 'pro',
    frequency: 'monthly'
  })
});
const { data: subscription } = await response.json();

// Get current subscription
const response = await fetch('http://localhost:3001/api/v1/subscriptions/current', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { data: subscription } = await response.json();

// Upgrade subscription
const response = await fetch('http://localhost:3001/api/v1/subscriptions/upgrade', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ newPlan: 'enterprise' })
});
const { data: subscription } = await response.json();

// Cancel subscription
const response = await fetch(`http://localhost:3001/api/v1/subscriptions/${subscriptionId}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ reason: 'Too expensive' })
});
const { data: subscription } = await response.json();
```

## Business Logic

### Subscription Creation
1. Check if subscriber already has active subscription
2. Validate plan exists and pricing is available
3. Calculate amount based on plan and frequency
4. Create subscription record with `ACTIVE` status
5. Return subscription DTO

### Plan Upgrade
1. Verify subscription exists and is active
2. Validate new plan is different from current
3. Calculate new price
4. Update subscription plan and amount
5. Return updated subscription

### Plan Downgrade
1. Same as upgrade
2. Can implement charge back logic if needed

### Cancellation
1. Verify subscription is not already cancelled
2. Set status to `CANCELLED`
3. Record cancellation timestamp and reason
4. Return updated subscription

## Future Enhancements

- [ ] Stripe webhook integration
- [ ] Automatic trial subscriptions
- [ ] Coupon/discount code support
- [ ] Usage-based billing
- [ ] Invoice generation and history
- [ ] Subscription renewal reminders
- [ ] Payment failure handling
- [ ] Proration for mid-cycle changes
- [ ] Revenue reporting
- [ ] Churn analysis

## Files

- `subscription.model.ts` - Mongoose schema definition
- `subscription.dto.ts` - Data transfer objects
- `subscription.mapper.ts` - DTO mapping logic
- `subscription.repository.ts` - Database access layer
- `subscription.service.ts` - Business logic
- `subscription.controller.ts` - Request handlers
- `subscription.routes.ts` - Route definitions
- `subscription.validation.ts` - Input validation schemas

## Testing

### Manual Testing with cURL

```bash
# Get all plans
curl http://localhost:3001/api/v1/subscriptions/plans

# Get specific plan
curl http://localhost:3001/api/v1/subscriptions/plans/pro

# Create subscription (requires auth token)
curl -X POST http://localhost:3001/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "subscriberType": "user",
    "plan": "pro",
    "frequency": "monthly"
  }'

# Get current subscription
curl http://localhost:3001/api/v1/subscriptions/current \
  -H "Authorization: Bearer YOUR_TOKEN"

# Upgrade subscription
curl -X POST http://localhost:3001/api/v1/subscriptions/upgrade \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"newPlan": "enterprise"}'
```

## Support

For issues or questions, please open an issue in the repository.
