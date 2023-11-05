import { ModeToggle } from '@/components/ui/mode-toggle';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="mx-auto flex max-w-7xl items-center justify-between border-b-2 p-2">
        <p className="text-lg font-black">FriendLink</p>
        <nav>
          <ul className="flex items-center font-normal">
            <li className="px-2">
              <Link to={'/'}>Home</Link>
            </li>
            <li className="px-2">
              <Link to={'/login'}>Login</Link>
            </li>
            <li className="px-2">
              <Link to={'/signup'}>Signup</Link>
            </li>
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
