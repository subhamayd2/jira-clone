import { MoreHorizontalIcon } from 'lucide-react';
import DottedSeparator from '@/components/dotted-separator';
import MemberAvatar from '@/features/members/components/member-avatar';
import useEditTaskModal from '@/features/tasks/hooks/use-edit-task-modal';
import { Task } from '@/features/tasks/types';
import TaskActions from './task-actions';

interface IKanbanCardProps {
    task: Task
}

const KanbanCard = ({ task }: IKanbanCardProps) => {
  const { open } = useEditTaskModal();
  return (
      <div
          className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3"
          onClick={() => open(task.$id)}
          role="button"
          tabIndex={-1}
      >
          <div className="flex items-start justify-between gap-x-2">
              <p className="text-sm line-clamp-2">{task.name}</p>
              <TaskActions id={task.$id} projectId={task.projectId}>
                  <MoreHorizontalIcon
                      className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition"
                  />
              </TaskActions>
          </div>
          <DottedSeparator className="my-2" />
          <div className="flex items-center gap-x-1.5">
              <MemberAvatar name={task.assignee.name} fallbackClassName="text-xs" />
              <p className="text-xs">{task.assignee.name}</p>
          </div>
      </div>
  );
};

export default KanbanCard;