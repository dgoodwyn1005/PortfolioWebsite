"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Save, Loader2, CreditCard, CheckCircle, XCircle, ExternalLink, Eye, EyeOff, Package } from "lucide-react"

interface StripeSettingsProps {
  settings: Record<string, string>
}

export function StripeSettings({ settings }: StripeSettingsProps) {
  const [secretKey, setSecretKey] = useState(settings.stripe_secret_key || "")
  const [publishableKey, setPublishableKey] = useState(settings.stripe_publishable_key || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "unknown">(
    settings.stripe_connected === "true" ? "connected" : settings.stripe_secret_key ? "unknown" : "disconnected",
  )
  const router = useRouter()

  const testConnection = async () => {
    if (!secretKey || !publishableKey) {
      setMessage({ type: "error", text: "Please enter both keys before testing" })
      return
    }

    setIsTesting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/stripe/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey, publishableKey }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setConnectionStatus("connected")
        setMessage({ type: "success", text: `Connected to Stripe account: ${data.accountName || data.accountId}` })
      } else {
        setConnectionStatus("disconnected")
        setMessage({ type: "error", text: data.error || "Failed to connect to Stripe" })
      }
    } catch (error) {
      setConnectionStatus("disconnected")
      setMessage({ type: "error", text: "Failed to test Stripe connection" })
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    try {
      // Save the keys
      const updates = [
        { key: "stripe_secret_key", value: secretKey },
        { key: "stripe_publishable_key", value: publishableKey },
        { key: "stripe_connected", value: connectionStatus === "connected" ? "true" : "false" },
      ]

      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ ...update, updated_at: new Date().toISOString() }, { onConflict: "key" })

        if (error) throw error
      }

      setMessage({ type: "success", text: "Stripe settings saved successfully!" })
      router.refresh()
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save settings" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const updates = [
        { key: "stripe_secret_key", value: "" },
        { key: "stripe_publishable_key", value: "" },
        { key: "stripe_connected", value: "false" },
      ]

      for (const update of updates) {
        await supabase
          .from("site_settings")
          .upsert({ ...update, updated_at: new Date().toISOString() }, { onConflict: "key" })
      }

      setSecretKey("")
      setPublishableKey("")
      setConnectionStatus("disconnected")
      setMessage({ type: "success", text: "Stripe disconnected" })
      router.refresh()
    } catch (err) {
      setMessage({ type: "error", text: "Failed to disconnect Stripe" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Stripe Connection</CardTitle>
                <CardDescription>Accept payments and create invoices</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connectionStatus === "connected" ? (
                <span className="flex items-center gap-1 text-green-500 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                  <XCircle className="h-4 w-4" />
                  Not Connected
                </span>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Enter your Stripe API keys from your{" "}
            <a
              href="https://dashboard.stripe.com/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Stripe Dashboard
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="publishable">Publishable Key</Label>
            <Input
              id="publishable"
              value={publishableKey}
              onChange={(e) => setPublishableKey(e.target.value)}
              placeholder="pk_live_... or pk_test_..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">Starts with pk_live_ or pk_test_</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secret">Secret Key</Label>
            <div className="flex gap-2">
              <Input
                id="secret"
                type={showSecret ? "text" : "password"}
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="sk_live_... or sk_test_..."
                className="font-mono text-sm flex-1"
              />
              <Button type="button" variant="outline" size="icon" onClick={() => setShowSecret(!showSecret)}>
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Starts with sk_live_ or sk_test_ (keep this secret!)</p>
          </div>

          <Alert>
            <AlertTitle>Test vs Live Mode</AlertTitle>
            <AlertDescription>
              Use test keys (pk_test_, sk_test_) while developing. Switch to live keys (pk_live_, sk_live_) when you're
              ready to accept real payments.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={testConnection}
              disabled={isTesting || !secretKey || !publishableKey}
            >
              {isTesting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Test Connection
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Keys
            </Button>
            {connectionStatus === "connected" && (
              <Button variant="destructive" onClick={handleDisconnect} disabled={isLoading}>
                Disconnect
              </Button>
            )}
          </div>

          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-green-500" : "text-destructive"}`}>
              {message.text}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Get Your API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Go to your{" "}
              <a
                href="https://dashboard.stripe.com/apikeys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Stripe Dashboard → API Keys
              </a>
            </li>
            <li>
              Copy your <strong>Publishable key</strong> (starts with pk_)
            </li>
            <li>
              Click "Reveal" next to your <strong>Secret key</strong> and copy it (starts with sk_)
            </li>
            <li>Paste both keys above and click "Test Connection"</li>
            <li>Once connected, click "Save Keys"</li>
          </ol>
          <p className="text-xs border-l-2 border-primary pl-3 mt-4">
            <strong>Tip:</strong> Use test mode keys first to verify everything works, then switch to live keys when
            ready to accept real payments.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
