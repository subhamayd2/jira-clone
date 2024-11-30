import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { ID, Query } from 'node-appwrite';
import { sessionMiddleware } from '@/lib/session-middleware';
import { getMember } from '@/features/members/utils';
import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config';
import { createProjectSchema, updateProjectSchema } from '@/features/projects/schemas';
import { Project } from '@/features/projects/types';

const projectsRoute = new Hono()
  .get('/', sessionMiddleware, zValidator('query', z.object({ workspaceId: z.string() })), async (context) => {
    const { workspaceId } = context.req.valid('query');
    const databases = context.get('databases');
    const user = context.get('user');

    if (!workspaceId) {
      return context.json({ message: 'Workspace ID is required' }, 400);
    }

    const member = await getMember({ databases, workspaceId, userId: user.$id });

    if (!member) {
      return context.json({ message: 'You are not a member of this workspace' }, 401);
    }

    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.orderDesc('$createdAt'),
    ]);

    return context.json({ data: projects });
  })
  .post('/', sessionMiddleware, zValidator('form', createProjectSchema), async (context) => {
    const databases = context.get('databases');
    const storage = context.get('storage');
    const user = context.get('user');

    const { name, image, workspaceId } = context.req.valid('form');

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) {
      return context.json({ message: 'You are not authorized to create a project in this workspace' }, 401);
    }

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
      const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    }

    const project = await databases.createDocument(
      DATABASE_ID,
      PROJECTS_ID,
      ID.unique(),
      {
        name,
        workspaceId,
        imageUrl: uploadedImageUrl,
      },
    );

    return context.json({ data: project });
  })
  .patch('/:projectId', zValidator('form', updateProjectSchema), sessionMiddleware, async (context) => {
    const databases = context.get('databases');
    const storage = context.get('storage');
    const user = context.get('user');

    const { projectId } = context.req.param();

    const { name, image } = context.req.valid('form');

    const existingProject = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    const member = await getMember({ databases, workspaceId: existingProject.workspaceId, userId: user.$id });

    if (!member) {
      return context.json({ message: 'You are not authorized to update this workspace' }, 401);
    }

    let uploadedImageUrl: string | undefined = image as string;

    if (image instanceof File) {
      const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);
      const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    }

    const project = await databases.updateDocument(DATABASE_ID, PROJECTS_ID, projectId, {
      name,
      imageUrl: uploadedImageUrl,
    });

    return context.json({ data: project });
  })
  .delete('/:projectId', sessionMiddleware, async (context) => {
    const databases = context.get('databases');
    const user = context.get('user');

    const { projectId } = context.req.param();

    const existingProject = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    const member = await getMember({ databases, workspaceId: existingProject.workspaceId, userId: user.$id });
    if (!member) {
      return context.json({ message: 'You are not authorized to delete this project' }, 401);
    }

    // TODO: delete tasks
    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return context.json({ data: { $id: projectId } });
  });

export default projectsRoute;
