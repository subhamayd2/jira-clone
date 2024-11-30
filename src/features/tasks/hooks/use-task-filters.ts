import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { TaskStatus } from '@/features/tasks/types';

const useTaskFilters = () => useQueryStates({
  projectId: parseAsString,
  status: parseAsStringEnum(Object.values(TaskStatus)),
  assigneeId: parseAsString,
  dueDate: parseAsString,
  search: parseAsString,
});

export default useTaskFilters;
