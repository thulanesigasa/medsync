import { Platform } from 'react-native';

/**
 * Color Rules Assignment
 * The 60-30-10 Rule
 */
export const COLORS = {
  // 60% Dominant Canvas (Light System Backgrounds)
  background: '#F3F2FA', // Screen backgrounds
  surface: '#FFFFFF',    // Primary card surfaces

  // 30% Secondary Branding (Deep Structural Elements)
  primary: '#0F2C59',    // Deep Navy Blue for headers, primary typography, selection states
  text: '#0F2C59',       // Alias for typographic consistency

  // 10% Accent Highlighters (CTAs & Status Indicators)
  accent: '#3B82F6',     // Bright Accent Blue for nav indicators & borders
  success: '#22C55E',    // Accent Green for confirmed/success states
  border: '#D3E2F2',     // Soft muted borders
};

export const SIZES = {
  padding: 16,
  margin: 16,
  gutter: 16,
  radius: 12,
};

export const LAYOUT = {
  statusBarHeight: Platform.OS === 'ios' ? 54 : 24,
  headerHeight: Platform.OS === 'ios' ? 96 : 56,
  tabBarHeight: 64,
  bottomPadding: Platform.OS === 'ios' ? 34 : 0,
};

