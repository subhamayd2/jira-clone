'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, CopyIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import DottedSepartor from '@/components/dotted-separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl, FormField, FormItem, FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useUpdateWorkspace from '@/features/workspaces/api/use-update-workspace';
import { updateWorkspaceSchema } from '@/features/workspaces/schemas';
import type { Workspace } from '@/features/workspaces/types';
import { cn } from '@/lib/utils';
import useConfirm from '@/hooks/use-confirm';
import useDeleteWorkspace from '@/features/workspaces/api/use-delete-workspace';
import useResetInviteCode from '@/features/workspaces/api/use-reset-invite-code';

interface IEditWorkspaceFormProps {
    onCancel?: () => void;
    initialValues: Workspace;
}

const EditWorkspaceForm = ({ onCancel, initialValues }: IEditWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: pendingDelete } = useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: pendingResetCode } = useResetInviteCode();

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete Workspace',
    'This operation cannot be undone. Are you sure you want to delete this workspace?',
    'destructive',
  );

  const [ResetCodeDialog, confirmResetCode] = useConfirm(
    'Reset Invite Code',
    'This will reset the current invite link. Are you sure you want to continue?',
    'destructive',
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? '',
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) {
      return;
    }

    deleteWorkspace(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          router.refresh();
          router.push('/');
        },
      },
    );
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };
    mutate({ form: finalValues, param: { workspaceId: initialValues.$id } }, {
      onSuccess: ({ data: { $id } }) => {
        form.reset();
        router.push(`/workspaces/${$id}`);
      },
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const handleCopyInvite = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullInviteLink)
        .then(() => {
          toast.success('Invite link copied to clipboard');
        });
    } else {
      toast.error('Clipboard not supported');
    }
  };

  const handleResetCode = async () => {
    const ok = await confirmResetCode();
    if (!ok) {
      return;
    }
    resetInviteCode(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };

  return (
      <div className="flex flex-col gap-y-4">
          <DeleteDialog />
          <ResetCodeDialog />
          <Card className="w-full h-full border-none shadow-none">
              <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                  <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={onCancel || (() => router.push(`/workspaces/${initialValues.$id}`))}
                      icon={<ArrowLeftIcon className="size-4" />}
                  >
                      Back
                  </Button>
                  <CardTitle className="text-xl font-bold">
                      {initialValues.name}
                  </CardTitle>
              </CardHeader>
              <div className="px-7">
                  <DottedSepartor />
              </div>
              <CardContent className="p-7">
                  <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                          <div className="flex flex-col gap-y-4">
                              <FormField
                                  name="name"
                                  control={form.control}
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Workspace Name</FormLabel>
                                          <FormControl>
                                              <Input
                                                  {...field}
                                                  placeholder="Enter a workspace name"
                                              />
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <FormField
                                  name="image"
                                  control={form.control}
                                  render={({ field }) => (
                                      <div className="flex flex-col gap-y-2">
                                          <div className="flex items-center gap-x-5">
                                              {field.value ? (
                                                  <div className="size-[72px] relative rounded-md overflow-hidden">
                                                      <Image
                                                          src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                                                          alt="workspace image"
                                                          fill
                                                          className="object-cover"
                                                      />
                                                  </div>
                                              ) : (
                                                  <Avatar className="size-[72px]">
                                                      <AvatarFallback>
                                                          <ImageIcon className="size-[36px] text-neutral-400" />
                                                      </AvatarFallback>
                                                  </Avatar>
                                              )}
                                              <div className="flex flex-col">
                                                  <p className="text-sm">Workspace Icon</p>
                                                  <p className="text-xs text-muted-foreground">
                                                      JPG, PNG, SVG or JPEG, max 1MB
                                                  </p>
                                                  <input
                                                      className="hidden"
                                                      type="file"
                                                      accept=".jpg, .jpeg, .png, .svg"
                                                      ref={inputRef}
                                                      disabled={isPending}
                                                      onChange={handleImageChange}
                                                  />
                                                  {field.value ? (
                                                      <Button
                                                          type="button"
                                                          disabled={isPending}
                                                          variant="destructive"
                                                          size="sm"
                                                          className="w-fit mt-2"
                                                          onClick={() => {
                                                            field.onChange(null);
                                                            if (inputRef.current) {
                                                              inputRef.current.value = '';
                                                            }
                                                          }}
                                                      >
                                                          Remove Image
                                                      </Button>
                                                  ) : (
                                                      <Button
                                                          type="button"
                                                          disabled={isPending}
                                                          variant="ternary"
                                                          size="sm"
                                                          className="w-fit mt-2"
                                                          onClick={() => inputRef.current?.click()}
                                                      >
                                                          Upload Image
                                                      </Button>
                                                  )}
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              />
                          </div>
                          <DottedSepartor className="py-7" />
                          <div className="flex items-center justify-between">
                              <Button
                                  type="button"
                                  size="lg"
                                  className={cn(!onCancel && 'invisible')}
                                  variant="secondary"
                                  onClick={onCancel}
                                  disabled={isPending}
                              >
                                  Cancel
                              </Button>
                              <Button size="lg" loading={isPending} disabled={pendingDelete}>
                                  Save changes
                              </Button>
                          </div>
                      </form>
                  </Form>
              </CardContent>
          </Card>
          <Card className="w-full h-full border-none shadow-none">
              <CardContent className="p-7">
                  <div className="flex flex-col">
                      <h3 className="font-bold">Invite Members</h3>
                      <p className="text-sm text-muted-foreground">
                          Invite members to your workspace and give them access to your projects and tasks.
                      </p>
                      <div className="mt-4">
                          <div className="flex items-center gap-x-2">
                              <Input disabled value={fullInviteLink} />
                              <Button type="button" onClick={handleCopyInvite} variant="secondary" className="size-12">
                                  <CopyIcon className="size-5" />
                              </Button>
                          </div>
                      </div>
                      <DottedSepartor className="py-7" />
                      <Button
                          className="w-fit ml-auto"
                          size="sm"
                          variant="destructive"
                          type="button"
                          disabled={pendingDelete}
                          loading={pendingResetCode}
                          onClick={handleResetCode}
                      >
                          Reset invite link
                      </Button>
                  </div>
              </CardContent>
          </Card>
          <Card className="w-full h-full border-destructive shadow-none">
              <CardContent className="p-7">
                  <div className="flex flex-col">
                      <h3 className="font-bold text-destructive">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground">
                          Deleting a workspace is permanent and cannot be undone. It will delete all associated projects, tasks, and members.
                      </p>
                      <DottedSepartor className="py-7" />
                      <Button
                          className="w-fit ml-auto"
                          size="sm"
                          variant="destructive"
                          type="button"
                          disabled={isPending}
                          loading={pendingDelete}
                          onClick={handleDelete}
                      >
                          Delete Workspace
                      </Button>
                  </div>
              </CardContent>
          </Card>
      </div>
  );
};

export default EditWorkspaceForm;
