import { useParams } from 'next/navigation';

const useWorkspaceId = () => {
  const { workspaceId } = useParams();
  return workspaceId as string;
};

export default useWorkspaceId;
