// js/keepers-table.js

// Wait for both DOM and TailwindPlus Elements to be ready
function initializeKeeperTables() {
  if (!window.ENABLE_TEAM_TABLES) return;

  // --- Element Cache ---
  const teamDropdownButton = document.getElementById('team-dropdown-button');
  const teamDropdownSelected = document.getElementById('team-dropdown-selected');
  const teamDropdownOptions = document.getElementById('team-dropdown-options');
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
    setupDropdownHandlers();
    clearSelectionBtn.addEventListener('click', () => clearSelection(true));
    submitSelectionBtn.addEventListener('click', () => window.submitKeepersFromTable());
  }

  function populateTeamDropdown() {
    const optionsContainer = document.getElementById('team-options');
    if (!optionsContainer) return;
    
    // Clear existing options
    optionsContainer.innerHTML = '';
    
    // Create option elements with proper structure
    window.TEAM_OPTIONS.forEach(opt => {
      const optionHTML = `
        <el-option value="${opt.value}" class="group/option relative block cursor-default py-2 pr-9 pl-3 text-gray-900 select-none focus:bg-indigo-600 focus:text-white focus:outline-hidden dark:text-white dark:focus:bg-indigo-500">
          <span class="block truncate font-normal group-aria-selected/option:font-semibold">${opt.label}</span>
          <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-aria-selected/option:hidden group-focus/option:text-white in-[el-selectedcontent]:hidden dark:text-indigo-400">
            <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5">
              <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
            </svg>
          </span>
        </el-option>
      `;
      optionsContainer.insertAdjacentHTML('beforeend', optionHTML);
    });
    
    // Update selected content when option is clicked
    const selectedContent = teamSelect.querySelector('el-selectedcontent');
    if (selectedContent) {
      optionsContainer.addEventListener('click', (e) => {
        const option = e.target.closest('el-option');
        if (option) {
          const value = option.getAttribute('value');
          const label = option.querySelector('span').textContent;
          selectedContent.textContent = label;
          currentTeamSlug = value;
          clearSelection(false);
          renderTeamTable(currentTeamSlug);
        }
      });
    }
  }

  function handleTeamChange(event) {
    // This is now handled in the populateTeamDropdown click event
    // Keep this for backward compatibility if needed
    if (event && event.target && event.target.value) {
      currentTeamSlug = event.target.value;
      clearSelection(false);
      renderTeamTable(currentTeamSlug);
    }
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
}

// Initialize when DOM is ready, with a slight delay for TailwindPlus
document.addEventListener('DOMContentLoaded', () => {
  // Give TailwindPlus Elements time to initialize
  setTimeout(initializeKeeperTables, 100);
});