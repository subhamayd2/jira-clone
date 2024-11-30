'use client';

import ResponsiveModal from '@/components/responsive-modal';
import useEditTaskModal from '@/features/tasks/hooks/use-edit-task-modal';
import EditTaskFormWrapper from './edit-task-form-wrapper';

const EditTaskModal = () => {
  const { taskId, close } = useEditTaskModal();

  return (
      <ResponsiveModal open={!!taskId} onOpenChange={close}>
          {taskId && (
          <EditTaskFormWrapper
              onCancel={close}
              id={taskId}
          />
          )}
      </ResponsiveModal>
  );
};

export default EditTaskModal;
