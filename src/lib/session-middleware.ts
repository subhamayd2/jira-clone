import 'server-only';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import {
  Client, Account, Storage, Databases,
  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StorageType,
  type Users as UsersType,
  Models,
} from 'node-appwrite';
import { AUTH_COOKIE } from '@/features/contants';

type AdditionalContext = {
    Variables: {
      account: AccountType;
      databases: DatabasesType;
      storage: StorageType;
      users: UsersType;
      user: Models.User<Models.Preferences>;
    }
}

export const sessionMiddleware = createMiddleware<AdditionalContext>(async (context, next) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = getCookie(context, AUTH_COOKIE);

  if (!session) {
    return context.json({ message: 'Unauthorized' }, 401);
  }

  client.setSession(session);

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  const user = await account.get();

  if (!user) {
    return context.json({ message: 'Unauthorized' }, 401);
  }

  context.set('account', account);
  context.set('user', user);
  context.set('databases', databases);
  context.set('storage', storage);

  await next();
});
