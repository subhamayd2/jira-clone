import Image from 'next/image';
import { cn, getColorForAvatar } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface IProjectAvatarProps {
    image?: string;
    name: string;
    className?: string;
    fallbackClassName?: string;
}

const ProjectAvatar = ({
  image, name, className, fallbackClassName,
}: IProjectAvatarProps) => {
  const avatarBg = getColorForAvatar(name.charAt(0));

  if (image) {
    return (
        <div className={cn('size-6 relative rounded-md overflow-hidden', className)}>
            <Image src={image} alt={name} fill className="object-cover" />
        </div>
    );
  }

  return (
      <Avatar className={cn('size-6 rounded-md', className)}>
          <AvatarFallback className={cn('text-white font-semibold text-sm uppercase rounded-md', avatarBg, fallbackClassName)}>
              {name.charAt(0).toUpperCase()}
          </AvatarFallback>
      </Avatar>
  );
};

export default ProjectAvatar;
