import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from './lib/prisma';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  // debug: process.env.NODE_ENV !== 'production',
  providers: [Google],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session({ session, user }) {
      if (!session?.user) {
        return session;
      }
      // @ts-ignore
      session.user.role = user.role;
      return session;
    }
  }
});
