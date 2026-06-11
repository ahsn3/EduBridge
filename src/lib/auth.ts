import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  AUTH_INTENT_COOKIE,
  getDashboardPath,
  type AuthIntent,
} from "@/lib/auth-utils";
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

async function getAuthIntent(): Promise<AuthIntent> {
  try {
    const cookieStore = await cookies();
    const intent = cookieStore.get(AUTH_INTENT_COOKIE)?.value;
    if (intent === "student" || intent === "instructor" || intent === "login") {
      return intent;
    }
  } catch {
    // cookies unavailable outside request
  }
  return "login";
}

async function clearAuthIntent() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_INTENT_COOKIE);
  } catch {
    // ignore
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
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
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

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        if (user.status === "INACTIVE") {
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
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return true;
      }

      const existing = await db.user.findUnique({
        where: { email: user.email },
      });

      if (existing?.status === "INACTIVE") {
        return false;
      }

      await clearAuthIntent();
      return true;
    },
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
  events: {
    async createUser({ user }) {
      const intent = await getAuthIntent();
      const isInstructorSignup = intent === "instructor";

      await db.user.update({
        where: { id: user.id },
        data: {
          role: isInstructorSignup ? "INSTRUCTOR" : "STUDENT",
          status: isInstructorSignup ? "PENDING" : "ACTIVE",
          nameAr: user.name,
          nameEn: user.name,
        },
      });

      await clearAuthIntent();
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
