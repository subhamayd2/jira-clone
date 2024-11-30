import { cookies } from 'next/headers';
import { createSessionClient } from '@/lib/appwrite';
import { DATABASE_ID, PROJECTS_ID } from '@/config';
import { AUTH_COOKIE } from '@/features/auth/contants';
import { getMember } from '@/features/members/utils';
import { Project } from './types';

interface IProjectInfoProps {
    projectId: string
  }

export const getProject = async ({ projectId }: IProjectInfoProps) => {
  const cookiesData = cookies().get(AUTH_COOKIE);
  try {
    const { account, databases } = await createSessionClient({ cookie: () => cookiesData });

    const user = await account.get();

    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

    const member = await getMember({ databases, workspaceId: project.workspaceId, userId: user.$id });
    if (!member) {
      throw new Error('You are not a member of this project');
    }

    return project;
  } catch (e) {
    console.error(e);
    throw new Error('Project not found');
  }
};
