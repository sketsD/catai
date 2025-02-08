import React from "react";

interface CheckIconSmallProps {
  className?: string;
}

export default function CheckIconSmall({ className }: CheckIconSmallProps) {
  return (
    <svg
      width="18"
      height="13"
      viewBox="0 0 18 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.5501 13.0001L0.850098 7.3001L2.2751 5.8751L6.5501 10.1501L15.7251 0.975098L17.1501 2.4001L6.5501 13.0001Z"
        fill="currentColor"
      />
    </svg>
  );
}
