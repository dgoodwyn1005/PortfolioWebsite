"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, GripVertical, ExternalLink, Users } from "lucide-react"

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

interface WaitlistEntry {
  id: string
  email: string
  created_at: string
}

interface Company {
  id: string
  name: string
  slug: string
}

export function DigitalProductsManager({ companyId }: { companyId: string }) {
  const [products, setProducts] = useState<DigitalProduct[]>([])
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [waitlistDialog, setWaitlistDialog] = useState<{ productId: string; productName: string } | null>(null)
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([])
  const [featuresText, setFeaturesText] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    gumroad_url: "",
    product_type: "chord_pack",
    status: "coming_soon" as "available" | "coming_soon" | "sold_out",
  })

  useEffect(() => {
    fetchProducts()
  }, [companyId])

  async function fetchProducts() {
    const supabase = createClient()
    const { data } = await supabase
      .from("digital_products")
      .select("*")
      .eq("company_id", companyId)
      .order("display_order")

    if (data) setProducts(data)
  }

  async function fetchWaitlist(productId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from("product_waitlist")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })

    if (data) setWaitlistEntries(data)
  }

  function openEditDialog(product?: DigitalProduct) {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url || "",
        gumroad_url: product.gumroad_url || "",
        product_type: product.product_type,
        status: product.status,
      })
      setFeaturesText(product.features?.join("\n") || "")
    } else {
      setEditingProduct(null)
      setFormData({
        name: "",
        description: "",
        price: 0,
        image_url: "",
        gumroad_url: "",
        product_type: "chord_pack",
        status: "coming_soon",
      })
      setFeaturesText("")
    }
    setIsDialogOpen(true)
  }

  async function handleSave() {
    const supabase = createClient()
    const features = featuresText.split("\n").filter((f) => f.trim())

    const productData = {
      ...formData,
      company_id: companyId,
      image_url: formData.image_url || null,
      gumroad_url: formData.gumroad_url || null,
      features: features.length > 0 ? features : null,
    }

    if (editingProduct) {
      await supabase.from("digital_products").update(productData).eq("id", editingProduct.id)
    } else {
      const maxOrder = Math.max(...products.map((p) => p.display_order), 0)
      await supabase.from("digital_products").insert({ ...productData, display_order: maxOrder + 1 })
    }

    setIsDialogOpen(false)
    fetchProducts()
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return
    const supabase = createClient()
    await supabase.from("digital_products").delete().eq("id", id)
    fetchProducts()
  }

  function openWaitlistDialog(productId: string, productName: string) {
    setWaitlistDialog({ productId, productName })
    fetchWaitlist(productId)
  }

  const statusColors = {
    available: "bg-green-500/20 text-green-600",
    coming_soon: "bg-yellow-500/20 text-yellow-600",
    sold_out: "bg-red-500/20 text-red-600",
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Digital Products</h2>
        <Button onClick={() => openEditDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <Badge variant="outline">{product.product_type}</Badge>
                    <Badge className={statusColors[product.status]}>{product.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    <span className="font-medium">${product.price.toFixed(2)}</span>
                    {product.gumroad_url && (
                      <a
                        href={product.gumroad_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-1"
                      >
                        Gumroad <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {product.status === "coming_soon" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openWaitlistDialog(product.id, product.name)}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Waitlist
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {products.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No digital products yet. Add your first chord pack or resource!
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Gospel Chord Pack Vol. 1"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what's included..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select
                  value={formData.product_type}
                  onValueChange={(value) => setFormData({ ...formData, product_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chord_pack">Chord Pack</SelectItem>
                    <SelectItem value="midi_pack">MIDI Pack</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="ebook">eBook</SelectItem>
                    <SelectItem value="preset_pack">Preset Pack</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "available" | "coming_soon" | "sold_out") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coming_soon">Coming Soon (Waitlist)</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold_out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Gumroad URL</Label>
              <Input
                value={formData.gumroad_url}
                onChange={(e) => setFormData({ ...formData, gumroad_url: e.target.value })}
                placeholder="https://yourname.gumroad.com/l/product"
              />
            </div>

            <div className="space-y-2">
              <Label>Features (one per line)</Label>
              <Textarea
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="50+ chord voicings&#10;PDF cheat sheet included&#10;Video walkthroughs"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Product</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Waitlist Dialog */}
      <Dialog open={!!waitlistDialog} onOpenChange={() => setWaitlistDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Waitlist for {waitlistDialog?.productName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {waitlistEntries.length} people signed up for notifications
            </p>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {waitlistEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">{entry.email}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {waitlistEntries.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No signups yet</p>
              )}
            </div>
            {waitlistEntries.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const emails = waitlistEntries.map((e) => e.email).join(", ")
                  navigator.clipboard.writeText(emails)
                  alert("Emails copied to clipboard!")
                }}
              >
                Copy All Emails
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
