const SCROLL_OFFSET_NAV = 100;
const SCROLL_THRESHOLD_NAVBAR_SHADOW = 100;
const INTERSECTION_THRESHOLD = 0.1;
const SKILL_BAR_ANIMATION_DELAY = 100;
const DOWNLOAD_FEEDBACK_DURATION = 2000;

const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

/**
 * Gets user's preferred theme with fallback chain: localStorage → system preference
 * @returns {'dark' | 'light'} Theme preference
 */
function getPreferredTheme() {
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
    } catch (e) {
        console.warn('localStorage not available:', e);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

html.setAttribute('data-theme', getPreferredTheme());

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    try {
        if (!localStorage.getItem('theme')) {
            html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    } catch (err) {
        html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

/**
 * Toggles theme and saves preference
 * @param {string} currentTheme - Current theme value
 * @returns {string} New theme value
 */
function toggleTheme(currentTheme) {
    return currentTheme === 'light' ? 'dark' : 'light';
}

/**
 * Saves theme preference to localStorage
 * @param {string} theme - Theme to save
 * @returns {boolean} Whether save was successful
 */
function saveThemePreference(theme) {
    try {
        localStorage.setItem('theme', theme);
        return true;
    } catch (e) {
        console.warn('Failed to save theme preference:', e);
        return false;
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = toggleTheme(currentTheme);

        html.setAttribute('data-theme', newTheme);
        saveThemePreference(newTheme);
    });
}

/**
 * Calculates target scroll position for smooth anchor navigation
 * @param {Element} target - Target element to scroll to
 * @param {Element} navbar - Navbar element
 * @returns {number} Target scroll position
 */
function calculateScrollPosition(target, navbar) {
    const navHeight = navbar.offsetHeight;
    return target.offsetTop - navHeight;
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const navbar = document.querySelector('.navbar');

        if (target && navbar) {
            const targetPosition = calculateScrollPosition(target, navbar);

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Determines which section is currently active based on scroll position
 * @param {number} scrollPosition - Current scroll position
 * @param {Array} sections - Array of section elements
 * @returns {string} ID of the active section
 */
function getCurrentSection(scrollPosition, sections) {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    return current;
}

/**
 * Updates navigation link colors based on active section
 * @param {string} activeSectionId - ID of the currently active section
 * @param {NodeList} navLinks - Navigation link elements
 * @param {string} primaryColor - Primary color value to use for active link
 */
function updateNavLinkColors(activeSectionId, navLinks, primaryColor) {
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${activeSectionId}`) {
            link.style.color = primaryColor;
        }
    });
}

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-menu a');

    const scrollPosition = window.pageYOffset + SCROLL_OFFSET_NAV;
    const current = getCurrentSection(scrollPosition, sections);
    const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-color');

    updateNavLinkColors(current, navLinks, primaryColor);
});

/**
 * Applies fade-in animation to element
 * @param {Element} element - Element to animate
 */
function applyFadeInAnimation(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
}

/**
 * Creates intersection observer callback for fade-in animations
 * @returns {Function} Observer callback
 */
function createFadeInObserverCallback() {
    return (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                applyFadeInAnimation(entry.target);
            }
        });
    };
}

const observerOptions = {
    threshold: INTERSECTION_THRESHOLD,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(createFadeInObserverCallback(), observerOptions);

/**
 * Prepares element for fade-in animation
 * @param {Element} element - Element to prepare
 */
function prepareElementForAnimation(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
}

/**
 * Animates skill bar width
 * @param {Element} skillBar - Skill bar element
 * @param {number} delay - Animation delay in ms
 */
function animateSkillBar(skillBar, delay) {
    const width = skillBar.style.width;
    skillBar.style.width = '0';
    setTimeout(() => {
        skillBar.style.width = width;
    }, delay);
}

/**
 * Creates intersection observer callback for skill bars
 * @param {IntersectionObserver} observer - Observer instance to unobserve after animation
 * @param {number} delay - Animation delay
 * @returns {Function} Observer callback
 */
function createSkillBarObserverCallback(observer, delay) {
    return (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBar(entry.target, delay);
                observer.unobserve(entry.target);
            }
        });
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.achievement-card, .case-study, .testimonial-card, .philosophy-card, ' +
        '.project-card, .interest-card, .timeline-item, .stat-card, .about-text'
    );

    animatedElements.forEach(el => {
        prepareElementForAnimation(el);
        observer.observe(el);
    });

    const skillBars = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver(
        createSkillBarObserverCallback(null, SKILL_BAR_ANIMATION_DELAY),
        observerOptions
    );

    const callback = createSkillBarObserverCallback(skillObserver, SKILL_BAR_ANIMATION_DELAY);
    const actualSkillObserver = new IntersectionObserver(callback, observerOptions);

    skillBars.forEach(bar => actualSkillObserver.observe(bar));
});

/**
 * Generates CV content as plain text
 * @returns {string} Formatted CV content
 */
function generateCvContent() {
    return `GREG ROTHWELL
Lead Scrum Master & Agile Transformation Leader

PROFILE
Lead Scrum Master with deep expertise in scaling agile practices and transforming delivery organizations. Over 11 years of experience spanning small digital agencies to large multinational corporations, with a passion for challenging the status quo and driving meaningful change.

CONTACT
Website: https://gregrothwell.co.uk
Location: Lancashire, UK

KEY ACHIEVEMENTS
• Built the Scrum Function at Pretty Little Thing (3→6+ SMs, expanding to 12+)
• Implemented tribe-based delivery model for 10+ squads
• Drove UX integration into delivery squads, eliminating friction and bottlenecks
• Championed API contract testing and CI/CD initiatives
• Introduced quarterly squad health checks across all teams
• Secured protected time for L&D and laid groundwork for Guild model

EXPERIENCE

Lead Scrum Master | Pretty Little Thing, Manchester (Dec 2021 – Present)
• Led team of 6 Scrum Masters after expanding from 3 over a short period
• Built the Scrum Function ensuring minimum standards while providing squad flexibility
• Implemented tribe-based delivery model for 10+ squads after communication degradation
• Maintained delivery stability during 40% staff expansion
• Facilitated merge with development squads from other group companies
• Integrated UX resources directly into squads, reducing friction
• Introduced quarterly health checks and tribe reviews for stakeholder alignment
• Championed API contract testing and CI/CD initiatives

Scrum Master | Pretty Little Thing, Manchester (Jun 2021 – Dec 2021)
• Supported up to 5 squads simultaneously
• Facilitated delivery of React Native iOS/Android PLT Marketplace app
• Supported large-scale Magento decommission and React web frontend transition

Scrum Master | Studio Retail, Accrington (Feb 2021 – Jun 2021)

Scrum Master | Foreign Currency Direct, Manchester (Sep 2019 – Oct 2020)

Scrum Master | Covéa Insurance, Halifax (Oct 2018 – Sep 2019)

Scrum Master | Pretty Little Thing, Manchester (Oct 2017 – Oct 2018)

Project Delivery Manager | Enghouse Networks, Blackburn (Dec 2016 – Oct 2017)

Project Delivery Assistant | Enghouse Networks, Blackburn (Aug 2015 – Dec 2016)

Project Manager | Netsells Ltd, Scarborough (2013 – 2015)

SKILLS & EXPERTISE
• Agile Frameworks: Scrum, Scaled Agile (Tribes/SAFe), Kanban, Agile Coaching
• Leadership: Team Building & Scaling, Servant Leadership, Stakeholder Management
• Tools: Jira, Confluence, Azure DevOps, Slack, MS Teams, Git, AWS
• Technical: Microservices, CI/CD pipelines, API contract testing, React/React Native
• Additional: Business Analysis, Project Management, UX Collaboration, Metrics

CERTIFICATIONS
Professional Scrum Master I (PSM I) - Scrum.org

For full details and case studies, visit: https://gregrothwell.co.uk
`;
}

const downloadCvBtn = document.getElementById('download-cv');

if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
        e.preventDefault();

        try {
            const cvContent = generateCvContent();
            const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Greg_Rothwell_CV.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

            const originalText = e.target.textContent;
            e.target.textContent = 'Downloaded ✓';
            setTimeout(() => {
                e.target.textContent = originalText;
            }, DOWNLOAD_FEEDBACK_DURATION);
        } catch (error) {
            console.error('Failed to download CV:', error);
            e.target.textContent = 'Download failed';
            setTimeout(() => {
                e.target.textContent = 'Download CV';
            }, DOWNLOAD_FEEDBACK_DURATION);
        }
    });
}

const navbar = document.querySelector('.navbar');

/**
 * Determines if navbar should have shadow based on scroll position
 * @param {number} scrollPosition - Current scroll position
 * @param {number} threshold - Scroll threshold for shadow
 * @returns {boolean} Whether shadow should be shown
 */
function shouldShowNavbarShadow(scrollPosition, threshold) {
    return scrollPosition > threshold;
}

if (navbar) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (shouldShowNavbarShadow(currentScroll, SCROLL_THRESHOLD_NAVBAR_SHADOW)) {
            navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

/**
 * Opens the mobile menu
 */
function openMobileMenu() {
    if (mobileMenu && mobileMenuOverlay && mobileMenuToggle) {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const firstLink = mobileMenu.querySelector('a');
        if (firstLink) {
            firstLink.focus();
        }
    }
}

/**
 * Closes the mobile menu
 */
function closeMobileMenu() {
    if (mobileMenu && mobileMenuOverlay && mobileMenuToggle) {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

/**
 * Toggles the mobile menu open/closed state
 */
function toggleMobileMenu() {
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
        if (mobileMenuToggle) {
            mobileMenuToggle.focus();
        }
    }
});

// Export for testing
export {
    getPreferredTheme,
    getCurrentSection,
    generateCvContent,
    updateNavLinkColors,
    shouldShowNavbarShadow,
    toggleTheme,
    saveThemePreference,
    calculateScrollPosition,
    applyFadeInAnimation,
    createFadeInObserverCallback,
    prepareElementForAnimation,
    animateSkillBar,
    createSkillBarObserverCallback,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu
};
