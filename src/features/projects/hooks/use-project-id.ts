import { useParams } from 'next/navigation';

const useProjectId = () => {
  const { projectId } = useParams();
  return projectId as string;
};

export default useProjectId;
