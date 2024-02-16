import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../lib/prisma';

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  // debug: process.env.NODE_ENV !== 'production',
  providers: [Google],
  adapter: PrismaAdapter(prisma)
  // callbacks: {}
});
