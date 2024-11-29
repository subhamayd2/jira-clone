import { Hono } from 'hono';
import { Models, Query } from 'node-appwrite';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { DATABASE_ID, MEMBERS_ID } from '@/config';
import { createAdminClient } from '@/lib/appwrite';
import { getMember } from '@/features/members/utils';
import { MemberRole } from '@/features/members/types';

const membersRoute = new Hono()
  .get('/', sessionMiddleware, zValidator('query', z.object({ workspaceId: z.string() })), async (context) => {
    const { users } = await createAdminClient();
    const databases = context.get('databases');
    const user = context.get('user');

    const { workspaceId } = context.req.valid('query');

    const member = await getMember({ databases, workspaceId, userId: user.$id });

    if (!member) {
      return context.json({ message: 'You are not a member of this workspace' }, 401);
    }

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('workspaceId', workspaceId),
    ]);

    const populatedMembers = await Promise.all(
      members.documents.map(async (m) => {
        const u = await users.get(m.userId);
        return {
          ...m, name: u.name, email: u.email, self: m.userId === user.$id, role: m.role,
        } as unknown as Models.User<Models.Preferences> & { self: boolean; role: MemberRole };
      }),
    );

    return context.json({
      data: {
        ...members,
        documents: populatedMembers,
      },
    });
  })
  .delete('/:memberId', sessionMiddleware, async (context) => {
    const databases = context.get('databases');
    const user = context.get('user');
    const { memberId } = context.req.param();

    const memberToDelete = await databases.getDocument(DATABASE_ID, MEMBERS_ID, memberId);

    const allMembersInWorkspace = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('workspaceId', memberToDelete.workspaceId),
    ]);

    const member = await getMember({ databases, workspaceId: memberToDelete.workspaceId, userId: user.$id });

    if (!member) {
      return context.json({ message: 'You are not authorized to delete this member' }, 401);
    }

    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return context.json({ message: 'You are not authorized to delete this member' }, 401);
    }

    if (allMembersInWorkspace.total === 1) {
      return context.json({ message: 'You cannot delete the last member of this workspace' }, 400);
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return context.json({ data: { $id: memberToDelete.$id } });
  })
  .patch('/:memberId', sessionMiddleware, zValidator('json', z.object({ role: z.nativeEnum(MemberRole) })), async (context) => {
    const databases = context.get('databases');
    const user = context.get('user');
    const { memberId } = context.req.param();

    const { role } = context.req.valid('json');

    const memberToUpdate = await databases.getDocument(DATABASE_ID, MEMBERS_ID, memberId);

    const allMembersInWorkspace = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('workspaceId', memberToUpdate.workspaceId),
    ]);

    const member = await getMember({ databases, workspaceId: memberToUpdate.workspaceId, userId: user.$id });

    if (!member) {
      return context.json({ message: 'You are not authorized to update this member' }, 401);
    }

    if (member.role !== MemberRole.ADMIN) {
      return context.json({ message: 'You are not authorized to update this member' }, 401);
    }

    if (allMembersInWorkspace.total === 1) {
      return context.json({ message: 'You cannot update the last member of this workspace' }, 400);
    }

    await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
      role,
    });

    return context.json({ data: { $id: memberToUpdate.$id } });
  });

export default membersRoute;
