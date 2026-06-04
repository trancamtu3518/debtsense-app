// Design System for DebtSense
export const Colors = {
  teal900: '#0D4A3A',
  teal700: '#1A6B5A',
  teal500: '#2E8B72',
  teal100: '#D6F0EA',
  teal50: '#F0FAF7',
  gold: '#F5A623',
  goldLight: '#FEF3DC',
  ink: '#1C2B2A',
  inkMid: '#4A5E5C',
  inkLight: '#8FA8A5',
  surface: '#FFFFFF',
  bg: '#F5F7F6',
  border: '#E4EDEB',
  success: '#2E8B72',
  warning: '#F5A623',
};

export const Typography = {
  display: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 40,
    lineHeight: 50,
    color: Colors.ink,
  },
  h1: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 24,
    lineHeight: 32,
    color: Colors.ink,
  },
  h2: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 18,
    lineHeight: 26,
    color: Colors.ink,
  },
  body: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: Colors.inkMid,
  },
  bodyBold: {
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 15,
    lineHeight: 22,
    color: Colors.ink,
  },
  caption: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.inkLight,
  },
  number: {
    fontFamily: 'BeVietnamPro-Bold',
    fontSize: 48,
    lineHeight: 56,
    color: Colors.teal700,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 100,
};

export const Shadow = {
  card: {
    shadowColor: '#0D4A3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  float: {
    shadowColor: '#0D4A3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
};
