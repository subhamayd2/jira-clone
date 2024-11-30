'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
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
import useCreateProject from '@/features/projects/api/use-create-project';
import { createProjectSchema } from '@/features/projects/schemas';
import useWorkspaceId from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

interface ICreateProjectFormProps {
    onCancel?: () => void;
}

const CreateProjectForm = ({ onCancel }: ICreateProjectFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateProject();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : '',
    };
    mutate({ form: finalValues }, {
      onSuccess: ({ data: { $id } }) => {
        form.reset();
        router.push(`/workspaces/${workspaceId}/projects/${$id}`);
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
      <Card className="w-full h-full border-none shadow-none">
          <CardHeader className="flex p-7">
              <CardTitle className="text-xl font-bold">
                  Create a new project
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
                          <Button size="lg" loading={isPending}>
                              Create Project
                          </Button>
                      </div>
                  </form>
              </Form>
          </CardContent>
      </Card>
  );
};

export default CreateProjectForm;
