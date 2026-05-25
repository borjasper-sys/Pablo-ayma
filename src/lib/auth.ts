import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { prisma } from "@/lib/prisma";

type AuthUser = {
  id: string;
  name: string | null;
  email?: string | null;
  username?: string | null;
  passwordHash: string;
  role: "MASTER" | "TRAINER";
  active?: boolean | number | null;
};

function usernameVariants(username: string) {
  const lower = username.toLowerCase();
  const title = lower.charAt(0).toUpperCase() + lower.slice(1);

  return Array.from(new Set([username, lower, username.toUpperCase(), title]));
}

async function findLocalSqliteUser(username: string) {
  if (!process.env.DATABASE_URL?.startsWith("file:")) {
    return null;
  }

  const databaseName = process.env.DATABASE_URL.replace("file:", "").replace(/^\.\//, "");
  const databasePath = path.join(process.cwd(), "prisma", databaseName);
  const safeUsername = username.replaceAll("'", "''");
  const output = execFileSync(
    "sqlite3",
    [
      "-json",
      databasePath,
      `SELECT id, name, username, username AS email, passwordHash, role, 1 AS active
       FROM "User"
       WHERE lower(username) = lower('${safeUsername}') OR lower(name) = lower('${safeUsername}')
       LIMIT 1`
    ],
    { encoding: "utf8" }
  );

  if (!output.trim()) {
    return null;
  }

  const users = JSON.parse(output) as AuthUser[];
  return users[0] ?? null;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Usuario y contraseña",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (!username || !password) {
          return null;
        }

        const variants = usernameVariants(username);
        let user = await findLocalSqliteUser(username);

        if (!user) {
          user = await prisma.user.findFirst({
            where: {
              OR: variants.flatMap((value) => [{ email: value }, { name: value }])
            }
          });
        }

        if (!user || !user.active) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name ?? user.username ?? "Master",
          email: user.email ?? user.username ?? "Master",
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: "MASTER" | "TRAINER" }).role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "MASTER" | "TRAINER" | undefined;
      }

      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
