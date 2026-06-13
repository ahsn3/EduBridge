import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getDashboardPath } from "@/lib/auth-utils";
import type { AccountStatus, Role } from "@prisma/client";

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
    },
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
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
        token.id = user.id;
        token.name = user.name;
        token.email = user.email ?? undefined;
        token.picture =
          "avatar" in user && user.avatar ? (user.avatar as string) : undefined;
        if ("role" in user && user.role) token.role = user.role as Role;
        if ("status" in user && user.status) token.status = user.status as AccountStatus;
        if ("locale" in user && user.locale) token.locale = user.locale as string;
      }

      if (token.id) {
        const dbUser = await loadUserAuthFields(token.id);
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.status = dbUser.status;
          token.locale = dbUser.locale;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.avatar;
        }
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
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.locale = token.locale;
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
        session.user.avatar = token.picture ?? null;
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

  const user = await db.user.findUnique({
    where: { id: session.user.id },
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
