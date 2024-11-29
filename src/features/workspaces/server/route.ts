import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { createWorkspaceSchema, updateWorkspaceSchema } from '@/features/workspaces/schemas';
import {
  DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID,
} from '@/config';
import { MemberRole } from '@/features/members/types';
import { generateInviteCode } from '@/lib/utils';
import { getMember } from '@/features/members/utils';
import { Workspace } from '@/features/workspaces/types';

const workspacesRoute = new Hono()
  .get('/', sessionMiddleware, async (context) => {
    const user = context.get('user');
    const databases = context.get('databases');

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('userId', user.$id),
    ]);

    if (members.total === 0) {
      return context.json({ data: { total: 0, documents: [] } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
      Query.orderDesc('$createdAt'),
      Query.contains('$id', workspaceIds),
    ]);
    return context.json({ data: workspaces });
  })
  .post('/', zValidator('form', createWorkspaceSchema), sessionMiddleware, async (context) => {
    const databases = context.get('databases');
    const storage = context.get('storage');
    const user = context.get('user');

    const { name, image } = context.req.valid('form');

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
      const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    }

    const workspace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageUrl: uploadedImageUrl,
        inviteCode: generateInviteCode(6),
      },
    );

    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      workspaceId: workspace.$id,
      userId: user.$id,
      role: MemberRole.ADMIN,
    });

    return context.json({ data: workspace });
  })
  .patch('/:workspaceId', zValidator('form', updateWorkspaceSchema), sessionMiddleware, async (context) => {
    const databases = context.get('databases');
    const storage = context.get('storage');
    const user = context.get('user');

    const { workspaceId } = context.req.param();

    const { name, image } = context.req.valid('form');

    const member = await getMember({ databases, workspaceId, userId: user.$id });

    if (!member || member.role !== MemberRole.ADMIN) {
      return context.json({ message: 'You are not authorized to update this workspace' }, 401);
    }

    let uploadedImageUrl: string | undefined = image as string;

    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
      const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    }

    const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
      name,
      imageUrl: uploadedImageUrl,
    });

    return context.json({ data: workspace });
  })
  .delete('/:workspaceId', sessionMiddleware, async (context) => {
    const databases = context.get('databases');
    const user = context.get('user');

    const { workspaceId } = context.req.param();

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member || member.role !== MemberRole.ADMIN) {
      return context.json({ message: 'You are not authorized to delete this workspace' }, 401);
    }

    // TODO: delete members, projects & tasks
    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return context.json({ data: { $id: workspaceId } });
  })
  .post('/:workspaceId/reset-invite-code', sessionMiddleware, async (context) => {
    const databases = context.get('databases');
    const user = context.get('user');

    const { workspaceId } = context.req.param();

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member || member.role !== MemberRole.ADMIN) {
      return context.json({ message: 'You are not authorized to reset invite code' }, 401);
    }

    const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
      inviteCode: generateInviteCode(6),
    });

    return context.json({ data: workspace });
  })
  .post('/:workspaceId/join', sessionMiddleware, zValidator('json', z.object({ code: z.string() })), async (context) => {
    const { workspaceId } = context.req.param();
    const { code } = context.req.valid('json');

    const databases = context.get('databases');
    const user = context.get('user');
    const member = await getMember({ databases, workspaceId, userId: user.$id });

    if (member) {
      return context.json({ message: 'Already a member of this workspace' }, 400);
    }

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);
    if (!workspace) {
      return context.json({ message: 'Workspace not found' }, 404);
    }

    if (workspace.inviteCode !== code) {
      return context.json({ message: 'Invalid invite code' }, 400);
    }

    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      workspaceId,
      userId: user.$id,
      role: MemberRole.MEMBER,
    });

    return context.json({ data: workspace });
  });

export default workspacesRoute;
