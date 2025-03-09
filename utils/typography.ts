import { StyleSheet, TextStyle } from 'react-native';

// Text style definitions using the loaded fonts
export const typography = StyleSheet.create({
  // Regular text styles
  text: {
    fontFamily: 'SF-Pro',
  },
  // Bold text styles
  textBold: {
    fontFamily: 'SF-Pro-Bold',
  },
  // Text size variants
  textSm: {
    fontSize: 12,
    lineHeight: 16,
  },
  textBase: {
    fontSize: 14,
    lineHeight: 20,
  },
  textLg: {
    fontSize: 16,
    lineHeight: 24,
  },
  textXl: {
    fontSize: 18,
    lineHeight: 28,
  },
  text2Xl: {
    fontSize: 24,
    lineHeight: 32,
  },
});

// Helper function to combine multiple text styles
export const combineTextStyles = (...styles: TextStyle[]): TextStyle => {
  return Object.assign({}, ...styles);
};

// Usage examples:
// Regular text: typography.text
// Bold text: typography.textBold
// Regular medium text: combineTextStyles(typography.text, typography.textLg)
// Bold large text: combineTextStyles(typography.textBold, typography.text2Xl) 