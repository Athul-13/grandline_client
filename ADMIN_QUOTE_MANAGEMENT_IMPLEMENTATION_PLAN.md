## Admin Quote Management Endpoints

### 1. Get Admin Quotes List

**Endpoint:** `GET /api/v1/admin/quotes`

**Description:** Get all quotes with filtering, sorting, pagination, and search capabilities. Returns quotes with user information.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 20 | Items per page (max 100) |
| `status` | string[] | No | - | Filter by quote status(es). Can be multiple: `?status=draft&status=submitted` |
| `includeDeleted` | boolean | No | false | Include soft-deleted quotes (`true` or `1`) |
| `search` | string | No | - | Search keyword (searches quoteId, tripName, eventType, customEventType, user fullName, user email) |
| `sortBy` | string | No | createdAt | Sort field: `createdAt`, `updatedAt`, `status`, `totalPrice`, `tripName` |
| `sortOrder` | string | No | desc | Sort order: `asc` or `desc` |

**Query Parameter Examples:**
```
GET /api/v1/admin/quotes?page=1&limit=20
GET /api/v1/admin/quotes?status=submitted&status=draft&page=2
GET /api/v1/admin/quotes?search=john&includeDeleted=true
GET /api/v1/admin/quotes?sortBy=createdAt&sortOrder=desc&page=1&limit=50
```

**Response Body Example:**
```json
{
  "success": true,
  "quotes": [
    {
      "quoteId": "550e8400-e29b-41d4-a716-446655440000",
      "tripName": "Summer Vacation Trip",
      "tripType": "two_way",
      "status": "submitted",
      "currentStep": 5,
      "totalPrice": 15000.50,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "user": {
        "userId": "user-123",
        "fullName": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+1234567890"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Error Response Example:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 2. Get Admin Quote Details

**Endpoint:** `GET /api/v1/admin/quotes/:id`

**Description:** Get detailed quote information including itinerary, passengers, and user details.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Quote ID |

**Response Body Example:**
```json
{
  "success": true,
  "quoteId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "tripType": "two_way",
  "tripName": "Summer Vacation Trip",
  "eventType": "wedding",
  "customEventType": null,
  "passengerCount": 25,
  "status": "submitted",
  "currentStep": 5,
  "selectedVehicles": [
    {
      "vehicleId": "vehicle-456",
      "quantity": 1
    }
  ],
  "selectedAmenities": ["amenity-789"],
  "pricing": {
    "fuelPriceAtTime": 95.50,
    "averageDriverRateAtTime": 500.00,
    "taxPercentageAtTime": 18.0,
    "baseFare": 8000.00,
    "distanceFare": 2500.00,
    "driverCharge": 3000.00,
    "fuelMaintenance": 0,
    "nightCharge": 500.00,
    "amenitiesTotal": 1000.00,
    "subtotal": 15000.00,
    "tax": 2700.00,
    "total": 17700.00
  },
  "routeData": {
    "outbound": {
      "totalDistance": 250.5,
      "totalDuration": 4.5,
      "routeGeometry": "{...}"
    },
    "return": {
      "totalDistance": 250.5,
      "totalDuration": 4.5,
      "routeGeometry": "{...}"
    }
  },
  "itinerary": {
    "outbound": [
      {
        "locationName": "Hotel Grand",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "arrivalTime": "2024-02-01T08:00:00.000Z",
        "departureTime": "2024-02-01T09:00:00.000Z",
        "isDriverStaying": false,
        "stayingDuration": null,
        "stopType": "pickup"
      }
    ],
    "return": [
      {
        "locationName": "Hotel Grand",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "arrivalTime": "2024-02-03T18:00:00.000Z",
        "departureTime": null,
        "isDriverStaying": false,
        "stayingDuration": null,
        "stopType": "dropoff"
      }
    ]
  },
  "passengers": [
    {
      "fullName": "John Doe",
      "phoneNumber": "+1234567890",
      "age": 35
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z",
  "user": {
    "userId": "user-123",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890"
  }
}
```

**Error Response Example:**
```json
{
  "success": false,
  "message": "Quote not found"
}
```

---

### 3. Update Quote Status

**Endpoint:** `PUT /api/v1/admin/quotes/:id/status`

**Description:** Update quote status. Admin can only change status to `PAID` or back to `SUBMITTED`.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Quote ID |

**Request Body:**
```json
{
  "status": "paid"
}
```

**Request Body Validation:**
- `status` must be one of: `"paid"` or `"submitted"`
- `status` is required

**Response Body Example:**
```json
{
  "success": true,
  "quoteId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "tripType": "two_way",
  "tripName": "Summer Vacation Trip",
  "status": "paid",
  "currentStep": 5,
  "pricing": {
    "total": 17700.00
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

**Error Response Examples:**

Invalid status transition:
```json
{
  "success": false,
  "message": "Can only change status to SUBMITTED from PAID status"
}
```

Quote already paid:
```json
{
  "success": false,
  "message": "Quote is already marked as paid"
}
```

---

## Admin Pricing Config Management Endpoints

### 1. Get Active Pricing Config

**Endpoint:** `GET /api/v1/admin/pricing-config`

**Description:** Get the currently active pricing configuration.

**Response Body Example:**
```json
{
  "success": true,
  "pricingConfigId": "config-123",
  "version": 3,
  "fuelPrice": 95.50,
  "averageDriverPerHourRate": 500.00,
  "taxPercentage": 18.0,
  "nightChargePerNight": 200.00,
  "isActive": true,
  "createdBy": "admin-user-id",
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-10T08:00:00.000Z"
}
```

**Error Response Example:**
```json
{
  "success": false,
  "message": "No active pricing configuration found"
}
```

---

### 2. Create Pricing Config

**Endpoint:** `POST /api/v1/admin/pricing-config`

**Description:** Create a new pricing configuration version. The version number is auto-incremented. New configs are created with `isActive: false` and must be activated separately.

**Request Body:**
```json
{
  "fuelPrice": 95.50,
  "averageDriverPerHourRate": 500.00,
  "taxPercentage": 18.0,
  "nightChargePerNight": 200.00
}
```

**Request Body Validation:**
- `fuelPrice`: number, min: 0, required
- `averageDriverPerHourRate`: number, min: 0, required
- `taxPercentage`: number, min: 0, max: 100, required
- `nightChargePerNight`: number, min: 0, required

**Response Body Example:**
```json
{
  "success": true,
  "pricingConfigId": "config-456",
  "version": 4,
  "fuelPrice": 95.50,
  "averageDriverPerHourRate": 500.00,
  "taxPercentage": 18.0,
  "nightChargePerNight": 200.00,
  "isActive": false,
  "createdBy": "admin-user-id",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:00:00.000Z"
}
```

**Error Response Examples:**

Validation error:
```json
{
  "success": false,
  "message": "Tax percentage must be between 0 and 100"
}
```

---

### 3. Get Pricing Config History

**Endpoint:** `GET /api/v1/admin/pricing-config/history`

**Description:** Get all pricing configuration versions ordered by version (newest first).

**Response Body Example:**
```json
{
  "success": true,
  "pricingConfigs": [
    {
      "pricingConfigId": "config-456",
      "version": 4,
      "fuelPrice": 95.50,
      "averageDriverPerHourRate": 500.00,
      "taxPercentage": 18.0,
      "nightChargePerNight": 200.00,
      "isActive": false,
      "createdBy": "admin-user-id",
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    },
    {
      "pricingConfigId": "config-123",
      "version": 3,
      "fuelPrice": 92.00,
      "averageDriverPerHourRate": 480.00,
      "taxPercentage": 18.0,
      "nightChargePerNight": 180.00,
      "isActive": true,
      "createdBy": "admin-user-id",
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-10T08:00:00.000Z"
    }
  ]
}
```

---

### 4. Activate Pricing Config

**Endpoint:** `PUT /api/v1/admin/pricing-config/:id/activate`

**Description:** Activate a pricing configuration. This deactivates all other configs and activates the specified one. Only one config can be active at a time.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Pricing Config ID |

**Response Body Example:**
```json
{
  "success": true,
  "pricingConfigId": "config-456",
  "version": 4,
  "fuelPrice": 95.50,
  "averageDriverPerHourRate": 500.00,
  "taxPercentage": 18.0,
  "nightChargePerNight": 200.00,
  "isActive": true,
  "createdBy": "admin-user-id",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T12:00:00.000Z"
}
```

**Error Response Example:**
```json
{
  "success": false,
  "message": "Pricing config not found"
}
```


### AdminQuoteListItemResponse
```typescript
{
  quoteId: string;
  tripName?: string;
  tripType: TripType;
  status: QuoteStatus;
  currentStep?: number;
  totalPrice?: number;
  createdAt: Date;
  user: {
    userId: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
}
```

### AdminQuoteResponse
```typescript
{
  // All fields from QuoteResponse
  quoteId: string;
  userId: string;
  tripType: TripType;
  tripName?: string;
  eventType?: string;
  customEventType?: string;
  passengerCount?: number;
  status: QuoteStatus;
  currentStep?: number;
  selectedVehicles?: SelectedVehicleDto[];
  selectedAmenities?: string[];
  pricing?: PricingBreakdownResponse;
  routeData?: IRouteData;
  itinerary?: { outbound?: ItineraryStopDto[]; return?: ItineraryStopDto[] };
  passengers?: PassengerDto[];
  createdAt: Date;
  updatedAt: Date;
  // Plus:
  user: {
    userId: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
}
```

### UpdateQuoteStatusRequest
```typescript
{
  status: QuoteStatus; // Only 'paid' or 'submitted' allowed
}
```

### PricingConfigResponse
```typescript
{
  pricingConfigId: string;
  version: number;
  fuelPrice: number;
  averageDriverPerHourRate: number;
  taxPercentage: number;
  nightChargePerNight: number;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### CreatePricingConfigRequest
```typescript
{
  fuelPrice: number; // min: 0
  averageDriverPerHourRate: number; // min: 0
  taxPercentage: number; // min: 0, max: 100
  nightChargePerNight: number; // min: 0
}
```

### PricingConfigHistoryResponse
```typescript
{
  pricingConfigs: PricingConfigResponse[];
}
```

---

## Error Handling

All endpoints return standardized error responses:
```json
{
  "success": false,
  "message": "Error message"
}
```

### Common Error Scenarios

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `PRICING_CONFIG_NOT_FOUND` | 404 | No active pricing config exists |
| `QUOTE_NOT_FOUND` | 404 | Quote doesn't exist |
| `INVALID_STATUS_TRANSITION` | 400 | Invalid status change (only PAID ↔ SUBMITTED allowed) |
| `QUOTE_ALREADY_PAID` | 400 | Quote is already marked as paid |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not admin user |
| `INVALID_REQUEST` | 400 | Invalid request parameters |

---

## Implementation Notes

### Removed Features
- **`stayingChargePerDay`** has been completely removed from:
  - PricingConfig entity
  - Pricing calculation service
  - Quote pricing breakdown
  - All DTOs and schemas

### Key Implementation Details
- All admin endpoints require `authenticate` and `requireAdmin` middleware
- Status changes are restricted to PAID ↔ SUBMITTED only
- Pricing config versions are immutable (no updates, only new versions)
- Only one pricing config can be active at a time
- Deleted quotes are excluded by default, can be included with `includeDeleted=true`
- User information is fetched from User repository using `quote.userId`
- All numeric validations ensure positive values
- Tax percentage must be between 0-100
- Search functionality searches across quote fields (quoteId, tripName, eventType, customEventType) and user fields (fullName, email)
- Default sort order is `createdAt` descending (newest first) if no `sortBy` is provided
- Allowed sort fields: `createdAt`, `updatedAt`, `status`, `totalPrice`, `tripName`

---



## Future Enhancements (Not in Current Scope)

1. **Driver Assignment Feature**
   - Assign drivers to quotes
   - Update `assignedDriverId` and `actualDriverRate` fields
   - Recalculate pricing with actual driver rates
   - Transition quote status from SUBMITTED to QUOTED

2. **Pricing Override by Admin**
   - Admin ability to manually override pricing values
   - Edit individual pricing breakdown components
   - Save overridden pricing to quote

3. **Email Sending on Status Changes**
   - Send email notifications when quote status changes
   - Email quote details with updated pricing
   - Email when driver is assigned

4. **Quote Expiration Dates**
   - Set expiration dates for quotes
   - Automatic status updates for expired quotes
   - Notifications before expiration

5. **Bulk Operations**
   - Bulk status updates
   - Bulk quote deletion
   - Bulk export functionality

6. **Advanced Analytics**
   - Quote statistics dashboard
   - Revenue analytics
   - Conversion rate tracking
   - Popular trip types and routes

7. **Pricing Recalculation on Config Change**
   - Automatic recalculation of existing quotes when pricing config changes
   - Highlight quotes with outdated pricing
   - Admin notification of affected quotes

8. **Quote Versioning**
   - Track quote history and changes
   - View previous versions of quotes
   - Compare quote versions

9. **Advanced Filtering**
   - Filter by date ranges
   - Filter by price ranges
   - Filter by vehicle types
   - Filter by event types

10. **Export Functionality**
    - Export quotes to CSV/Excel
    - Export pricing config history
    - Generate PDF reports

---
