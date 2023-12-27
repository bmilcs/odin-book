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
import { CLIENT_MODE } from '@/utils/env';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
  const { error, search, results, status } = useUserSearch();
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState<TFriend[]>([]);
  const [incomingFriendRequests, setIncomingFriendRequests] = useState<
    TFriendRequest[]
  >([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFriends(user.friends);
      setIncomingFriendRequests(user.friendRequestsReceived);
      console.log(user);
    }
  }, [user]);

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      CLIENT_MODE === 'development'
        ? {
            searchTerm: 'may',
          }
        : {
            searchTerm: '',
          },
  });

  useEffect(() => {
    if (status === 'success') {
      reset();
    }
  }, [error, status, reset]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setOpen(true);
    search(values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`relative flex w-full items-center gap-2 ${className}`}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <Input type="post" {...register('searchTerm')} autoComplete="off" />
        <DropdownMenuTrigger asChild>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="ghost"
            className="h-full"
          >
            <Icons.search />
            <span className="sr-only">Search for user</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {results.length > 0 ? (
            <>
              {results.map((result) => (
                <UserSearchResult
                  key={result._id}
                  result={result}
                  currentFriends={friends}
                  currentFriendRequests={incomingFriendRequests}
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
}: {
  result: TFriend;
  currentFriends: TFriend[];
  currentFriendRequests: TFriendRequest[];
}) => {
  const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    deleteFriend,
  } = useFriends();
  const { user } = useContext(AuthContext);

  function handleAddFriend(id: string) {
    sendFriendRequest(id);
  }

  function handleAcceptFriendRequest(id: string) {
    acceptFriendRequest(id);
  }

  function handleRejectFriendRequest(id: string) {
    rejectFriendRequest(id);
  }

  function handleDeleteFriend(id: string) {
    deleteFriend(id);
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
      <DropdownMenuItem>
        <p>
          <strong>{result.username}</strong> (You)
        </p>
      </DropdownMenuItem>
    );
  }

  if (isFriend) {
    return (
      <DropdownMenuItem className="flex items-center gap-4" key={result._id}>
        <p>
          <strong>{result.username}</strong> (Friend)
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
      <DropdownMenuItem className="flex items-center gap-4" key={result._id}>
        <p>
          <strong>{result.username}</strong> (Friend Request Sent)
        </p>
      </DropdownMenuItem>
    );
  }

  if (isIncomingFriendRequest) {
    return (
      <DropdownMenuItem className="flex items-center gap-4" key={result._id}>
        <p>
          <strong>{result.username}</strong>
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
      <DropdownMenuItem className="flex items-center gap-4" key={result._id}>
        <p>
          <strong>{result.username}</strong>
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
