'use server';

import {
  Query,
} from 'node-appwrite';
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { createSessionClient } from '@/lib/appwrite';
import { Workspace } from './types';

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('userId', user.$id),
    ]);

    if (members.total === 0) {
      return { total: 0, documents: [] };
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
      Query.orderDesc('$createdAt'),
      Query.contains('$id', workspaceIds),
    ]);

    return workspaces;
  } catch (e) {
    console.error(e);
    return { total: 0, documents: [] };
  }
};

interface IWorkspaceInfoProps {
  workspaceId: string
}

export const getWorkspace = async ({ workspaceId }: IWorkspaceInfoProps) => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const member = await getMember({ databases, workspaceId, userId: user.$id });
    if (!member) {
      return null;
    }

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return workspace;
  } catch (e) {
    console.error(e);
    return null;
  }
};

interface IWorkspaceInfoProps {
    workspaceId: string
  }

export const getWorkspaceInfo = async ({ workspaceId }: IWorkspaceInfoProps) => {
  try {
    const { databases } = await createSessionClient();

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return {
      name: workspace.name,
      imageUrl: workspace.imageUrl,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};
