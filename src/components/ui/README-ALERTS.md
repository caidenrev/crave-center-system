# Alert Component System

## Quick Start

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

<Alert variant="warning">
  <AlertTitle>Warning!</AlertTitle>
  <AlertDescription>This is a warning message.</AlertDescription>
</Alert>
```

## Pre-built Alerts

### Worker Alerts
```tsx
import { WorkerReviewAlert } from "@/components/worker/alerts"

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
} from "@/components/client/alerts"

<PaymentSuccessAlert amount={5000000} type="DP" />
```

### Project Alerts
```tsx
import { 
  WaitingOfferAlert,
  DeliverableReadyAlert 
} from "@/components/client/alerts"

<WaitingOfferAlert workerName="John Doe" />
<DeliverableReadyAlert files={["file1.zip"]} />
```

## Variants

- `info` - Blue (information, updates)
- `success` - Green (confirmations, completions)
- `warning` - Amber (cautions, pending actions)
- `destructive` - Red (errors, failures)

## Features

- ✅ Dark mode support
- ✅ Dismissible alerts
- ✅ Custom icons
- ✅ Footer sections
- ✅ Type-safe props
- ✅ Accessible (ARIA)

## Demo

Visit `/dev/alerts` to see all variants in action.

## Documentation

Full documentation: `/docs/components/alert-component.md`
