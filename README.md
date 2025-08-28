# GBFF Fantasy Football Keeper Submission Tool

![GitHub repo size](https://img.shields.io/github/repo-size/ryantulloch/gbff-keeper-tool)
![GitHub last commit](https://img.shields.io/github/last-commit/ryantulloch/gbff-keeper-tool)
![GitHub issues](https://img.shields.io/github/issues/ryantulloch/gbff-keeper-tool)

A premium, real-time fantasy football keeper submission platform with encrypted submissions, automated countdown reveals, and live Firebase synchronization.

## 🔗 Live Demo

[View Live Application](https://gbff-keeper-tool.netlify.app) *(Configure with your Firebase credentials)*

## 📥 Quick Start

```bash
# Clone the repository
git clone https://github.com/ryantulloch/gbff-keeper-tool.git

# Navigate to project directory
cd gbff-keeper-tool

# Open index.html in your browser or deploy to Netlify
```

## 🚀 Production Ready

Deploy directly to Netlify - **NO BUILD PROCESS REQUIRED!**

### Required Files Structure
```
keeper-tool-project/
├── index.html          # Main application
├── styles/             # Modular CSS architecture
│   ├── main.css        # CSS entry point with @imports
│   ├── core/           # Foundation styles (variables, base, utilities)
│   ├── components/     # UI component styles (tables, forms, accordion)
│   ├── animations/     # All @keyframes definitions
│   └── responsive/     # Mobile-specific responsive styles
└── js/                 # Modular JavaScript architecture
    ├── config.js       # Configuration & Firebase settings
    ├── encryption.js   # XOR cipher for password protection
    ├── firebase-manager.js    # Real-time database sync
    ├── countdown.js    # Timer & auto-reveal countdown
    ├── ui-controller.js        # DOM updates & UI management
    ├── teams-data.js   # Team roster data and selection interface
    ├── keepers-table.js        # Enhanced team selection & edit functionality
    ├── submissions.js  # Form handling & submission logic
    ├── commissioner.js # Admin controls & functions
    └── accordion.js    # Smooth accordion animations

## ✨ Premium Features

### Core Functionality
- **🔐 Encrypted Submissions**: Password-protected keeper selections using XOR encryption
- **✏️ Edit Keepers**: Complete submission overwrite system with bypass for "already submitted" blocks
- **⚽ Team Roster Interface**: Interactive team selection with budget tracking and player costs
- **⏱️ Auto-Reveal Countdown**: Dramatic 10-second countdown with "FUCK/YOU/DANNY" finale
- **🔄 Real-Time Sync**: Firebase-powered live updates across all connected users
- **👮 Commissioner Controls**: Password-protected admin panel for deadline management
- **📱 Fully Responsive**: Mobile-first design with premium animations

### Design Excellence
- **Typography**: Playfair Display for headers, Inter for body text
- **Animations**: Smooth cubic-bezier transitions throughout
- **Dark Theme Countdown**: Premium overlay with gold accents
- **Glass Morphism**: Subtle blur effects for modern UI
- **Gradient Accents**: Professional blue-to-emerald color schemes

### Technical Features
- **Team Selection Interface**: Interactive roster selection with real-time budget calculations
- **Edit Submissions**: Complete keeper replacement with password auto-detection
- **Modular CSS Architecture**: Organized styles with core, components, animations, and responsive modules
- **Smooth Accordion UI**: Hardware-accelerated animations
- **Post-Reveal State**: Clean results display with preserved header styling
- **Mobile Optimized**: Touch-friendly targets, responsive grid layouts, enhanced checkbox sizing
- **No Build Required**: CDN-based Tailwind CSS, vanilla JavaScript

## 🎯 How to Deploy

### Netlify Deployment (Recommended)
1. Ensure all files are in the correct structure (index.html, styles.css, js/ folder)
2. Go to [Netlify](https://app.netlify.com)
3. Drag the entire project folder to deploy
4. Your app is live! No configuration needed

### Configuration
Edit `js/config.js` to customize:
- Firebase credentials
- Commissioner password
- Keeper limits (MIN: 0, MAX: 10, DEFAULT: 4)
- Countdown duration
- Default deadline

## 🎮 Usage Guide

### For Players
1. **Submit Keepers**
   - Select your team from the dropdown
   - Choose keeper players from your roster (budget: $300, max keepers vary by configuration)
   - Set a secure password
   - Submit before the deadline

2. **Edit Keepers** ✨ *New Feature*
   - Select your team and enter your password
   - Choose your new keeper selection
   - Click "Edit Keepers" for complete submission replacement
   - Crystal clear confirmation shows your NEW ENTIRE team

3. **View Submissions**
   - Switch to "View Submissions" tab
   - See encrypted submissions before deadline
   - Watch live reveals after countdown

### For Commissioner
1. **Set Deadline**
   - Use commissioner controls (password protected)
   - Set submission deadline
   - System auto-initiates countdown when deadline passes

2. **Admin Functions**
   - Force reveal all submissions
   - Clear all data
   - Export submissions
   - Test countdown (dev mode)

### The Reveal Experience
When the deadline hits:
- 60-second full-screen countdown begins with dramatic gold-accented overlay
- 57 rotating meme images (Cowboys/Micah/Jerry) with smooth crossfade transitions
- Images display at 30% opacity, one per second from 60→4
- Final 3 seconds: "FUCK" → "YOU" → "DANNY" (no background images)
- All keepers revealed simultaneously with staggered animations
- Header updates to "Final Results"

## 🛠️ Technical Stack

- **Frontend**: HTML5, Tailwind CSS (CDN), Custom CSS3 animations
- **JavaScript**: Vanilla ES6+ with modular architecture
- **Database**: Firebase Realtime Database
- **Encryption**: XOR cipher with double-encryption for auto-reveal
- **Fonts**: Playfair Display (headers), Inter (UI), Raleway (countdown)
- **Icons**: Font Awesome 6.4

## 🔒 Security Features

- Password-protected submissions
- Encrypted keeper data until reveal
- Commissioner password for admin functions
- XOR double-encryption for auto-reveal system
- No plaintext passwords stored

## 📱 Browser Support

- Chrome 90+ (Recommended)
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android)

## 🎨 Design System

### Colors
- Primary: Blue (#3B82F6) → Emerald (#10B981) gradient
- Accent: Gold (#FFD700) for countdown
- Dark: Slate (#0F172A) for headers
- Danger: Red (#DC2626) for final countdown

### Animations
- Smooth cubic-bezier easing (0.25, 0.46, 0.45, 0.94)
- Hardware-accelerated transforms
- 60fps countdown transitions
- Responsive hover states

## 🚦 Testing

### Quick Test Mode
1. Open Commissioner Controls
2. Click "Test Countdown (Dev)" 
3. Watch the countdown animation
4. No data is modified in test mode

### Full Integration Test
1. Submit test keepers with password
2. Set deadline to 1 minute in future
3. Wait for auto-countdown
4. Verify all keepers revealed

## 📄 License

Private project for GBFF league use.

## 🏆 Credits

Built with precision for the GBFF Fantasy Football League.
Premium countdown experience dedicated to Danny.

---

**Status**: ✅ Production Ready | **Version**: 2.2 | **Last Updated**: January 2025

## 🔄 Recent Updates (v2.2)

### 🎬 Countdown Background Images with Smooth Crossfade
- **57 Rotating Meme Images**: Cowboys/Micah Parsons/Jerry Jones themed backgrounds during 60-second countdown
- **Smooth Crossfade Transitions**: Images blend seamlessly without black gaps between transitions
- **Optimized Performance**: GPU-accelerated CSS transitions with 400ms crossfade duration
- **Smart Image Management**: Previous images fade out while new images fade in with 100ms overlap
- **Final 3 Seconds**: Background images pause for dramatic "FUCK/YOU/DANNY" text display

## 🔄 Previous Updates (v2.1)

### ✨ Enhanced Edit Functionality
- **Complete Submission Overwrite**: Edit keepers with full replacement system
- **Auto-Password Detection**: Form password automatically used for edits
- **Bypass "Already Submitted"**: Edit existing submissions without restrictions
- **Crystal Clear Confirmation**: Enhanced messaging emphasizing complete replacement

### 🏗️ CSS Architecture Refactoring
- **Modular Structure**: Migrated from monolithic `styles.css` to organized `styles/` directory
- **Performance**: Improved load times with targeted CSS imports
- **Maintainability**: Separated concerns with core, components, animations, and responsive modules
- **Mobile Enhancements**: Better checkbox sizing and touch targets

### 🐛 Bug Fixes
- **Floating Bar Math**: Fixed calculation sync issues during edit workflow
- **Password Validation**: Enhanced form field detection with `.trim()` validation
- **UI State Management**: Proper reset of both Map and UI state during edits
- **Player Data**: Updated roster data (Daniel Lock → Drew Lock)

### 🧹 Code Cleanup
- **Eliminated Duplication**: Consolidated CSS `@keyframes` into dedicated module
- **Enhanced Logging**: Better debugging for edit workflow and team lookup
- **Clean Database**: Removed test submissions and maintained production-ready state