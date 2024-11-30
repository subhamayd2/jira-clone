'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MemberAvatar from '@/features/members/components/member-avatar';
import ProjectAvatar from '@/features/projects/components/project-avatar';
import { Task } from '@/features/tasks/types';
import { snakeCaseToTitleCase } from '@/lib/utils';
import TaskActions from './task-actions';
import TaskDate from './task-date';

const taskColumns: Array<ColumnDef<Task>> = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            Task Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
      const { name } = row.original;
      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: 'projectId',
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            Project
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
      const { project } = row.original;
      return (
          <div className="flex items-center gap-x-2 text-sm font-medium">
              <ProjectAvatar name={project.name} image={project.imageUrl} className="size-6" />
              <p className="line-clamp-1">{project.name}</p>
          </div>
      );
    },
  },
  {
    accessorKey: 'assigneeId',
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            Assignee
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
      const { assignee } = row.original;
      return (
          <div className="flex items-center gap-x-2 text-sm font-medium">
              <MemberAvatar name={assignee.name} className="size-6" fallbackClassName="text-xs" />
              <p className="line-clamp-1">{assignee.name}</p>
          </div>
      );
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
      const { dueDate } = row.original;
      return <TaskDate value={dueDate} />;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
      const { status } = row.original;
      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { $id: id, projectId } = row.original;
      return (
          <TaskActions id={id} projectId={projectId}>
              <Button variant="ghost" className="size-8 p-0">
                  <MoreVertical className="size-4" />
              </Button>
          </TaskActions>
      );
    },
  },
];

export default taskColumns;
