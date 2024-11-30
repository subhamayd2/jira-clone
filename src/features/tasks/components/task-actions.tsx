import {
  ExternalLinkIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useDeleteTask from '@/features/tasks/api/use-delete-task';
import useConfirm from '@/hooks/use-confirm';
import useWorkspaceId from '@/features/workspaces/hooks/use-workspace-id';
import useEditTaskModal from '@/features/tasks/hooks/use-edit-task-modal';

interface ITaskActionsProps {
    id: string;
    projectId: string
    children: ReactNode
}

const TaskActions = ({ id, projectId, children }: ITaskActionsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete Task',
    'Are you sure you want to delete this task?',
    'destructive',
  );

  const { mutate: deleteTask, isPending: pendingDelete } = useDeleteTask();

  const { open } = useEditTaskModal();

  const isPending = pendingDelete;

  const onDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteTask({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  return (
      <div className="flex justify-end">
          <DeleteDialog />
          <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  {children}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuItem onClick={onOpenTask} disabled={isPending} className="font-medium p-[10px]">
                      <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                      Task Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => open(id)} disabled={isPending} className="font-medium p-[10px]">
                      <PencilIcon className="size-4 mr-2 stroke-2" />
                      Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onOpenProject} disabled={isPending} className="font-medium p-[10px]">
                      <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                      Open Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} disabled={isPending} className="text-destructive focus:text-destructive font-medium p-[10px]">
                      <TrashIcon className="size-4 mr-2 stroke-2" />
                      Delete
                  </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
      </div>
  );
};

export default TaskActions;
