import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, LogOut } from "lucide-react";

export default async function PendingApprovalPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "INSTRUCTOR" || session.user.status !== "PENDING") {
    redirect("/instructor");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-xl text-center">
        <CardHeader className="space-y-4">
          <Logo variant="full" className="justify-center" href={null} />
          <div className="mx-auto h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Clock className="h-7 w-7 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Your instructor account has been created and is waiting for admin approval.
            You will get access to the instructor dashboard once activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <LogOut className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
