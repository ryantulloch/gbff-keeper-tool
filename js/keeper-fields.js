/**
 * Keeper Fields Module - Manages dynamic keeper input fields
 */

let keeperFieldCount = 0;

/**
 * Initialize keeper fields on page load
 */
function initializeKeeperFields() {
    if (window.ENABLE_TEAM_TABLES) {
        // Hide the old container if it exists
        const oldContainer = document.getElementById('keepersList');
        if (oldContainer) {
            oldContainer.style.display = 'none';
        }
        // Also hide the parent container if it exists
        const keeperFieldsContainer = document.getElementById('keeper-fields-container');
        if (keeperFieldsContainer) {
            keeperFieldsContainer.style.display = 'none';
        }
        // Hide any other old form elements
        const submitContent = document.getElementById('submitContent');
        if (submitContent) {
            const oldFormElements = submitContent.querySelectorAll('.keeper-form-section, #keeperCount, #addKeeperBtn');
            oldFormElements.forEach(el => {
                el.style.display = 'none';
            });
        }
        return; // Do not initialize old logic
    }

    const keepersList = document.getElementById('keepersList');
    if (!keepersList) return; // Guard against missing element
    
    keepersList.innerHTML = ''; // Clear existing fields
    keeperFieldCount = 0;
    
    // Start with DEFAULT_KEEPER_COUNT keeper fields
    for (let i = 0; i < window.CONFIG.DEFAULT_KEEPER_COUNT; i++) {
        addKeeperField(false); // false = don't animate on initial load
    }
    
    // Update the initial count display
    updateKeeperCount();
}

/**
 * Add a new keeper input field
 */
function addKeeperField(animate = true) {
    if (keeperFieldCount >= window.CONFIG.MAX_KEEPERS) {
        alert(`Maximum ${window.CONFIG.MAX_KEEPERS} keepers allowed`);
        return;
    }
    
    keeperFieldCount++;
    const keepersList = document.getElementById('keepersList');
    
    // Create wrapper div for the keeper field
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'keeper-field-wrapper flex gap-3 items-center group';
    fieldWrapper.id = `keeper-field-${keeperFieldCount}`;
    
    if (animate) {
        fieldWrapper.style.opacity = '0';
        fieldWrapper.style.transform = 'translateY(-10px)';
    }
    
    // Create label
    const label = document.createElement('span');
    label.className = 'flex-shrink-0 w-24 text-sm font-medium text-slate-600';
    label.style.fontFamily = "'Inter', sans-serif";
    label.textContent = `Keeper ${keeperFieldCount}:`;
    
    // Create input
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'keeper';
    input.className = 'flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 placeholder-slate-400';
    input.style.fontFamily = "'Inter', sans-serif";
    input.placeholder = 'Player name (optional)';
    
    // Create remove button - using TailwindUI style
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-keeper-btn inline-flex items-center justify-center w-9 h-9 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105';
    removeBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    removeBtn.title = 'Remove keeper';
    removeBtn.onclick = function() {
        removeKeeperField(fieldWrapper.id);
    };
    
    // Only show remove button if we have more than 1 field (allow zero keepers)
    if (keeperFieldCount <= 1) {
        removeBtn.style.visibility = 'hidden';
    }
    
    // Assemble the field
    fieldWrapper.appendChild(label);
    fieldWrapper.appendChild(input);
    fieldWrapper.appendChild(removeBtn);
    
    // Add to list
    keepersList.appendChild(fieldWrapper);
    
    // Animate in if requested
    if (animate) {
        setTimeout(() => {
            fieldWrapper.style.transition = 'all 0.3s ease';
            fieldWrapper.style.opacity = '1';
            fieldWrapper.style.transform = 'translateY(0)';
            input.focus();
        }, 10);
    }
    
    // Update remove button visibility for all fields
    updateRemoveButtonVisibility();
    updateKeeperCount();
    
    // Update add button state
    const addBtn = document.getElementById('addKeeperBtn');
    if (keeperFieldCount >= window.CONFIG.MAX_KEEPERS) {
        addBtn.disabled = true;
        addBtn.className = 'w-full px-4 py-2.5 bg-slate-400 text-white font-medium rounded-lg cursor-not-allowed shadow-sm flex items-center justify-center gap-2';
        addBtn.querySelector('span').textContent = 'Maximum Keepers Reached';
    }
}

/**
 * Remove a keeper input field
 */
function removeKeeperField(fieldId) {
    const fieldWrapper = document.getElementById(fieldId);
    if (!fieldWrapper) return;
    
    // Get current keeper count
    const currentFields = document.querySelectorAll('.keeper-field-wrapper').length;
    
    // Allow removing down to 0 keepers
    if (currentFields <= 1) {
        // Still allow removal of the last field
    }
    
    // Animate out
    fieldWrapper.style.transition = 'all 0.3s ease';
    fieldWrapper.style.opacity = '0';
    fieldWrapper.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        fieldWrapper.remove();
        
        // Re-number remaining fields
        renumberKeeperFields();
        
        // Update remove button visibility
        updateRemoveButtonVisibility();
        
        // Update keeper count display
        updateKeeperCount();
        
        // Re-enable add button if was disabled
        const addBtn = document.getElementById('addKeeperBtn');
        if (addBtn.disabled) {
            addBtn.disabled = false;
            addBtn.className = 'w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2';
            addBtn.querySelector('span').textContent = 'Add Keeper';
        }
    }, 300);
}

/**
 * Renumber keeper fields after removal
 */
function renumberKeeperFields() {
    const fields = document.querySelectorAll('.keeper-field-wrapper');
    keeperFieldCount = fields.length;
    
    fields.forEach((field, index) => {
        const label = field.querySelector('span');
        label.textContent = `Keeper ${index + 1}:`;
        field.id = `keeper-field-${index + 1}`;
    });
}

/**
 * Update remove button visibility based on field count
 */
function updateRemoveButtonVisibility() {
    const fields = document.querySelectorAll('.keeper-field-wrapper');
    const removeButtons = document.querySelectorAll('.remove-keeper-btn');
    
    removeButtons.forEach(btn => {
        // Allow removing down to 0 keepers, only hide if 1 field left
        if (fields.length <= 1) {
            btn.style.visibility = 'hidden';
        } else {
            btn.style.visibility = 'visible';
        }
    });
}

/**
 * Update keeper count display
 */
function updateKeeperCount() {
    const countDisplay = document.getElementById('keeperCount');
    if (countDisplay) {
        countDisplay.textContent = `${keeperFieldCount} / ${window.CONFIG.MAX_KEEPERS} keepers`;
    }
}

/**
 * Reset keeper field count (for edit mode)
 */
function resetKeeperFieldCount() {
    keeperFieldCount = 0;
}

// Make functions globally accessible
window.initializeKeeperFields = initializeKeeperFields;
window.addKeeperField = addKeeperField;
window.removeKeeperField = removeKeeperField;
window.renumberKeeperFields = renumberKeeperFields;
window.updateRemoveButtonVisibility = updateRemoveButtonVisibility;
window.resetKeeperFieldCount = resetKeeperFieldCount;
window.updateKeeperCount = updateKeeperCount;