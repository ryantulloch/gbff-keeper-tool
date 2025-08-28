// js/keepers-table.js

// Wait for both DOM and TailwindPlus Elements to be ready
function initializeKeeperTables() {
  console.log('initializeKeeperTables called');
  console.log('ENABLE_TEAM_TABLES:', window.ENABLE_TEAM_TABLES);
  
  if (!window.ENABLE_TEAM_TABLES) {
    console.log('Team tables disabled, exiting...');
    return;
  }

  // --- Element Cache ---
  const teamSelect = document.getElementById('team-select');
  const tableContainer = document.getElementById('keepers-table-container');
  const floatingBar = document.getElementById('floating-bar');
  const selectionCountEl = document.getElementById('selection-count');
  const totalCostEl = document.getElementById('total-cost');
  const remainingBudgetEl = document.getElementById('remaining-budget');
  const clearSelectionBtn = document.getElementById('clear-selection');
  const submitSelectionBtn = document.getElementById('submit-selection');
  const editKeepersBtn = document.getElementById('edit-keepers');
  const noticeEl = document.getElementById('constraint-notice');
  
  console.log('Element cache results:');
  console.log('- editKeepersBtn:', editKeepersBtn);
  console.log('- clearSelectionBtn:', clearSelectionBtn);
  console.log('- submitSelectionBtn:', submitSelectionBtn);
  console.log('- floatingBar:', floatingBar);

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
    setupTeamSelectHandler();
    clearSelectionBtn.addEventListener('click', () => clearSelection(true));
    submitSelectionBtn.addEventListener('click', () => window.submitKeepersFromTable());
    editKeepersBtn.addEventListener('click', () => editExistingSubmission());
  }

  function populateTeamDropdown() {
    const dropdown = document.getElementById('team-select-dropdown');
    if (!dropdown) return;
    
    // Clear existing options
    dropdown.innerHTML = '';
    
    // Add team options with checkmark on the right for selected item
    window.TEAM_OPTIONS.forEach((opt) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'relative block cursor-pointer py-2 pr-9 pl-3 text-gray-900 hover:bg-indigo-600 hover:text-white dark:text-white dark:hover:bg-indigo-500';
      optionDiv.dataset.value = opt.value;
      optionDiv.innerHTML = `
        <span class="block truncate font-normal">${opt.label}</span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 dark:text-indigo-400" style="display: none;">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="size-5">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
        </span>
      `;
      dropdown.appendChild(optionDiv);
    });
  }

  function setupTeamSelectHandler() {
    const button = document.getElementById('team-select-button');
    const dropdown = document.getElementById('team-select-dropdown');
    const text = document.getElementById('team-select-text');
    
    if (!button || !dropdown || !text) return;
    
    let isOpen = false;
    
    // Toggle dropdown on button click
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });
    
    // Handle option selection
    dropdown.addEventListener('click', (e) => {
      const option = e.target.closest('[data-value]');
      if (!option) return;
      
      const value = option.dataset.value;
      const label = option.querySelector('span').textContent;
      
      // Update button text
      text.textContent = label;
      
      // Update checkmarks - hide all first
      dropdown.querySelectorAll('.absolute.inset-y-0.right-0').forEach(check => {
        check.style.display = 'none';
      });
      
      // Show checkmark for selected option
      const checkmark = option.querySelector('.absolute.inset-y-0.right-0');
      if (checkmark) {
        checkmark.style.display = 'flex';
      }
      
      // Update state and render table
      currentTeamSlug = value;
      clearSelection(false);
      renderTeamTable(currentTeamSlug);
      
      closeDropdown();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!button.contains(e.target) && !dropdown.contains(e.target)) {
        closeDropdown();
      }
    });
    
    function openDropdown() {
      dropdown.classList.remove('hidden');
      isOpen = true;
    }
    
    function closeDropdown() {
      dropdown.classList.add('hidden');
      isOpen = false;
    }
  }

  // --- Table Rendering ---
  function renderTeamTable(slug) {
    const roster = window.TEAMS[slug] || [];
    
    // Show password section when team is selected
    const passwordSection = document.getElementById('password-section');
    if (passwordSection) {
      passwordSection.style.display = 'block';
    }
    
    const tableHtml = `
      <div class="keeper-table-container">
        <div class="mt-2 sm:mt-8">
          <!-- Mobile-friendly header -->
          <div class="mobile-table-header hidden">
            <div class="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <input type="checkbox" id="toggle-all-checkbox-mobile" class="mobile-checkbox" />
                <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Select All</span>
              </div>
              <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Cost</span>
            </div>
          </div>
          
          <!-- Desktop Table -->
          <div class="desktop-table-wrapper overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
              <table id="keepers-table" class="min-w-full divide-y divide-gray-300 dark:divide-white/15">
                <thead class="desktop-table-header">
                  <tr>
                    <th scope="col" class="w-12 px-4 py-3.5">
                      <input type="checkbox" id="toggle-all-checkbox" class="rounded" />
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Player</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Cost</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-white/10 dark:bg-gray-900">
                  ${roster.map(player => `
                    <tr class="keepers-table-row hover:bg-gray-50 dark:hover:bg-gray-800" data-player-name="${sanitizeForAttribute(player.name)}">
                      <td class="w-12 px-4 py-3 checkbox-cell">
                        <div class="relative">
                          <div class="absolute inset-y-0 -left-4 w-0.5 bg-indigo-500 opacity-0 row-selected-indicator"></div>
                          <input type="checkbox" data-player-name="${sanitizeForAttribute(player.name)}" data-player-cost="${player.cost}" class="player-checkbox rounded" />
                        </div>
                      </td>
                      <td class="px-3 py-3 text-sm font-medium text-gray-900 dark:text-white player-name">
                        <span class="player-name-text">${player.name}</span>
                      </td>
                      <td class="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
                        <span class="player-cost-text">${window.currency.format(player.cost)}</span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Mobile List View -->
          <div class="mobile-list-view hidden">
            ${roster.map(player => `
              <div class="player-card flex items-center gap-2 px-3 py-1.5 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" data-player-name="${sanitizeForAttribute(player.name)}">
                <div class="flex-shrink-0">
                  <input type="checkbox" data-player-name="${sanitizeForAttribute(player.name)}" data-player-cost="${player.cost}" class="player-checkbox-mobile mobile-checkbox" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-medium text-gray-800 dark:text-gray-200">${player.name}</div>
                </div>
                <div class="flex-shrink-0">
                  <span class="text-xs font-semibold text-gray-600 dark:text-gray-400">${window.currency.format(player.cost)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    tableContainer.innerHTML = tableHtml;
    attachTableEventListeners();
  }

  function attachTableEventListeners() {
    // Desktop checkboxes
    document.querySelectorAll('.player-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => handlePlayerSelection(e.target, false)); // explicitly pass false for individual selections
    });
    
    // Mobile checkboxes
    document.querySelectorAll('.player-checkbox-mobile').forEach(cb => {
      cb.addEventListener('change', (e) => handlePlayerSelection(e.target, false));
    });
    
    // Desktop header checkbox
    const headerCheckbox = document.getElementById('toggle-all-checkbox');
    if(headerCheckbox) {
        headerCheckbox.addEventListener('change', handleSelectAll);
    }
    
    // Mobile header checkbox
    const mobileHeaderCheckbox = document.getElementById('toggle-all-checkbox-mobile');
    if(mobileHeaderCheckbox) {
        mobileHeaderCheckbox.addEventListener('change', handleSelectAll);
    }
  }

  // --- Selection Logic ---
  function handlePlayerSelection(checkbox, bypassLimits = false) {
    if (!currentTeamSlug) {
      checkbox.checked = false;
      showNotice('Please select your team first.');
      return;
    }
    
    const name = checkbox.dataset.playerName;
    const cost = parseInt(checkbox.dataset.playerCost, 10);
    const row = checkbox.closest('tr');

    if (checkbox.checked) {
      // Only enforce limits if not bypassing (for individual selections)
      if (!bypassLimits) {
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
      }
      // When bypassLimits is true, we add regardless of limits
      selectedPlayers.set(name, { name, cost });
      
      // Add selected styling to row (desktop)
      if (row) {
        row.classList.add('selected');
        const indicator = row.querySelector('.row-selected-indicator');
        if (indicator) {
          indicator.style.opacity = '1';
        }
      }
      
      // Add selected styling to card (mobile)
      const card = checkbox.closest('.player-card');
      if (card) {
        card.classList.add('selected');
      }
    } else {
      selectedPlayers.delete(name);
      
      // Remove selected styling from row (desktop)
      if (row) {
        row.classList.remove('selected');
        const indicator = row.querySelector('.row-selected-indicator');
        if (indicator) {
          indicator.style.opacity = '0';
        }
      }
      
      // Remove selected styling from card (mobile)
      const card = checkbox.closest('.player-card');
      if (card) {
        card.classList.remove('selected');
      }
    }
    updateFloatingBar();
  }
  
  function handleSelectAll(event) {
      const isChecked = event.target.checked;
      // Only select checkboxes that are actually visible
      const isMobile = window.innerWidth <= 640;
      const checkboxes = isMobile 
          ? document.querySelectorAll('.player-checkbox-mobile')
          : document.querySelectorAll('.player-checkbox');
      
      if (isChecked) {
          // Select all - bypass individual limits
          checkboxes.forEach(cb => {
              if (!cb.checked) {
                  cb.checked = true;
                  handlePlayerSelection(cb, true); // bypass limits for select all
              }
          });
          // Note: Removed problematic warning message that was overflowing on mobile
      } else {
          // Deselect all - clear the Map completely first
          selectedPlayers.clear();
          // Then uncheck all visible checkboxes
          checkboxes.forEach(cb => {
              cb.checked = false;
          });
          // Update all row/card styling
          document.querySelectorAll('.keepers-table-row.selected, .player-card.selected').forEach(el => {
              el.classList.remove('selected');
          });
          document.querySelectorAll('.row-selected-indicator').forEach(el => {
              el.style.opacity = '0';
          });
      }
      updateFloatingBar();
  }

  window.clearSelection = function clearSelection(reRender = true) {
    selectedPlayers.clear();
    if (reRender && currentTeamSlug) {
      renderTeamTable(currentTeamSlug);
    } else {
      // Clear desktop checkboxes and row highlighting
      document.querySelectorAll('.player-checkbox').forEach(cb => {
        cb.checked = false;
        const row = cb.closest('tr');
        if (row) {
          row.classList.remove('selected');
          const indicator = row.querySelector('.row-selected-indicator');
          if (indicator) {
            indicator.style.opacity = '0';
          }
        }
      });
      // Clear mobile checkboxes
      document.querySelectorAll('.player-checkbox-mobile').forEach(cb => {
        cb.checked = false;
        const card = cb.closest('.player-card');
        if (card) {
          card.classList.remove('selected');
        }
      });
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
      
      // Show warning colors if over limits
      if (count > window.MAX_KEEPERS) {
        selectionCountEl.style.color = '#fbbf24'; // soft amber warning
        selectionCountEl.textContent += ` (max ${window.MAX_KEEPERS})`;
      } else {
        selectionCountEl.style.color = '';
      }
      
      if (remainingBudget < 0) {
        remainingBudgetEl.textContent = window.currency.format(remainingBudget);
        remainingBudgetEl.style.color = '#fbbf24'; // soft amber warning
        totalCostEl.style.color = '#fbbf24'; // soft amber warning
      } else {
        remainingBudgetEl.textContent = window.currency.format(remainingBudget);
        remainingBudgetEl.style.color = '';
        totalCostEl.style.color = '';
      }
      
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
    
    // Update mobile header checkbox
    const mobileHeaderCheckbox = document.getElementById('toggle-all-checkbox-mobile');
    if (mobileHeaderCheckbox) {
        const allCheckboxes = document.querySelectorAll('.player-checkbox-mobile');
        const allChecked = count === allCheckboxes.length && count > 0;
        mobileHeaderCheckbox.checked = allChecked;
        mobileHeaderCheckbox.indeterminate = count > 0 && !allChecked;
    }
    
    // Don't clear notices here - let them timeout naturally
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
  
  // --- Edit Keepers Functionality ---
  function editExistingSubmission() {
    console.log('editExistingSubmission called');
    
    // Check if team is selected
    if (!currentTeamSlug) {
      alert('Please select your team first, then click Edit Keepers.');
      return;
    }
    
    // Check if players are selected
    if (selectedPlayers.size === 0) {
      alert('Please select the players you want to keep, then click Edit Keepers.');
      return;
    }
    
    // Check if password is entered
    const password = document.getElementById('password')?.value?.trim();
    if (!password) {
      alert('Please enter your password first, then click Edit Keepers.');
      return;
    }
    
    console.log('Team:', currentTeamSlug);
    console.log('Selected players:', selectedPlayers.size);
    console.log('Password entered');
    
    // Validate selection limits
    if (selectedPlayers.size > window.MAX_KEEPERS) {
      alert(`You can only keep up to ${window.MAX_KEEPERS} players. You currently have ${selectedPlayers.size} selected.`);
      return;
    }
    
    const totalCost = window.getTotalKeeperCost();
    if (totalCost > window.TEAM_BUDGET) {
      alert(`Your selected keepers cost ${window.currency.format(totalCost)}, which exceeds your ${window.currency.format(window.TEAM_BUDGET)} budget.`);
      return;
    }
    
    // Confirm the edit
    const keepersList = Array.from(selectedPlayers.values())
      .map(p => `${p.name} (${window.currency.format(p.cost)})`)
      .join('\n');
    
    const confirmMessage = `⚠️ COMPLETE REPLACEMENT ⚠️\n\nThis will be your NEW ENTIRE keeper team, completely replacing any previous submission.\n\nYour NEW TEAM (${selectedPlayers.size} keepers):\n${keepersList}\n\nTotal Cost: ${window.currency.format(totalCost)}\n\n✅ Confirm this as your complete new keeper team?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    // Submit the updated keepers using the existing submission system
    console.log('Submitting updated keepers...');
    window.submitKeepersFromTable();
  }
  
  // Expose showNotice globally for other modules
  window.showNotice = showNotice;

  initialize();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Short delay to ensure all scripts are loaded
  setTimeout(() => {
    initializeKeeperTables();
  }, 100);
});