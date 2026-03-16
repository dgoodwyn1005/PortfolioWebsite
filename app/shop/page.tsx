import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ShopContent } from "@/components/shop-content"
import { stripe } from "@/lib/stripe"

export const dynamic = "force-dynamic"

// Seed products if none exist
async function seedProductsIfNeeded() {
  if (!stripe) return

  try {
    const products = await stripe.products.list({ limit: 1, active: true })
    
    // If no products exist, seed them
    if (products.data.length === 0) {
      const productsToCreate = [
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

      for (const p of productsToCreate) {
        const product = await stripe.products.create({
          name: p.name,
          description: p.description,
        })
        await stripe.prices.create({
          product: product.id,
          unit_amount: p.price,
          currency: "usd",
        })
      }
    }
  } catch (error) {
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
