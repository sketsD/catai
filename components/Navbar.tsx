import { ReactNode } from "react";
import Logo from "./Logo";
import Link from "next/link";

const Navbar: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 p-4 z-10 flex items-center px-5 w-full bg-color-gray-950 py-4">
      <Link href={"/"}>
        <Logo />
      </Link>
      <div className="flex w-full justify-end">{children}</div>
    </nav>
  );
};
export default Navbar;
