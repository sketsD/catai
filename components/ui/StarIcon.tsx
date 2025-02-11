import React from "react";

const StarIcon: React.FC<{ isFilled: boolean }> = ({ isFilled }) => {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="37" height="37" rx="18.5" fill="white" />
      <rect
        x="0.5"
        y="0.5"
        width="37"
        height="37"
        rx="18.5"
        stroke={isFilled ? "#0165FC" : "#757575"}
      />
      {isFilled ? (
        <path
          d="M19 24.27L25.18 28L23.54 20.97L29 16.24L21.81 15.63L19 9L16.19 15.63L9 16.24L14.46 20.97L12.82 28L19 24.27Z"
          fill="#0165FC"
        />
      ) : (
        <path
          d="M15.85 23.825L19 21.925L22.15 23.85L21.325 20.25L24.1 17.85L20.45 17.525L19 14.125L17.55 17.5L13.9 17.825L16.675 20.25L15.85 23.825ZM12.825 28L14.45 20.975L9 16.25L16.2 15.625L19 9L21.8 15.625L29 16.25L23.55 20.975L25.175 28L19 24.275L12.825 28Z"
          fill="#757575"
        />
      )}
    </svg>
  );
};
export default StarIcon;
