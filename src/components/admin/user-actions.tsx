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
import type { AccountStatus } from "@prisma/client";

interface UserActionsProps {
  userId: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  status: AccountStatus;
}

export function UserActions({ userId, role, status }: UserActionsProps) {
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
        <Badge variant="secondary">Pending</Badge>
        <Button
          size="sm"
          disabled={pending}
          onClick={() => run(() => approveInstructor(userId), "Instructor approved")}
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() => run(() => rejectInstructor(userId), "Application rejected")}
        >
          Reject
        </Button>
      </div>
    );
  }

  if (status === "ACTIVE") {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10">Active</Badge>
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run(() => updateUserStatus(userId, "INACTIVE"), "Account deactivated")}
        >
          Deactivate
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="destructive">Inactive</Badge>
      <Button
        size="sm"
        disabled={pending}
        onClick={() => run(() => updateUserStatus(userId, "ACTIVE"), "Account activated")}
      >
        Activate
      </Button>
    </div>
  );
}
