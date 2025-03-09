import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { typography, combineTextStyles } from '@/utils/typography';

export interface TextProps extends RNTextProps {
  variant?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  bold?: boolean;
  style?: RNTextProps['style'];
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'base',
  bold = false,
  style,
  ...props
}) => {
  // Determine which typography styles to use based on props
  const variantStyle = (() => {
    switch (variant) {
      case 'sm':
        return typography.textSm;
      case 'lg':
        return typography.textLg;
      case 'xl':
        return typography.textXl;
      case '2xl':
        return typography.text2Xl;
      case '3xl':
        return typography.text3Xl;
      case '4xl':
        return typography.text4Xl;
      case '5xl':
        return typography.text5Xl;
      case '6xl':
        return typography.text6Xl;
      case '7xl':
        return typography.text7Xl;
      case '8xl':
        return typography.text8Xl;
      case '9xl':
        return typography.text9Xl;
      default:
        return typography.textBase;
    }
  })();

  // Combine base font, variant size, and optional bold style
  const textStyles = combineTextStyles(
    bold ? typography.textBold : typography.text,
    variantStyle
  );

  return (
    <RNText style={[textStyles, style]} {...props}>
      {children}
    </RNText>
  );
};

export default Text; 