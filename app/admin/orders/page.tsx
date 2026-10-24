import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAdmin } from "@/lib/admin/require-admin"
import { formatDistance } from "date-fns"

export default async function OrdersPage() {
  const { supabase } = await requireAdmin()

  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  const totalRevenue =
    orders?.reduce((sum, order) => {
      return order.status === "completed" ? sum + order.amount_paid : sum
    }, 0) || 0

  const completedOrders = orders?.filter((o) => o.status === "completed").length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">View and manage customer orders</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-3xl">{orders?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completedOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">${(totalRevenue / 100).toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-4">
        {orders?.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{order.user_email}</CardTitle>
                  <CardDescription>
                    {order.created_at && formatDistance(new Date(order.created_at), new Date(), { addSuffix: true })}
                  </CardDescription>
                </div>
                <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="ml-2 font-medium">
                    ${(order.amount_paid / 100).toFixed(2)} {order.currency.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Service Type:</span>
                  <span className="ml-2 font-medium capitalize">{order.service_type}</span>
                </div>
                {order.user_name && (
                  <div>
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="ml-2 font-medium">{order.user_name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {!orders?.length && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">No orders yet</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
