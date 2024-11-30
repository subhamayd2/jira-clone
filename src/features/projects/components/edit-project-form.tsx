'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DottedSeparator from '@/components/dotted-separator';
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
import type { Project } from '@/features/projects/types';
import useConfirm from '@/hooks/use-confirm';
import { cn } from '@/lib/utils';
import useUpdateProject from '@/features/projects/api/use-update-project';
import { updateProjectSchema } from '@/features/projects/schemas';
import useDeleteProject from './use-delete-project';

interface IEditProjectFormProps {
    onCancel?: () => void;
    initialValues: Project;
}

const EditProjectForm = ({ onCancel, initialValues }: IEditProjectFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: pendingDelete } = useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete Project',
    'This operation cannot be undone. Are you sure you want to delete this project?',
    'destructive',
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
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

    deleteProject(
      { param: { projectId: initialValues.$id } },
      {
        onSuccess: () => {
          window.location.href = `/workspaces/${initialValues.workspaceId}`;
        },
      },
    );
  };

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };
    mutate({ form: finalValues, param: { projectId: initialValues.$id } }, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  return (
      <div className="flex flex-col gap-y-4">
          <DeleteDialog />
          <Card className="w-full h-full border-none shadow-none">
              <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                  <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={onCancel || (() => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`))}
                      icon={<ArrowLeftIcon className="size-4" />}
                  >
                      Back
                  </Button>
                  <CardTitle className="text-xl font-bold">
                      {initialValues.name}
                  </CardTitle>
              </CardHeader>
              <div className="px-7">
                  <DottedSeparator />
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
                                          <FormLabel>Project Name</FormLabel>
                                          <FormControl>
                                              <Input
                                                  {...field}
                                                  placeholder="Enter a project name"
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
                                                          alt="project image"
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
                                                  <p className="text-sm">Project Icon</p>
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
                          <DottedSeparator className="py-7" />
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
          <Card className="w-full h-full border-destructive shadow-none">
              <CardContent className="p-7">
                  <div className="flex flex-col">
                      <h3 className="font-bold text-destructive">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground">
                          Deleting a project is permanent and cannot be undone. It will delete all associated tasks.
                      </p>
                      <DottedSeparator className="py-7" />
                      <Button
                          className="w-fit ml-auto"
                          size="sm"
                          variant="destructive"
                          type="button"
                          disabled={isPending}
                          loading={pendingDelete}
                          onClick={handleDelete}
                      >
                          Delete Project
                      </Button>
                  </div>
              </CardContent>
          </Card>
      </div>
  );
};

export default EditProjectForm;
