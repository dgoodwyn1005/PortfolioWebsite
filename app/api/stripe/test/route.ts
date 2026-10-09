import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

interface StripeTestRequest {
  secretKey?: string
  publishableKey?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as StripeTestRequest

    const secretKey = body.secretKey?.trim()
    const publishableKey = body.publishableKey?.trim()

    if (!secretKey || !publishableKey) {
      return NextResponse.json(
        {
          error: "Both keys are required",
        },
        {
          status: 400,
        },
      )
    }

    // Validate secret key format.
    if (
      !secretKey.startsWith("sk_test_") &&
      !secretKey.startsWith("sk_live_")
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid secret key format. Must start with sk_test_ or sk_live_.",
        },
        {
          status: 400,
        },
      )
    }

    // Validate publishable key format.
    if (
      !publishableKey.startsWith("pk_test_") &&
      !publishableKey.startsWith("pk_live_")
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid publishable key format. Must start with pk_test_ or pk_live_.",
        },
        {
          status: 400,
        },
      )
    }

    // Make sure both keys belong to the same environment.
    const secretIsLive =
      secretKey.startsWith("sk_live_")

    const publishableIsLive =
      publishableKey.startsWith("pk_live_")

    if (secretIsLive !== publishableIsLive) {
      return NextResponse.json(
        {
          error:
            "Secret and publishable keys must both be test keys or both be live keys.",
        },
        {
          status: 400,
        },
      )
    }

    /*
     * Do not manually pin an older API version here.
     *
     * stripe@20.x uses the API version that matches
     * the SDK's TypeScript definitions by default.
     */
    const stripe = new Stripe(secretKey)

    // Verify the secret key by retrieving the account.
    const account =
      await stripe.accounts.retrieve()

    return NextResponse.json({
      success: true,
      accountId: account.id,

      accountName:
        account.business_profile?.name ??
        account.email ??
        account.id,

      livemode:
        account.charges_enabled
          ? secretIsLive
          : secretIsLive,
    })
  } catch (error) {
    console.error(
      "Stripe test error:",
      error,
    )

    if (
      error instanceof
      Stripe.errors
        .StripeAuthenticationError
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid Stripe API key.",
        },
        {
          status: 401,
        },
      )
    }

    if (
      error instanceof
      Stripe.errors
        .StripePermissionError
    ) {
      return NextResponse.json(
        {
          error:
            "The Stripe key does not have permission to retrieve account information.",
        },
        {
          status: 403,
        },
      )
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to connect to Stripe.",
      },
      {
        status: 500,
      },
    )
  }
}