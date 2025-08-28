/**
 * Countdown Coordinator Module - Main entry point for countdown functionality
 * This module coordinates between all countdown-related modules
 * 
 * Modules:
 * - timer.js: Deadline countdown timer
 * - countdown-overlay.js: 10-second reveal countdown
 * - countdown-test.js: Safe test mode (no team reveals)
 * - progress-animation.js: Circular progress bar animations
 * - notifications.js: Premium notification system
 */

// Note: All individual modules are loaded via HTML script tags
// This file serves as a coordinator and ensures all modules are properly connected

console.log('🚀 Countdown system initialized with modular architecture');
console.log('📦 Modules: timer, countdown-overlay, countdown-test, progress-animation, notifications');

// Verify all modules are loaded
const requiredFunctions = [
    'startTimer',
    'updateTimer', 
    'initiateCountdown',
    'startCountdown',
    'testCountdown',
    'testCountdownWithAuth',
    'startProgressAnimation',
    'showNotification'
];

const missingFunctions = requiredFunctions.filter(fn => typeof window[fn] !== 'function');
if (missingFunctions.length > 0) {
    console.error('❌ Missing countdown functions:', missingFunctions);
} else {
    console.log('✅ All countdown modules loaded successfully');
}

// Legacy compatibility - ensure executeAutoReveal is defined by submissions.js
if (typeof window.executeAutoReveal !== 'function') {
    console.warn('⚠️ executeAutoReveal not found - ensure submissions.js is loaded');
}