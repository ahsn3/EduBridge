import { getAllPayments, updatePaymentStatus } from "@/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDateTime } from "@/lib/utils";

const statusVariant: Record<string, "default" | "secondary" | "success" | "destructive" | "warning"> = {
  COMPLETED: "success",
  PENDING: "warning",
  FAILED: "destructive",
  REFUNDED: "secondary",
};

export default async function AdminPaymentsPage() {
  const payments = await getAllPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إدارة المدفوعات</h1>
        <p className="text-muted-foreground">{payments.length} عملية دفع</p>
      </div>

      <div className="grid gap-3">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium">{payment.user.name}</p>
                <p className="text-sm text-muted-foreground">{payment.user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDateTime(payment.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{formatPrice(payment.amount)}</span>
                <Badge variant={statusVariant[payment.paymentStatus]}>
                  {payment.paymentStatus}
                </Badge>
                {payment.paymentStatus === "PENDING" && (
                  <form action={async () => {
                    "use server";
                    await updatePaymentStatus(payment.id, "COMPLETED");
                  }}>
                    <Button type="submit" size="sm">تأكيد</Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
