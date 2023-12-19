import UserSearchForm from '@/components/common/user-search-form';
import { AuthContext } from '@/components/services/auth-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { GearIcon } from '@radix-ui/react-icons';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header>
      <div className="mx-auto flex max-w-7xl items-center justify-between border-b-2 p-2">
        <p className="text-lg font-black">FriendLink</p>
        <nav>
          <ul className="flex items-center font-normal">
            {isAuthenticated() ? (
              //
              // User is Logged In
              //
              <>
                <UserSearchForm />
                <li className="px-2">
                  <Link to={'/feed'}>Feed</Link>
                </li>
                <li className="px-2">
                  <Link to={'/profile'}>Profile</Link>
                </li>
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <GearIcon />
                        <span className="sr-only">Settings Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert('Settings')}>
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </>
            ) : (
              //
              // User is Logged Out
              //
              <>
                <li className="px-2">
                  <Link to={'/login'}>Login</Link>
                </li>
                <li className="px-2">
                  <Link to={'/signup'}>Signup</Link>
                </li>
              </>
            )}
            {/* 
            Theme Toggle 
            */}
            <li className="px-2">
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
