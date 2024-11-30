'use server';

import { cookies } from 'next/headers';
import { createSessionClient } from '@/lib/appwrite';
import { AUTH_COOKIE } from './contants';

export const getCurrentUser = async () => {
  const cookiesData = cookies().get(AUTH_COOKIE);

  try {
    const { account } = await createSessionClient({ cookie: () => cookiesData });

    const user = await account.get();
    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
};
