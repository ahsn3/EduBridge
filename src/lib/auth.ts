import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getDashboardPath } from "@/lib/auth-utils";
import { isAdminEmail } from "@/lib/admin-emails";
import { ensureAdminUser } from "@/lib/ensure-admin-user";
import { authConfig } from "@/lib/auth.config";
import { getAuthSecret, isAuthSecretExplicit } from "@/lib/auth-secret";
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
    avatar?: string | null;
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

function resolveRole(email: string | null | undefined, role?: Role | null): Role {
  if (isAdminEmail(email)) return "ADMIN";
  return role ?? "STUDENT";
}

const secret = getAuthSecret();

if (!isAuthSecretExplicit() && process.env.NODE_ENV === "production") {
  console.warn(
    "Using derived AUTH_SECRET. Set AUTH_SECRET in Railway variables for production hardening."
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret,
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).toLowerCase().trim();

        if (isAdminEmail(email)) {
          await ensureAdminUser(email);
        }

        const user = await db.user.findUnique({ where: { email } });

        if (!user?.password || user.status === "INACTIVE") {
          return null;
        }

        if (!user.emailVerified && !isAdminEmail(email) && user.role !== "ADMIN") {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: resolveRole(email, user.role),
          status: user.status,
          avatar: user.avatar,
          locale: user.locale ?? "ar",
        };
      },
    }),
  ],
});

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function getCurrentUser() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.email) return null;

  const email = sessionUser.email.toLowerCase().trim();

  try {
    if (isAdminEmail(email)) {
      await ensureAdminUser(email);
    }

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        locale: true,
        phone: true,
        bio: true,
        referralCode: true,
        createdAt: true,
      },
    });

    if (user) {
      if (isAdminEmail(email) && user.role !== "ADMIN") {
        return { ...user, role: "ADMIN" as Role, status: "ACTIVE" as AccountStatus };
      }
      return user;
    }
  } catch (error) {
    console.error("getCurrentUser db lookup failed:", error);
  }

  return {
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
    role: resolveRole(email, sessionUser.role),
    status: sessionUser.status,
    avatar: sessionUser.avatar ?? null,
    locale: sessionUser.locale ?? "ar",
    phone: null,
    bio: null,
    referralCode: null,
    createdAt: new Date(),
  };
}

export function requireRole(allowedRoles: Role[]) {
  return async () => {
    const user = await getCurrentUser();
    if (!user || !allowedRoles.includes(user.role)) {
      return null;
    }
    if (user.status === "INACTIVE") {
      return null;
    }
    return user;
  };
}

export { getDashboardPath };
