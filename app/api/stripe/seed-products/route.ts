import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"

const PRODUCTS = [
  // Wynora Music Services
  { name: "Piano Accompaniment", description: "Professional piano accompaniment for auditions, recitals, competitions, and performances. Wynora Music Services.", price: 7500, category: "wynora" },
  { name: "Essential Recording Package", description: "Basic recording package for musicians. Wynora Music Services.", price: 15000, category: "wynora" },
  { name: "Premium Recording Package", description: "Enhanced recording package with additional features. Wynora Music Services.", price: 30000, category: "wynora" },
  { name: "Luxury Recording Package", description: "Full-service premium recording experience. Wynora Music Services.", price: 60000, category: "wynora" },
  { name: "Simple Arrangement", description: "Custom music arrangement services. Wynora Music Services.", price: 10000, category: "wynora" },
  { name: "Audio Recording Session", description: "Professional audio recording session. Wynora Music Services.", price: 12500, category: "wynora" },
  
  // WynTech Solutions
  { name: "Starter Website", description: "Professional starter website for individuals and small businesses. WynTech Solutions.", price: 20000, category: "wyntech" },
  { name: "Study Automation Tools", description: "Custom automation tools to enhance your study workflow. WynTech Solutions.", price: 5000, category: "wyntech" },
  { name: "Portfolio Website", description: "Showcase your work with a stunning portfolio website. WynTech Solutions.", price: 15000, category: "wyntech" },
  { name: "E-Commerce Website", description: "Full-featured online store to sell your products. WynTech Solutions.", price: 40000, category: "wyntech" },
  { name: "Custom Scripts", description: "Custom automation scripts tailored to your needs. WynTech Solutions.", price: 5000, category: "wyntech" },
  { name: "Resume Bundle", description: "Professional resume design and optimization package. WynTech Solutions.", price: 10000, category: "wyntech" },
  { name: "Student Branding Package", description: "Complete personal branding package for students. WynTech Solutions.", price: 12500, category: "wyntech" },
]

export async function POST() {
  try {
    const stripe = await getStripe()
    
    // Get existing products to avoid duplicates
    const existingProducts = await stripe.products.list({ limit: 100 })
    const existingNames = new Set(existingProducts.data.map(p => p.name))
    
    const results = []
    
    for (const product of PRODUCTS) {
      // Skip if product already exists
      if (existingNames.has(product.name)) {
        // Check if it has a price
        const existing = existingProducts.data.find(p => p.name === product.name)
        if (existing) {
          const prices = await stripe.prices.list({ product: existing.id, active: true, limit: 1 })
          if (prices.data.length === 0) {
            // Add price to existing product
            const price = await stripe.prices.create({
              product: existing.id,
              unit_amount: product.price,
              currency: "usd",
            })
            results.push({ name: product.name, status: "price_added", priceId: price.id })
          } else {
            results.push({ name: product.name, status: "already_exists" })
          }
        }
        continue
      }
      
      // Create new product with price
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: { category: product.category },
        default_price_data: {
          unit_amount: product.price,
          currency: "usd",
        },
      })
      
      results.push({ 
        name: product.name, 
        status: "created", 
        productId: stripeProduct.id,
        priceId: stripeProduct.default_price 
      })
    }
    
    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error seeding products:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to seed products" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "POST to this endpoint to seed all Wynora and WynTech products with prices",
    products: PRODUCTS.map(p => ({ name: p.name, price: `$${(p.price / 100).toFixed(2)}` }))
  })
}
