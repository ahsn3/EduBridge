import type { AccountStatus, InstructorApprovalStatus, Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      status: AccountStatus;
      avatar?: string | null;
      locale: string;
      instructorProfileCompleted?: boolean;
      instructorApprovalStatus?: InstructorApprovalStatus | null;
    };
  }

  interface User {
    role: Role;
    status: AccountStatus;
    locale: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    status: AccountStatus;
    locale: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    instructorProfileCompleted?: boolean;
    instructorApprovalStatus?: InstructorApprovalStatus | null;
  }
}

export {};
