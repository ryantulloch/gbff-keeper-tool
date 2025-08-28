# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fantasy Football Keeper Submission Tool - A web application for securely submitting and revealing fantasy football keeper selections with Firebase real-time sync.

## Architecture

### Modular JavaScript Structure
The application uses vanilla JavaScript organized into modules (no build process required):

- **js/config.js** - Configuration constants, Firebase config, keeper limits (0-20), passwords
- **js/encryption.js** - XOR cipher for password protection
- **js/firebase-manager.js** - Firebase connection and real-time data sync
- **js/countdown.js** - Deadline timer and auto-reveal countdown (custom 3/2/1 display: "Fuck"/"You"/"Danny")
- **js/ui-controller.js** - DOM updates, tab switching, confetti animations
- **js/keeper-fields.js** - Dynamic keeper field management (add/remove 0-20 fields)
- **js/submissions.js** - Form handling and submission logic
- **js/commissioner.js** - Admin functions (password protected)

### Critical Load Order
Scripts must load in this exact sequence in index.html:
1. config.js (configuration first)
2. encryption.js
3. firebase-manager.js
4. countdown.js
5. ui-controller.js
6. keeper-fields.js
7. submissions.js
8. commissioner.js

## Key Features

- Firebase real-time database sync across all users
- Password-protected keeper submissions using XOR encryption
- Auto-reveal countdown (10 seconds after deadline)
- Commissioner controls with password protection
- Dynamic keeper fields (0-20 keepers per team)
- Mobile-responsive design using Tailwind CSS

## Deployment

Direct deployment to Netlify (no build required):
- Uses CDN for Tailwind CSS
- Vanilla JavaScript with `<script>` tags
- All functions accessible via window object
- Required files: index.html, styles.css, js/* folder

## Important Configuration

- Commissioner password: Located in js/config.js
- Firebase configuration: Hardcoded in js/config.js
- Keeper limits: MIN=0, MAX=20, DEFAULT=4
- System encryption key for auto-reveal functionality

## Testing Points

When making changes, verify:
- Firebase connection establishes
- Dynamic keeper fields add/remove properly (0-20 range)
- Countdown displays custom text at final 3 seconds
- Auto-reveal triggers correctly after deadline
- Commissioner functions work with password authentication
- Mobile responsive layout functions correctly