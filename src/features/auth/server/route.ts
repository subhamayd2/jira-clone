import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID } from 'node-appwrite';
import { setCookie, deleteCookie } from 'hono/cookie';
import { loginSchema, signUpSchema } from '@/features/auth/schemas';
import { createAdminClient } from '@/lib/appwrite';
import { AUTH_COOKIE } from '@/features/auth/contants';
import { sessionMiddleware } from '@/lib/session-middleware';

const authRoute = new Hono()
  .get('/user', sessionMiddleware, (context) => {
    const user = context.get('user');
    return context.json({ data: user });
  })
  .post('/login', zValidator('json', loginSchema), async (context) => {
    const { email, password } = context.req.valid('json');
    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(context, AUTH_COOKIE, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
    });

    return context.json({ message: 'User logged in successfully' });
  })
  .post('/signup', zValidator('json', signUpSchema), async (context) => {
    const { name, email, password } = context.req.valid('json');

    const { account } = createAdminClient();
    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(context, AUTH_COOKIE, session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
    });

    return context.json({ message: 'User signed up successfully' });
  })
  .post('/logout', sessionMiddleware, async (context) => {
    deleteCookie(context, AUTH_COOKIE);
    const account = context.get('account');
    await account.deleteSession('current');
    return context.json({ message: 'User logged out successfully' });
  });

export default authRoute;
