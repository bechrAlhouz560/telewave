import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const cleanPercentage = (percentage: number): number => {
  const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0;
  const isTooHigh = percentage > 100;
  return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage;
};

interface CircleProps {
  colour: string;
  percentage?: number;
  radius: number;
  strokeWidth: number;
}

interface TextProps {
  percentage: number;
  fontSize: string;
}

interface CircleProgressBarProps {
  percentage?: number;
  colour?: string;
  size?: number;
  strokeWidth?: number;
  fontSize?: string;
}

const Circle: React.FC<CircleProps> = ({
  colour,
  percentage = 100,
  radius,
  strokeWidth,
}) => {
  const circ = 2 * Math.PI * radius;
  const strokePct = ((100 - percentage) * circ) / 100;

  const animatedProps = useSpring({ strokeDashoffset: strokePct });

  return (
    <animated.circle
      r={radius}
      cx={radius + strokeWidth / 2}
      cy={radius + strokeWidth / 2}
      fill="transparent"
      stroke={strokePct !== circ ? colour : ""}
      strokeWidth={strokeWidth}
      strokeDasharray={circ}
      style={animatedProps}
    />
  );
};

const Text: React.FC<TextProps> = ({ percentage, fontSize }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={fontSize}
    >
      {percentage.toFixed(0)}%
    </text>
  );
};

const CircleProgressBar: React.FC<CircleProgressBarProps> = ({
  percentage = 0,
  colour = "blue",
  size = 200,
  strokeWidth = 10,
  fontSize = "1.5em",
}) => {
  const pct = cleanPercentage(percentage);
  const radius = (size - strokeWidth) / 2;

  return (
    <svg width={size} height={size}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <Circle colour="lightgrey" radius={radius} strokeWidth={strokeWidth} />
        <Circle
          colour={colour}
          percentage={pct}
          radius={radius}
          strokeWidth={strokeWidth}
        />
      </g>
      <Text percentage={pct} fontSize={fontSize} />
    </svg>
  );
};

export default CircleProgressBar;
