# VizAI Frontend (React + Tailwind)

A modern, minimal, and responsive frontend for VizAI with the Electric Orange theme.

## Features
- Sidebar navigation: Dashboard, Import, Analysis
- Header with brand icon and theme toggle
- Reusable components: Cards, Summary KPIs, Table, Upload Button
- Mock analysis flow (YOLO-like): random detections and accuracy
- Responsive for desktop and tablet
- Tailwind CSS with extended Electric Orange palette

## Quickstart
1. Install dependencies:
   - npm install
2. Run development server:
   - npm start
3. Build for production:
   - npm run build

## Structure
- src/App.js: App layout, routing, and pages
- src/index.css: Tailwind base and utility classes
- tailwind.config.js: Theme config

## Notes
- Replace mock analysis logic in Analysis page with real backend once available.
- Theme uses dark mode by default; toggle available in header.
