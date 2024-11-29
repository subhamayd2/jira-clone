'use server';

import { createSessionClient } from '@/lib/appwrite';

export const getCurrentUser = async () => {
  try {
    const { account } = await createSessionClient();

    const user = await account.get();
    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
};
