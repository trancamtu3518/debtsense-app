// Calm Purple Design System for DebtSense (Calm, Friendly, Mental Wellness, Gen Z)
export const Colors = {
  // Brand Backgrounds
  bg: '#F8FAFC', // Sleek background
  surface: '#FFFFFF', // Clean white cards
  surfaceHighlight: '#EDE9FE', // Light purple highlight
  
  // Purple Accents (Headspace/Finch vibe)
  primary: '#6C63FF', // Primary Purple
  secondary: '#A78BFA', // Secondary Purple
  accent: '#4F46E5', // Indigo Accent
  primaryLight: '#E0E7FF',
  primaryGlow: '#F5F3FF',
  
  // Legacy aliases for backward compatibility
  teal900: '#3730A3', // Deep indigo/purple
  teal700: '#6C63FF', // Primary Purple
  teal500: '#A78BFA', // Secondary Purple
  teal100: '#E0E7FF', // Very light purple background
  teal50: '#F5F3FF', // Subtle purple glow/bg
  
  // Warnings/Gold
  gold: '#F59E0B',
  goldLight: '#FEF3C7',
  
  // Text Colors
  ink: '#1E293B', // Slate 800 (Deepest dark for text)
  inkMid: '#475569', // Slate 600 (Muted text)
  inkLight: '#94A3B8', // Slate 400 (Very muted text)
  
  // Borders
  border: '#E2E8F0', // Soft border
  borderGlow: '#DDD6FE',
  
  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444'
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
    color: Colors.teal700, // Primary purple
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
  sm: 12, // Very round, friendly (Finch-style)
  md: 20,
  lg: 32,
  pill: 100,
};

export const Shadow = {
  card: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  glow: {
    shadowColor: Colors.teal700,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
  float: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
};
