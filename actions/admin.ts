'use server';

import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { currentRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const admin = async () => {
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    return { success: 'Allowed Server Action!' };
  }

  return { error: 'Forbidden Server Action!' };
};

export async function setAsAdmin(id: string) {
  await prisma.user.update({
    where: {
      id
    },
    data: {
      role: 'ADMIN'
    }
  });
  revalidatePath('/admin');
}
