# Insight Christian Assembly Website

## Overview
This is a static HTML/CSS/JavaScript website for Insight Christian Assembly, a church organization. The website includes:
- Home page with event carousel and donation section
- About Us page featuring the pastors and mission statement
- Contact Us page with a contact form

## Project Structure
- **HTML Pages**: `index.html`, `about_us.html`, `contact_us.html`, `ministries.html`, `ministry_page.html`, `give.html`, `building_fund.html`, `visit_us.html`
- **CSS Files**:
  - `style.css` - Main homepage styles
  - `about_us_style.css` - About Us page styles
  - `contact.css` - Contact Us page styles
  - `css/common.css` - Shared styles (nav, footer, page-header, etc.)
  - `css/give_style.css` - Give page styles
  - `css/building_fund_style.css` - Building Fund page styles
  - `css/ministries_style.css` - Ministries page styles
  - `css/visit_us_style.css` - Visit Us page styles
- **JavaScript Files**: `index.js`, `contact.js`, `about_us.js`, `give.js`, `building_fund.js`
- **Assets**: Images and videos stored in the `/assets` directory

## Technology Stack
- HTML5
- CSS3
- JavaScript (with jQuery)
- Bootstrap 5.3.8 and 3.4.1
- Node.js with Express for the server
- PayPal SDK for donations

## Development Setup
The project uses a Node.js/Express server to serve static files:
- **Server**: Node.js 20 with Express
- **Port**: 5000 (frontend)
- **Host**: 0.0.0.0 (to support Replit's proxy environment)

## Running the Project
The workflow "Run Website" automatically starts the server using:
```bash
node server.js
```

The server includes cache-control headers to prevent browser caching issues during development.

## Server Features
- Static file serving with no-cache headers
- YouTube API endpoint (`/api/latest-video`) for fetching latest church video
- Weekly caching of YouTube API responses to minimize API calls
- Environment variables: `YOUTUBE_API_KEY`, `CHANNEL_ID`

## Deployment
The project is configured as a static deployment:
- **Type**: Static site
- **Public Directory**: Root directory (.)
- **Files Served**: All HTML, CSS, JavaScript, and assets

## Recent Changes (December 2, 2025)
- Imported GitHub repository to Replit
- Replaced Python HTTP server with Node.js/Express server (`server.js`)
- Added `package.json` with Express dependency
- Configured "Run Website" workflow on port 5000
- Set up static deployment configuration
- Updated `.gitignore` for Node.js files (node_modules, etc.)
- Created `replit.md` for project documentation
- Fixed video hero background display (z-index and HTML attribute corrections)
- Implemented comprehensive mobile responsive design across all pages
- Enhanced About Us page: added scroll animations, updated fonts (Noto Sans/Libre Baskerville), single pastor card
- Enhanced Give page: animated Proverbs 11:25 scripture hero, changed "Tithes & Offerings" to "Offering", featured Building Fund card
- Created dedicated Building Fund page with scrolling image gallery, vision section, and PayPal donation integration
- Added lightbox/expand feature for viewing gallery images individually with keyboard navigation support
- Redesigned events carousel: compact 800px width, navy gradient overlay, teal accent buttons, rounded corners

## Design System
- **Color Scheme**: Navy blue (#001d3d), White, Teal (#00A7E1)
- **Fonts**: Noto Sans (body), Libre Baskerville (headings)
- **Animations**: jQuery scroll-triggered animations on hero titles and bio sections

## Notes
- The website uses external CDNs for Bootstrap, jQuery, and Google Fonts
- PayPal integration is configured for donations (sandbox mode currently)
- Contact form is currently frontend-only (no backend processing)

## User Preferences
- Backend development: Node.js with Express (preferred for future developments)
- Color scheme: Navy blue (#001d3d), White, Teal (#00A7E1)
- Fonts: Noto Sans (body), Libre Baskerville (headings)
