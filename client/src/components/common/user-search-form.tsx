import UserImage from '@/components/common/user-image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import useUserRelationships from '@/hooks/useUserRelationships';
import useUserSearch from '@/hooks/useUserSearch';
import { TUserSearchResult } from '@/utils/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentPropsWithoutRef, FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  searchTerm: z
    .string()
    .min(1, {
      message: 'Please enter a search term',
    })
    .max(320, {
      message: 'Search terms cannot be longer than 320 characters',
    }),
});

type UserSearchFormProps = ComponentPropsWithoutRef<'form'> & {
  className?: string;
};

const UserSearchForm: FC<UserSearchFormProps> = ({
  className = '',
  ...props
}) => {
  const { search, results, error: apiError, status } = useUserSearch();
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors: formErrors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { searchTerm: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await search(values);
  };

  useEffect(() => {
    if (status === 'success' || formErrors.searchTerm) {
      setOpen(true);
    }
  }, [status, formErrors]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`relative flex w-full items-center ${className}`}
      {...props}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <Input
          type="post"
          {...register('searchTerm')}
          autoComplete="off"
          placeholder="Find Friends"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="ghost"
          className="h-full"
        >
          <Icons.search />
          <span className="sr-only">Search for user</span>
        </Button>
        <DropdownMenuTrigger className="absolute bottom-0 left-0">
          {/* Dropdown menu is triggered manually using open & setOpen state variables
              so we don't need to render anything here. This is a workaround
              for the fact that the DropdownMenuTrigger component doesn't support
              async logic.
           */}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {apiError ? (
            <DropdownMenuItem>
              <p>{apiError}</p>
            </DropdownMenuItem>
          ) : formErrors.searchTerm ? (
            <DropdownMenuItem>{formErrors.searchTerm.message}</DropdownMenuItem>
          ) : results.length > 0 ? (
            <>
              {results.map((result) => (
                <UserSearchResult
                  key={result._id}
                  result={result}
                  closeMenu={() => setOpen(false)}
                />
              ))}
            </>
          ) : (
            <DropdownMenuItem>
              <p>No users found</p>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  );
};

const UserSearchResult = ({
  result,
  closeMenu,
}: {
  result: TUserSearchResult;
  closeMenu: () => void;
}) => {
  const navigate = useNavigate();
  const {
    isUserAFriend,
    isUserInIncomingFriendRequests,
    isUserInOutgoingFriendRequests,
    isUserTheActiveUser,
  } = useUserRelationships();

  const handleResultClick = () => {
    navigate(`/users/${result.username}`);
    closeMenu();
  };

  const isActiveUser = isUserTheActiveUser(result._id);
  const isFriend = isUserAFriend(result._id);
  const isIncomingFriendRequest = isUserInIncomingFriendRequests(result._id);
  const isOutgoingFriendRequest = isUserInOutgoingFriendRequests(result._id);

  return (
    <DropdownMenuItem
      className="flex w-full items-center gap-4"
      key={result._id}
      onClick={handleResultClick}
    >
      <UserImage user={result} className="h-8 w-8 rounded-full" />
      <p className="font-bold">{result.username}</p>
      <p className="ml-auto text-muted-foreground">
        {isActiveUser
          ? 'You'
          : isFriend
          ? 'Friend'
          : isIncomingFriendRequest
          ? 'Request Received *'
          : isOutgoingFriendRequest
          ? 'Request Sent'
          : ''}
      </p>
    </DropdownMenuItem>
  );
};

export default UserSearchForm;
