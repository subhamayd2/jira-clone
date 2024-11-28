'use server';

import { cookies } from 'next/headers';
import {
  Account, Client, Databases, Query,
} from 'node-appwrite';
import { AUTH_COOKIE } from '@/features/auth/contants';
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { Workspace } from './types';

export const getWorkspaces = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE);

    if (!session) {
      return { total: 0, documents: [] };
    }

    client.setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);

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

interface IWorkspaceProps {
  workspaceId: string
}

export const getWorkspace = async ({ workspaceId }: IWorkspaceProps) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE);

    if (!session) {
      return null;
    }

    client.setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);
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
