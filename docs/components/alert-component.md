# Alert Component Documentation

## Overview

Alert component yang solid dan reusable untuk menampilkan berbagai jenis notifikasi dan pesan penting di aplikasi Crave ITSM. Komponen ini mengikuti design system yang telah ditetapkan dengan support untuk theming, variants, dan customization.

## Features

- ✅ **4 Variants**: info, success, warning, destructive
- ✅ **3 Sizes**: sm, default, lg
- ✅ **Dark Mode Support**: Automatic theme adaptation
- ✅ **Dismissible**: Optional close button
- ✅ **Custom Icons**: Override default icons
- ✅ **Modular Structure**: Title, Description, Footer components
- ✅ **Accessible**: ARIA roles and keyboard navigation
- ✅ **Type-Safe**: Full TypeScript support

## Installation

The Alert component is already installed in `src/components/ui/alert.tsx`. Make sure you have the required dependencies:

```json
{
  "class-variance-authority": "^0.7.1",
  "lucide-react": "^1.28.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.6.0"
}
```

## Basic Usage

### Import Components

```tsx
import { Alert, AlertTitle, AlertDescription, AlertFooter } from "@/components/ui/alert"
```

### Simple Alert

```tsx
<Alert variant="info">
  <AlertTitle>Informasi Penting</AlertTitle>
  <AlertDescription>
    Project Anda sedang dalam tahap review.
  </AlertDescription>
</Alert>
```

## Variants

### Info Alert (Blue)

```tsx
<Alert variant="info">
  <AlertTitle>Informasi</AlertTitle>
  <AlertDescription>
    Proses verifikasi membutuhkan waktu 1-24 jam.
  </AlertDescription>
</Alert>
```

**Use for:** General information, status updates, non-critical notices

### Success Alert (Green)

```tsx
<Alert variant="success">
  <AlertTitle>Berhasil!</AlertTitle>
  <AlertDescription>
    Pembayaran Anda telah dikonfirmasi.
  </AlertDescription>
</Alert>
```

**Use for:** Success messages, confirmations, positive outcomes

### Warning Alert (Amber/Yellow)

```tsx
<Alert variant="warning">
  <AlertTitle>Perhatian</AlertTitle>
  <AlertDescription>
    Anda belum mengirimkan penawaran harga.
  </AlertDescription>
</Alert>
```

**Use for:** Warnings, pending actions, attention required

### Destructive Alert (Red)

```tsx
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Pembayaran gagal diproses.
  </AlertDescription>
</Alert>
```

**Use for:** Errors, failures, critical issues

## Sizes

```tsx
{/* Small - Compact */}
<Alert variant="info" size="sm">
  <AlertTitle>Small Alert</AlertTitle>
  <AlertDescription>Compact version</AlertDescription>
</Alert>

{/* Default - Standard */}
<Alert variant="info" size="default">
  <AlertTitle>Default Alert</AlertTitle>
  <AlertDescription>Standard size</AlertDescription>
</Alert>

{/* Large - Prominent */}
<Alert variant="info" size="lg">
  <AlertTitle>Large Alert</AlertTitle>
  <AlertDescription>More prominent</AlertDescription>
</Alert>
```

## Advanced Features

### With Footer

```tsx
<Alert variant="warning">
  <AlertTitle>Proyek Dalam Tahap Review Worker</AlertTitle>
  <AlertDescription>
    Klien sedang menunggu estimasi dari Anda.
  </AlertDescription>
  <AlertFooter>
    <span className="text-slate-500">Penawaran:</span>
    <strong className="text-slate-900 dark:text-white">
      Rp 15.000.000 (30 hari)
    </strong>
  </AlertFooter>
</Alert>
```

### Dismissible Alert

```tsx
<Alert 
  variant="info" 
  dismissible 
  onDismiss={() => console.log("Dismissed")}
>
  <AlertTitle>Tips</AlertTitle>
  <AlertDescription>
    Gunakan fitur chat untuk berkomunikasi dengan client.
  </AlertDescription>
</Alert>
```

### Custom Icon

```tsx
import { Zap } from "lucide-react"

<Alert variant="info" icon={<Zap className="h-4 w-4" />}>
  <AlertTitle>Fast Processing</AlertTitle>
  <AlertDescription>Your request is being processed.</AlertDescription>
</Alert>
```

### No Icon

```tsx
<Alert variant="default" icon={null}>
  <AlertTitle>Simple Message</AlertTitle>
  <AlertDescription>No icon version</AlertDescription>
</Alert>
```

## Pre-built Alert Components

### Worker Review Alert

```tsx
import { WorkerReviewAlert } from "@/components/worker/alerts/worker-review-alert"

<WorkerReviewAlert 
  offeredPrice={15000000}
  offeredDuration={30}
  showOffer={true}
/>
```

### Payment Alerts

```tsx
import { 
  PaymentPendingAlert,
  PaymentSuccessAlert,
  PaymentFailedAlert 
} from "@/components/client/alerts/payment-alerts"

// Pending
<PaymentPendingAlert 
  transactionId="TRX-2024-001234"
  amount={5000000}
/>

// Success
<PaymentSuccessAlert 
  amount={5000000}
  type="DP"
  dismissible
/>

// Failed
<PaymentFailedAlert 
  reason="Saldo tidak mencukupi"
/>
```

### Project Alerts

```tsx
import { 
  WaitingOfferAlert,
  ProjectOnHoldAlert,
  DeliverableReadyAlert,
  WarrantyPeriodAlert,
  ActionRequiredAlert
} from "@/components/client/alerts/project-alerts"

// Waiting for offer
<WaitingOfferAlert workerName="John Doe" />

// On hold
<ProjectOnHoldAlert />

// Deliverable ready
<DeliverableReadyAlert 
  files={["project_final.zip", "source_code.zip"]}
/>

// Warranty
<WarrantyPeriodAlert endDate="15 Februari 2024" />

// Action required
<ActionRequiredAlert 
  action="Approve penawaran worker"
  description="Review dan approve penawaran harga dari worker."
/>
```

## Styling & Customization

### Custom Classes

```tsx
<Alert variant="info" className="shadow-xl border-2">
  <AlertTitle>Custom Styled</AlertTitle>
  <AlertDescription>With additional classes</AlertDescription>
</Alert>
```

### Complex Footer Layout

```tsx
<Alert variant="success">
  <AlertTitle>Files Ready</AlertTitle>
  <AlertDescription>Multiple deliverables available</AlertDescription>
  <AlertFooter className="flex-col items-start gap-2">
    <span className="text-slate-500">Files:</span>
    <div className="flex flex-wrap gap-2">
      <span className="px-2 py-1 bg-emerald-100 rounded text-xs">file1.zip</span>
      <span className="px-2 py-1 bg-emerald-100 rounded text-xs">file2.pdf</span>
    </div>
  </AlertFooter>
</Alert>
```

## Props Reference

### Alert

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "info" \| "success" \| "warning" \| "destructive"` | `"default"` | Alert style variant |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | Alert size |
| `icon` | `React.ReactNode` | Auto | Custom icon (use `null` to remove) |
| `dismissible` | `boolean` | `false` | Show close button |
| `onDismiss` | `() => void` | - | Callback when dismissed |
| `className` | `string` | - | Additional CSS classes |

### AlertTitle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Title content |

### AlertDescription

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Description content |

### AlertFooter

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Footer content |

## Best Practices

### ✅ Do

- Use appropriate variants for context (success for confirmations, warning for caution)
- Keep titles concise and descriptive
- Use AlertFooter for additional structured data
- Implement dismissible alerts for non-critical information
- Maintain consistent spacing around alerts

### ❌ Don't

- Don't use multiple high-priority alerts on the same page
- Don't put too much text in AlertDescription
- Don't use destructive variant for non-critical messages
- Don't override icon colors that conflict with variant
- Don't nest alerts inside other alerts

## Accessibility

- All alerts have `role="alert"` for screen readers
- Dismissible alerts are keyboard accessible
- Color is not the only indicator (icons included)
- Focus management on dismiss button
- ARIA labels on interactive elements

## Color Palette Reference

### Light Mode
- **Info**: `bg-blue-50`, `border-blue-200`, `text-blue-900`
- **Success**: `bg-emerald-50`, `border-emerald-200`, `text-emerald-900`
- **Warning**: `bg-amber-50`, `border-amber-200`, `text-amber-900`
- **Destructive**: `bg-red-50`, `border-red-200`, `text-red-900`

### Dark Mode
- **Info**: `bg-blue-950/40`, `border-blue-900/60`, `text-blue-300`
- **Success**: `bg-emerald-950/40`, `border-emerald-900/60`, `text-emerald-300`
- **Warning**: `bg-amber-950/40`, `border-amber-900/60`, `text-amber-300`
- **Destructive**: `bg-red-950/40`, `border-red-900/60`, `text-red-300`

## Testing

### Example Test Cases

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from './alert'

test('renders alert with title and description', () => {
  render(
    <Alert variant="info">
      <AlertTitle>Test Title</AlertTitle>
      <AlertDescription>Test Description</AlertDescription>
    </Alert>
  )
  
  expect(screen.getByText('Test Title')).toBeInTheDocument()
  expect(screen.getByText('Test Description')).toBeInTheDocument()
})

test('dismissible alert calls onDismiss', () => {
  const handleDismiss = jest.fn()
  render(
    <Alert dismissible onDismiss={handleDismiss}>
      <AlertTitle>Dismissible</AlertTitle>
    </Alert>
  )
  
  fireEvent.click(screen.getByLabelText('Close'))
  expect(handleDismiss).toHaveBeenCalledTimes(1)
})
```

## Migration Guide

### From Old Alert to New Alert

**Before:**
```tsx
<div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
  <div className="flex items-center gap-2">
    <AlertCircle className="w-4 h-4" />
    <span>Warning Message</span>
  </div>
</div>
```

**After:**
```tsx
<Alert variant="warning">
  <AlertTitle>Warning Message</AlertTitle>
</Alert>
```

## Support

For issues or questions, contact the development team or check the main documentation at `/docs/README.md`.

---

**Last Updated:** December 2024  
**Component Version:** 1.0.0  
**Design System:** Crave ITSM v2
