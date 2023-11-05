import { Icons } from '@/components/ui/icons';

const Footer = () => {
  return (
    <footer className="">
      <div className="mx-auto flex max-w-7xl justify-center border-t-2 p-2">
        <a
          href="https://www.github.com/bmilcs/odin-book"
          className="flex gap-2  transition-colors duration-300 ease-in-out hover:text-blue-500"
        >
          Created by BMILCS
          <Icons.gitHub className="w-5" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
