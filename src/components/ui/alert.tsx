import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 [&>svg]:shrink-0 [&>svg]:translate-y-[-3px] [&:has(svg)]:pl-11 transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground border-border",
        info: 
          "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-300 [&>svg]:text-blue-500",
        success:
          "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300 [&>svg]:text-emerald-500",
        warning:
          "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300 [&>svg]:text-amber-500",
        destructive:
          "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-300 [&>svg]:text-red-500",
      },
      size: {
        default: "p-4",
        sm: "p-3 text-sm",
        lg: "p-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & {
      icon?: React.ReactNode
      dismissible?: boolean
      onDismiss?: () => void
    }
>(({ className, variant, size, icon, dismissible, onDismiss, children, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  // Default icons based on variant
  const defaultIcon = React.useMemo(() => {
    if (icon !== undefined) return icon
    
    switch (variant) {
      case "info":
        return <Info className="h-4 w-4" />
      case "success":
        return <CheckCircle2 className="h-4 w-4" />
      case "warning":
        return <AlertCircle className="h-4 w-4" />
      case "destructive":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }, [icon, variant])

  if (!isVisible) return null

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, size }), className)}
      {...props}
    >
      {defaultIcon && (
        <div className="absolute left-4 top-4">
          {defaultIcon}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-extrabold text-sm leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs leading-relaxed [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

const AlertFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-3 pt-3 border-t border-current/20 text-xs flex items-center justify-between",
      className
    )}
    {...props}
  />
))
AlertFooter.displayName = "AlertFooter"

export { Alert, AlertTitle, AlertDescription, AlertFooter }
