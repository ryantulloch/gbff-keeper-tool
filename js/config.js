/**
 * Configuration Module - All constants and settings
 * This file must be loaded first
 */

// Firebase configuration (hardcoded for this app)
const firebaseConfig = {
    apiKey: "AIzaSyAQLCxk6rbl7chpifupFXa3TLV9ZvWsf2E",
    authDomain: "gbbf-keepers-tool.firebaseapp.com",
    databaseURL: "https://gbbf-keepers-tool-default-rtdb.firebaseio.com",
    projectId: "gbbf-keepers-tool",
    storageBucket: "gbbf-keepers-tool.appspot.com",
    messagingSenderId: "797435886779",
    appId: "1:797435886779:web:9c3f5a6129e6d7940afd9e"
};

// Keeper field configuration
const MIN_KEEPERS = 0;  // Allow zero keepers (all are optional)
const MAX_KEEPERS = 10;  // Maximum 10 keepers per team
const DEFAULT_KEEPER_COUNT = 4;

// Commissioner password
const COMMISSIONER_PASSWORD = 'teaisbest';

// System encryption key for auto-reveal
const SYSTEM_KEY = 'SYSTEM_KEY_2024';

// Countdown settings
const COUNTDOWN_DURATION = 10; // seconds
const COUNTDOWN_STALE_THRESHOLD = 10000; // 10 seconds in ms
const EXPIRY_AUTO_START_WINDOW = 86400000; // 24 hours in ms

// Default deadline
const DEFAULT_DEADLINE = '2025-09-02T00:00';

// Make configuration globally accessible
window.CONFIG = {
    firebaseConfig,
    MIN_KEEPERS,
    MAX_KEEPERS,
    DEFAULT_KEEPER_COUNT,
    COMMISSIONER_PASSWORD,
    SYSTEM_KEY,
    COUNTDOWN_DURATION,
    COUNTDOWN_STALE_THRESHOLD,
    EXPIRY_AUTO_START_WINDOW,
    DEFAULT_DEADLINE
};

// --- NEW: Keeper Table Configuration ---
window.MAX_KEEPERS = 10;
window.TEAM_BUDGET = 300;
window.ENABLE_TEAM_TABLES = true; // Feature flag to toggle the new UI

// --- NEW: Global Currency Formatter ---
// Provides consistent currency formatting across the application.
window.currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});