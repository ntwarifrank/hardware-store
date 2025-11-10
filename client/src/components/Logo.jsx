const Logo = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Toolbox/Hardware Store Icon */}
      <g>
        {/* Main Toolbox Body */}
        <rect
          x="15"
          y="35"
          width="70"
          height="50"
          rx="4"
          fill="#FF6B35"
          stroke="#2C3E50"
          strokeWidth="3"
        />
        
        {/* Toolbox Handle */}
        <path
          d="M 35 35 L 35 25 Q 35 20 40 20 L 60 20 Q 65 20 65 25 L 65 35"
          fill="none"
          stroke="#2C3E50"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Tool Compartment Divider */}
        <line
          x1="20"
          y1="60"
          x2="80"
          y2="60"
          stroke="#2C3E50"
          strokeWidth="2"
        />
        
        {/* Wrench Icon */}
        <g transform="translate(30, 45)">
          <path
            d="M 10 5 L 15 10 L 12 13 L 7 8 Z"
            fill="#FFD93D"
            stroke="#2C3E50"
            strokeWidth="1.5"
          />
          <circle
            cx="5"
            cy="6"
            r="3"
            fill="none"
            stroke="#2C3E50"
            strokeWidth="1.5"
          />
        </g>
        
        {/* Hammer Icon */}
        <g transform="translate(50, 45)">
          <rect
            x="5"
            y="2"
            width="8"
            height="4"
            rx="1"
            fill="#FFD93D"
            stroke="#2C3E50"
            strokeWidth="1.5"
          />
          <rect
            x="8"
            y="6"
            width="2"
            height="10"
            fill="#8B4513"
            stroke="#2C3E50"
            strokeWidth="1.5"
          />
        </g>
        
        {/* Screwdriver Icon */}
        <g transform="translate(25, 68)">
          <polygon
            points="5,2 7,2 6,8 4,8"
            fill="#FFD93D"
            stroke="#2C3E50"
            strokeWidth="1"
          />
          <rect
            x="4.5"
            y="8"
            width="2"
            height="6"
            fill="#8B4513"
            stroke="#2C3E50"
            strokeWidth="1"
          />
        </g>
        
        {/* Bolt/Screw Icon */}
        <g transform="translate(45, 68)">
          <circle
            cx="5"
            cy="5"
            r="4"
            fill="#C0C0C0"
            stroke="#2C3E50"
            strokeWidth="1.5"
          />
          <line
            x1="3"
            y1="5"
            x2="7"
            y2="5"
            stroke="#2C3E50"
            strokeWidth="1"
          />
          <line
            x1="5"
            y1="3"
            x2="5"
            y2="7"
            stroke="#2C3E50"
            strokeWidth="1"
          />
        </g>
        
        {/* Paint Brush Icon */}
        <g transform="translate(60, 68)">
          <rect
            x="4"
            y="2"
            width="3"
            height="5"
            fill="#FFD93D"
            stroke="#2C3E50"
            strokeWidth="1"
          />
          <path
            d="M 4 7 L 4.5 12 L 6.5 12 L 7 7 Z"
            fill="#8B4513"
            stroke="#2C3E50"
            strokeWidth="1"
          />
        </g>
      </g>
    </svg>
  );
};

export default Logo;
