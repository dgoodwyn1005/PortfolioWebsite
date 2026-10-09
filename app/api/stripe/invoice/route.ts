import { getStripe } from "@/lib/stripe"
import { type NextRequest, NextResponse } from "next/server"

interface InvoiceItemInput {
  description: string
  amount: number
  quantity?: number
}

interface InvoiceRequestBody {
  customerEmail?: string
  customerName?: string
  items?: InvoiceItemInput[]
  dueDate?: string
  memo?: string
}

function getDaysUntilDue(dueDate?: string) {
  if (!dueDate) {
    return 30
  }

  const dueTime = new Date(dueDate).getTime()

  if (Number.isNaN(dueTime)) {
    return 30
  }

  const difference =
    dueTime - Date.now()

  const days = Math.ceil(
    difference /
      (1000 * 60 * 60 * 24),
  )

  return Math.max(1, days)
}

export async function POST(
  request: NextRequest,
) {
  try {
    const stripe = await getStripe()

    const body =
      (await request.json()) as InvoiceRequestBody

    const {
      customerEmail,
      customerName,
      items,
      dueDate,
      memo,
    } = body

    if (
      !customerEmail ||
      !items ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Customer email and items are required",
        },
        {
          status: 400,
        },
      )
    }

    const validItems =
      items.filter(
        (item) =>
          typeof item.description ===
            "string" &&
          item.description.trim()
            .length > 0 &&
          typeof item.amount ===
            "number" &&
          Number.isFinite(
            item.amount,
          ) &&
          item.amount > 0,
      )

    if (validItems.length === 0) {
      return NextResponse.json(
        {
          error:
            "At least one valid invoice item is required",
        },
        {
          status: 400,
        },
      )
    }

    // Find an existing Stripe customer
    // using the supplied email.
    const existingCustomers =
      await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      })

    let customer =
      existingCustomers.data[0]

    // Create one if no matching
    // customer exists.
    if (!customer) {
      customer =
        await stripe.customers.create(
          {
            email: customerEmail,
            name:
              customerName ||
              undefined,
          },
        )
    }

    // Create the draft invoice.
    const invoice =
      await stripe.invoices.create({
        customer: customer.id,
        collection_method:
          "send_invoice",
        days_until_due:
          getDaysUntilDue(
            dueDate,
          ),
        description:
          memo || undefined,
      })

    // Add each line item while the
    // invoice is still a draft.
    for (const item of validItems) {
      const quantity = Math.max(
        1,
        Math.floor(
          item.quantity ?? 1,
        ),
      )

      const unitAmount =
        Math.round(
          item.amount * 100,
        )

      await stripe.invoiceItems.create(
        {
          customer:
            customer.id,

          invoice:
            invoice.id,

          description:
            item.description.trim(),

          quantity,

          // Stripe's current API
          // accepts unit_amount_decimal
          // as a string and multiplies
          // it by quantity.
          unit_amount_decimal:
            String(unitAmount),

          currency: "usd",
        },
      )
    }

    // Finalize before sending.
    const finalizedInvoice =
      await stripe.invoices.finalizeInvoice(
        invoice.id,
      )

    // Send the invoice and use the
    // returned object for the latest
    // hosted URL / PDF.
    const sentInvoice =
      await stripe.invoices.sendInvoice(
        finalizedInvoice.id,
      )

    return NextResponse.json({
      success: true,
      invoiceId:
        sentInvoice.id,
      invoiceUrl:
        sentInvoice.hosted_invoice_url,
      invoicePdf:
        sentInvoice.invoice_pdf,
    })
  } catch (error) {
    console.error(
      "Invoice error:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Failed to create invoice. Please configure Stripe in Admin.",
      },
      {
        status: 500,
      },
    )
  }
}