import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme';

type BullMarkProps = {
  size?: number;
  hornColor?: string;
  headColor?: string;
};

// Minimalist bull mark in USF green and gold. This is an original drawing —
// swap in official USF athletics artwork only if you have permission to use it.
export const BullMark: React.FC<BullMarkProps> = ({
  size = 96,
  hornColor = colors.accent,
  headColor = colors.primary,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Horns */}
      <Path
        d="M14 42 C6 34 4 22 8 12 C22 16 32 26 35 38 C28 36 20 38 14 42 Z"
        fill={hornColor}
      />
      <Path
        d="M86 42 C94 34 96 22 92 12 C78 16 68 26 65 38 C72 36 80 38 86 42 Z"
        fill={hornColor}
      />
      {/* Head */}
      <Path
        d="M50 30 C66 30 76 40 76 54 C76 62 72 68 66 72 L62 86 C60 92 40 92 38 86 L34 72 C28 68 24 62 24 54 C24 40 34 30 50 30 Z"
        fill={headColor}
      />
      {/* Eyes */}
      <Circle cx="39" cy="52" r="4" fill={colors.background} />
      <Circle cx="61" cy="52" r="4" fill={colors.background} />
      {/* Nostrils */}
      <Circle cx="44" cy="76" r="3" fill={hornColor} />
      <Circle cx="56" cy="76" r="3" fill={hornColor} />
    </Svg>
  );
};
