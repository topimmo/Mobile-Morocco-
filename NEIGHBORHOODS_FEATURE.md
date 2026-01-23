# Neighborhoods Feature

This branch implements the neighborhoods (districts) feature for Mobile Morocco.

## Overview

Enables neighborhood-based location targeting for:
- Search and filtering
- Ad posting with neighborhood selection
- Admin moderation of new neighborhoods

## Key Changes

1. **Enabled neighborhood filtering** in `src/lib/supabase/listings.ts`
2. **Added admin functions** in `src/lib/supabase/neighborhoods.ts`
3. **Created admin page** at `src/pages/admin/NeighborhoodsPage.tsx`
4. **Added route** in `src/App.tsx` for `/admin/neighborhoods`
5. **Updated admin dashboard** with navigation link

## Features

### For Users
- Select neighborhood when posting ads (optional)
- Add custom neighborhoods if not in list
- Filter search results by neighborhood

### For Admins
- Review pending neighborhood submissions
- Approve/reject new neighborhoods
- Manage all neighborhoods by city

## Database Schema

Already exists:
- `neighborhoods` table with `city_id`, `name`, `slug`, `is_verified`
- `listings.neighborhood_id` column

## Testing

The infrastructure was already built, this PR connects the pieces:
- ✅ Ad posting form has neighborhood selector
- ✅ Search filters have neighborhood dropdown
- ✅ Admin page for moderation
- ✅ Backend filtering enabled

## Next Steps

After merge:
1. Test neighborhood creation flow
2. Test admin approval workflow
3. Verify search filtering works
4. Add search ranking boost for neighborhood matches (future enhancement)
