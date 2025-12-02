# Insight Christian Assembly Website

## Overview
This is a static HTML/CSS/JavaScript website for Insight Christian Assembly, a church organization. The website includes:
- Home page with event carousel and donation section
- About Us page featuring the pastors and mission statement
- Contact Us page with a contact form

## Project Structure
- **HTML Pages**: `index.html`, `about_us.html`, `contact_us.html`, `ministries.html`, `ministry_page.html`, `building_fund.html`
- **CSS Files**: `style.css`, `about_us_style.css`, `contact.css`
- **JavaScript Files**: `index.js`, `contact.js`
- **Assets**: Images and videos stored in the `/assets` directory

## Technology Stack
- HTML5
- CSS3
- JavaScript (with jQuery)
- Bootstrap 5.3.8 and 3.4.1
- PayPal SDK for donations

## Development Setup
The project uses a simple Python HTTP server to serve static files:
- **Server**: Python 3.11 with built-in HTTP server
- **Port**: 5000 (frontend)
- **Host**: 0.0.0.0 (to support Replit's proxy environment)

## Running the Project
The workflow "Run Website" automatically starts the server using:
```bash
python server.py
```

The server includes cache-control headers to prevent browser caching issues during development.

## Deployment
The project is configured as a static deployment:
- **Type**: Static site
- **Public Directory**: Root directory (.)
- **Files Served**: All HTML, CSS, JavaScript, and assets

## Recent Changes (December 2, 2025)
- Imported GitHub repository to Replit
- Installed Python 3.11 for HTTP server
- Created `server.py` with cache-control headers
- Configured "Run Website" workflow on port 5000
- Set up static deployment configuration
- Added `.gitignore` for Python files
- Created `replit.md` for project documentation

## Notes
- The website uses external CDNs for Bootstrap, jQuery, and Google Fonts
- PayPal integration is configured for donations (sandbox mode currently)
- Contact form is currently frontend-only (no backend processing)
