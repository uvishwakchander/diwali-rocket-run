/**
 * ============================================================================
 * DIWALI ROCKET RUN - GAME CONFIGURATION
 * ============================================================================
 * 
 * To connect your personal Google Sheet Global Leaderboard & Telemetry:
 * 1. Follow the 1-minute steps in backend/google-apps-script.js
 * 2. Paste your deployed Web App URL into the API_URL property below:
 * 
 * Example:
 * API_URL: "https://script.google.com/macros/s/AKfycbx.../exec",
 * 
 * If API_URL is left empty (""), the game automatically saves scores to
 * local device storage and displays festive champions seamlessly!
 * ============================================================================
 */

window.GAME_CONFIG = {
  // Global Leaderboard & Telemetry Web App URL
  API_URL: "",

  // Leaderboard display settings
  LEADERBOARD_LIMIT: 10,
  DEFAULT_NAME: "Festive Pilot",

  // GitHub Repository URL
  GITHUB_REPO_URL: "https://github.com/uvishwakchander/diwali-rocket-run",

  // Live GitHub Pages URL
  LIVE_GAME_URL: "https://uvishwakchander.github.io/diwali-rocket-run/"
};
