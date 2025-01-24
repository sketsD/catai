import Image from "next/image";
import LogoBlack from "./LogoBlack";
import logo2 from "../assets/logo2.jpg";

const LoginTemplate = () => {
  return (
    <>
      <div className="flex justify-center space-x-4 items-center">
        <LogoBlack />
        <div className="w-px h-12 bg-gray-200" />
        <Image
          src={logo2}
          alt="CATAI PHARM Logo"
          width={180}
          height={60}
          className="h-12 w-auto"
        />
      </div>

      <p className="text-center w-full mx-auto max-w-sm text-mainBlack">
        The App helps identify Look-Alike Sound-Alike medications to prevent
        errors
      </p>
    </>
  );
};
export default LoginTemplate;
