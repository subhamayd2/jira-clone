import { useCallback, useState } from 'react';
import {
  DragDropContext, Draggable, Droppable, type DropResult,
} from '@hello-pangea/dnd';
import { Task, TaskStatus } from '@/features/tasks/types';
import KanbanColumnHeader from './kanban-column-header';
import KanbanCard from './kanban-card';

interface IDataKanbanProps {
    data: Array<Task>;
    onChange: (payload: Array<{$id: string, status: TaskStatus, position: number}>) => void;
}

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TasksState = {
    [key in TaskStatus]: Array<Task>;
}

const DataKanban = ({ data, onChange }: IDataKanbanProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((key) => {
      initialTasks[key as TaskStatus] = initialTasks[key as TaskStatus].sort((a, b) => a.position - b.position);
    });

    return initialTasks;
  });

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    let updatePayload: Array<{$id: string, status: TaskStatus, position: number}> = [];

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      // remove task from sourcere
      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      if (!movedTask) {
        console.error('No task found at the source index');
        return prevTasks;
      }

      // new task
      const updatedTask = sourceStatus !== destinationStatus
        ? { ...movedTask, status: destinationStatus }
        : { ...movedTask };

      newTasks[sourceStatus] = sourceColumn;
      const destinationColumn = [...newTasks[destinationStatus]];
      destinationColumn.splice(destination.index, 0, updatedTask);
      newTasks[destinationStatus] = destinationColumn;

      updatePayload = [];

      updatePayload.push({
        $id: updatedTask.$id,
        status: destinationStatus,
        position: Math.min((destination.index + 1) * 1000, 1_000_000),
      });

      newTasks[destinationStatus].forEach((task, index) => {
        if (task && task.$id !== updatedTask.$id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          if (task.position !== newPosition) {
            updatePayload.push({
              $id: task.$id,
              status: destinationStatus,
              position: newPosition,
            });
          }
        }
      });

      if (sourceStatus !== destinationStatus) {
        newTasks[sourceStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position !== newPosition) {
              updatePayload.push({
                $id: task.$id,
                status: sourceStatus,
                position: newPosition,
              });
            }
          }
        });
      }

      return newTasks;
    });

    onChange(updatePayload);
  }, [onChange]);

  return (
      <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex overflow-x-auto">
              {boards.map((board) => (
                  <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]">
                      <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
                      <Droppable droppableId={board}>
                          {(providedDroppable) => (
                              <div {...providedDroppable.droppableProps} ref={providedDroppable.innerRef} className="min-h-[200px] py-1.5">
                                  {tasks[board].map((task, index) => (
                                      <Draggable key={task.$id} draggableId={task.$id} index={index}>
                                          {(providedDraggable) => (
                                              <div
                                                  {...providedDraggable.draggableProps}
                                                  {...providedDraggable.dragHandleProps}
                                                  ref={providedDraggable.innerRef}
                                              >
                                                  <KanbanCard task={task} />
                                              </div>
                                          )}
                                      </Draggable>
                                  ))}
                                  {providedDroppable.placeholder}
                              </div>
                          )}
                      </Droppable>
                  </div>
              ))}
          </div>
      </DragDropContext>
  );
};

export default DataKanban;
