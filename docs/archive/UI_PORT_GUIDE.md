# UI Port Guide: marocmobile → Mobile-Morocco-

## Overview

This guide documents the UI porting process from the `marocmobile` repository to `Mobile-Morocco-`. The foundation has been completed, and this guide explains what was done and how to continue the work.

## ✅ Completed: Foundation (Phases 1-3)

### 1. Theme & Styling Setup

#### Tailwind Configuration (`tailwind.config.js`)
Added marocmobile's design system:

**Fonts:**
```javascript
fontFamily: {
  syne: ['Syne', 'system-ui', 'sans-serif'],
  grotesk: ['Space Grotesk', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

**Color Palette:**
```javascript
colors: {
  terracotta: "#C1440E",
  charcoal: "#1A1A1A",
  lime: "#CDFF00",
  rose: "#E8A598",
  cream: "#F5F1E8",
  dark: {
    bg: "#0E0E10",
    card: "#16181D",
    secondary: "#1E1F24",
    border: "#27272A",
  },
  orange: "#F97316",
  yellow: "#FACC15",
  success: "#22C55E",
}
```

**Custom Effects:**
```javascript
boxShadow: {
  'brutal': '8px 8px 0px 0px var(--charcoal, #1A1A1A)',
  'brutal-hover': '12px 12px 0px 0px var(--charcoal, #1A1A1A)',
}
animation: {
  'slide-left': 'slide-left 0.3s ease-in-out',
  'slide-in-right': 'slide-in-right 0.3s ease-in-out',
}
```

#### Global Styles (`src/index.css`)
- Added marocmobile fonts (Syne, Space Grotesk, JetBrains Mono)
- Added `noise-texture` utility class
- Maintained existing RTL support for Arabic

### 2. UI Components

**Added:**
- `src/components/ui/loading-spinner.tsx` - Updated with orange theme colors

**Updated:**
- `src/components/ui/button.tsx` - Uses CSS variables instead of hardcoded colors

**Reference Components:**
- All marocmobile components copied to `src/components/_marocmobile-reference/`
- Excluded from TypeScript compilation
- Available as visual reference for future updates

### 3. Type Definitions

**Added:**
- `src/types/marketplace.ts` - Product, Category, City, RepairShop interfaces from marocmobile

## 📋 How to Continue: Page-by-Page Updates

### General Approach

For each page, follow this pattern:

1. **Reference the marocmobile UI** in `src/components/_marocmobile-reference/pages/`
2. **Keep ALL logic** from Mobile-Morocco- (data fetching, auth, routing)
3. **Update ONLY visual elements** (JSX structure, CSS classes, layout)
4. **Test thoroughly** before moving to next page

### Example: Updating HomePage

#### WRONG ❌ - Don't Copy Logic
```tsx
// Don't do this - this copies data fetching logic
import { supabase } from '@/lib/supabase'; // From marocmobile
const { data } = await supabase.from('products').select(); // Wrong
```

#### RIGHT ✅ - Keep Existing Logic, Update UI
```tsx
// Keep existing Mobile-Morocco- data fetching
const [listings, setListings] = useState<ListingWithRelations[]>([]);

// Update ONLY the visual presentation
return (
  <div className="min-h-screen bg-dark-bg"> {/* New dark theme */}
    <section className="py-16 px-4">
      <h1 className="font-syne text-4xl font-bold text-terracotta"> {/* New font & color */}
        {labels.title}
      </h1>
      {/* Keep existing listing data, just update card styling */}
      {listings.map(listing => (
        <Card className="shadow-brutal hover:shadow-brutal-hover"> {/* New shadow */}
          {/* ... existing content ... */}
        </Card>
      ))}
    </section>
  </div>
);
```

### Step-by-Step Page Update Process

1. **Open both files side by side:**
   - `src/pages/[PageName].tsx` (Mobile-Morocco-)
   - `src/components/_marocmobile-reference/pages/[page].tsx` (reference)

2. **Identify visual differences:**
   - Background colors (cream vs dark)
   - Font families (Inter vs Syne/Space Grotesk)
   - Card styling (standard vs brutal shadows)
   - Layout structure (grid patterns, spacing)

3. **Update CSS classes only:**
   ```diff
   - <div className="bg-white">
   + <div className="bg-cream noise-texture">
   
   - <h1 className="font-sans text-2xl">
   + <h1 className="font-syne text-4xl font-extrabold text-terracotta">
   
   - <Card className="shadow-md">
   + <Card className="shadow-brutal hover:shadow-brutal-hover border-2 border-charcoal">
   ```

4. **Test the changes:**
   ```bash
   npm run typecheck  # Check for type errors
   npm run build      # Verify build succeeds
   npm run dev        # Test in browser
   ```

5. **Verify no logic changed:**
   - Data still fetches correctly
   - Auth still works
   - Routing still functions
   - Forms still submit

## 🎨 Using the New Design System

### Colors

**Background:**
```tsx
<div className="bg-cream">        {/* Light cream background */}
<div className="bg-dark-bg">      {/* Dark background */}
<div className="bg-dark-card">    {/* Dark card background */}
```

**Text:**
```tsx
<h1 className="text-charcoal">    {/* Dark charcoal text */}
<h1 className="text-terracotta">  {/* Orange-red accent */}
<p className="text-text-secondary"> {/* Muted gray text */}
```

**Accents:**
```tsx
<Badge className="bg-lime text-charcoal">  {/* Bright lime badge */}
<Button className="bg-orange">             {/* Orange button */}
```

### Typography

```tsx
<h1 className="font-syne">        {/* Bold display font */}
<p className="font-grotesk">      {/* Body text font */}
<code className="font-mono">      {/* Monospace font */}
```

### Effects

```tsx
<Card className="shadow-brutal">               {/* 8px offset shadow */}
<Card className="shadow-brutal-hover">          {/* 12px offset shadow */}
<div className="noise-texture">                 {/* Subtle noise overlay */}
<div className="animate-slide-in-right">        {/* Slide animation */}
```

### Dark Mode

```tsx
<div className="bg-cream dark:bg-dark-bg">
<Card className="bg-white dark:bg-dark-card">
<h1 className="text-charcoal dark:text-text-primary">
```

## 📊 Page Update Priority

### High Priority (Core User Experience)
1. **HomePage** - First impression, most traffic
2. **PhonesPage / ProductsPage** - Main product browsing
3. **ListingsPage** - Marketplace listings
4. **StoresPage** - Store directory
5. **RepairShopsPage** - Service provider directory

### Medium Priority (User Flows)
6. **LoginPage** - Auth flow
7. **RegisterPage** - Auth flow
8. **ListingDetailsPage** - Product details
9. **StoreProfilePage** - Store pages
10. **RepairShopDetailsPage** - Shop pages

### Lower Priority (Supporting Pages)
11. **DashboardPage** - User dashboard
12. **Admin Dashboard** - Admin panel
13. **About / Contact / FAQ** - Informational pages
14. **Terms / Privacy** - Legal pages

## 🔧 Useful Patterns

### Card Layout from marocmobile
```tsx
<Card className="
  border-2 border-charcoal 
  shadow-brutal 
  hover:shadow-brutal-hover 
  transition-all 
  bg-white dark:bg-dark-card
">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Hero Section from marocmobile
```tsx
<section className="
  py-16 px-4 
  bg-gradient-to-b from-cream to-white 
  dark:from-dark-bg dark:to-dark-secondary
  noise-texture
">
  <h1 className="
    font-syne text-5xl font-extrabold 
    text-charcoal dark:text-text-primary
    mb-6
  ">
    {title}
  </h1>
</section>
```

### Product Card from marocmobile
```tsx
<div className="
  group 
  border-2 border-charcoal 
  rounded-lg 
  overflow-hidden
  shadow-brutal hover:shadow-brutal-hover
  transition-all
">
  <img className="w-full h-48 object-cover" />
  <div className="p-4 bg-white dark:bg-dark-card">
    <h3 className="font-grotesk font-semibold text-charcoal dark:text-text-primary">
      {title}
    </h3>
    <Badge className="mt-2 bg-lime text-charcoal">
      {condition}
    </Badge>
  </div>
</div>
```

## ⚠️ CRITICAL RULES

### DO NOT Touch These:

1. **Supabase Queries**
   ```tsx
   // ❌ Don't modify
   const { data } = await getListings(...);
   const { data } = await supabase.from('table').select();
   ```

2. **Authentication Logic**
   ```tsx
   // ❌ Don't modify
   const { user, signIn, signOut } = useAuth();
   if (!user) return <Navigate to="/login" />;
   ```

3. **Data Models & Types**
   ```tsx
   // ❌ Don't modify (unless adding new optional fields)
   interface Listing { ... }
   type UserRole = 'admin' | 'user' | ...;
   ```

4. **Routing & Guards**
   ```tsx
   // ❌ Don't modify
   <ProtectedRoute>
   <AdminRoute>
   <Route path="..." element={...} />
   ```

### DO Update These:

1. **CSS Classes**
   ```tsx
   // ✅ Update freely
   className="bg-white" → className="bg-cream"
   className="font-sans" → className="font-syne"
   ```

2. **Component Structure**
   ```tsx
   // ✅ Update layout
   <div className="grid grid-cols-2">
   → <div className="grid grid-cols-3 gap-6">
   ```

3. **Visual Elements**
   ```tsx
   // ✅ Update styling
   <Card> → <Card className="shadow-brutal">
   <Button> → <Button className="bg-orange">
   ```

## 🧪 Testing Checklist

After updating each page:

- [ ] TypeScript check passes (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Page loads without errors
- [ ] Data fetches correctly
- [ ] Auth still works (if applicable)
- [ ] Forms submit correctly (if applicable)
- [ ] Navigation works
- [ ] RTL layout works (for Arabic)
- [ ] LTR layout works (for French)
- [ ] Mobile responsive
- [ ] Dark mode works (if implemented)

## 📦 Resources

- **Reference Components**: `src/components/_marocmobile-reference/`
- **Marocmobile Repo**: https://github.com/topimmo/marocmobile
- **Tailwind Config**: `tailwind.config.js`
- **Global Styles**: `src/index.css`
- **Type Definitions**: `src/types/marketplace.ts`

## 🚀 Quick Start

To update a page right now:

1. Choose a page from the priority list
2. Open `src/pages/[PageName].tsx`
3. Reference `src/components/_marocmobile-reference/pages/` for visual style
4. Update CSS classes to use new theme
5. Test locally
6. Commit changes
7. Move to next page

## ✅ Foundation Status

**COMPLETE** - The theme, fonts, colors, and design system are fully integrated and ready to use.

**READY** - Begin updating individual pages using this guide.

**SUPPORT** - All marocmobile reference components available for visual guidance.
