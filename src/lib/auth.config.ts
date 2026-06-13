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
        };

        const email = credUser.email ?? undefined;
        const role = resolveRole(email, credUser.role);

        return {
          ...token,
          sub: credUser.id,
          id: credUser.id,
          role,
          status: credUser.status ?? "ACTIVE",
          locale: credUser.locale ?? "ar",
          name: credUser.name,
          email,
          picture: credUser.avatar ?? undefined,
          instructorProfileCompleted: false,
          instructorApprovalStatus: null,
        };
      }

      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.locale) token.locale = session.locale;
      }

      if (token.email) {
        token.role = resolveRole(token.email as string, token.role as Role);
      }

      return token;
    },
    session({ session, token }) {
      const role = resolveRole(token.email as string | undefined, token.role as Role);

      session.user.id = (token.id as string) ?? (token.sub as string) ?? "";
      session.user.role = role;
      session.user.status = ((token.status as AccountStatus) ?? "ACTIVE");
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
