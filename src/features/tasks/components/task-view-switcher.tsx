'use client';

import { Loader, PlusIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import DottedSeparator from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import useCreateTaskModal from '@/features/tasks/hooks/use-create-task-modal';
import useWorkspaceId from '@/features/workspaces/hooks/use-workspace-id';

const TaskViewSwitcher = () => {
  const [view, setView] = useQueryState(
    'task-view',
    {
      defaultValue: 'table',
    },
  );
  const { open } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  //   const projectId = useProjectId();
  const { data: tasks, isLoading: loadingTasks } = useGetTasks({ workspaceId });

  console.table(tasks?.documents);

  return (
      <Tabs className="flex-1 w-full border rounded-lg" defaultValue={view} onValueChange={setView}>
          <div className="h-full flex flex-col overflow-auto p-4">
              <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                  <TabsList className="w-full lg:w-auto">
                      <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
                          Table
                      </TabsTrigger>
                      <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
                          Kanban
                      </TabsTrigger>
                      <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
                          Calendar
                      </TabsTrigger>
                  </TabsList>
                  <Button
                      size="sm"
                      className="w-full lg:w-auto"
                      icon={<PlusIcon className="size-4" />}
                      onClick={open}
                  >
                      New
                  </Button>
              </div>
              <DottedSeparator className="my-4" />
              Data filters
              <DottedSeparator className="my-4" />

              {loadingTasks
                ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <Loader className="size-4 animate-spin text-muted-foreground" />
                    </div>
                )
                : (
                    <>
                        <TabsContent value="table">
                            Table
                        </TabsContent>
                        <TabsContent value="kanban">
                            Kanban
                        </TabsContent>
                        <TabsContent value="calendar">
                            Calendar
                        </TabsContent>
                    </>
                )}

          </div>
      </Tabs>
  );
};

export default TaskViewSwitcher;
