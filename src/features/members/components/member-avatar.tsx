import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, getColorForAvatar } from '@/lib/utils';

interface IMemberAvatarProps {
    name: string;
    className?: string;
    fallbackClassName?: string;
}

const MemberAvatar = ({ name, className, fallbackClassName }: IMemberAvatarProps) => {
  const avatarBg = getColorForAvatar(name.charAt(0));

  return (
      <Avatar
          className={cn(
            'size-5 transition border border-neutral-300 rounded-full',
            className,
          )}
      >
          <AvatarFallback
              className={cn(
                'font-medium text-white flex items-center justify-center',
                avatarBg,
                fallbackClassName,
              )}
          >
              {name.charAt(0).toUpperCase()}
          </AvatarFallback>
      </Avatar>
  );
};

export default MemberAvatar;
