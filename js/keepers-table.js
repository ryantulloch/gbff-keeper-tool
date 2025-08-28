// js/keepers-table.js

// Wait for both DOM and TailwindPlus Elements to be ready
function initializeKeeperTables() {
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
    setupTeamSelectHandler();
    clearSelectionBtn.addEventListener('click', () => clearSelection(true));
    submitSelectionBtn.addEventListener('click', () => window.submitKeepersFromTable());
  }

  function populateTeamDropdown() {
    if (!teamSelect) return;
    
    const optionsContainer = teamSelect.querySelector('el-options');
    if (!optionsContainer) return;
    
    // Clear existing options
    optionsContainer.innerHTML = '';
    
    // Create option elements with checkmarks hidden by default
    window.TEAM_OPTIONS.forEach((opt, index) => {
      const optionHTML = `
        <el-option value="${opt.value}" class="group/option relative block cursor-default py-2 pr-9 pl-3 text-gray-900 select-none hover:bg-indigo-50 focus:bg-indigo-600 focus:text-white focus:outline-hidden dark:text-white dark:focus:bg-indigo-500">
          <span class="block truncate font-normal group-aria-selected/option:font-semibold">${opt.label}</span>
          <span class="absolute inset-y-0 right-0 items-center pr-4 text-indigo-600 group-focus/option:text-white dark:text-indigo-400" style="display: none;">
            <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5">
              <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
            </svg>
          </span>
        </el-option>
      `;
      optionsContainer.insertAdjacentHTML('beforeend', optionHTML);
    });
  }

  function setupTeamSelectHandler() {
    if (!teamSelect) return;
    
    const selectButton = teamSelect.querySelector('button');
    const optionsContainer = teamSelect.querySelector('el-options');
    
    if (!selectButton || !optionsContainer) return;
    
    let isDropdownOpen = false;
    
    // Handle button click to toggle dropdown
    selectButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isDropdownOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!teamSelect.contains(e.target) && isDropdownOpen) {
        closeDropdown();
      }
    });
    
    // Handle option selection with event delegation
    optionsContainer.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event from bubbling up
      
      const option = e.target.closest('el-option');
      if (!option) return;
      
      const value = option.getAttribute('value');
      const label = option.querySelector('span').textContent;
      const selectedContent = teamSelect.querySelector('el-selectedcontent');
      
      // Update the selected content text
      if (selectedContent) {
        selectedContent.textContent = label;
      }
      
      // Hide all checkmarks first
      optionsContainer.querySelectorAll('el-option').forEach(opt => {
        opt.removeAttribute('aria-selected');
        const checkmark = opt.querySelector('.absolute.inset-y-0.right-0');
        if (checkmark) {
          checkmark.style.display = 'none';
        }
      });
      
      // Show checkmark for selected option
      option.setAttribute('aria-selected', 'true');
      const selectedCheckmark = option.querySelector('.absolute.inset-y-0.right-0');
      if (selectedCheckmark) {
        selectedCheckmark.style.display = 'flex';
      }
      
      // Update state and render table
      currentTeamSlug = value;
      clearSelection(false);
      renderTeamTable(currentTeamSlug);
      
      // Close dropdown after selection
      closeDropdown();
    });
    
    function openDropdown() {
      if (!optionsContainer) return;
      
      isDropdownOpen = true;
      optionsContainer.style.display = 'block';
      optionsContainer.style.opacity = '1';
      optionsContainer.style.visibility = 'visible';
      optionsContainer.classList.add('dropdown-open');
    }
    
    function closeDropdown() {
      if (!optionsContainer) return;
      
      isDropdownOpen = false;
      optionsContainer.classList.remove('dropdown-open');
      optionsContainer.style.display = 'none';
      optionsContainer.style.opacity = '0';
      optionsContainer.style.visibility = 'hidden';
    }
    
    // Initialize dropdown as closed - set initial state directly without calling closeDropdown
    if (optionsContainer) {
      optionsContainer.style.display = 'none';
      optionsContainer.style.opacity = '0';
      optionsContainer.style.visibility = 'hidden';
      optionsContainer.classList.remove('dropdown-open');
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
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="mt-8 flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table id="keepers-table" class="min-w-full table-fixed divide-y divide-gray-300 dark:divide-white/15">
                <thead>
                  <tr>
                    <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
                      <div class="absolute top-1/2 left-4 -mt-2">
                        <input type="checkbox" id="toggle-all-checkbox" />
                      </div>
                    </th>
                    <th scope="col" class="min-w-48 py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Player</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Cost</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-white/10 dark:bg-gray-900">
                  ${roster.map(player => `
                    <tr class="keepers-table-row hover:bg-gray-50 dark:hover:bg-gray-800" data-player-name="${sanitizeForAttribute(player.name)}">
                      <td class="relative px-7 sm:w-12 sm:px-6">
                        <div class="absolute inset-y-0 left-0 w-0.5 bg-indigo-500 opacity-0 row-selected-indicator"></div>
                        <div class="absolute top-1/2 left-4 -mt-2">
                            <input type="checkbox" data-player-name="${sanitizeForAttribute(player.name)}" data-player-cost="${player.cost}" class="player-checkbox" />
                        </div>
                      </td>
                      <td class="py-4 pr-3 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white player-name">${player.name}</td>
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
    const row = checkbox.closest('tr');

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
      
      // Add selected styling to row
      if (row) {
        row.classList.add('selected');
        const indicator = row.querySelector('.row-selected-indicator');
        if (indicator) {
          indicator.style.opacity = '1';
        }
      }
    } else {
      selectedPlayers.delete(name);
      
      // Remove selected styling from row
      if (row) {
        row.classList.remove('selected');
        const indicator = row.querySelector('.row-selected-indicator');
        if (indicator) {
          indicator.style.opacity = '0';
        }
      }
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

  window.clearSelection = function clearSelection(reRender = true) {
    selectedPlayers.clear();
    if (reRender && currentTeamSlug) {
      renderTeamTable(currentTeamSlug);
    } else {
      // Clear checkboxes and row highlighting
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Short delay to ensure all scripts are loaded
  setTimeout(() => {
    initializeKeeperTables();
  }, 100);
});