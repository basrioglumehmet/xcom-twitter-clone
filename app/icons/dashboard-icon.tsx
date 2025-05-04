import React from "react";

type Props = {
  size?: number; // Controls the width and height of the SVG
  color?: string; // Controls the fill color of the path
  className?: string; // Allows custom CSS classes
  ariaHidden?: boolean; // Controls the aria-hidden attribute
};

const DashboardIcon = ({
  size = 24,
  color = "currentColor",
  className = "r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-lwhw9o r-cnnz9e",
  ariaHidden = true,
}: Props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      aria-hidden={ariaHidden}
      className={className}
    >
      <g>
        <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
      </g>
    </svg>
  );
};

export default DashboardIcon;
