import type { NextAuthConfig } from "next-auth";
import type { AccountStatus, InstructorApprovalStatus, Role } from "@prisma/client";
import { isAdminEmail } from "@/lib/admin-emails";

function resolveRole(email: string | null | undefined, role?: Role | null): Role {
  if (isAdminEmail(email)) return "ADMIN";
  return role ?? "STUDENT";
}

export const authConfig = {
  trustHost: true,
  providers: [],
  session: { strategy: "jwt" as const, maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    newUser: "/register/student",
  },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user?.id) {
        const credUser = user as {
          id: string;
          name?: string | null;
          email?: string | null;
          role?: Role;
          status?: AccountStatus;
          locale?: string;
          avatar?: string | null;
          instructorProfileCompleted?: boolean;
          instructorApprovalStatus?: InstructorApprovalStatus | null;
        };

        const email = credUser.email ?? undefined;
        const role = resolveRole(email, credUser.role);

        return {
          ...token,
          sub: credUser.id,
          id: credUser.id,
          role,
          status: role === "ADMIN" ? "ACTIVE" : (credUser.status ?? "ACTIVE"),
          locale: credUser.locale ?? "ar",
          name: credUser.name,
          email,
          picture: credUser.avatar ?? undefined,
          instructorProfileCompleted: credUser.instructorProfileCompleted ?? false,
          instructorApprovalStatus: credUser.instructorApprovalStatus ?? null,
        };
      }

      if (trigger === "update" && session) {
        const update = session as {
          name?: string;
          locale?: string;
          status?: AccountStatus;
          role?: Role;
          instructorProfileCompleted?: boolean;
          instructorApprovalStatus?: InstructorApprovalStatus | null;
        };
        if (update.name) token.name = update.name;
        if (update.locale) token.locale = update.locale;
        if (update.status) token.status = update.status;
        if (update.role) token.role = update.role;
        if (typeof update.instructorProfileCompleted === "boolean") {
          token.instructorProfileCompleted = update.instructorProfileCompleted;
        }
        if (update.instructorApprovalStatus !== undefined) {
          token.instructorApprovalStatus = update.instructorApprovalStatus;
        }
      }

      if (token.email) {
        token.role = resolveRole(token.email as string, token.role as Role);
        if (token.role === "ADMIN") {
          token.status = "ACTIVE";
        }
      }

      return token;
    },
    session({ session, token }) {
      const role = resolveRole(token.email as string | undefined, token.role as Role);

      session.user.id = (token.id as string) ?? (token.sub as string) ?? "";
      session.user.role = role;
      session.user.status = role === "ADMIN"
        ? "ACTIVE"
        : ((token.status as AccountStatus) ?? "ACTIVE");
      session.user.locale = (token.locale as string) ?? "ar";
      session.user.name = (token.name as string) ?? session.user.name ?? "";
      session.user.email = (token.email as string) ?? session.user.email ?? "";
      session.user.avatar = (token.picture as string | null) ?? null;
      session.user.instructorProfileCompleted =
        (token.instructorProfileCompleted as boolean) ?? false;
      session.user.instructorApprovalStatus =
        (token.instructorApprovalStatus as InstructorApprovalStatus | null) ?? null;

      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/auth/redirect`;
    },
  },
} satisfies NextAuthConfig;
