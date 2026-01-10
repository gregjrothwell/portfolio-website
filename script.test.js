import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
    getPreferredTheme,
    getCurrentSection,
    generateCvContent,
    updateNavLinkColors,
    shouldShowNavbarShadow,
    toggleTheme,
    saveThemePreference,
    calculateScrollPosition,
    applyFadeInAnimation,
    prepareElementForAnimation,
    animateSkillBar,
    createFadeInObserverCallback,
    createSkillBarObserverCallback
} from './script.js';

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

describe('shouldShowNavbarShadow', () => {
  it('returns true when scroll position exceeds threshold', () => {
    expect(shouldShowNavbarShadow(150, 100)).toBe(true);
  });

  it('returns false when scroll position is below threshold', () => {
    expect(shouldShowNavbarShadow(50, 100)).toBe(false);
  });

  it('returns false when scroll position equals threshold', () => {
    expect(shouldShowNavbarShadow(100, 100)).toBe(false);
  });

  it('handles zero scroll position', () => {
    expect(shouldShowNavbarShadow(0, 100)).toBe(false);
  });
});

describe('updateNavLinkColors', () => {
  it('sets primary color on active link', () => {
    const link1 = { style: { color: '' }, getAttribute: () => '#about' };
    const link2 = { style: { color: '' }, getAttribute: () => '#skills' };
    const navLinks = [link1, link2];

    updateNavLinkColors('about', navLinks, '#007bff');

    expect(link1.style.color).toBe('#007bff');
    expect(link2.style.color).toBe('');
  });

  it('resets all colors when no match', () => {
    const link1 = { style: { color: '#007bff' }, getAttribute: () => '#about' };
    const link2 = { style: { color: '#007bff' }, getAttribute: () => '#skills' };
    const navLinks = [link1, link2];

    updateNavLinkColors('contact', navLinks, '#007bff');

    expect(link1.style.color).toBe('');
    expect(link2.style.color).toBe('');
  });

  it('handles empty section ID', () => {
    const link1 = { style: { color: '' }, getAttribute: () => '#about' };
    const navLinks = [link1];

    updateNavLinkColors('', navLinks, '#007bff');

    expect(link1.style.color).toBe('');
  });
});

describe('toggleTheme', () => {
  it('switches from light to dark', () => {
    expect(toggleTheme('light')).toBe('dark');
  });

  it('switches from dark to light', () => {
    expect(toggleTheme('dark')).toBe('light');
  });
});

describe('saveThemePreference', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves theme to localStorage and returns true', () => {
    localStorage.setItem.mockReturnValue(undefined);
    const result = saveThemePreference('dark');

    expect(result).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('returns false when localStorage fails', () => {
    localStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage not available');
    });
    const result = saveThemePreference('dark');

    expect(result).toBe(false);
  });
});

describe('calculateScrollPosition', () => {
  it('calculates correct scroll position', () => {
    const target = { offsetTop: 500 };
    const navbar = { offsetHeight: 80 };

    const result = calculateScrollPosition(target, navbar);

    expect(result).toBe(420);
  });

  it('handles zero navbar height', () => {
    const target = { offsetTop: 300 };
    const navbar = { offsetHeight: 0 };

    const result = calculateScrollPosition(target, navbar);

    expect(result).toBe(300);
  });

  it('handles target at top of page', () => {
    const target = { offsetTop: 0 };
    const navbar = { offsetHeight: 60 };

    const result = calculateScrollPosition(target, navbar);

    expect(result).toBe(-60);
  });
});

describe('applyFadeInAnimation', () => {
  it('sets opacity to 1', () => {
    const element = { style: { opacity: '0', transform: 'translateY(30px)' } };

    applyFadeInAnimation(element);

    expect(element.style.opacity).toBe('1');
  });

  it('sets transform to translateY(0)', () => {
    const element = { style: { opacity: '0', transform: 'translateY(30px)' } };

    applyFadeInAnimation(element);

    expect(element.style.transform).toBe('translateY(0)');
  });
});

describe('prepareElementForAnimation', () => {
  it('sets opacity to 0', () => {
    const element = { style: {} };

    prepareElementForAnimation(element);

    expect(element.style.opacity).toBe('0');
  });

  it('sets initial transform', () => {
    const element = { style: {} };

    prepareElementForAnimation(element);

    expect(element.style.transform).toBe('translateY(30px)');
  });

  it('sets transition property', () => {
    const element = { style: {} };

    prepareElementForAnimation(element);

    expect(element.style.transition).toBe('opacity 0.6s ease, transform 0.6s ease');
  });
});

describe('animateSkillBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resets width to 0 initially', () => {
    const skillBar = { style: { width: '80%' } };

    animateSkillBar(skillBar, 100);

    expect(skillBar.style.width).toBe('0');
  });

  it('restores original width after delay', () => {
    const skillBar = { style: { width: '80%' } };

    animateSkillBar(skillBar, 100);
    expect(skillBar.style.width).toBe('0');

    vi.advanceTimersByTime(100);
    expect(skillBar.style.width).toBe('80%');
  });

  it('handles different delay values', () => {
    const skillBar = { style: { width: '60%' } };

    animateSkillBar(skillBar, 200);
    expect(skillBar.style.width).toBe('0');

    vi.advanceTimersByTime(199);
    expect(skillBar.style.width).toBe('0');

    vi.advanceTimersByTime(1);
    expect(skillBar.style.width).toBe('60%');
  });
});

describe('createFadeInObserverCallback', () => {
  it('returns a callback function', () => {
    const callback = createFadeInObserverCallback();
    expect(typeof callback).toBe('function');
  });

  it('callback applies animation when entry is intersecting', () => {
    const callback = createFadeInObserverCallback();
    const element = { style: { opacity: '0', transform: 'translateY(30px)' } };
    const entries = [{ isIntersecting: true, target: element }];

    callback(entries);

    expect(element.style.opacity).toBe('1');
    expect(element.style.transform).toBe('translateY(0)');
  });

  it('callback does not apply animation when entry is not intersecting', () => {
    const callback = createFadeInObserverCallback();
    const element = { style: { opacity: '0', transform: 'translateY(30px)' } };
    const entries = [{ isIntersecting: false, target: element }];

    callback(entries);

    expect(element.style.opacity).toBe('0');
    expect(element.style.transform).toBe('translateY(30px)');
  });

  it('callback handles multiple entries', () => {
    const callback = createFadeInObserverCallback();
    const element1 = { style: { opacity: '0', transform: 'translateY(30px)' } };
    const element2 = { style: { opacity: '0', transform: 'translateY(30px)' } };
    const entries = [
      { isIntersecting: true, target: element1 },
      { isIntersecting: false, target: element2 }
    ];

    callback(entries);

    expect(element1.style.opacity).toBe('1');
    expect(element2.style.opacity).toBe('0');
  });
});

describe('createSkillBarObserverCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a callback function', () => {
    const observer = { unobserve: vi.fn() };
    const callback = createSkillBarObserverCallback(observer, 100);
    expect(typeof callback).toBe('function');
  });

  it('callback animates skill bar when intersecting', () => {
    const observer = { unobserve: vi.fn() };
    const callback = createSkillBarObserverCallback(observer, 100);
    const skillBar = { style: { width: '75%' } };
    const entries = [{ isIntersecting: true, target: skillBar }];

    callback(entries);

    expect(skillBar.style.width).toBe('0');
    vi.advanceTimersByTime(100);
    expect(skillBar.style.width).toBe('75%');
  });

  it('callback unobserves after animation', () => {
    const observer = { unobserve: vi.fn() };
    const callback = createSkillBarObserverCallback(observer, 100);
    const skillBar = { style: { width: '75%' } };
    const entries = [{ isIntersecting: true, target: skillBar }];

    callback(entries);

    expect(observer.unobserve).toHaveBeenCalledWith(skillBar);
  });

  it('callback does nothing when not intersecting', () => {
    const observer = { unobserve: vi.fn() };
    const callback = createSkillBarObserverCallback(observer, 100);
    const skillBar = { style: { width: '75%' } };
    const entries = [{ isIntersecting: false, target: skillBar }];

    callback(entries);

    expect(skillBar.style.width).toBe('75%');
    expect(observer.unobserve).not.toHaveBeenCalled();
  });
});
