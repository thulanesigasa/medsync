import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function EmptyAppointmentsSVG({ width = 120, height = 120 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 120" fill="none">
      <Circle cx="60" cy="60" r="50" fill="#EEF2FF" />
      <Rect x="40" y="35" width="40" height="50" rx="4" fill="#C7D2FE" />
      <Path d="M48 45h24M48 55h24M48 65h14" stroke="#818CF8" strokeWidth="4" strokeLinecap="round" />
      <Circle cx="70" cy="70" r="16" fill="#4F46E5" />
      <Path d="M65 70h10M70 65v10" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}
