import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ShopContent } from "@/components/shop-content"
import { getStripe } from "@/lib/stripe"

export const dynamic = "force-dynamic"

const PRODUCTS_TO_SEED = [
  // Wynora Services
  { name: "Piano Accompaniment", description: "Professional piano accompaniment for auditions, recitals, competitions, and performances. Wynora Music Services.", price: 7500 },
  { name: "Essential Recording Package", description: "Basic recording package for musicians. Wynora Music Services.", price: 15000 },
  { name: "Premium Recording Package", description: "Enhanced recording package with additional features. Wynora Music Services.", price: 30000 },
  { name: "Luxury Recording Package", description: "Full-service premium recording experience. Wynora Music Services.", price: 60000 },
  { name: "Simple Arrangement", description: "Custom music arrangement services. Wynora Music Services.", price: 10000 },
  { name: "Audio Recording Session", description: "Professional audio recording session. Wynora Music Services.", price: 12500 },
  // WynTech Services
  { name: "Starter Website", description: "Professional starter website for individuals and small businesses. WynTech Solutions.", price: 20000 },
  { name: "Study Automation Tools", description: "Custom automation tools to enhance your study workflow. WynTech Solutions.", price: 5000 },
  { name: "Portfolio Website", description: "Showcase your work with a stunning portfolio website. WynTech Solutions.", price: 15000 },
  { name: "E-Commerce Website", description: "Full-featured online store to sell your products. WynTech Solutions.", price: 40000 },
  { name: "Custom Scripts", description: "Custom automation scripts tailored to your needs. WynTech Solutions.", price: 5000 },
  { name: "Resume Bundle", description: "Professional resume design and optimization package. WynTech Solutions.", price: 10000 },
  { name: "Student Branding Package", description: "Complete personal branding package for students. WynTech Solutions.", price: 12500 },
]

// Seed products and ensure all have prices
async function seedProductsIfNeeded() {
  try {
    const stripe = await getStripe()
    const existingProducts = await stripe.products.list({ limit: 100, active: true })
    const existingNames = new Map(existingProducts.data.map(p => [p.name, p]))
    
    for (const p of PRODUCTS_TO_SEED) {
      const existing = existingNames.get(p.name)
      
      if (existing) {
        // Check if product has a price
        const prices = await stripe.prices.list({ product: existing.id, active: true, limit: 1 })
        if (prices.data.length === 0) {
          // Add price to existing product and set as default
          const price = await stripe.prices.create({
            product: existing.id,
            unit_amount: p.price,
            currency: "usd",
          })
          // Set as default price
          await stripe.products.update(existing.id, { default_price: price.id })
        }
      } else {
        // Create new product with default price
        await stripe.products.create({
          name: p.name,
          description: p.description,
          default_price_data: {
            unit_amount: p.price,
            currency: "usd",
          },
        })
      }
    }
  } catch (error) {
    // Silently fail - products API will handle missing Stripe config
    console.error("Error seeding products:", error)
  }
}

export default async function ShopPage() {
  await seedProductsIfNeeded()

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <ShopContent />
      </div>
      <Footer />
    </main>
  )
}
