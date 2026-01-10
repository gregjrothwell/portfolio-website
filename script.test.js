import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPreferredTheme, getCurrentSection, generateCvContent } from './script.js';

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

describe('getCurrentSection', () => {
  it('returns empty string when no sections match', () => {
    const sections = [
      { offsetTop: 100, clientHeight: 200, getAttribute: () => 'section1' },
      { offsetTop: 300, clientHeight: 200, getAttribute: () => 'section2' }
    ];
    const result = getCurrentSection(50, sections);
    expect(result).toBe('');
  });

  it('returns section ID when scroll position is within section bounds', () => {
    const sections = [
      { offsetTop: 0, clientHeight: 200, getAttribute: () => 'hero' },
      { offsetTop: 200, clientHeight: 300, getAttribute: () => 'about' },
      { offsetTop: 500, clientHeight: 200, getAttribute: () => 'skills' }
    ];
    const result = getCurrentSection(250, sections);
    expect(result).toBe('about');
  });

  it('returns last matching section when multiple sections overlap', () => {
    const sections = [
      { offsetTop: 0, clientHeight: 500, getAttribute: () => 'section1' },
      { offsetTop: 200, clientHeight: 300, getAttribute: () => 'section2' }
    ];
    const result = getCurrentSection(250, sections);
    expect(result).toBe('section2');
  });

  it('handles edge case at exact section boundary', () => {
    const sections = [
      { offsetTop: 0, clientHeight: 200, getAttribute: () => 'section1' },
      { offsetTop: 200, clientHeight: 200, getAttribute: () => 'section2' }
    ];
    const result = getCurrentSection(200, sections);
    expect(result).toBe('section2');
  });
});

describe('generateCvContent', () => {
  it('returns CV content as string', () => {
    const content = generateCvContent();
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
  });

  it('includes name in header', () => {
    const content = generateCvContent();
    expect(content).toContain('GREG ROTHWELL');
  });

  it('includes title', () => {
    const content = generateCvContent();
    expect(content).toContain('Lead Scrum Master & Agile Transformation Leader');
  });

  it('includes profile section', () => {
    const content = generateCvContent();
    expect(content).toContain('PROFILE');
    expect(content).toContain('11 years of experience');
  });

  it('includes contact information', () => {
    const content = generateCvContent();
    expect(content).toContain('CONTACT');
    expect(content).toContain('https://gregrothwell.co.uk');
    expect(content).toContain('Lancashire, UK');
  });

  it('includes key achievements section', () => {
    const content = generateCvContent();
    expect(content).toContain('KEY ACHIEVEMENTS');
    expect(content).toContain('Pretty Little Thing');
  });

  it('includes experience section', () => {
    const content = generateCvContent();
    expect(content).toContain('EXPERIENCE');
    expect(content).toContain('Lead Scrum Master');
  });

  it('includes skills section', () => {
    const content = generateCvContent();
    expect(content).toContain('SKILLS & EXPERTISE');
    expect(content).toContain('Agile Frameworks');
  });

  it('includes certifications', () => {
    const content = generateCvContent();
    expect(content).toContain('CERTIFICATIONS');
    expect(content).toContain('PSM I');
  });
});
