import {
  AuthContext,
  TFriend,
  TFriendRequest,
} from '@/components/services/auth-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import useFriends from '@/hooks/useFriends';
import useUserSearch from '@/hooks/useUserSearch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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

const UserSearchForm = ({ className }: { className?: string }) => {
  const {
    search,
    results,
    error: searchError,
    status,
    friends,
    incomingFriendRequests,
  } = useUserSearch();
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors: useFormErrors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { searchTerm: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await search(values);
  };

  useEffect(() => {
    if (status === 'success' || useFormErrors.searchTerm) {
      setOpen(true);
    }
  }, [status, useFormErrors]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`relative flex w-full items-center ${className}`}
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
          {searchError ? (
            <DropdownMenuItem>
              <p>{searchError}</p>
            </DropdownMenuItem>
          ) : useFormErrors.searchTerm ? (
            <DropdownMenuItem>
              {useFormErrors.searchTerm.message}
            </DropdownMenuItem>
          ) : results.length > 0 ? (
            <>
              {results.map((result) => (
                <UserSearchResult
                  key={result._id}
                  result={result}
                  currentFriends={friends}
                  currentFriendRequests={incomingFriendRequests}
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
  currentFriends,
  currentFriendRequests,
  closeMenu,
}: {
  result: TFriend;
  currentFriends: TFriend[];
  currentFriendRequests: TFriendRequest[];
  closeMenu: () => void;
}) => {
  const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    deleteFriend,
  } = useFriends();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleAddFriend(id: string) {
    sendFriendRequest(id);
    closeMenu();
  }

  function handleAcceptFriendRequest(id: string) {
    acceptFriendRequest(id);
    closeMenu();
  }

  function handleRejectFriendRequest(id: string) {
    rejectFriendRequest(id);
    closeMenu();
  }

  function handleDeleteFriend(id: string) {
    deleteFriend(id);
    closeMenu();
  }

  function handleGenericClick(username: string) {
    navigate(`/users/${username}`);
    closeMenu();
  }

  const isFriend = currentFriends.some((friend) => friend._id === result._id);
  const isUser = result._id === user?._id;
  const isIncomingFriendRequest = currentFriendRequests.some(
    (friendRequest) => friendRequest._id === result._id,
  );
  const isOutgoingFriendRequest = user?.friendRequestsSent.some(
    (friendRequest) => friendRequest._id === result._id,
  );

  if (isUser) {
    return (
      <DropdownMenuItem onClick={() => handleGenericClick(result.username)}>
        <p>
          <strong>
            <Link to={`/users/${result.username}`}>{result.username}</Link>
          </strong>{' '}
          (You)
        </p>
      </DropdownMenuItem>
    );
  }

  if (isFriend) {
    return (
      <DropdownMenuItem
        className="flex items-center gap-4"
        key={result._id}
        onClick={() => handleGenericClick(result.username)}
      >
        <p>
          <strong>
            <Link to={`/users/${result.username}`}>{result.username}</Link>
          </strong>{' '}
          (Friend)
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteFriend(result._id)}
        >
          <Icons.delete />
          <span className="sr-only">Delete Friend</span>
        </Button>
      </DropdownMenuItem>
    );
  }

  if (isOutgoingFriendRequest) {
    return (
      <DropdownMenuItem
        className="flex items-center gap-4"
        key={result._id}
        onClick={() => handleGenericClick(result.username)}
      >
        <p>
          <strong>
            <Link to={`/users/${result.username}`}>{result.username}</Link>
          </strong>{' '}
          (Friend Request Sent)
        </p>
      </DropdownMenuItem>
    );
  }

  if (isIncomingFriendRequest) {
    return (
      <DropdownMenuItem
        className="flex items-center gap-4"
        key={result._id}
        onClick={() => handleGenericClick(result.username)}
      >
        <p>
          <strong>
            <Link to={`/users/${result.username}`}>{result.username}</Link>
          </strong>
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleAcceptFriendRequest(result._id)}
        >
          <Icons.check />
          <span className="sr-only">Accept Friend Request</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleRejectFriendRequest(result._id)}
        >
          <Icons.close />
          <span className="sr-only">Reject Friend Request</span>
        </Button>
      </DropdownMenuItem>
    );
  }

  if (!isFriend && !isUser) {
    return (
      <DropdownMenuItem
        className="flex items-center gap-4"
        key={result._id}
        onClick={() => handleGenericClick(result.username)}
      >
        <p>
          <strong>
            <Link to={`/users/${result.username}`}>{result.username}</Link>
          </strong>
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleAddFriend(result._id)}
        >
          <Icons.add />
          <span className="sr-only">Add Friend</span>
        </Button>
      </DropdownMenuItem>
    );
  }
};

export default UserSearchForm;
