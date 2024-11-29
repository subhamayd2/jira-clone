'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import DottedSepartor from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import useJoinWorkspace from '@/features/workspaces/api/use-join-workspace';
import useInviteCode from '@/features/workspaces/hooks/use-invite-code';
import useWorkspaceId from '@/features/workspaces/hooks/use-workspace-id';
import WorkspaceAvatar from './workspace-avatar';

interface IJoinWorkspaceFormProps {
    initialValues: {
        name: string;
        imageUrl?: string;
    }
}

const JoinWorkspaceForm = ({ initialValues: { name, imageUrl } }: IJoinWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate: joinWorkspace, isPending } = useJoinWorkspace();
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();

  const handleJoinWorkspace = () => {
    joinWorkspace(
      { json: { code: inviteCode }, param: { workspaceId } },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      },
    );
  };

  return (
      <Card className="w-full h-full border-none shadow-none">
          <CardHeader className="p-7">
              <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
              <CardDescription>🎉 You&apos;ve been invited to join the workspace&nbsp;&nbsp;
                  <strong className="text-black border border-gray-200 py-2 px-3 rounded-md inline-flex items-center gap-x-2 align-middle">
                      <WorkspaceAvatar name={name} image={imageUrl} />{name}
                  </strong>
              </CardDescription>
          </CardHeader>
          <div className="px-7">
              <DottedSepartor />
          </div>
          <CardContent className="p-7">
              <div className="flex items-center flex-col lg:flex-row gap-2 justify-between">
                  <Button variant="secondary" type="button" asChild className="w-full lg:w-fit" size="lg" disabled={isPending}>
                      <Link href="/">
                          Cancel
                      </Link>
                  </Button>
                  <Button
                      className="w-full lg:w-fit"
                      size="lg"
                      type="button"
                      loading={isPending}
                      onClick={handleJoinWorkspace}
                  >
                      Join Workspace
                  </Button>
              </div>
          </CardContent>
      </Card>
  );
};

export default JoinWorkspaceForm;
