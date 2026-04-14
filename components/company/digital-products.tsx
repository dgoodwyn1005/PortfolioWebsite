"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Music, Download, Bell, CheckCircle, ExternalLink, Loader2 } from "lucide-react"

interface DigitalProduct {
  id: string
  company_id: string
  name: string
  description: string
  price: number
  image_url: string | null
  gumroad_url: string | null
  product_type: string
  status: "available" | "coming_soon" | "sold_out"
  features: string[] | null
  display_order: number
}

interface DigitalProductsProps {
  companyId: string
  primaryColor?: string
}

export function DigitalProducts({ companyId, primaryColor = "#D4AF37" }: DigitalProductsProps) {
  const [products, setProducts] = useState<DigitalProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [waitlistEmail, setWaitlistEmail] = useState<Record<string, string>>({})
  const [waitlistSubmitting, setWaitlistSubmitting] = useState<Record<string, boolean>>({})
  const [waitlistSuccess, setWaitlistSuccess] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchProducts()
  }, [companyId])

  async function fetchProducts() {
    const supabase = createClient()
    const { data } = await supabase
      .from("digital_products")
      .select("*")
      .eq("company_id", companyId)
      .order("display_order", { ascending: true })

    if (data) {
      setProducts(data)
    }
    setLoading(false)
  }

  async function handleWaitlistSignup(productId: string) {
    const email = waitlistEmail[productId]
    if (!email) return

    setWaitlistSubmitting({ ...waitlistSubmitting, [productId]: true })

    const supabase = createClient()
    const { error } = await supabase.from("product_waitlist").insert({
      product_id: productId,
      email: email,
    })

    setWaitlistSubmitting({ ...waitlistSubmitting, [productId]: false })

    if (!error) {
      setWaitlistSuccess({ ...waitlistSuccess, [productId]: true })
      setWaitlistEmail({ ...waitlistEmail, [productId]: "" })
    }
  }

  if (loading) {
    return (
      <section id="products" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge 
            className="mb-4 text-sm"
            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
          >
            Digital Products
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Chord Packs & Resources
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Level up your playing with professionally crafted chord progressions, 
            voicings, and resources designed to help you sound better at the keys.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="flex flex-col overflow-hidden border-border/50 hover:border-border transition-colors"
            >
              {product.image_url && (
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  {product.status === "coming_soon" && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="secondary" className="text-sm px-4 py-1">
                        Coming Soon
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <Badge 
                    variant="outline"
                    className="shrink-0"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    <Music className="h-3 w-3 mr-1" />
                    {product.product_type}
                  </Badge>
                </div>
                <CardDescription className="text-muted-foreground">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {product.features && product.features.length > 0 && (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle 
                          className="h-4 w-4 mt-0.5 shrink-0" 
                          style={{ color: primaryColor }}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>

              <CardFooter className="mt-auto pt-4 border-t border-border/50">
                {product.status === "available" && product.gumroad_url ? (
                  <div className="w-full flex items-center justify-between">
                    <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                      ${product.price.toFixed(2)}
                    </span>
                    <Button 
                      asChild
                      style={{ backgroundColor: primaryColor }}
                      className="hover:opacity-90"
                    >
                      <a href={product.gumroad_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Get It Now
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </a>
                    </Button>
                  </div>
                ) : product.status === "coming_soon" ? (
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-muted-foreground">
                        {product.price > 0 ? `$${product.price.toFixed(2)}` : "Price TBD"}
                      </span>
                      <Badge variant="secondary">
                        <Bell className="h-3 w-3 mr-1" />
                        Coming Soon
                      </Badge>
                    </div>
                    
                    {waitlistSuccess[product.id] ? (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        You&apos;re on the list! We&apos;ll notify you when it&apos;s ready.
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={waitlistEmail[product.id] || ""}
                          onChange={(e) => 
                            setWaitlistEmail({ ...waitlistEmail, [product.id]: e.target.value })
                          }
                          className="flex-1"
                        />
                        <Button
                          onClick={() => handleWaitlistSignup(product.id)}
                          disabled={waitlistSubmitting[product.id] || !waitlistEmail[product.id]}
                          variant="outline"
                          style={{ borderColor: primaryColor, color: primaryColor }}
                          className="hover:bg-primary/10"
                        >
                          {waitlistSubmitting[product.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Notify Me"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <Badge variant="secondary">Sold Out</Badge>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
