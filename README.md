# Greg Rothwell - Portfolio Website

Professional portfolio website showcasing experience as a Lead Scrum Master & Agile Transformation Leader.

[![Tests](https://img.shields.io/badge/tests-49%20passing-success)](package.json)
[![Coverage](https://img.shields.io/badge/coverage-71.93%25-brightgreen)](package.json)
[![Functions](https://img.shields.io/badge/functions-100%25-success)](package.json)

## ✨ Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Theme** - Automatic detection with manual toggle
- **Smooth Animations** - Intersection Observer-based scroll effects
- **CV Download** - Professional CV download functionality
- **Active Navigation** - Auto-highlighting based on scroll position
- **Production Ready** - 72% test coverage with comprehensive error handling

## 🧪 Testing

This project includes a comprehensive test suite using Vitest.

### Quick Start

```bash
# Install dependencies
npm install

# Run tests (watch mode)
npm test

# Run tests once
npm run test:run

# Generate coverage report
npm run test:coverage

# Open interactive test UI
npm run test:ui
```

### Test Coverage

```
File       | % Stmts | % Branch | % Funcs | % Lines
-----------|---------|----------|---------|----------
script.js  |  71.93% |  91.66%  |   100%  |  71.93%
```

**Test Suite:** 49 comprehensive tests covering:
- Theme system (6 tests): localStorage fallback, system preference detection, error handling
- Navigation (7 tests): Section detection, link highlighting, scroll calculations
- CV generation (9 tests): Content validation, all sections present
- Scroll behavior (4 tests): Navbar shadow, position calculations
- Animations (10 tests): Fade-in effects, skill bar animations, element preparation
- Observer callbacks (8 tests): Intersection observer logic, callback factories
- Click handlers (5 tests): Theme toggle, anchor navigation, scroll positioning

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, responsive design
- **Vanilla JavaScript** - ES6 modules, no frameworks
- **Vitest** - Testing framework
- **jsdom** - DOM testing environment

## 📁 Project Structure

```
portfolio-website/
├── index.html          # Main HTML file
├── script.js           # Core functionality (383 lines, ES6 module)
├── script.test.js      # Test suite (449 lines, 49 tests)
├── vitest.config.js    # Vitest configuration
├── test-setup.js       # Test mocks (IntersectionObserver, localStorage, matchMedia)
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## 🚀 Local Development

### Without Tests
Simply open `index.html` in your browser to view the site.

### With Tests
```bash
# Prerequisites: Node.js v24+ and npm v11+

# Install dependencies
npm install

# Open in browser
open index.html

# Run tests in background
npm test
```

## Customization

Update the following in `index.html`:
- Email address in the contact section
- LinkedIn profile URL
- Any specific details about your experience and projects

## GitHub Pages Setup

This site is configured to be hosted on GitHub Pages. Once pushed to GitHub:
1. Go to repository Settings
2. Navigate to Pages section
3. Set Source to main branch
4. Your site will be available at `https://yourusername.github.io/repository-name`

## Custom Domain Setup (GoDaddy)

To use a custom domain from GoDaddy:
1. Create a `CNAME` file in the root directory with your domain name
2. In GoDaddy DNS settings, add:
   - A records pointing to GitHub Pages IPs
   - CNAME record for www subdomain
