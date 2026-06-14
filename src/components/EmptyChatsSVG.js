import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function EmptyChatsSVG({ width = 120, height = 120 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 120" fill="none">
      <Circle cx="60" cy="60" r="50" fill="#F0FDF4" />
      <Rect x="25" y="40" width="45" height="30" rx="8" fill="#86EFAC" />
      <Path d="M30 70l10-10" stroke="#86EFAC" strokeWidth="10" strokeLinecap="round" />
      <Rect x="50" y="55" width="45" height="30" rx="8" fill="#22C55E" />
      <Path d="M90 85l-10-10" stroke="#22C55E" strokeWidth="10" strokeLinecap="round" />
      <Path d="M58 65h10M58 75h20" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}
