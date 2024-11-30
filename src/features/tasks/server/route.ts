import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';
import { sessionMiddleware } from '@/lib/session-middleware';
import { getMember } from '@/features/members/utils';
import {
  DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID,
} from '@/config';
import { createTaskSchema } from '@/features/tasks/schemas';
import { Task, TaskStatus } from '@/features/tasks/types';
import { createAdminClient } from '@/lib/appwrite';
import { Project } from '@/features/projects/types';

const tasksRoute = new Hono()
  .get(
    '/',
    sessionMiddleware,
    zValidator('query', z.object({
      workspaceId: z.string(),
      projectId: z.string().nullish(),
      assigneeId: z.string().nullish(),
      status: z.nativeEnum(TaskStatus).nullish(),
      search: z.string().nullish(),
      dueDate: z.string().nullish(),
    })),
    async (context) => {
      const { users } = await createAdminClient();
      const databases = context.get('databases');
      const user = context.get('user');

      const {
        workspaceId,
        projectId,
        assigneeId,
        status,
        search,
        dueDate,
      } = context.req.valid('query');

      const member = await getMember({ databases, workspaceId, userId: user.$id });
      if (!member) {
        return context.json({ message: 'You are not a member of this workspace' }, 401);
      }

      const query = [
        Query.equal('workspaceId', workspaceId),
        Query.orderDesc('$createdAt'),
      ];

      if (projectId) {
        console.log('projectId', projectId);
        query.push(Query.equal('projectId', projectId));
      }

      if (assigneeId) {
        console.log('assigneeId', assigneeId);
        query.push(Query.equal('assigneeId', assigneeId));
      }

      if (status) {
        console.log('status', status);
        query.push(Query.equal('status', status));
      }

      if (search) {
        console.log('search', search);
        query.push(Query.search('name', search));
      }

      if (dueDate) {
        console.log('dueDate', dueDate);
        query.push(Query.equal('dueDate', dueDate));
      }

      const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, query);

      const projectIds: Array<string> = [];
      const assigneeIds: Array<string> = [];

      tasks.documents.forEach((task) => {
        projectIds.push(task.projectId);
        assigneeIds.push(task.assigneeId);
      });

      const projects = await databases.listDocuments<Project>(DATABASE_ID, PROJECTS_ID, projectIds.length > 0 ? [
        Query.contains('$id', projectIds),
      ] : []);

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, assigneeIds.length > 0 ? [
        Query.contains('$id', assigneeIds),
      ] : []);

      const userIds = members.documents.map((m) => m.userId);

      const allUsersByIds = await users.list([
        Query.contains('$id', userIds),
      ]);

      const assignees = allUsersByIds.total === 0 ? [] : members.documents.map((m) => {
        const u = allUsersByIds.users.find((x) => x.$id === m.userId)!;
        return {
          ...m,
          name: u.name,
          email: u.email,
        };
      });

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find((p) => p.$id === task.projectId);
        const assignee = assignees.find((a) => a.$id === task.assigneeId);

        return {
          ...task,
          project,
          assignee,
        };
      });

      return context.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    },
  )
  .post('/', sessionMiddleware, zValidator('json', createTaskSchema), async (context) => {
    const user = context.get('user');
    const databases = context.get('databases');

    const {
      name,
      projectId,
      workspaceId,
      dueDate,
      assigneeId,
      status,
      description,
    } = context.req.valid('json');

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) {
      return context.json({ message: 'You are not a member of this workspace' }, 401);
    }

    const highestPositionTask = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('status', status),
      Query.equal('workspaceId', workspaceId),
      Query.equal('projectId', projectId),
      Query.orderDesc('position'),
      Query.limit(1),
    ]);

    const newPosition = highestPositionTask.documents.length === 0 ? 1000 : highestPositionTask.documents[0].position + 1000;

    const task = await databases.createDocument(DATABASE_ID, TASKS_ID, ID.unique(), {
      name,
      projectId,
      workspaceId,
      dueDate,
      assigneeId,
      status,
      description,
      position: newPosition,
    });

    return context.json({ data: task });
  });

export default tasksRoute;
