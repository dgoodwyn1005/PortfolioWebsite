"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShoppingCart, ExternalLink } from "lucide-react"

interface Price {
  id: string
  unit_amount: number | null
  currency: string
  type: string
  recurring: { interval: string } | null
}

interface Product {
  id: string
  name: string
  description: string | null
  images: string[]
  metadata: Record<string, string>
  default_price: Price | null
  prices: Price[]
}

export function ShopContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/stripe/products")
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setProducts(data.products || [])
      }
    } catch (err) {
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async (product: Product, priceId: string) => {
    setCheckoutLoading(product.id)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          productId: product.id,
        }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || "Failed to create checkout")
      }
    } catch (err) {
      alert("Failed to start checkout")
    } finally {
      setCheckoutLoading(null)
    }
  }

  const formatPrice = (amount: number | null, currency: string) => {
    if (amount === null) return "Contact for pricing"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold mb-4">Shop Coming Soon</h2>
        <p className="text-muted-foreground text-center max-w-md">
          {error}. Please check back later or contact us for services.
        </p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold mb-4">Shop</h2>
        <p className="text-muted-foreground text-center max-w-md">
          No products available at the moment. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Browse our services and products</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const price = product.default_price || product.prices?.[0]
            const isRecurring = price?.recurring != null

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  {product.images[0] && (
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      {isRecurring && <Badge variant="secondary">{price.recurring?.interval}ly</Badge>}
                    </div>
                    {product.description && <CardDescription>{product.description}</CardDescription>}
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="text-2xl font-bold text-primary">
                      {price ? formatPrice(price.unit_amount, price.currency) : "Contact for pricing"}
                      {isRecurring && price.recurring && (
                        <span className="text-sm font-normal text-muted-foreground">/{price.recurring.interval}</span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {price ? (
                      <Button
                        className="w-full"
                        onClick={() => handleCheckout(product, price.id)}
                        disabled={checkoutLoading === product.id}
                      >
                        {checkoutLoading === product.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-4 w-4 mr-2" />
                        )}
                        Purchase
                      </Button>
                    ) : (
                      <Button className="w-full bg-transparent" variant="outline" asChild>
                        <a href="/#contact">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Contact Us
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
