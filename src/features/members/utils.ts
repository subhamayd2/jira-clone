import { Query, type Databases } from 'node-appwrite';
import { DATABASE_ID, MEMBERS_ID } from '@/config';

interface IMemberProps {
    databases: Databases;
    workspaceId: string;
    userId: string;
}

export const getMember = async ({ databases, workspaceId, userId }: IMemberProps) => {
  const members = await databases.listDocuments(
    DATABASE_ID,
    MEMBERS_ID,
    [
      Query.equal('workspaceId', workspaceId),
      Query.equal('userId', userId),
    ],
  );

  return members.documents[0];
};
