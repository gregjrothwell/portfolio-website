import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPreferredTheme } from './script.js';

describe('getPreferredTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns saved theme from localStorage', () => {
    localStorage.getItem.mockReturnValue('dark');
    expect(getPreferredTheme()).toBe('dark');
    expect(localStorage.getItem).toHaveBeenCalledWith('theme');
  });

  it('returns light theme from localStorage', () => {
    localStorage.getItem.mockReturnValue('light');
    expect(getPreferredTheme()).toBe('light');
  });

  it('falls back to system preference when no saved theme', () => {
    localStorage.getItem.mockReturnValue(null);
    window.matchMedia.mockReturnValue({ matches: true });
    expect(getPreferredTheme()).toBe('dark');
  });

  it('returns light when no saved theme and system prefers light', () => {
    localStorage.getItem.mockReturnValue(null);
    window.matchMedia.mockReturnValue({ matches: false });
    expect(getPreferredTheme()).toBe('light');
  });

  it('handles localStorage errors gracefully', () => {
    localStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage not available');
    });
    window.matchMedia.mockReturnValue({ matches: true });
    expect(getPreferredTheme()).toBe('dark');
  });

  it('handles localStorage errors and falls back to light theme', () => {
    localStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage not available');
    });
    window.matchMedia.mockReturnValue({ matches: false });
    expect(getPreferredTheme()).toBe('light');
  });
});
