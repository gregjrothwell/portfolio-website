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

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            console.warn('Failed to save theme preference:', e);
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const navbar = document.querySelector('.navbar');

        if (target && navbar) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color');
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.achievement-card, .case-study, .philosophy-card, ' +
        '.interest-card, .timeline-item, .stat-card, .about-text'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const skillBars = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => skillObserver.observe(bar));
});

const downloadCvBtn = document.getElementById('download-cv');

if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
        e.preventDefault();

        try {
            const cvContent = `GREG ROTHWELL
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
            }, 2000);
        } catch (error) {
            console.error('Failed to download CV:', error);
            e.target.textContent = 'Download failed';
            setTimeout(() => {
                e.target.textContent = 'Download CV';
            }, 2000);
        }
    });
}

const navbar = document.querySelector('.navbar');

if (navbar) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}
