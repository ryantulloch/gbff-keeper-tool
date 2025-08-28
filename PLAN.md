# GBFF Keepers: Detailed Implementation Plan v2.2 (Definitive)

**Owner:** Roo the Architect  
**Target Repo:** `keeper-tool-project`  
**Output:** `PLAN.md`  
**Version:** 2.2 (This version is code-complete, incorporating all feedback for direct implementation.)

## 1. Project Summary & Revisions

This document provides a definitive, code-complete blueprint for replacing the manual keeper input system with a dynamic, table-based UI. It incorporates all feedback, including UI polish, validation, and responsive design.

### Core Features:
- **Team Selection:** A styled dropdown (`el-select`) will replace the free-text team name input.
- **Keeper Tables:** Each team will have a dedicated table showing their available players and keeper costs.
- **Floating Budget Bar:** A UI element will display the running total of selected keepers, the remaining budget, and provide `Clear` and `Submit` actions.
- **Constraint Enforcement:** The system will enforce a maximum of **10 keepers** and a total team budget of **$300**.

### Revisions Incorporated (v2.2):
- **UI Polish:**
    - Added missing SVG checkmark for visual feedback in tables.
    - Implemented header "select all" checkbox logic with constraint awareness.
    - Increased floating bar `z-index` to `z-50` to avoid conflicts with dropdowns.
    - Added responsive CSS for the floating bar on mobile screens.
- **Validation & Hardening:**
    - Added a team selection guard to prevent actions before a team is chosen.
    - Included an input sanitization function for player names used in data attributes.
- **Future Considerations (Noted for future work):**
    - **Local Storage:** Persist selections to prevent data loss on page refresh.
    - **Error Handling:** Add more robust `try-catch` blocks for critical operations.

---

## 2. System Configuration (`js/config.js`)

**Task:** Add `MAX_KEEPERS`, `TEAM_BUDGET`, a feature flag, and a currency formatter to `js/config.js`.

```javascript
// js/config.js

// --- Existing Config ---
// ... (Firebase config, passwords, etc.)

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
```

---

## 3. Team and Roster Data (`js/teams-data.js`)

**Task:** Create a new file `js/teams-data.js` and populate it with the complete team data structure.

```javascript
// js/teams-data.js

// Helper function to create URL-friendly slugs from manager names.
function createSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const MANAGERS = [
  'Ryan Gies', 'Mike Loseth', 'Danny Willox', 'Mike Malecha', 'Codie K',
  'Cody Johnstone', 'Taylor Garrett', 'Randy S', 'Ryan T', 'Jon Probe', 'Tako', 'Will Redl'
];

// TEAM_OPTIONS will be used to populate the dropdown.
// - `label` is the capitalized manager name shown to the user.
// - `value` is a URL-friendly slug for internal use.
window.TEAM_OPTIONS = MANAGERS.map(name => ({
  value: createSlug(name),
  label: name,
}));

window.TEAMS = {
  'ryan-gies': [
    { name: 'Kirk Cousins', cost: 33 }, { name: 'Austin Ekeler', cost: 15 },
    { name: 'Devon Achane', cost: 18 }, { name: 'Jaxon Smith-Njigba', cost: 32 },
    { name: 'Mike Evans', cost: 58 }, { name: 'Evan Engram', cost: 13 },
    { name: 'Gus Edwards', cost: 9 }, { name: 'Jakobi Meyers', cost: 6 },
    { name: 'George Kittle', cost: 36 }, { name: 'Daniel Jones', cost: 13 },
    { name: 'Ray Davis', cost: 5 }, { name: 'Jaylen Wright', cost: 15 },
    { name: 'Kimani Vidal', cost: 5 }, { name: 'Tyler Allgeier', cost: 9 },
    { name: 'Jahan Dotson', cost: 5 }, { name: 'Rashid Shaheed', cost: 9 },
    { name: 'Demario Douglas', cost: 6 }, { name: 'Dallas Goedert', cost: 22 },
    { name: 'Brandon Aiyuk', cost: 23 }
  ],
  'mike-loseth': [
    { name: 'Jalen Hurts', cost: 70 }, { name: 'Christian McCaffrey', cost: 113 },
    { name: 'Zach Charbonnet', cost: 9 }, { name: 'Michael Pittman Jr.', cost: 19 },
    { name: 'Christian Watson', cost: 19 }, { name: 'Brock Bowers', cost: 21 },
    { name: 'Garrett Wilson', cost: 21 }, { name: 'Cade Otton', cost: 5 },
    { name: 'Xavier Legette', cost: 6 }, { name: 'Josh Allen', cost: 26 },
    { name: 'Michael Penix Jr.', cost: 11 }, { name: 'Trey Benson', cost: 14 },
    { name: 'Jordan Mason', cost: 9 }, { name: 'Keaton Mitchell', cost: 6 },
    { name: 'Mike Wilson', cost: 6 }, { name: 'Malik Washington', cost: 5 },
    { name: 'Jalen McMillan', cost: 10 }, { name: 'Russell Wilson', cost: 5 },
    { name: 'Jermaine Burton', cost: 6 }, { name: 'Allen Lazard', cost: 10 }
  ],
  'danny-willox': [
    { name: 'Kyler Murray', cost: 18 }, { name: 'Clyde Edwards-Helaire', cost: 10 },
    { name: 'Kenneth Gainwell', cost: 5 }, { name: 'DK Metcalf', cost: 37 },
    { name: 'Marvin Harrison Jr.', cost: 62 }, { name: 'Cole Kmet', cost: 10 },
    { name: 'Demarcus Robinson', cost: 5 }, { name: 'Keenan Allen', cost: 12 },
    { name: 'Adam Thielen', cost: 16 }, { name: 'Bryce Young', cost: 25 },
    { name: 'Derrick Henry', cost: 92 }, { name: 'Justice Hill', cost: 5 },
    { name: 'Brian Robinson Jr.', cost: 19 }, { name: 'Tyler Boyd', cost: 5 },
    { name: 'DJ Chark', cost: 5 }, { name: 'Rashod Bateman', cost: 5 },
    { name: 'Taysom Hill', cost: 9 }, { name: 'Noah Fant', cost: 5 },
    { name: 'Jake Ferguson', cost: 17 }, { name: 'Hollywood Brown', cost: 18 }
  ],
  'mike-malecha': [
    { name: 'Caleb Williams', cost: 37 }, { name: 'Aaron Jones Sr.', cost: 33 },
    { name: 'D\'Andre Swift', cost: 40 }, { name: 'Davante Adams', cost: 42 },
    { name: 'Deebo Samuel Sr.', cost: 43 }, { name: 'Will Dissly', cost: 10 },
    { name: 'Joe Mixon', cost: 41 }, { name: 'Quentin Johnston', cost: 5 },
    { name: 'Kendre Miller', cost: 5 }, { name: 'Justin Herbert', cost: 22 },
    { name: 'Geno Smith', cost: 18 }, { name: 'Alexander Mattison', cost: 5 },
    { name: 'Cam Akers', cost: 10 }, { name: 'Tyler Lockett', cost: 7 },
    { name: 'Noah Brown', cost: 10 }, { name: 'Ray-Ray McCloud', cost: 10 },
    { name: 'Wan\'Dale Robinson', cost: 5 }, { name: 'Dalton Schultz', cost: 13 },
    { name: 'Christian Kirk', cost: 20 }
  ],
  'codie-k': [
    { name: 'Patrick Mahomes', cost: 33 }, { name: 'Tyrone Tracy Jr.', cost: 5 },
    { name: 'Isiah Pacheco', cost: 29 }, { name: 'DeAndre Hopkins', cost: 8 },
    { name: 'Jaylen Waddle', cost: 26 }, { name: 'T.J. Hockenson', cost: 24 },
    { name: 'Alvin Kamara', cost: 36 }, { name: 'JuJu Smith-Schuster', cost: 10 },
    { name: 'Braelon Allen', cost: 6 }, { name: 'Tua Tagovailoa', cost: 24 },
    { name: 'Jameis Winston', cost: 10 }, { name: 'Roschon Johnson', cost: 5 },
    { name: 'Jonathon Brooks', cost: 36 }, { name: 'Rachaad White', cost: 19 },
    { name: 'Breece Hall', cost: 64 }, { name: 'Ladd McConkey', cost: 9 },
    { name: 'Ricky Pearsall', cost: 5 }, { name: 'Nick Westbrook-Ikhine', cost: 10 },
    { name: 'Elijah Moore', cost: 10 }, { name: 'Tank Dell', cost: 9 },
    { name: 'Rashee Rice', cost: 10 }, { name: 'J.J. McCarthy', cost: 8 }
  ],
  'cody-johnstone': [
    { name: 'Matthew Stafford', cost: 11 }, { name: 'Saquon Barkley', cost: 89 },
    { name: 'Nick Chubb', cost: 13 }, { name: 'Jordan Addison', cost: 40 },
    { name: 'Nico Collins', cost: 11 }, { name: 'Luke Schoonmaker', cost: 10 },
    { name: 'Tee Higgins', cost: 24 }, { name: 'Amari Cooper', cost: 34 },
    { name: 'Sterling Shepard', cost: 10 }, { name: 'Brock Purdy', cost: 18 },
    { name: 'Will Levis', cost: 9 }, { name: 'Raheem Mostert', cost: 14 },
    { name: 'Dalvin Cook', cost: 10 }, { name: 'Samaje Perine', cost: 5 },
    { name: 'D\'Onta Foreman', cost: 13 }, { name: 'Dameon Pierce', cost: 5 },
    { name: 'Brandin Cooks', cost: 5 }, { name: 'Josh Palmer', cost: 18 },
    { name: 'Dalton Kincaid', cost: 18 }, { name: 'Kyle Pitts', cost: 31 },
    { name: 'Stefon Diggs', cost: 31 }
  ],
  'taylor-garrett': [
    { name: 'Jayden Daniels', cost: 47 }, { name: 'Jonathan Taylor', cost: 48 },
    { name: 'Kenneth Walker III', cost: 34 }, { name: 'Justin Jefferson', cost: 29 },
    { name: 'Ja\'Marr Chase', cost: 46 }, { name: 'Pat Freiermuth', cost: 10 },
    { name: 'Calvin Ridley', cost: 18 }, { name: 'Jerry Jeudy', cost: 8 },
    { name: 'Rico Dowdle', cost: 15 }, { name: 'Cooper Rush', cost: 10 },
    { name: 'Joe Flacco', cost: 10 }, { name: 'Dak Prescott', cost: 53 },
    { name: 'Trey Lance', cost: 10 }, { name: 'Ameer Abdullah', cost: 10 },
    { name: 'Marquez Valdes-Scantling', cost: 10 }, { name: 'Diontae Johnson', cost: 13 },
    { name: 'Jalen Tolbert', cost: 10 }, { name: 'Alijah Pierce', cost: 10 },
    { name: 'Josh Downs', cost: 7 }, { name: 'Mike Gesicki', cost: 5 }
  ],
  'randy-s': [
    { name: 'Bo Nix', cost: 19 }, { name: 'James Cook', cost: 41 },
    { name: 'Bucky Irving', cost: 6 }, { name: 'A.J. Brown', cost: 30 },
    { name: 'Terry McLaurin', cost: 30 }, { name: 'Mark Andrews', cost: 37 },
    { name: 'Xavier Worthy', cost: 27 }, { name: 'Courtland Sutton', cost: 27 },
    { name: 'Zay Flowers', cost: 25 }, { name: 'Jordan Love', cost: 18 },
    { name: 'Russell Wilson', cost: 6 }, { name: 'Hendon Hooker', cost: 10 },
    { name: 'Blake Corum', cost: 19 }, { name: 'Isaac Guerendo', cost: 5 },
    { name: 'Travis Etienne Jr.', cost: 23 }, { name: 'Adonai Mitchell', cost: 8 },
    { name: 'Troy Franklin', cost: 5 }, { name: 'George Pickens', cost: 27 },
    { name: 'Ja\'Tavion Sanders', cost: 5 }, { name: 'Tucker Kraft', cost: 5 },
    { name: 'Bryce Rice', cost: 6 }, { name: 'Bub Means', cost: 10 }
  ],
  'ryan-t': [
    { name: 'Jared Goff', cost: 14 }, { name: 'Jahmyr Gibbs', cost: 73 },
    { name: 'Bijan Robinson', cost: 111 }, { name: 'Puka Nacua', cost: 9 },
    { name: 'Tyreek Hill', cost: 42 }, { name: 'Hunter Henry', cost: 6 },
    { name: 'Chase Brown', cost: 12 }, { name: 'Jameson Williams', cost: 19 },
    { name: 'Darnell Mooney', cost: 5 }, { name: 'Daniel Lock', cost: 10 },
    { name: 'Kenny Pickett', cost: 10 }, { name: 'Anthony Richardson', cost: 34 },
    { name: 'Jaleel McLaughlin', cost: 14 }, { name: 'Ke\'Shawn Vaughn', cost: 10 },
    { name: 'Raheem Blackshear', cost: 10 }, { name: 'Tank Bigsby', cost: 6 },
    { name: 'Sean Tucker', cost: 10 }, { name: 'Jalen Coker', cost: 10 },
    { name: 'Juwan Johnson', cost: 5 }, { name: 'Noah Gray', cost: 10 }
  ],
  'jon-probe': [
    { name: 'Joe Burrow', cost: 45 }, { name: 'Kyren Williams', cost: 9 },
    { name: 'Josh Jacobs', cost: 52 }, { name: 'Amon-Ra St. Brown', cost: 22 },
    { name: 'DJ Moore', cost: 39 }, { name: 'Travis Kelce', cost: 30 },
    { name: 'James Conner', cost: 38 }, { name: 'Khalil Shakir', cost: 14 },
    { name: 'Romeo Doubs', cost: 19 }, { name: 'Aaron Rodgers', cost: 21 },
    { name: 'Mason Rudolph', cost: 10 }, { name: 'Malik Willis', cost: 10 },
    { name: 'Tony Pollard', cost: 24 }, { name: 'Chuba Hubbard', cost: 9 },
    { name: 'Andrei Iosivas', cost: 5 }, { name: 'Keon Coleman', cost: 13 },
    { name: 'Dontayvion Wicks', cost: 14 }, { name: 'Ben Sinnott', cost: 5 },
    { name: 'Isaiah Likely', cost: 6 }, { name: 'Luke Musgrave', cost: 11 },
    { name: 'MarShawn Lloyd', cost: 7 }
  ],
  'tako': [
    { name: 'Najee Harris', cost: 25 }, { name: 'Audric Estime', cost: 6 },
    { name: 'Cooper Kupp', cost: 70 }, { name: 'Kayshon Boutte', cost: 10 },
    { name: 'Trey McBride', cost: 14 }, { name: 'Brian Thomas Jr.', cost: 16 },
    { name: 'DeVonta Smith', cost: 51 }, { name: 'KaVontae Turpin', cost: 10 },
    { name: 'Baker Mayfield', cost: 9 }, { name: 'Drake Maye', cost: 24 },
    { name: 'Isaiah Davis', cost: 10 }, { name: 'Mike Boone', cost: 10 },
    { name: 'David Montgomery', cost: 41 }, { name: 'Jaylen Warren', cost: 13 },
    { name: 'Javonte Williams', cost: 30 }, { name: 'Cedric Tillman', cost: 10 },
    { name: 'Ryan Flournoy', cost: 10 }, { name: 'Tim Patrick', cost: 10 },
    { name: 'Olamide Zaccheaus', cost: 10 }, { name: 'CeeDee Lamb', cost: 69 },
    { name: 'David Njoku', cost: 11 }, { name: 'Chris Godwin', cost: 36 },
    { name: 'Zamir White', cost: 28 }
  ],
  'will-redl': [
    { name: 'Chris Olave', cost: 18 }, { name: 'Tyjae Spears', cost: 12 },
    { name: 'Lamar Jackson', cost: 31 }, { name: 'J.K. Dobbins', cost: 9 },
    { name: 'Rhamondre Stevenson', cost: 17 }, { name: 'Malik Nabers', cost: 46 },
    { name: 'Drake London', cost: 23 }, { name: 'Jonnu Smith', cost: 5 },
    { name: 'Rome Odunze', cost: 30 }, { name: 'Jerome Ford', cost: 10 },
    { name: 'C.J. Stroud', cost: 18 }, { name: 'Aidan O\'Connell', cost: 10 },
    { name: 'Sam Darnold', cost: 15 }, { name: 'Trevor Lawrence', cost: 22 },
    { name: 'Mac Jones', cost: 10 }, { name: 'Antonio Gibson', cost: 5 },
    { name: 'Khalil Herbert', cost: 8 }, { name: 'Jaylen Reed', cost: 14 }
  ]
};
```

---

## 4. Main Page Layout (`index.html`)

**Task:** Modify `index.html` to replace the old form with the new structure, including a higher z-index for the floating bar.

```html
<!-- In <head> of index.html -->
<script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script>

<!-- In <body>, replace the existing form elements -->
<div class="space-y-4">
  <!-- Team Selection Dropdown -->
  <div>
    <label for="team-select" class="block text-sm/6 font-medium text-gray-900 dark:text-white">
      Select Your Team
    </label>
    <el-select id="team-select" name="team" class="mt-2 block">
      <!-- Options are populated from TEAM_OPTIONS in keepers-table.js. -->
      <!-- The capitalized manager name (label) is displayed to the user. -->
    </el-select>
  </div>

  <!-- Keeper Selection Table -->
  <div id="keepers-table-container">
    <!-- Table will be rendered here by keepers-table.js -->
  </div>
</div>

<!-- Floating Selection Bar (add this before the closing </body> tag) -->
<div id="floating-bar" class="fixed bottom-4 right-4 z-50 bg-blue-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out opacity-0 translate-y-4 pointer-events-none">
  <div class="px-4 py-3">
    <div class="flex items-center justify-between space-x-6">
      <!-- Info Section -->
      <div class="flex items-center space-x-4">
        <span id="selection-count" class="text-sm font-medium">0 players</span>
        <div class="text-right">
          <div class="text-xs text-blue-200">Total Cost</div>
          <div id="total-cost" class="text-lg font-bold">$0</div>
        </div>
        <div class="text-right">
          <div class="text-xs text-blue-200">Budget Left</div>
          <div id="remaining-budget" class="text-lg font-bold">$300</div>
        </div>
      </div>
      <!-- Actions Section -->
      <div class="flex items-center space-x-2">
        <button type="button" id="clear-selection" title="Clear selection" class="p-2 text-blue-200 hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-white">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <button type="button" id="submit-selection" class="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          Submit Keepers
        </button>
      </div>
    </div>
    <div id="constraint-notice" class="text-center text-yellow-300 text-xs pt-2 h-4"></div>
  </div>
</div>

<!-- Ensure script load order is correct before closing </body> tag -->
<script src="js/config.js"></script>
<script src="js/encryption.js"></script>
<script src="js/firebase-manager.js"></script>
<script src="js/countdown.js"></script>
<script src="js/ui-controller.js"></script>
<script src="js/teams-data.js"></script>
<script src="js/keepers-table.js"></script>
<script src="js/submissions.js"></script>
<script src="js/commissioner.js"></script>
```

---

## 5. Styling (`styles.css`)

**Task:** Add CSS for the floating bar's transitions and mobile responsiveness.

```css
/* styles.css */

#floating-bar {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

#floating-bar.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* Responsive adjustments for the floating bar on small screens */
@media (max-width: 640px) {
  #floating-bar {
    bottom: 0;
    right: 0;
    left: 0;
    border-radius: 0.5rem 0.5rem 0 0;
  }
}
```

---

## 6. Keeper Table UI and Logic (`js/keepers-table.js`)

**Task:** Create `js/keepers-table.js` with comprehensive logic for rendering, interaction, validation, and state management.

```javascript
// js/keepers-table.js

document.addEventListener('DOMContentLoaded', () => {
  if (!window.ENABLE_TEAM_TABLES) return;

  // --- Element Cache ---
  const teamSelect = document.getElementById('team-select');
  const tableContainer = document.getElementById('keepers-table-container');
  const floatingBar = document.getElementById('floating-bar');
  const selectionCountEl = document.getElementById('selection-count');
  const totalCostEl = document.getElementById('total-cost');
  const remainingBudgetEl = document.getElementById('remaining-budget');
  const clearSelectionBtn = document.getElementById('clear-selection');
  const submitSelectionBtn = document.getElementById('submit-selection');
  const noticeEl = document.getElementById('constraint-notice');

  // --- State ---
  let selectedPlayers = new Map();
  let currentTeamSlug = null;

  // --- Utility ---
  function sanitizeForAttribute(str) {
    return str.replace(/['"]/g, '"').replace(/[<>]/g, '');
  }

  // --- Public API ---
  window.getSelectedTeam = () => currentTeamSlug;
  window.getSelectedKeepers = () => Array.from(selectedPlayers.values());
  window.getTotalKeeperCost = () => Array.from(selectedPlayers.values()).reduce((sum, p) => sum + p.cost, 0);
  window.getRemainingBudget = () => window.TEAM_BUDGET - window.getTotalKeeperCost();

  // --- Initialization ---
  function initialize() {
    populateTeamDropdown();
    teamSelect.addEventListener('change', handleTeamChange);
    clearSelectionBtn.addEventListener('click', () => clearSelection(true));
    submitSelectionBtn.addEventListener('click', () => window.submitKeepersFromTable());
  }

  function populateTeamDropdown() {
    window.TEAM_OPTIONS.forEach(opt => {
      const option = document.createElement('el-option');
      option.value = opt.value;
      option.textContent = opt.label;
      teamSelect.appendChild(option);
    });
  }

  function handleTeamChange(event) {
    currentTeamSlug = event.target.value;
    clearSelection(false);
    renderTeamTable(currentTeamSlug);
  }

  // --- Table Rendering ---
  function renderTeamTable(slug) {
    const roster = window.TEAMS[slug] || [];
    const tableHtml = `
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="mt-8 flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table id="keepers-table" class="min-w-full table-fixed divide-y divide-gray-300 dark:divide-white/15">
                <thead>
                  <tr>
                    <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
                      <div class="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
                        <input type="checkbox" id="toggle-all-checkbox" class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-white/20 dark:bg-gray-800/50 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500" />
                        <svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-white/25">
                            <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
                            <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
                        </svg>
                      </div>
                    </th>
                    <th scope="col" class="min-w-48 py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Player</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Cost</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-white/10 dark:bg-gray-900">
                  ${roster.map(player => `
                    <tr class="group has-checked:bg-indigo-50 hover:bg-gray-50 dark:has-checked:bg-indigo-950/50">
                      <td class="relative px-7 sm:w-12 sm:px-6">
                        <div class="absolute inset-y-0 left-0 hidden w-0.5 bg-indigo-500 group-has-checked:block"></div>
                        <div class="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
                            <input type="checkbox" data-player-name="${sanitizeForAttribute(player.name)}" data-player-cost="${player.cost}" class="player-checkbox col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-white/20 dark:bg-gray-800/50 dark:checked:border-indigo-500 dark:checked:bg-indigo-500" />
                            <svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-white/25">
                                <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
                            </svg>
                        </div>
                      </td>
                      <td class="py-4 pr-3 text-sm font-medium whitespace-nowrap text-gray-900 group-has-checked:text-indigo-600 dark:text-white dark:group-has-checked:text-indigo-400">${player.name}</td>
                      <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">${window.currency.format(player.cost)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
    tableContainer.innerHTML = tableHtml;
    attachTableEventListeners();
  }

  function attachTableEventListeners() {
    document.querySelectorAll('.player-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => handlePlayerSelection(e.target));
    });
    const headerCheckbox = document.getElementById('toggle-all-checkbox');
    if(headerCheckbox) {
        headerCheckbox.addEventListener('change', handleSelectAll);
    }
  }

  // --- Selection Logic ---
  function handlePlayerSelection(checkbox) {
    if (!currentTeamSlug) {
      checkbox.checked = false;
      showNotice('Please select your team first.');
      return;
    }
    
    const name = checkbox.dataset.playerName;
    const cost = parseInt(checkbox.dataset.playerCost, 10);

    if (checkbox.checked) {
      if (selectedPlayers.size >= window.MAX_KEEPERS) {
        showNotice(`You can only select up to ${window.MAX_KEEPERS} keepers.`);
        checkbox.checked = false;
        return;
      }
      if (window.getTotalKeeperCost() + cost > window.TEAM_BUDGET) {
        showNotice(`This selection would exceed your $${window.TEAM_BUDGET} budget.`);
        checkbox.checked = false;
        return;
      }
      selectedPlayers.set(name, { name, cost });
    } else {
      selectedPlayers.delete(name);
    }
    updateFloatingBar();
  }
  
  function handleSelectAll(event) {
      const isChecked = event.target.checked;
      const checkboxes = document.querySelectorAll('.player-checkbox');
      
      if (!isChecked) {
          checkboxes.forEach(cb => { if(cb.checked) { cb.click(); } });
      } else {
          checkboxes.forEach(cb => { if(!cb.checked) { cb.click(); } });
      }
      updateFloatingBar();
  }

  function clearSelection(reRender = true) {
    selectedPlayers.clear();
    if (reRender && currentTeamSlug) {
      renderTeamTable(currentTeamSlug);
    } else {
        document.querySelectorAll('.player-checkbox').forEach(cb => cb.checked = false);
    }
    updateFloatingBar();
  }

  // --- UI Updates ---
  function updateFloatingBar() {
    const count = selectedPlayers.size;
    const totalCost = window.getTotalKeeperCost();
    const remainingBudget = window.getRemainingBudget();
    const headerCheckbox = document.getElementById('toggle-all-checkbox');

    if (count > 0) {
      selectionCountEl.textContent = `${count} ${count === 1 ? 'player' : 'players'}`;
      totalCostEl.textContent = window.currency.format(totalCost);
      remainingBudgetEl.textContent = window.currency.format(remainingBudget);
      floatingBar.classList.add('visible');
    } else {
      floatingBar.classList.remove('visible');
    }
    
    if (headerCheckbox) {
        const allCheckboxes = document.querySelectorAll('.player-checkbox');
        const allChecked = count === allCheckboxes.length && count > 0;
        headerCheckbox.checked = allChecked;
        headerCheckbox.indeterminate = count > 0 && !allChecked;
    }
    
    showNotice(''); // Clear any existing notices
  }

  let noticeTimeout;
  function showNotice(message) {
    clearTimeout(noticeTimeout);
    noticeEl.textContent = message;
    if (message) {
      noticeTimeout = setTimeout(() => {
        noticeEl.textContent = '';
      }, 3000);
    }
  }

  initialize();
});
```

---

## 7. Submission Logic Integration (`js/submissions.js`)

**Task:** Update `js/submissions.js` to handle submissions from the new table UI.

```javascript
// js/submissions.js

// --- Keep existing functions like encrypt, decrypt, etc. ---

// --- NEW: Submission handler for the table UI ---
window.submitKeepersFromTable = function() {
  try {
    if (!window.ENABLE_TEAM_TABLES) return;

    const teamSlug = window.getSelectedTeam();
    const keepers = window.getSelectedKeepers();
    const totalCost = window.getTotalKeeperCost();
    const remainingBudget = window.getRemainingBudget();

    if (!teamSlug) {
      alert('Please select your team first.');
      return;
    }

    if (keepers.length === 0) {
      if (!confirm('You have not selected any keepers. Are you sure you want to submit an empty list?')) {
        return;
      }
    }

    // Final validation
    if (keepers.length > window.MAX_KEEPERS) {
      alert(`Error: You have selected more than the maximum of ${window.MAX_KEEPERS} keepers.`);
      return;
    }
    if (totalCost > window.TEAM_BUDGET) {
      alert(`Error: Your total keeper cost exceeds the $${window.TEAM_BUDGET} budget.`);
      return;
    }

    const password = prompt('Please enter your team password to confirm your submission:');
    if (password === null) return; // User cancelled prompt

    const submissionData = {
      team: teamSlug,
      keepers: keepers,
      totalCost: totalCost,
      remainingBudget: remainingBudget,
      timestamp: new Date().toISOString(),
    };

    // Use existing encryption and Firebase logic
    const encryptedSubmission = encrypt(JSON.stringify(submissionData), password);
    const hash = generateHash(password); // Assuming generateHash exists in encryption.js

    const firebaseRef = ref(db, `submissions/${teamSlug}`);
    set(firebaseRef, {
      data: encryptedSubmission,
      hash: hash,
      timestamp: submissionData.timestamp,
    }).then(() => {
      alert('Your keeper submission has been successfully recorded!');
    }).catch((error) => {
      console.error('Firebase write error:', error);
      alert('There was an error submitting your keepers. Please try again.');
    });
  } catch (error) {
    console.error("Submission failed:", error);
    alert("A critical error occurred during submission. Please check the console.");
  }
};

// --- Modify existing `submitKeepers` function ---
// This function should be disabled or modified if the old form is removed.
function submitKeepers() { // or whatever the original function is called
  if (window.ENABLE_TEAM_TABLES) {
    console.log('Legacy submission ignored. Use the floating bar to submit.');
    return;
  }
  // ... (original logic for manual fields)
}
```

---

## 8. Retiring Old UI (`js/keeper-fields.js`)

**Task:** Effectively disable the old dynamic keeper field logic.

```javascript
// js/keeper-fields.js

function initializeKeeperFields() {
  if (window.ENABLE_TEAM_TABLES) {
    // Hide the old container if it exists
    const oldContainer = document.getElementById('keeper-fields-container'); // Assuming an ID
    if (oldContainer) {
      oldContainer.style.display = 'none';
    }
    return; // Do not initialize old logic
  }

  // ... (all original code for adding/removing fields)
}

// ... (rest of the original functions)



