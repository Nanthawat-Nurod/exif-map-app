# ExifMapper: Serverless GPS Map Application 🗺️📍

![ExifMapper UI Screenshot](public/vite.svg)<!-- Replace with actual screenshot later if you'd like -->

A stunning, fast, and 100% serverless web application that extracts GPS metadata (EXIF) from your photos and instantly visualizes them on an interactive map. Everything is processed locally in your browser, ensuring maximum privacy!

Live Demo: [https://Nanthawat-Nurod.github.io/exif-map-app](https://Nanthawat-Nurod.github.io/exif-map-app)

## Features ✨
- **100% Serverless & Private**: No backend needed! EXIF data is parsed entirely in your browser using `exifr`. Your photos never leave your device.
- **Drag & Drop Upload**: Upload multiple images simultaneously with a clean, modern interface.
- **Interactive Mapping**: Automatically drops pins on a beautiful dark-themed `Leaflet` map based on the GPS coordinates embedded in your photos.
- **Dynamic Previews**: Hover over or view map pins to see the actual image thumbnails right on the map.
- **Modern Aesthetics**: Built with a sleek Glassmorphism UI, smooth micro-animations, and a responsive mobile-first design tailored for both desktop and smartphones.
- **Smart Error Handling**: Gracefully alerts you if an uploaded photo lacks GPS metadata.

## Tech Stack 🛠️
- **Framework**: React 19 + TypeScript 
- **Build Tool**: Vite
- **Mapping**: Leaflet + React-Leaflet (using CARTO Dark Matter basemap)
- **EXIF Parsing**: Exifr
- **Styling**: Vanilla CSS (Custom Glassmorphism + Responsive Design)
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## Development 💻

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nanthawat-Nurod/exif-map-app.git
   cd exif-map-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Deployment 🚀
This project is configured to easily deploy to GitHub Pages.

To push a new update to the live site, simply run:
```bash
npm run deploy
```

---
*Created by Nanthawat.*
