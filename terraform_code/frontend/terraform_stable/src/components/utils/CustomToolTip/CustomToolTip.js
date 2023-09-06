import React, { useState } from "react";

const CustomToolTip = ({ label, children, sx }) => {
  const [isToolTipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = (e) => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <div
      style={{ position: "relative" }}
      className="tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isToolTipVisible && (
        <span
          style={{
            position: "absolute",
            zIndex: 100,
            background: "transparent",
            padding: "3px",
            boxShadow: "0px 0px 3px rgb(0 0 0/0.2)",
            margin: "11px 5px",
            border: "1px solid white",
            borderRadius: "4px",
            fontSize:".7rem",
            width:"max-content",
            ...sx
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default CustomToolTip;
