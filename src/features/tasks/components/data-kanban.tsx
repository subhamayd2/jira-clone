import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '@/features/tasks/types';
import KanbanColumnHeader from './kanban-column-header';
import KanbanCard from './kanban-card';

interface IDataKanbanProps {
    data: Array<Task>;
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

const DataKanban = ({ data }: IDataKanbanProps) => {
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

  return (
      <DragDropContext onDragEnd={() => {}}>
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
