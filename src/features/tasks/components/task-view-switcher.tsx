'use client';

import { Loader, PlusIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import DottedSeparator from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import DataFilters from '@/features/tasks/components/data-filters';
import useTaskFilters from '@/features/tasks/hooks/use-task-filters';
import useWorkspaceId from '@/features/workspaces/hooks/use-workspace-id';
import useCreateTaskModal from '@/features/tasks/hooks/use-create-task-modal';
import taskColumns from './columns';
import DataKanban from './data-kanban';
import DataTable from './data-table';

const TaskViewSwitcher = () => {
  const [
    {
      projectId,
      status,
      assigneeId,
      dueDate,
    },
  ] = useTaskFilters();

  const [view, setView] = useQueryState(
    'task-view',
    {
      defaultValue: 'table',
    },
  );
  const { open } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  const { data: tasks, isLoading: loadingTasks } = useGetTasks({
    workspaceId,
    projectId,
    assigneeId,
    dueDate,
    status,
  });

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
              <DataFilters />
              <DottedSeparator className="my-4" />

              {loadingTasks
                ? (
                    <div className="flex flex-col items-center justify-center w-full h-[200px] border rounded-lg">
                        <Loader className="size-5 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <TabsContent value="table">
                            <DataTable columns={taskColumns} data={(tasks?.documents ?? [])} />
                        </TabsContent>
                        <TabsContent value="kanban">
                            <DataKanban data={tasks?.documents ?? []} />
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
