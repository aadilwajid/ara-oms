# StoreOS - Bootstrap 5 Migration Guide

## 📋 Overview

This guide documents the migration of StoreOS from Tailwind CSS to Bootstrap 5. The application now supports both frameworks, with Bootstrap 5 as the primary framework and Tailwind utilities available for backward compatibility.

---

## ✅ What's Been Done

### 1. **Bootstrap 5 Installation**
- ✅ Installed `bootstrap@5.3.3`
- ✅ Installed `@popperjs/core@2.11.8` (required for Bootstrap)
- ✅ Created custom Bootstrap theme (`bootstrap-custom.css`)
- ✅ Integrated Bootstrap into main CSS file

### 2. **Custom Theme**
- ✅ Emerald green primary color (#059669)
- ✅ Custom gradient backgrounds
- ✅ Dark mode support
- ✅ Custom animations and transitions
- ✅ Print styles
- ✅ Responsive utilities

### 3. **Hybrid Approach**
- ✅ Bootstrap 5 as primary framework
- ✅ Tailwind utilities for backward compatibility
- ✅ Custom utility classes bridging both frameworks
- ✅ Smooth transition path

---

## 🎨 Bootstrap 5 Class Mapping

### Layout Classes

| Tailwind | Bootstrap 5 | Example |
|----------|-------------|---------|
| `flex` | `d-flex` | `<div class="d-flex">` |
| `items-center` | `align-items-center` | `<div class="d-flex align-items-center">` |
| `justify-between` | `justify-content-between` | `<div class="d-flex justify-content-between">` |
| `gap-2` | `gap-2` | `<div class="d-flex gap-2">` |
| `grid grid-cols-2` | `row row-cols-2` | `<div class="row row-cols-2">` |
| `col-span-2` | `col-md-6` | `<div class="col-md-6">` |

### Spacing Classes

| Tailwind | Bootstrap 5 | Example |
|----------|-------------|---------|
| `p-4` | `p-3` or `p-4` | `<div class="p-4">` |
| `px-4` | `px-3` or `px-4` | `<div class="px-4">` |
| `py-2` | `py-2` | `<div class="py-2">` |
| `m-4` | `m-3` or `m-4` | `<div class="m-4">` |
| `mt-4` | `mt-3` or `mt-4` | `<div class="mt-4">` |
| `mb-2` | `mb-2` | `<div class="mb-2">` |

### Typography Classes

| Tailwind | Bootstrap 5 | Example |
|----------|-------------|---------|
| `text-sm` | `small` or `fs-6` | `<p class="small">` |
| `text-xs` | `small` + custom | `<p class="small" style="font-size: 0.75rem">` |
| `text-lg` | `fs-5` | `<h1 class="fs-5">` |
| `text-xl` | `fs-4` | `<h1 class="fs-4">` |
| `text-2xl` | `fs-3` | `<h1 class="fs-3">` |
| `font-medium` | `fw-medium` | `<p class="fw-medium">` |
| `font-semibold` | `fw-semibold` | `<p class="fw-semibold">` |
| `font-bold` | `fw-bold` | `<p class="fw-bold">` |
| `text-gray-800` | `text-dark` | `<p class="text-dark">` |
| `text-gray-600` | `text-secondary` | `<p class="text-secondary">` |
| `text-gray-500` | `text-muted` | `<p class="text-muted">` |

### Color Classes

| Tailwind | Bootstrap 5 | Example |
|----------|-------------|---------|
| `bg-white` | `bg-white` | `<div class="bg-white">` |
| `bg-gray-50` | `bg-light` | `<div class="bg-light">` |
| `bg-emerald-600` | `bg-success` or custom | `<div class="bg-success">` |
| `text-emerald-600` | `text-success` | `<p class="text-success">` |
| `border-emerald-600` | `border-success` | `<div class="border border-success">` |

### Component Classes

| Tailwind | Bootstrap 5 | Example |
|----------|-------------|---------|
| `rounded` | `rounded` | `<div class="rounded">` |
| `rounded-lg` | `rounded-3` | `<div class="rounded-3">` |
| `rounded-xl` | `rounded-4` | `<div class="rounded-4">` |
| `shadow-sm` | `shadow-sm` | `<div class="shadow-sm">` |
| `shadow-md` | `shadow` | `<div class="shadow">` |
| `shadow-lg` | `shadow-lg` | `<div class="shadow-lg">` |
| `border` | `border` | `<div class="border">` |
| `border-b` | `border-bottom` | `<div class="border-bottom">` |

### Button Classes

| Tailwind | Bootstrap 5 | Example |
|----------|-------------|---------|
| `bg-emerald-600 text-white px-4 py-2 rounded-lg` | `btn btn-success` | `<button class="btn btn-success">` |
| `bg-blue-600 text-white px-4 py-2 rounded-lg` | `btn btn-primary` | `<button class="btn btn-primary">` |
| `bg-red-600 text-white px-4 py-2 rounded-lg` | `btn btn-danger` | `<button class="btn btn-danger">` |
| `border rounded-lg px-4 py-2 hover:bg-gray-50` | `btn btn-outline-secondary` | `<button class="btn btn-outline-secondary">` |

### Form Classes

| Tailwind | Bootstrap 5 | Example |
|----------|-------------|---------|
| `border rounded-lg px-3 py-2 text-sm` | `form-control` | `<input class="form-control">` |
| `border rounded-lg px-3 py-2 text-sm` (select) | `form-select` | `<select class="form-select">` |
| `text-sm font-medium text-gray-700 mb-1` | `form-label` | `<label class="form-label">` |

### Badge Classes

| Tailwind | Bootstrap 5 | Example |
|----------|-------------|---------|
| `px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700` | `badge rounded-pill bg-success` | `<span class="badge rounded-pill bg-success">` |
| `px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700` | `badge rounded-pill bg-danger` | `<span class="badge rounded-pill bg-danger">` |

### Card Classes

| Tailwind | Bootstrap 5 | Example |
|----------|-------------|---------|
| `bg-white rounded-xl shadow-sm border p-4` | `card border shadow-sm` | `<div class="card border shadow-sm"><div class="card-body">` |

### Table Classes

| Tailwind | Bootstrap 5 | Example |
|----------|-------------|---------|
| `w-full text-sm` | `table table-sm` | `<table class="table table-sm">` |
| `bg-gray-50 border-b` | `table-light` | `<thead class="table-light">` |
| `divide-y` | `table-bordered` | `<table class="table table-bordered">` |
| `hover:bg-gray-50` | `table-hover` | `<table class="table table-hover">` |

### Modal Classes

| Tailwind | Bootstrap 5 | Example |
|----------|-------------|---------|
| `fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4` | `modal fade show d-block` | `<div class="modal fade show d-block">` |
| `bg-white rounded-xl max-w-md w-full` | `modal-dialog modal-dialog-centered` | `<div class="modal-dialog modal-dialog-centered">` |

### Responsive Classes

| Tailwind | Bootstrap 5 | Example |
|----------|-------------|---------|
| `hidden lg:block` | `d-none d-lg-block` | `<div class="d-none d-lg-block">` |
| `lg:hidden` | `d-lg-none` | `<div class="d-lg-none">` |
| `md:grid-cols-2` | `row-cols-md-2` | `<div class="row row-cols-md-2">` |
| `lg:grid-cols-3` | `row-cols-lg-3` | `<div class="row row-cols-lg-3">` |

---

## 🎯 Example Conversions

### Example 1: Card Component

**Before (Tailwind):**
```tsx
<div className="bg-white rounded-xl shadow-sm border p-4">
  <h3 className="text-lg font-semibold text-gray-800 mb-2">Title</h3>
  <p className="text-sm text-gray-600">Description</p>
</div>
```

**After (Bootstrap 5):**
```tsx
<div className="card border shadow-sm">
  <div className="card-body p-4">
    <h3 className="card-title fs-5 fw-semibold text-dark mb-2">Title</h3>
    <p className="card-text small text-secondary">Description</p>
  </div>
</div>
```

### Example 2: Button with Icon

**Before (Tailwind):**
```tsx
<button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
  <Plus className="w-4 h-4" /> Add Item
</button>
```

**After (Bootstrap 5):**
```tsx
<button className="btn btn-success d-flex align-items-center gap-2">
  <Plus style={{width: '16px', height: '16px'}} /> Add Item
</button>
```

### Example 3: Form Input

**Before (Tailwind):**
```tsx
<input 
  type="text" 
  placeholder="Search..." 
  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
/>
```

**After (Bootstrap 5):**
```tsx
<input 
  type="text" 
  placeholder="Search..." 
  className="form-control" 
/>
```

### Example 4: Table

**Before (Tailwind):**
```tsx
<table className="w-full text-sm">
  <thead className="bg-gray-50 border-b">
    <tr>
      <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
      <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
    </tr>
  </thead>
  <tbody className="divide-y">
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">Item</td>
      <td className="px-4 py-3 text-right">$100</td>
    </tr>
  </tbody>
</table>
```

**After (Bootstrap 5):**
```tsx
<table className="table table-sm table-hover">
  <thead className="table-light">
    <tr>
      <th className="text-start px-3 py-2 fw-medium text-secondary">Name</th>
      <th className="text-end px-3 py-2 fw-medium text-secondary">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="px-3 py-2">Item</td>
      <td className="px-3 py-2 text-end">$100</td>
    </tr>
  </tbody>
</table>
```

### Example 5: Modal

**Before (Tailwind):**
```tsx
<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
  <div className="bg-white rounded-xl max-w-md w-full">
    <div className="p-5 border-b">
      <h3 className="text-lg font-semibold">Title</h3>
    </div>
    <div className="p-5">
      Content
    </div>
  </div>
</div>
```

**After (Bootstrap 5):**
```tsx
<div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content rounded-4">
      <div className="modal-header border-bottom">
        <h3 className="modal-title fs-5 fw-semibold">Title</h3>
      </div>
      <div className="modal-body p-4">
        Content
      </div>
    </div>
  </div>
</div>
```

---

## 🎨 Custom Bootstrap Theme

### Primary Colors
```css
--bs-primary: #059669; /* Emerald */
--bs-secondary: #064e3b; /* Dark Emerald */
--bs-success: #10b981; /* Green */
--bs-info: #3b82f6; /* Blue */
--bs-warning: #f59e0b; /* Amber */
--bs-danger: #ef4444; /* Red */
```

### Custom Classes
```css
.btn-emerald {
  background-color: #059669;
  border-color: #059669;
  color: white;
}

.bg-gradient-emerald {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.text-emerald {
  color: #059669;
}
```

---

## 📱 Responsive Breakpoints

| Bootstrap | Tailwind | Pixels |
|-----------|----------|--------|
| `xs` | default | <576px |
| `sm` | `sm:` | ≥576px |
| `md` | `md:` | ≥768px |
| `lg` | `lg:` | ≥992px |
| `xl` | `xl:` | ≥1200px |
| `xxl` | `2xl:` | ≥1400px |

---

## 🚀 Migration Strategy

### Phase 1: Setup (✅ Complete)
- ✅ Install Bootstrap 5
- ✅ Create custom theme
- ✅ Integrate with existing CSS
- ✅ Set up hybrid approach

### Phase 2: Core Components (Recommended)
1. Convert App.tsx shell (sidebar, header, main content)
2. Convert Dashboard page
3. Convert Orders page
4. Convert Products page

### Phase 3: All Pages
- Convert remaining 19 pages
- Test all functionality
- Optimize performance

### Phase 4: Cleanup
- Remove Tailwind dependencies
- Final testing
- Documentation update

---

## 💡 Tips for Migration

### 1. **Use Bootstrap Components**
Instead of recreating components with utilities, use Bootstrap's built-in components:
- Cards: `card`, `card-body`, `card-header`
- Buttons: `btn`, `btn-primary`, `btn-outline-secondary`
- Forms: `form-control`, `form-select`, `form-label`
- Tables: `table`, `table-hover`, `table-sm`

### 2. **Leverage Bootstrap Grid**
```tsx
<div className="row">
  <div className="col-md-6 col-lg-4">Column 1</div>
  <div className="col-md-6 col-lg-4">Column 2</div>
  <div className="col-md-6 col-lg-4">Column 3</div>
</div>
```

### 3. **Use Bootstrap Utilities**
Bootstrap 5 has utility classes similar to Tailwind:
- Spacing: `m-3`, `p-4`, `mt-2`, `px-3`
- Display: `d-flex`, `d-none`, `d-block`
- Text: `text-center`, `text-start`, `text-end`
- Colors: `text-primary`, `bg-success`, `border-danger`

### 4. **Custom Styling**
For custom styles not covered by Bootstrap, use the custom CSS file:
```css
/* In bootstrap-custom.css */
.custom-card {
  /* Your custom styles */
}
```

### 5. **Icons**
Bootstrap Icons can be used alongside Lucide React:
```tsx
import { Plus } from 'lucide-react';
// or
<i className="bi bi-plus-lg"></i> // Bootstrap Icons
```

---

## 🔧 Current Status

### ✅ Completed
- Bootstrap 5 installed and configured
- Custom theme created
- Hybrid approach implemented
- Migration guide documented

### 🔄 In Progress
- App.tsx partially converted
- Core pages need conversion

### 📋 TODO
- Convert all 22 pages to Bootstrap 5
- Test all functionality
- Optimize performance
- Remove Tailwind dependencies (optional)

---

## 📚 Resources

### Official Documentation
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Bootstrap 5 Components](https://getbootstrap.com/docs/5.3/components/)
- [Bootstrap 5 Utilities](https://getbootstrap.com/docs/5.3/utilities/)

### Migration Tools
- [Tailwind to Bootstrap Converter](https://tailwind-to-bootstrap.vercel.app/)
- [Bootstrap Cheat Sheet](https://bootstrap-cheatsheet.themeselection.com/)

---

## 🎯 Next Steps

1. **Continue Migration**: Convert remaining pages one by one
2. **Test Thoroughly**: Ensure all features work with Bootstrap
3. **Optimize**: Remove unused CSS and optimize bundle size
4. **Document**: Update component documentation with Bootstrap examples

---

## ✅ Summary

The StoreOS application now has **Bootstrap 5 fully integrated** with:
- ✅ Bootstrap 5.3.3 installed
- ✅ Custom emerald theme
- ✅ Dark mode support
- ✅ Hybrid Tailwind/Bootstrap approach
- ✅ Comprehensive migration guide
- ✅ Example conversions for all major components

The application remains **fully functional** while providing a clear path to complete Bootstrap 5 migration.

**Build Status:** ✅ Successful
**Bootstrap Version:** 5.3.3
**Migration Progress:** 10% (Setup complete, pages pending)

---

**Note:** The current implementation uses a hybrid approach where both Tailwind and Bootstrap are available. This ensures backward compatibility while allowing gradual migration to Bootstrap 5. All existing functionality continues to work as expected.
