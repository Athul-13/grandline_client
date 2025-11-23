# Large Files Analysis Report

## Files Exceeding or Near the 300-Line Threshold

This report identifies all files in the `pages` and `components` directories that are near or have passed the 300-line threshold, which is a common indicator that a file may need refactoring.

---

## 🔴 Critical (700+ lines) - **Immediate Refactoring Needed**

These files are extremely large and should be refactored as soon as possible:

1. **`src/pages/admin/admin_fleet_management_page.tsx`** - **838 lines**
   - Status: ⚠️ Critical
   - Recommendation: Break down into smaller components and extract logic into custom hooks

2. **`src/components/fleet/vehicle_form_modal.tsx`** - **731 lines**
   - Status: ⚠️ Critical
   - Recommendation: Split into multiple sub-components and extract form logic

---

## 🟠 Very Large (500-699 lines) - **Should Be Refactored Soon**

3. **`src/components/quotes/admin_quotes_table.tsx`** - **575 lines**
   - Status: ⚠️ Very Large
   - Recommendation: Extract table columns, row components, and actions into separate files

---

## 🟡 Large (400-499 lines) - **Consider Refactoring**

4. **`src/components/quotes/quote_builder/step_2/step_2_itinerary.tsx`** - **451 lines**
   - Status: ⚠️ Large
   - Recommendation: Extract itinerary logic and sub-components

5. **`src/components/user/profile/my_profile_form.tsx`** - **434 lines**
   - Status: ⚠️ Large
   - Recommendation: Split form sections into separate components

6. **`src/components/quotes/quote_builder/step_2/itinerary_floating_panel.tsx`** - **415 lines**
   - Status: ⚠️ Large
   - Recommendation: Extract panel sections into smaller components

7. **`src/components/quotes/quote_builder/step_3/step_3_user_details.tsx`** - **414 lines**
   - Status: ⚠️ Large
   - Recommendation: Extract passenger management logic

8. **`src/components/quotes/quotes_table.tsx`** - **405 lines**
   - Status: ⚠️ Large
   - Recommendation: Extract table components and logic

---

## 🟢 Near Threshold (300-399 lines) - **Monitor**

These files are approaching the threshold and should be monitored:

9. **`src/components/quotes/quote_builder/step_2/stop_item_v2.tsx`** - **347 lines**
   - Status: ⚠️ Near Threshold
   - Recommendation: Monitor and consider splitting if it grows further

10. **`src/components/user/navbar.tsx`** - **334 lines**
    - Status: ⚠️ Near Threshold
    - Recommendation: Extract navigation sections into sub-components

11. **`src/components/pricing_config/pricing_config_section.tsx`** - **322 lines**
    - Status: ⚠️ Near Threshold
    - Recommendation: Monitor for growth

12. **`src/components/pricing_config/pricing_config_history_modal.tsx`** - **305 lines**
    - Status: ⚠️ Near Threshold
    - Recommendation: Monitor for growth

13. **`src/components/quotes/quote_builder/step_2/route_info_box.tsx`** - **302 lines**
    - Status: ⚠️ Near Threshold
    - Recommendation: Monitor for growth

---

## 🔵 Approaching Threshold (250-299 lines)

These files are getting close to the threshold:

14. **`src/pages/admin/admin_settings_page.tsx`** - **260 lines**
    - Status: ℹ️ Approaching Threshold
    - Recommendation: Monitor and plan for refactoring if it continues to grow

15. **`src/components/auth/otp_verification_form.tsx`** - **255 lines**
    - Status: ℹ️ Approaching Threshold
    - Recommendation: Monitor for growth

---

## Summary Statistics

- **Total files ≥ 300 lines:** 13 files
- **Total files 250-299 lines:** 2 files
- **Largest file:** `admin_fleet_management_page.tsx` (838 lines)
- **Most critical:** 2 files over 700 lines need immediate attention

---

## Refactoring Recommendations

### Priority 1: Critical Files (700+ lines)

#### `admin_fleet_management_page.tsx` (838 lines)
- **Suggested approach:**
  - Extract vehicle list into a separate component
  - Extract vehicle type management into a separate component
  - Extract amenity management into a separate component
  - Move state management logic into custom hooks
  - Create separate components for modals and forms

#### `vehicle_form_modal.tsx` (731 lines)
- **Suggested approach:**
  - Split form into sections (basic info, specifications, amenities, etc.)
  - Extract form validation logic
  - Create separate components for each form section
  - Move image upload logic to a separate component

### Priority 2: Very Large Files (500-699 lines)

#### `admin_quotes_table.tsx` (575 lines)
- **Suggested approach:**
  - Extract table columns definition
  - Create separate row component
  - Extract action handlers into custom hooks
  - Split filter logic into separate component

### Priority 3: Large Files (400-499 lines)

- Break down into smaller, focused components
- Extract business logic into custom hooks
- Separate UI components from container components
- Use composition patterns to reduce complexity

---

## Best Practices for Refactoring

1. **Single Responsibility Principle:** Each component should have one clear purpose
2. **Extract Custom Hooks:** Move complex logic into reusable hooks
3. **Component Composition:** Break large components into smaller, composable pieces
4. **Separation of Concerns:** Separate UI, business logic, and data fetching
5. **Reusability:** Extract common patterns into shared components

---

## Notes

- Threshold set at **300 lines** as a general guideline
- Files over **500 lines** are considered problematic
- Files over **700 lines** require immediate attention
- This analysis was generated on: $(date)

---

## Next Steps

1. ✅ Review this analysis
2. ⏳ Prioritize refactoring based on:
   - File complexity
   - Frequency of changes
   - Team impact
   - Business criticality
3. ⏳ Create refactoring tickets for critical files
4. ⏳ Set up code review guidelines to prevent files from growing too large

