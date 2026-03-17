import { getStripe } from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const stripe = await getStripe()

    // Fetch all active products with their prices
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    })

    // Fetch all active prices
    const prices = await stripe.prices.list({
      active: true,
    })

    // Map products with their prices
    const productsWithPrices = products.data.map((product) => {
      const productPrices = prices.data.filter((price) => price.product === product.id)
      
      // Format default_price if it exists and is expanded
      let formattedDefaultPrice = null
      if (product.default_price && typeof product.default_price === 'object') {
        const dp = product.default_price
        formattedDefaultPrice = {
          id: dp.id,
          unit_amount: dp.unit_amount,
          currency: dp.currency,
          type: dp.type,
          recurring: dp.recurring,
        }
      }
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        metadata: product.metadata,
        default_price: formattedDefaultPrice,
        prices: productPrices.map((price) => ({
          id: price.id,
          unit_amount: price.unit_amount,
          currency: price.currency,
          type: price.type,
          recurring: price.recurring,
        })),
      }
    })

    return NextResponse.json({ products: productsWithPrices })
  } catch (error) {
    console.error("Error fetching Stripe products:", error)
    return NextResponse.json({ error: "Failed to fetch products. Please configure Stripe in Admin." }, { status: 500 })
  }
}

// Create a new product
export async function POST(request: NextRequest) {
  try {
    const stripe = await getStripe()
    const { name, description, price, image_url } = await request.json()

    const product = await stripe.products.create({
      name,
      description: description || undefined,
      images: image_url ? [image_url] : undefined,
      default_price_data: {
        unit_amount: price,
        currency: "usd",
      },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

// Update an existing product
export async function PUT(request: NextRequest) {
  try {
    const stripe = await getStripe()
    const { id, name, description, price, image_url } = await request.json()

    // Update product details
    const product = await stripe.products.update(id, {
      name,
      description: description || undefined,
      images: image_url ? [image_url] : undefined,
    })

    // If price changed, create a new price and set as default
    if (price) {
      const newPrice = await stripe.prices.create({
        product: id,
        unit_amount: price,
        currency: "usd",
      })
      await stripe.products.update(id, { default_price: newPrice.id })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// Archive a product (Stripe doesn't allow true deletion)
export async function DELETE(request: NextRequest) {
  try {
    const stripe = await getStripe()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    // Archive the product instead of deleting
    await stripe.products.update(id, { active: false })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error archiving product:", error)
    return NextResponse.json({ error: "Failed to archive product" }, { status: 500 })
  }
}
