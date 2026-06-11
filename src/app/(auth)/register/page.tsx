import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, UserCog } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function RegisterHubPage() {
  const session = await auth();
  if (session?.user) {
    redirect(getDashboardPath(session.user.role, session.user.status));
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center space-y-2">
          <Logo variant="full" className="justify-center mb-2" />
          <CardTitle className="text-2xl">Create your EduBridge account</CardTitle>
          <CardDescription>Choose how you want to join the platform</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Link href="/register/student" className="block">
            <div className="rounded-2xl border p-6 h-full hover:border-primary hover:shadow-md transition-all text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Student</h3>
              <p className="text-sm text-muted-foreground">
                Enroll in courses, join live sessions, and track your progress.
              </p>
            </div>
          </Link>
          <Link href="/register/instructor" className="block">
            <div className="rounded-2xl border p-6 h-full hover:border-primary hover:shadow-md transition-all text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Instructor</h3>
              <p className="text-sm text-muted-foreground">
                Teach courses after admin approval. Requires activation.
              </p>
            </div>
          </Link>
          <Button asChild variant="ghost" className="sm:col-span-2">
            <Link href="/login">Already have an account? Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
