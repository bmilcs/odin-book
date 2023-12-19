import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import useFriends from '@/hooks/useFriends';
import useUserSearch from '@/hooks/useUserSearch';
import { CLIENT_MODE } from '@/utils/env';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
  const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    deleteFriend,
  } = useFriends();

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
    search(values);
  }

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`relative flex w-full items-center gap-2 ${className}`}
    >
      <Input type="post" {...register('searchTerm')} />
      <Button
        type="submit"
        disabled={isSubmitting}
        variant="ghost"
        className="h-full"
      >
        <Icons.search />
        <span className="sr-only">User Search</span>
      </Button>

      {results.length > 0 && (
        <div className="absolute top-full translate-y-4 overflow-hidden rounded-md text-sm">
          {results.map((result) => {
            return (
              <div
                className="flex items-center gap-4 bg-secondary p-2"
                key={result._id}
              >
                <p>{result.username}</p>
                <Button
                  type="button"
                  onClick={() => handleAddFriend(result._id)}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  onClick={() => handleAcceptFriendRequest(result._id)}
                >
                  Accept
                </Button>
                <Button
                  type="button"
                  onClick={() => handleRejectFriendRequest(result._id)}
                >
                  Reject
                </Button>
                <Button
                  type="button"
                  onClick={() => handleDeleteFriend(result._id)}
                >
                  Delete
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </form>
  );
};

export default UserSearchForm;
