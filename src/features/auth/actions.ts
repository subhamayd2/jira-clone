'use server';

import { cookies } from 'next/headers';
import { Account, Client } from 'node-appwrite';
import { AUTH_COOKIE } from '@/features/auth/contants';

export const getCurrentUser = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE);

    if (!session) {
      return null;
    }

    client.setSession(session.value);

    const account = new Account(client);
    const user = await account.get();
    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
};
