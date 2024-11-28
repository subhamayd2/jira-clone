import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createWorkspaceSchema } from '@/features/workspaces/schemas';
import { WORKSPACES_ID } from '@/config';

const workspacesRoute = new Hono()
  .post('/', zValidator('json', createWorkspaceSchema), sessionMiddleware, async (context) => {
    const databases = context.get('databases');
    const user = context.get('user');

    const { name } = context.req.valid('json');

    const workspace = await databases.createDocument(
      WORKSPACES_ID,
    );
  });

export default workspacesRoute;
