import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getDashboardPath } from "@/lib/auth-utils";
import { isAdminEmail } from "@/lib/admin-emails";
import { ensureAdminUser } from "@/lib/ensure-admin-user";
import type { AccountStatus, InstructorApprovalStatus, Role } from "@prisma/client";
import type { JWT } from "@auth/core/jwt";

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

async function loadUserAuthFields(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
      locale: true,
      name: true,
      email: true,
      avatar: true,
      instructorProfile: {
        select: { profileCompleted: true, approvalStatus: true },
      },
    },
  });
}

async function loadUserAuthFieldsByEmail(email: string) {
  return db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: {
      id: true,
      role: true,
      status: true,
      locale: true,
      name: true,
      email: true,
      avatar: true,
      instructorProfile: {
        select: { profileCompleted: true, approvalStatus: true },
      },
    },
  });
}

function applyDbUserToToken(token: JWT, dbUser: NonNullable<Awaited<ReturnType<typeof loadUserAuthFields>>>) {
  return {
    ...token,
    sub: dbUser.id,
    id: dbUser.id,
    role: dbUser.role,
    status: dbUser.status,
    locale: dbUser.locale,
    name: dbUser.name,
    email: dbUser.email,
    picture: dbUser.avatar,
    instructorProfileCompleted: dbUser.instructorProfile?.profileCompleted ?? false,
    instructorApprovalStatus: dbUser.instructorProfile?.approvalStatus ?? null,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  trustHost: true,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    newUser: "/register/student",
  },
  providers: [
    Credentials({
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

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        if (user.status === "INACTIVE") {
          return null;
        }

        if (!user.emailVerified && user.role !== "ADMIN") {
          return null;
        }

        if (!user.password) {
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
          role: user.role,
          status: user.status,
          avatar: user.avatar,
          locale: user.locale,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
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

        return {
          ...token,
          sub: credUser.id,
          id: credUser.id,
          role: credUser.role ?? "STUDENT",
          status: credUser.status ?? "ACTIVE",
          locale: credUser.locale ?? "ar",
          name: credUser.name,
          email: credUser.email ?? undefined,
          picture: credUser.avatar ?? undefined,
          instructorProfileCompleted: false,
          instructorApprovalStatus: null,
        };
      }

      if (isAdminEmail(typeof token.email === "string" ? token.email : undefined)) {
        return {
          ...token,
          role: "ADMIN" as Role,
          status: "ACTIVE" as AccountStatus,
        };
      }

      const email = typeof token.email === "string" ? token.email : undefined;
      const dbUser = email
        ? await loadUserAuthFieldsByEmail(email)
        : token.id
          ? await loadUserAuthFields(token.id)
          : null;

      if (dbUser) {
        return applyDbUserToToken(token, dbUser);
      }

      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.locale) token.locale = session.locale;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = isAdminEmail(token.email)
          ? "ADMIN"
          : token.role;
        session.user.status = token.status;
        session.user.locale = token.locale;
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
        session.user.avatar = token.picture ?? null;
        session.user.instructorProfileCompleted = token.instructorProfileCompleted ?? false;
        session.user.instructorApprovalStatus = token.instructorApprovalStatus ?? null;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/auth/redirect`;
    },
  },
});

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) return null;

  const email = session.user.email?.toLowerCase().trim();

  if (isAdminEmail(email)) {
    await ensureAdminUser(email!);
  }

  const user = await db.user.findUnique({
    where: email ? { email } : { id: session.user.id },
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

  return user;
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
