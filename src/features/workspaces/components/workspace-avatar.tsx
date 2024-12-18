import Image from 'next/image';
import { cn, getColorForAvatar } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface IWorkspaceAvatarProps {
    image?: string;
    name: string;
    className?: string;
}

const WorkspaceAvatar = ({ image, name, className }: IWorkspaceAvatarProps) => {
  const avatarBg = getColorForAvatar(name.charAt(0));

  if (image) {
    return (
        <div className={cn('size-8 relative rounded-md overflow-hidden', className)}>
            <Image src={image} alt={name} fill className="object-cover" />
        </div>
    );
  }

  return (
      <Avatar className={cn('size-8 rounded-md', className)}>
          <AvatarFallback className={cn('text-white font-semibold text-lg uppercase rounded-md', avatarBg)}>
              {name.charAt(0).toUpperCase()}
          </AvatarFallback>
      </Avatar>
  );
};

export default WorkspaceAvatar;
