import { getStripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

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
