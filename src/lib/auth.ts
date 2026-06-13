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
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    status: AccountStatus;
    locale: string;
  }
}

async function loadUserAuthFields(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, status: true, locale: true, name: true, email: true },
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

        if (!user.emailVerified) {
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
        const dbUser = await loadUserAuthFields(user.id);
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.status = dbUser.status;
          token.locale = dbUser.locale;
        }
      } else if (token.id) {
        const dbUser = await loadUserAuthFields(token.id);
        if (dbUser) {
          token.role = dbUser.role;
          token.status = dbUser.status;
          token.locale = dbUser.locale;
        }
      }

      if (trigger === "update" && session) {
        token.name = session.name;
        token.locale = session.locale;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.locale = token.locale;
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
