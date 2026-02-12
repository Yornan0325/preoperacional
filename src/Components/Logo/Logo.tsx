import React from "react";
// import logo from "../../public/Image/logo/powercolor.svg?url";

interface LogoIconProps {
  sizeWidth?: string | number;
  sizeHeight?: string | number;
  textSize?: string;
  showText?: boolean;
  className?: string;
}

const LogoIcon: React.FC<LogoIconProps> = ({
  sizeWidth = "40",
  sizeHeight = "40",
  textSize = "text-2xl",
  showText = true,
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* <img
        src={logo}
        alt="PowerLab Logo"
        width={sizeWidth}
        height={sizeHeight}
        className="ring-primary ring-offset-base-100 ring-1 ring-offset-2 object-cover object-center rounded-lg bg-white dark:bg-gray-800"
      /> */}
      {showText && (
        <span className={`font-bold ${textSize} text-gray-900 dark:text-white`}>
         Preoperacional
        </span>
      )}
    </div>
  );
};

export default LogoIcon;