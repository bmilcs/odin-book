import NotificationIcon from '@/components/common/notification';
import UserSearchForm from '@/components/common/user-search-form';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/ui/icons';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useAuthContext } from '@/hooks/useAuthContext';
import useLogout from '@/hooks/useLogout';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, isAuthenticated } = useAuthContext();
  const { logout } = useLogout();

  const handleSettingsClick = () => {
    alert('Settings');
  };

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <header>
      <div className="mx-auto flex max-w-7xl items-center justify-between border-b-2 p-2">
        <p className="text-lg font-black">
          <Link to={isAuthenticated() ? `/feed` : `/login`}>FriendLink</Link>
        </p>
        <nav>
          <ul className="flex items-center font-normal">
            {isAuthenticated() ? (
              // User is Logged In
              <>
                <UserSearchForm />
                <li className="px-2">
                  <Link to={'/feed'}>Feed</Link>
                </li>
                <li className="px-2">
                  <Link to={`/users/${user?.username}`}>Profile</Link>
                </li>
                <li>
                  <NotificationIcon />
                </li>
                <li className="">
                  <ModeToggle />
                </li>
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Icons.more />
                        <span className="sr-only">Settings Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleSettingsClick}>
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogoutClick}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </>
            ) : (
              // User is Logged Out
              <>
                <li className="px-2">
                  <Link to={'/login'}>Login</Link>
                </li>
                <li className="px-2">
                  <Link to={'/signup'}>Signup</Link>
                </li>
                <li className="">
                  <ModeToggle />
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
