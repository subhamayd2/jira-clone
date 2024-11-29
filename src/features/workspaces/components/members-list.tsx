'use client';

import { ArrowLeft, Loader, MoreVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useWorkspaceId from '@/features/workspaces/hooks/use-workspace-id';
import DottedSeparator from '@/components/dotted-separator';
import { useGetMembers } from '@/features/members/api/use-get-members';
import MemberAvatar from '@/features/members/components/member-avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useUpdateMember from '@/features/members/api/use-update-member';
import useDeleteMember from '@/features/members/api/use-delete-member';
import { MemberRole } from '@/features/members/types';
import useConfirm from '@/hooks/use-confirm';

const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { data: members, isLoading } = useGetMembers({ workspaceId });

  const { mutate: updateMember, isPending: pendingUpdate } = useUpdateMember();
  const { mutate: deleteMember, isPending: pendingDelete } = useDeleteMember();

  const [DeleteModal, confirmDelete] = useConfirm(
    'Remove Member',
    'This member will be removed from the workspace',
    'destructive',
  );

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ json: { role }, param: { memberId } });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      },
    );
  };

  return (
      <Card className="w-full h-full border-none shadow-none">
          <DeleteModal />
          <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
              <Button variant="secondary" size="sm" asChild>
                  <Link href={`/workspaces/${workspaceId}`}>
                      <ArrowLeft className="size-4" />
                      Back
                  </Link>
              </Button>
              <CardTitle className="text-xl font-bold">Members</CardTitle>
          </CardHeader>
          <div className="px-7">
              <DottedSeparator />
          </div>
          <CardContent className="p-7">
              {isLoading
                ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader className="size-4 animate-spin text-muted-foreground" />
                    </div>
                )
                : members?.documents.map((member, index) => (
                    <Fragment key={member.$id}>
                        <div className="flex items-center gap-2">
                            <MemberAvatar
                                name={member.name}
                                className="size-10"
                                fallbackClassName="text-lg"
                            />
                            <div className="flex flex-col">
                                <div className="flex gap-x-2 items-center">
                                    <p className="text-sm font-md">{member.name}</p>
                                    {member.role === MemberRole.ADMIN && (
                                        <span className="bg-slate-100 py-1 px-2 rounded-sm text-xs text-muted-foreground">
                                            Admin
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="ml-auto" variant="secondary" size="icon">
                                        <MoreVerticalIcon className="size-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="bottom" align="end">
                                    <DropdownMenuItem
                                        className="font-medium"
                                        onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                                        disabled={pendingUpdate || pendingDelete}
                                    >
                                        Set as Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="font-medium"
                                        onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                                        disabled={pendingUpdate || pendingDelete}
                                    >
                                        Set as Member
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="font-medium text-destructive"
                                        onClick={() => handleDeleteMember(member.$id)}
                                        disabled={pendingUpdate || pendingDelete}
                                    >
                                        Remove {member.name}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {index < members.documents.length - 1 && <Separator className="my-2.5 bg-gray-100" />}
                    </Fragment>
                ))}
          </CardContent>
      </Card>
  );
};

export default MembersList;
