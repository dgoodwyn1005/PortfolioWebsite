"use client"

import { useCallback, useState } from "react"
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { createCheckoutSession } from "@/app/actions/stripe"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

interface CheckoutDialogProps {
  serviceId: string
  serviceType:
    | "pricing"
    | "company_service"
  serviceName: string
  open: boolean
  onOpenChange: (
    open: boolean,
  ) => void
}

export function CheckoutDialog({
  serviceId,
  serviceType,
  serviceName,
  open,
  onOpenChange,
}: CheckoutDialogProps) {
  const [
    clientSecret,
    setClientSecret,
  ] = useState<string | null>(
    null,
  )

  const fetchClientSecret =
    useCallback(
      async (): Promise<string> => {
        if (clientSecret) {
          return clientSecret
        }

        const secret =
          await createCheckoutSession(
            serviceId,
            serviceType,
          )

        if (!secret) {
          throw new Error(
            "Failed to create Stripe checkout session.",
          )
        }

        setClientSecret(secret)

        return secret
      },
      [
        serviceId,
        serviceType,
        clientSecret,
      ],
    )

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Complete Your Purchase
            {" - "}
            {serviceName}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{
              fetchClientSecret,
            }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </DialogContent>
    </Dialog>
  )
}