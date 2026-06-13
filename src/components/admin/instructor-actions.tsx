"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  approveInstructor,
  rejectInstructor,
  requestInstructorInfo,
  updateUserStatus,
} from "@/actions/admin";
import { useLocale } from "@/hooks/use-locale";
import type { AccountStatus, InstructorApprovalStatus } from "@prisma/client";

interface InstructorActionsProps {
  userId: string;
  status: AccountStatus;
  approvalStatus?: InstructorApprovalStatus | null;
}

export function InstructorActions({ userId, status, approvalStatus }: InstructorActionsProps) {
  const { t, locale } = useLocale();
  const [pending, startTransition] = useTransition();
  const [notes, setNotes] = useState("");

  function run(action: () => Promise<{ error?: string; success?: boolean }>, msg: string) {
    startTransition(async () => {
      const result = await action();
      if (result.error) toast.error(result.error);
      else toast.success(msg);
    });
  }

  if (approvalStatus === "PENDING_REVIEW" || (status === "PENDING" && approvalStatus !== "PROFILE_INCOMPLETE")) {
    return (
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{t.admin.pending}</Badge>
        <Button size="sm" disabled={pending} onClick={() => run(() => approveInstructor(userId), t.admin.instructorApproved)}>
          {t.admin.approve}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">{locale === "ar" ? "طلب معلومات" : "Request Info"}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{locale === "ar" ? "طلب معلومات إضافية" : "Request Additional Info"}</DialogTitle>
            </DialogHeader>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
            <Button
              disabled={pending || !notes.trim()}
              onClick={() => run(() => requestInstructorInfo(userId, notes), locale === "ar" ? "تم الإرسال" : "Sent")}
            >
              {t.common.submit}
            </Button>
          </DialogContent>
        </Dialog>
        <Button size="sm" variant="destructive" disabled={pending} onClick={() => run(() => rejectInstructor(userId), t.admin.applicationRejected)}>
          {t.admin.reject}
        </Button>
      </div>
    );
  }

  if (status === "ACTIVE") {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-emerald-500/10 text-emerald-700">{t.admin.active}</Badge>
        <Button size="sm" variant="outline" disabled={pending} onClick={() => run(() => updateUserStatus(userId, "INACTIVE"), t.admin.accountDeactivated)}>
          {t.admin.deactivate}
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" disabled={pending} onClick={() => run(() => updateUserStatus(userId, "ACTIVE"), t.admin.accountActivated)}>
      {t.admin.activate}
    </Button>
  );
}
