# Alert Component Migration Checklist

## Overview

Panduan untuk migrasi dari custom alert divs ke Alert component yang solid dan reusable.

## Migration Steps

### 1. Identify Alert Usage

Cari semua penggunaan alert custom di codebase:

```bash
# Search untuk pattern alert lama
grep -r "bg-amber-50.*border.*amber" src/components
grep -r "bg-red-50.*border.*red" src/components
grep -r "bg-emerald-50.*border.*emerald" src/components
grep -r "bg-blue-50.*border.*blue" src/components
```

### 2. Files Already Migrated

- ✅ `src/components/worker/projects/worker-projects-client.tsx` - WORKER_REVIEW alert
- ✅ Demo page created at `/dev/alerts`

### 3. Files to Migrate

Berikut adalah file-file yang masih menggunakan custom alert div dan perlu di-migrate:

#### Worker Components

- [ ] `src/components/worker/overview/worker-reminders.tsx`
  - Lines 54-90: Worker review status alert
  - **Migration:** Use `<WorkerReviewAlert />`

- [ ] `src/components/worker/overview/worker-new-requests.tsx`
  - Multiple alert badges and cards
  - **Migration:** Use `<Alert variant="warning" size="sm" />`

#### Client Components

- [ ] `src/components/client/settings-form.tsx`
  - Line 39-43: Success/Error message display
  - **Migration:** Use `<Alert variant="success" />` or `<Alert variant="destructive" />`

- [ ] `src/components/client/projects/client-reminders.tsx`
  - Line 35-38: Action required section header
  - **Note:** This might be intentional as section header, review context

#### Admin Components

Check admin components for any inline alerts that could benefit from the new component.

### 4. Migration Examples

#### Before (Old Pattern):
```tsx
<div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 mb-5 flex flex-col gap-2">
  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" /> 
    Proyek Dalam Tahap Review Worker
  </div>
  <p className="text-xs text-slate-600 dark:text-slate-300">
    Klien & Admin sedang menunggu estimasi harga dan waktu pengerjaan dari Anda.
  </p>
  {offeredPrice && (
    <div className="mt-1 pt-2 border-t border-amber-200/80 dark:border-amber-900/60 text-xs flex items-center justify-between">
      <span className="text-slate-500">Penawaran Terdaftar:</span>
      <strong className="text-slate-900 dark:text-white font-black">
        Rp {Number(offeredPrice).toLocaleString("id-ID")} ({offeredDuration} hari)
      </strong>
    </div>
  )}
</div>
```

#### After (New Pattern):
```tsx
import { WorkerReviewAlert } from "@/components/worker/alerts"

<WorkerReviewAlert 
  offeredPrice={offeredPrice}
  offeredDuration={offeredDuration}
  showOffer={true}
  className="mb-5"
/>
```

#### Before (Success Message):
```tsx
<div className="p-4 rounded-xl text-sm font-medium flex items-center gap-3 bg-emerald-50 text-emerald-700 border border-emerald-200">
  <CheckCircle2 className="w-4 h-4 shrink-0" />
  Settings updated successfully!
</div>
```

#### After (New Pattern):
```tsx
import { Alert, AlertDescription } from "@/components/ui/alert"

<Alert variant="success" dismissible>
  <AlertDescription>
    Settings updated successfully!
  </AlertDescription>
</Alert>
```

### 5. Component Selection Guide

| Use Case | Component | Example |
|----------|-----------|---------|
| Worker review status | `WorkerReviewAlert` | Project in review phase |
| Payment confirmation | `PaymentSuccessAlert` | DP payment confirmed |
| Payment pending | `PaymentPendingAlert` | Verifying payment |
| Payment failed | `PaymentFailedAlert` | Transaction failed |
| Waiting for offer | `WaitingOfferAlert` | Worker reviewing brief |
| Project on hold | `ProjectOnHoldAlert` | No response for 3 days |
| Files ready | `DeliverableReadyAlert` | Deliverables uploaded |
| Warranty period | `WarrantyPeriodAlert` | In warranty period |
| Action required | `ActionRequiredAlert` | User action needed |
| Generic info | `Alert variant="info"` | General information |
| Generic success | `Alert variant="success"` | Generic success message |
| Generic warning | `Alert variant="warning"` | Generic warning |
| Generic error | `Alert variant="destructive"` | Generic error |

### 6. Testing After Migration

#### Visual Testing
- [ ] Check in light mode
- [ ] Check in dark mode
- [ ] Test responsive behavior (mobile, tablet, desktop)
- [ ] Verify icon display
- [ ] Check spacing and alignment

#### Functional Testing
- [ ] Test dismissible alerts (if applicable)
- [ ] Verify onDismiss callbacks
- [ ] Test with/without footer
- [ ] Test with custom icons
- [ ] Verify conditional rendering

#### Accessibility Testing
- [ ] Screen reader announces role="alert"
- [ ] Keyboard navigation works for dismissible
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators visible

### 7. Benefits After Migration

✅ **Consistency**: All alerts follow same design pattern  
✅ **Maintainability**: One source of truth for alert styling  
✅ **Type Safety**: Full TypeScript support  
✅ **Dark Mode**: Automatic theme support  
✅ **Accessibility**: Built-in ARIA roles  
✅ **Reusability**: Pre-built components for common use cases  
✅ **Documentation**: Comprehensive docs and examples  

### 8. Migration Priority

**High Priority (User-facing, frequent):**
1. Worker project alerts (status notifications)
2. Client payment alerts (transaction status)
3. Form validation messages

**Medium Priority:**
4. Settings/profile update messages
5. Dashboard notification cards

**Low Priority:**
6. Admin panel alerts (internal tools)
7. Dev/debug alerts

### 9. Breaking Changes

None. The new Alert component is additive and doesn't break existing code.

### 10. Rollback Plan

If issues arise, the old alert divs can remain in place. Both patterns can coexist during transition period.

## Command to Run

```bash
# Run the dev server and visit the demo page
npm run dev
# Navigate to: http://localhost:3000/dev/alerts
```

## Review Process

Before marking a file as migrated:
1. Create PR with before/after screenshots
2. Test in both themes
3. Verify responsiveness
4. Get design team approval
5. Merge and update this checklist

## Questions?

Contact the development team or refer to:
- `/docs/components/alert-component.md` - Full documentation
- `/src/app/[locale]/dev/alerts/page.tsx` - Live examples
- `/src/components/ui/alert.stories.tsx` - Code examples

---

**Migration Started:** December 2024  
**Target Completion:** January 2025  
**Status:** 🟡 In Progress
