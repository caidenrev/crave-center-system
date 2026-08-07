# Alert Component Visual Guide

## 🎨 Quick Visual Reference

### Variant Colors

```
┌─────────────────────────────────────────────────┐
│  INFO (Blue)                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  🔵 Information & Updates                       │
│  Light: #EFF6FF / #BFDBFE / #1E3A8A            │
│  Dark:  #1E3A8A/40 / #1E3A8A/60 / #93C5FD     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  SUCCESS (Green)                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ✅ Confirmations & Completions                 │
│  Light: #ECFDF5 / #A7F3D0 / #064E3B            │
│  Dark:  #064E3B/40 / #064E3B/60 / #6EE7B7     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  WARNING (Amber)                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ⚠️  Cautions & Pending Actions                 │
│  Light: #FFFBEB / #FDE68A / #78350F            │
│  Dark:  #78350F/40 / #78350F/60 / #FCD34D     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  DESTRUCTIVE (Red)                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ❌ Errors & Critical Issues                    │
│  Light: #FEF2F2 / #FECACA / #7F1D1D            │
│  Dark:  #7F1D1D/40 / #7F1D1D/60 / #FCA5A5     │
└─────────────────────────────────────────────────┘
```

---

## 📐 Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│  [Icon]  Alert Title                              [Close ×] │  ← Header
│  ─────────────────────────────────────────────────────────  │
│  Alert description text goes here. This can be              │  ← Body
│  multiple lines and contain important information.          │
│  ─────────────────────────────────────────────────────────  │
│  Label:                                     Value ──────→   │  ← Footer
└─────────────────────────────────────────────────────────────┘
```

### Spacing Breakdown

```
   16px padding (default size)
   ┌────────────────────────────────────┐
   │                                    │  ← 16px top
   │  🔵 [4px gap] Title                │  ← Icon + Title
   │                                    │  ← 4px gap
   │  Description text here             │  ← Description
   │  ════════════════════════════      │  ← 12px gap
   │  Footer content                    │  ← Footer (optional)
   │                                    │  ← 16px bottom
   └────────────────────────────────────┘
      ↑                            ↑
   16px left               16px right
```

---

## 📏 Size Variations

### Small (`size="sm"`)
```
┌────────────────────────────────┐
│ [icon] Small Alert             │  12px padding
│ Compact text                   │  text-sm
└────────────────────────────────┘
```

### Default (`size="default"`)
```
┌────────────────────────────────────┐
│ [icon] Default Alert               │  16px padding
│ Standard text size                 │  text-sm (title)
└────────────────────────────────────┘
```

### Large (`size="lg"`)
```
┌──────────────────────────────────────┐
│ [icon] Large Alert                   │  20px padding
│ More prominent with larger padding   │  text-base
└──────────────────────────────────────┘
```

---

## 🎯 Use Case Matrix

| Scenario | Variant | Pre-built Component | Icon |
|----------|---------|---------------------|------|
| Payment confirmed | `success` | `PaymentSuccessAlert` | ✅ CheckCircle2 |
| Payment pending | `info` | `PaymentPendingAlert` | 🔵 Info |
| Payment failed | `destructive` | `PaymentFailedAlert` | ❌ AlertTriangle |
| Worker reviewing | `warning` | `WorkerReviewAlert` | ⚠️ AlertCircle |
| Project on hold | `destructive` | `ProjectOnHoldAlert` | ❌ AlertCircle |
| Files ready | `success` | `DeliverableReadyAlert` | ✅ CheckCircle2 |
| Waiting for offer | `warning` | `WaitingOfferAlert` | ⚠️ AlertCircle |
| In warranty | `info` | `WarrantyPeriodAlert` | 🔵 Info |
| Action needed | `warning` | `ActionRequiredAlert` | ⚠️ AlertCircle |
| General info | `info` | `Alert` | 🔵 Info |
| Form success | `success` | `Alert` | ✅ CheckCircle2 |
| Form error | `destructive` | `Alert` | ❌ AlertTriangle |

---

## 🎭 Visual States

### Default State
```
┌────────────────────────────────────────┐
│ 🔵 Information                         │
│ This is a standard alert               │
└────────────────────────────────────────┘
```

### Hover State (Dismissible)
```
┌────────────────────────────────────────┐
│ 🔵 Information                    [×̲]  │  ← Close button highlighted
│ This is a dismissible alert           │
└────────────────────────────────────────┘
```

### With Footer
```
┌────────────────────────────────────────┐
│ 🔵 Information                         │
│ Alert with additional data             │
│ ──────────────────────────────────────  │
│ Label:                  Value →        │
└────────────────────────────────────────┘
```

### Dismissed
```
[Component removed from DOM]
```

---

## 🌓 Theme Comparison

### Light Mode Example
```
┌─────────────────────────────────────────┐
│ Background: #FFFBEB (Light Amber)       │
│ Border:     #FDE68A (Amber 200)         │
│ Text:       #78350F (Amber 900)         │
│ Icon:       #F59E0B (Amber 500)         │
└─────────────────────────────────────────┘
```

### Dark Mode Example
```
┌─────────────────────────────────────────┐
│ Background: #78350F/40 (Dark Amber)     │
│ Border:     #78350F/60 (Amber Border)   │
│ Text:       #FCD34D (Amber 300)         │
│ Icon:       #F59E0B (Amber 500)         │
└─────────────────────────────────────────┘
```

---

## 🔢 Component Hierarchy

```
Alert (Container)
├── Icon (Optional, left-aligned)
├── Content Area
│   ├── AlertTitle (Required)
│   └── AlertDescription (Optional)
├── AlertFooter (Optional)
└── Close Button (If dismissible)
```

---

## 📱 Responsive Behavior

### Mobile (< 640px)
```
┌─────────────────────────────┐
│ 🔵 Mobile Alert             │
│                             │
│ Text wraps naturally        │
│ Full width container        │
│ ────────────────────────────│
│ Label:        Value         │
└─────────────────────────────┘
```

### Tablet (640px - 1024px)
```
┌───────────────────────────────────────┐
│ 🔵 Tablet Alert                       │
│                                       │
│ More horizontal space available       │
│ ──────────────────────────────────────│
│ Label:                    Value →     │
└───────────────────────────────────────┘
```

### Desktop (> 1024px)
```
┌─────────────────────────────────────────────────────┐
│ 🔵 Desktop Alert                                    │
│                                                     │
│ Maximum width constrained for readability           │
│ ─────────────────────────────────────────────────── │
│ Label:                              Value ──────→   │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Color Accessibility

### Contrast Ratios (WCAG AA)

| Variant | Background | Text | Ratio | Pass |
|---------|-----------|------|-------|------|
| Info (Light) | #EFF6FF | #1E3A8A | 8.2:1 | ✅ AAA |
| Info (Dark) | #1E3A8A/40 | #93C5FD | 4.8:1 | ✅ AA |
| Success (Light) | #ECFDF5 | #064E3B | 10.1:1 | ✅ AAA |
| Success (Dark) | #064E3B/40 | #6EE7B7 | 5.2:1 | ✅ AA |
| Warning (Light) | #FFFBEB | #78350F | 9.3:1 | ✅ AAA |
| Warning (Dark) | #78350F/40 | #FCD34D | 4.6:1 | ✅ AA |
| Destructive (Light) | #FEF2F2 | #7F1D1D | 8.9:1 | ✅ AAA |
| Destructive (Dark) | #7F1D1D/40 | #FCA5A5 | 5.1:1 | ✅ AA |

---

## 🖼️ Real-World Examples

### Payment Success
```tsx
┌────────────────────────────────────────────────────┐
│ ✅ Pembayaran Berhasil!                            │
│                                                    │
│ Pembayaran DP sebesar Rp 5.000.000 telah          │
│ dikonfirmasi. Project akan segera dimulai.        │
└────────────────────────────────────────────────────┘
```

### Worker Review with Offer
```tsx
┌────────────────────────────────────────────────────┐
│ ⚠️  Proyek Dalam Tahap Review Worker              │
│                                                    │
│ Klien & Admin sedang menunggu estimasi harga      │
│ dan waktu pengerjaan dari Anda.                   │
│ ────────────────────────────────────────────────── │
│ Penawaran Terdaftar:    Rp 15.000.000 (30 hari)  │
└────────────────────────────────────────────────────┘
```

### Deliverable Ready
```tsx
┌────────────────────────────────────────────────────┐
│ ✅ Deliverable Siap Diunduh!                       │
│                                                    │
│ Worker telah mengupload hasil pekerjaan.          │
│ ────────────────────────────────────────────────── │
│ Files:                                             │
│ [project_final.zip]  [source_code.zip]            │
└────────────────────────────────────────────────────┘
```

---

## 🎬 Animation (Future Enhancement)

### Potential Entrance Animation
```
Frame 1:  opacity: 0,    y: -20px
Frame 2:  opacity: 0.3,  y: -10px
Frame 3:  opacity: 0.7,  y: -5px
Frame 4:  opacity: 1,    y: 0px
```

### Potential Exit Animation
```
Frame 1:  opacity: 1,    scale: 1
Frame 2:  opacity: 0.7,  scale: 0.95
Frame 3:  opacity: 0.3,  scale: 0.9
Frame 4:  opacity: 0,    scale: 0.85
```

---

## 📐 Spacing Specifications

### Icon Spacing
- Icon size: `16px × 16px` (`h-4 w-4`)
- Icon position: Absolute, `left-4 top-4`
- Content padding-left when icon present: `44px` (`pl-11`)

### Text Spacing
- Title font: `font-extrabold text-sm`
- Title margin-bottom: `4px` (`mb-1`)
- Description font: `text-xs`
- Description line-height: `leading-relaxed` (1.625)

### Footer Spacing
- Footer margin-top: `12px` (`mt-3`)
- Footer padding-top: `12px` (`pt-3`)
- Footer border: `border-t border-current/20`

### Close Button
- Position: Absolute, `right-3 top-3`
- Size: `16px × 16px` icon in `padding: 4px` button
- Hover opacity: `100%` (from `70%`)

---

## 🔍 Inspection Guide

### Browser DevTools Checklist

When inspecting Alert component:

1. **Container**
   - Has `role="alert"`
   - Has `data-slot="alert"`
   - Border radius: `16px`
   - Padding matches size variant

2. **Icon**
   - Size: `16px × 16px`
   - Position: `absolute left-4 top-4`
   - Color matches variant

3. **Title**
   - Font weight: `800` (extrabold)
   - Font size: `14px` (0.875rem)
   - Line height: `20px` (1.428)

4. **Description**
   - Font size: `12px` (0.75rem)
   - Line height: `20px` (1.666)
   - Color: muted variant of main color

5. **Close Button (if dismissible)**
   - Has `aria-label="Close"`
   - Opacity: `0.7` default, `1.0` on hover
   - Focus ring visible

---

## 💡 Tips for Designers

### When Designing Alerts

1. **Hierarchy**: Icon → Title → Description → Footer
2. **Brevity**: Keep titles under 50 characters
3. **Clarity**: Use clear, actionable language
4. **Consistency**: Same variant for same context
5. **Accessibility**: Don't rely on color alone

### Color Usage Guidelines

- **Info (Blue)**: Neutral information, non-critical updates
- **Success (Green)**: Positive outcomes, confirmations
- **Warning (Amber)**: Caution, attention needed, pending actions
- **Destructive (Red)**: Errors, failures, critical issues

### Layout Considerations

- Alerts should have breathing room (16-24px margin)
- Max width for readability: `640px - 896px`
- Mobile: Full width minus container padding
- Desktop: Consider max-w-4xl or similar constraint

---

## 📊 Decision Tree

```
Need to show a message?
│
├─ Is it an error or failure?
│  └─ Yes → Use variant="destructive" (Red)
│
├─ Is it a success or confirmation?
│  └─ Yes → Use variant="success" (Green)
│
├─ Does it require user action?
│  └─ Yes → Use variant="warning" (Amber)
│
└─ Is it general information?
   └─ Yes → Use variant="info" (Blue)
```

---

## 🎓 Learning Resources

1. **Live Demo**: Visit `/dev/alerts`
2. **Code Examples**: `src/components/ui/alert.stories.tsx`
3. **Full Docs**: `docs/components/alert-component.md`
4. **API Reference**: Props tables in documentation
5. **Migration Guide**: `docs/components/alert-migration-checklist.md`

---

**Last Updated:** December 2024  
**Design System Version:** Crave ITSM v2  
**Component Version:** 1.0.0
