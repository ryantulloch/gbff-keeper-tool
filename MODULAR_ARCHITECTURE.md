# GBFF Keepers Tool - Modular JavaScript Architecture

## Overview
The JavaScript has been refactored from a single 1211-line `app.js` file into a modular architecture for better maintainability and organization.

## Architecture Structure

### JavaScript Modules (`js/` directory)

1. **config.js** (Loads First)
   - All configuration constants
   - Firebase configuration
   - Keeper limits (MIN=0, MAX=20; Default=4)
   - Commissioner password
   - Countdown settings
   - System encryption key

2. **encryption.js** (Core Utility)
   - XOR cipher encryption/decryption functions
   - Hash generation for integrity verification
   - Used by submissions for password protection

3. **firebase-manager.js** (Database Layer)
   - Firebase connection management
   - Real-time data listeners
   - Database reference management
   - Connection status monitoring
   - Global state management

4. **countdown.js** (Timer & Countdown)
   - Deadline timer management
   - 10-second auto-reveal countdown
   - **CUSTOM FEATURE**: Final 3 seconds display:
     - 3 seconds: "Fuck"
     - 2 seconds: "You"  
     - 1 second: "Danny"
   - Countdown overlay management
   - Auto-reveal initiation logic

5. **ui-controller.js** (Display Management)
   - Submissions list rendering
   - Tab switching functionality
   - Confetti animations
   - DOM updates and display refresh

6. **keeper-fields.js** (Dynamic Fields)
   - Dynamic keeper field management (0-20 fields)
   - Add/remove keeper input fields
   - Field numbering and validation
   - Remove button visibility control

7. **submissions.js** (Form Handling)
   - Keeper submission logic
   - Password validation
   - Auto-reveal execution
   - Edit submission functionality
   - Search and filter capabilities

8. **commissioner.js** (Admin Functions)
   - Deadline setting (password protected)
   - Reset everything functionality
   - Force reveal capability
   - Export submissions to JSON
   - Clear all submissions

## Load Order (CRITICAL)

Scripts must be loaded in this specific order in `index.html`:

```html
<!-- Configuration must load first -->
<script src="js/config.js"></script>

<!-- Core utilities -->
<script src="js/encryption.js"></script>

<!-- Firebase manager -->
<script src="js/firebase-manager.js"></script>

<!-- Feature modules -->
<script src="js/countdown.js"></script>
<script src="js/ui-controller.js"></script>
<script src="js/keeper-fields.js"></script>
<script src="js/submissions.js"></script>
<script src="js/commissioner.js"></script>

<!-- Main initialization -->
<script>
    window.onload = function() {
        connectFirebase();
        initializeKeeperFields();
        // ... other initialization
    };
</script>
```

## Key Features Preserved

✅ **Firebase Integration** - Real-time sync across all users
✅ **Dynamic Keeper Fields** - Add/remove keeper inputs (0-20)
✅ **Auto-Reveal Countdown** - 10-second countdown after deadline
✅ **Custom Countdown Text** - "Fuck/You/Danny" at 3/2/1 seconds
✅ **Password Protection** - XOR cipher encryption for submissions
✅ **Commissioner Controls** - Password-protected admin functions
✅ **Live Sync Status** - Connection status indicator
✅ **Confetti Animations** - Celebration on reveal
✅ **Mobile Responsive** - Collapsible instructions on mobile

## Deployment

This modular architecture is compatible with Netlify drag-and-drop deployment:
- Uses standard `<script>` tags (no ES6 modules)
- Proper dependency ordering
- All functions accessible via `window` object
- No build process required

## Testing Checklist

- [ ] Firebase connection establishes
- [ ] Submissions save and sync
- [ ] Dynamic keeper fields add/remove (0-20)
- [ ] Countdown displays custom text at 3/2/1
- [ ] Auto-reveal triggers after deadline
- [ ] Commissioner functions work with password
- [ ] Tab switching updates display
- [ ] Search/filter functionality works
- [ ] Edit submission with password works
- [ ] Export to JSON works

## Files

- `app.js.backup` - Original single-file backup
- `js/` - Modular JavaScript files
- `index.html` - Updated with modular script tags
- `styles.css` - Unchanged
- `README.md` - Original documentation