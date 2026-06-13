"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  approveInstructor,
  rejectInstructor,
  updateUserStatus,
} from "@/actions/admin";
import { useLocale } from "@/hooks/use-locale";
import type { AccountStatus } from "@prisma/client";

interface UserActionsProps {
  userId: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  status: AccountStatus;
}

export function UserActions({ userId, role, status }: UserActionsProps) {
  const { t } = useLocale();
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ error?: string; success?: boolean }>, successMsg: string) {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(successMsg);
      }
    });
  }

  if (role === "INSTRUCTOR" && status === "PENDING") {
    return (
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{t.admin.pending}</Badge>
        <Button
          size="sm"
          disabled={pending}
          onClick={() => run(() => approveInstructor(userId), t.admin.instructorApproved)}
        >
          {t.admin.approve}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() => run(() => rejectInstructor(userId), t.admin.applicationRejected)}
        >
          {t.admin.reject}
        </Button>
      </div>
    );
  }

  if (status === "ACTIVE") {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10">
          {t.admin.active}
        </Badge>
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run(() => updateUserStatus(userId, "INACTIVE"), t.admin.accountDeactivated)}
        >
          {t.admin.deactivate}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="destructive">{t.admin.inactive}</Badge>
      <Button
        size="sm"
        disabled={pending}
        onClick={() => run(() => updateUserStatus(userId, "ACTIVE"), t.admin.accountActivated)}
      >
        {t.admin.activate}
      </Button>
    </div>
  );
}
