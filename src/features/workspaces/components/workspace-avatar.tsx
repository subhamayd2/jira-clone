import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface IWorkspaceAvatarProps {
    image?: string;
    name: string;
    className?: string;
}

const WorkspaceAvatar = ({ image, name, className }: IWorkspaceAvatarProps) => {
  if (image) {
    return (
        <div className={cn('size-8 relative rounded-md overflow-hidden', className)}>
            <Image src={image} alt={name} fill className="object-cover" />
        </div>
    );
  }

  return (
      <Avatar className={cn('size-8 rounded-md', className)}>
          <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md">
              {name.charAt(0).toUpperCase()}
          </AvatarFallback>
      </Avatar>
  );
};

export default WorkspaceAvatar;
