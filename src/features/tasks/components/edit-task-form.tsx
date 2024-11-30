'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DatePicker from '@/components/date-picker';
import DottedSeparator from '@/components/dotted-separator';
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import MemberAvatar from '@/features/members/components/member-avatar';
import ProjectAvatar from '@/features/projects/components/project-avatar';
import useUpdateTask from '@/features/tasks/api/use-update-task';
import { createTaskSchema } from '@/features/tasks/schemas';
import { Task, TaskStatus } from '@/features/tasks/types';
import { cn } from '@/lib/utils';

interface IEditTaskFormProps {
    projectOptions: {
        name: string;
        id: string;
        imageUrl: string;
    }[];
    memberOptions: {
        name: string;
        id: string;
    }[];
    initialValues: Task,
    onCancel?: () => void;
}

const EditTaskForm = ({
  onCancel, projectOptions, memberOptions, initialValues,
}: IEditTaskFormProps) => {
  const { mutate, isPending } = useUpdateTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true, description: true })),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate ? new Date(initialValues.dueDate) : undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate({ json: values, param: { taskId: initialValues.$id } }, {
      onSuccess: () => {
        form.reset();
        onCancel?.();
      },
    });
  };

  return (
      <Card className="w-full h-full border-none shadow-none">
          <CardHeader className="flex p-7">
              <CardTitle className="text-xl font-bold">
                  Edit task
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
                                      <FormLabel>Task Name</FormLabel>
                                      <FormControl>
                                          <Input
                                              {...field}
                                              placeholder="Enter a task name"
                                          />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              name="dueDate"
                              control={form.control}
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Due Date</FormLabel>
                                      <FormControl>
                                          <DatePicker {...field} disablePast />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              name="assigneeId"
                              control={form.control}
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Assignee</FormLabel>
                                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                                          <FormControl>
                                              <SelectTrigger>
                                                  <SelectValue placeholder="Select a member" />
                                              </SelectTrigger>
                                          </FormControl>
                                          <FormMessage />
                                          <SelectContent>
                                              {memberOptions.map((member) => (
                                                  <SelectItem key={member.id} value={member.id}>
                                                      <div className="flex items-center gap-x-2">
                                                          <MemberAvatar name={member.name} className="size-6" />
                                                          {member.name}
                                                      </div>
                                                  </SelectItem>
                                              ))}
                                          </SelectContent>
                                      </Select>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              name="status"
                              control={form.control}
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Status</FormLabel>
                                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                                          <FormControl>
                                              <SelectTrigger>
                                                  <SelectValue placeholder="Select status" />
                                              </SelectTrigger>
                                          </FormControl>
                                          <FormMessage />
                                          <SelectContent>
                                              <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                                              <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                                              <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                                              <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                                              <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                                          </SelectContent>
                                      </Select>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              name="projectId"
                              control={form.control}
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Project</FormLabel>
                                      <Select defaultValue={field.value} onValueChange={field.onChange}>
                                          <FormControl>
                                              <SelectTrigger>
                                                  <SelectValue placeholder="Select a project" />
                                              </SelectTrigger>
                                          </FormControl>
                                          <FormMessage />
                                          <SelectContent>
                                              {projectOptions.map((project) => (
                                                  <SelectItem key={project.id} value={project.id}>
                                                      <div className="flex items-center gap-x-2">
                                                          <ProjectAvatar
                                                              name={project.name}
                                                              image={project.imageUrl}
                                                              className="size-6"
                                                          />
                                                          {project.name}
                                                      </div>
                                                  </SelectItem>
                                              ))}
                                          </SelectContent>
                                      </Select>
                                      <FormMessage />
                                  </FormItem>
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
                              Update Task
                          </Button>
                      </div>
                  </form>
              </Form>
          </CardContent>
      </Card>
  );
};

export default EditTaskForm;
