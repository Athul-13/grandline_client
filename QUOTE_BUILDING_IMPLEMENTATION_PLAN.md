# Quote Building 5-Step Process - Implementation Plan (Commit-Based)

## Overview
This plan is organized into logical commits that build upon each other. Each commit is self-contained and can be tested independently.

---

## Commit 1: Foundation - Types, API Constants, and Services

**Goal**: Set up all TypeScript types, API endpoint constants, and service functions (no UI yet)

### Files to Create:
- `src/types/quotes/quote.ts` - Quote, Draft, QuoteStatus, TripType types
- `src/types/quotes/itinerary.ts` - Location, Stop, Itinerary, Route types (with stopType field)
- `src/types/quotes/passenger.ts` - Passenger type
- `src/types/quotes/vehicle_recommendation.ts` - Recommendation types
- `src/types/quotes/pricing.ts` - Pricing breakdown types
- `src/types/quotes/event_type.ts` - Event type types
- `src/types/quotes/chat.ts` - Chat message types (for later)

### Files to Update:
- `src/constants/api.ts` - Add quotes, eventTypes, chat endpoints

### Files to Create:
- `src/services/api/quote_service.ts` - Quote API calls (create, update, delete, calculate routes, calculate pricing, submit)
- `src/services/api/event_type_service.ts` - Event type API calls (get, create custom)
- `src/services/api/mapbox_service.ts` - Mapbox Geocoder integration (client-side only)

### Testing:
- Verify all types are correctly defined
- Verify API endpoints match documentation
- Verify service functions are properly structured (no actual API calls yet)

---

## Commit 2: Mapbox Integration and Map Components

**Goal**: Set up Mapbox map with basic functionality (geocoding, map display, markers)

### Files to Create:
- `src/components/quotes/quote_builder/map_container.tsx` - Mapbox map wrapper component
- `src/components/quotes/quote_builder/location_search.tsx` - Location search input (Mapbox Geocoder)

### Files to Create:
- `src/hooks/quotes/use_mapbox_map.ts` - Mapbox map initialization and controls

### Dependencies:
- Install: `mapbox-gl @mapbox/mapbox-gl-geocoder @types/mapbox-gl`
- Add Mapbox CSS import in `src/main.tsx` or `src/index.css`

### Environment:
- Add `VITE_MAPBOX_ACCESS_TOKEN` to `.env`

### Testing:
- Map renders correctly
- Location search works
- Markers can be added to map
- Map centers on selected locations

---

## Commit 3: Quote Builder Core - Container and Step Navigation

**Goal**: Create main quote builder container with step navigation (no step content yet)

### Files to Create:
- `src/components/quotes/quote_builder/quote_builder_container.tsx` - Main container
- `src/components/quotes/quote_builder/step_navigation.tsx` - Top step indicator/navigation

### Files to Create:
- `src/hooks/quotes/use_quote_builder.ts` - Main quote builder state management
- `src/hooks/quotes/use_quote_draft.ts` - Draft save/load logic with debouncing

### Files to Update:
- `src/pages/user/build_quote_page.tsx` - Replace with quote builder container

### Testing:
- Step navigation works (can switch between steps)
- Step validation blocks forward navigation
- Draft auto-save works (check network requests)
- Draft loading from URL parameter works

---

## Commit 4: Step 1 - Trip Type Selection

**Goal**: Implement Step 1 with trip type selection and draft creation

### Files to Create:
- `src/components/quotes/quote_builder/step_1_trip_type.tsx` - Trip type selection component

### Testing:
- User can select one-way or two-way
- Draft is created on "Next" click (combines POST + PUT)
- Step navigation works
- Validation blocks if no selection

---

## Commit 5: Step 2 Part 1 - Itinerary UI (Without Route Calculation)

**Goal**: Build itinerary UI with location selection, stops management, but no route calculation yet

### Files to Create:
- `src/components/quotes/quote_builder/step_2_itinerary.tsx` - Itinerary builder container
- `src/components/quotes/quote_builder/itinerary_floating_panel.tsx` - Floating itinerary component with Outbound/Return tabs
- `src/components/quotes/quote_builder/itinerary_tab.tsx` - Reusable component for Outbound/Return itinerary
- `src/components/quotes/quote_builder/stop_item.tsx` - Individual stop in itinerary (draggable)

### Files to Create:
- `src/hooks/quotes/use_itinerary_auto_update.ts` - Auto-update return trip when outbound changes

### Testing:
- User can add pickup, stops, dropoff
- Stops can be reordered (drag & drop)
- Driver stay checkbox works
- Time/date fields appear when driver stay is checked
- Outbound/Return tabs work (Return disabled initially)
- Auto-update return locations works with notifications
- Map shows markers for all locations
- Auto-save works on location changes

---

## Commit 6: Step 2 Part 2 - Route Calculation Integration

**Goal**: Add client-side preview routes and server-side route calculation

### Files to Update:
- `src/components/quotes/quote_builder/map_container.tsx` - Add preview route polylines
- `src/components/quotes/quote_builder/step_2_itinerary.tsx` - Add route calculation on "Next" click

### Files to Create:
- `src/hooks/quotes/use_route_calculation.ts` - Server-side route calculation logic

### Testing:
- Preview routes show as user adds locations (client-side Mapbox)
- Server-side route calculation works on "Next" click
- Calculated routes replace preview routes
- Route geometry displays correctly on map
- Distance/time displayed for segments
- Night travel detection works

---

## Commit 7: Step 3 - User Details

**Goal**: Implement Step 3 with trip name, event type, and passengers

### Files to Create:
- `src/components/quotes/quote_builder/step_3_user_details.tsx` - User details form
- `src/components/quotes/quote_builder/passenger_form.tsx` - Add/edit passenger form

### Testing:
- Trip name input works
- Event type dropdown populated from API
- "Other" option shows custom field
- Custom event type created on "Next" click
- Passengers can be added/removed
- Validation works (all fields required)
- Auto-save works

---

## Commit 8: Step 4 - Vehicle Selection

**Goal**: Implement Step 4 with vehicle recommendations and selection

### Files to Create:
- `src/components/quotes/quote_builder/step_4_vehicle_selection.tsx` - Vehicle selection container
- `src/components/quotes/quote_builder/vehicle_recommendations.tsx` - Recommended vehicle options
- `src/components/quotes/quote_builder/vehicle_custom_selection.tsx` - Custom vehicle selection

### Files to Create:
- `src/hooks/quotes/use_vehicle_recommendations.ts` - Vehicle recommendation logic

### Testing:
- Recommendations API call works
- Recommended options display correctly
- Custom selection works
- Vehicle prices (baseFare) display
- Quantity selector works
- Auto-recalculate on passenger count change
- Validation works (at least one vehicle required)

---

## Commit 9: Step 5 - Additional Amenities

**Goal**: Implement Step 5 with additional amenities selection

### Files to Create:
- `src/components/quotes/quote_builder/step_5_additional_amenities.tsx` - Additional amenities selection

### Testing:
- Paid amenities fetched correctly
- Amenities already in vehicles are filtered out
- User can select amenities
- Auto-save works

---

## Commit 10: Pricing Preview and Quote Submission

**Goal**: Add pricing preview page and final quote submission

### Files to Create:
- `src/components/quotes/quote_builder/pricing_preview.tsx` - Pricing preview page

### Files to Create:
- `src/hooks/quotes/use_pricing_preview.ts` - Calculate and display pricing preview

### Testing:
- Pricing calculation API works
- Pricing breakdown displays correctly
- Quote submission works
- Status changes to "submitted"
- Redirect to quotes page works
- Email sent (check backend logs)

---

## Commit 11: Quotes Page - List and Detail Views

**Goal**: Implement quotes list page and quote detail page

### Files to Create:
- `src/components/quotes/quotes_table.tsx` - Quotes list table (user side)
- `src/components/quotes/quote_card.tsx` - Quote card with unread badge (user side)
- `src/components/quotes/quote_detail.tsx` - Quote detail view (user side)

### Files to Create:
- `src/hooks/quotes/use_quotes_list.ts` - Fetch and manage quotes list
- `src/hooks/quotes/use_quote_detail.ts` - Fetch and manage single quote detail

### Files to Update:
- `src/pages/user/quotes_page.tsx` - Show all quotes in table/cards

### Files to Create:
- `src/pages/user/quote_detail_page.tsx` - Quote detail with chat toggle (chat UI placeholder for later)

### Testing:
- Quotes list displays all quotes (all statuses)
- Pagination works
- Quote detail page loads correctly
- All quote information displays
- Route geometry displays on map
- Can navigate back to quotes list

---

## Commit 12: Chat Features (Later Phase - Placeholder)

**Goal**: Set up chat infrastructure (UI components, hooks, services) - actual WebSocket integration later

### Files to Create:
- `src/components/quotes/chat/chat_modal.tsx` - Chat modal with unread messages preview (admin)
- `src/components/quotes/chat/chat_section.tsx` - Full chat interface (embedded in quote detail)
- `src/components/quotes/chat/chat_message.tsx` - Individual chat message component
- `src/components/quotes/chat/chat_input.tsx` - Chat input with send button
- `src/components/quotes/chat/unread_badge.tsx` - Unread message count badge
- `src/components/quotes/notification_button.tsx` - Notification button with badge (user)

### Files to Create:
- `src/services/api/chat_service.ts` - Chat API calls (get messages, send message)
- `src/hooks/quotes/use_chat_messages.ts` - Fetch and manage chat messages
- `src/hooks/quotes/use_unread_count.ts` - Track unread message counts

### Files to Update:
- `src/pages/user/quote_detail_page.tsx` - Add chat toggle functionality
- `src/components/quotes/quote_card.tsx` - Add unread badge
- `src/pages/user/quotes_page.tsx` - Add notification button

### Testing:
- Chat UI components render correctly
- Chat API calls work (get messages, send message)
- Unread count displays correctly
- Chat toggle works on quote detail page
- Notification button works (UI only, WebSocket later)

---

## Commit 13: WebSocket Integration for Real-Time Chat (Later Phase)

**Goal**: Add WebSocket support for real-time messaging

### Files to Create:
- `src/services/websocket/chat_websocket.ts` - WebSocket service for real-time chat
- `src/hooks/quotes/use_chat_websocket.ts` - WebSocket connection hook

### Files to Update:
- `src/components/quotes/chat/chat_section.tsx` - Integrate WebSocket for real-time updates
- `src/components/quotes/notification_button.tsx` - Real-time unread count updates

### Testing:
- WebSocket connection works
- Real-time message delivery works
- Typing indicators work
- Read receipts work
- Live notification updates work

---

## Implementation Order Summary

1. **Foundation** (Commit 1) - Types, constants, services
2. **Mapbox Setup** (Commit 2) - Map components and geocoding
3. **Core Builder** (Commit 3) - Container and navigation
4. **Step 1** (Commit 4) - Trip type selection
5. **Step 2 UI** (Commit 5) - Itinerary UI without routes
6. **Step 2 Routes** (Commit 6) - Route calculation
7. **Step 3** (Commit 7) - User details
8. **Step 4** (Commit 8) - Vehicle selection
9. **Step 5** (Commit 9) - Additional amenities
10. **Pricing & Submit** (Commit 10) - Pricing preview and submission
11. **Quotes Pages** (Commit 11) - List and detail views
12. **Chat UI** (Commit 12) - Chat components (later phase)
13. **WebSocket** (Commit 13) - Real-time chat (later phase)

---

## Notes

- Each commit should be tested independently before moving to the next
- Commits 12 and 13 are for later phase (chat features)
- All API endpoints and request/response structures follow the API documentation
- Draft creation happens on Step 1 "Next" click (combines POST + PUT)
- Custom event type created on Step 3 "Next" click
- Client-side route preview updates as locations are added
- Server-side route calculation on "Next" click in Step 2
- Pricing preview shown after Step 5 before final submission

