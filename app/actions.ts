'use server';

import { revalidatePath } from 'next/cache';

export async function setAsAdmin(id: string) {
  const updateUser = await prisma.user.update({
    where: {
      id
    },
    data: {
      role: 'ADMIN'
    }
  });
  revalidatePath('/admin');
}
