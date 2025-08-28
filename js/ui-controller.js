/**
 * UI Controller Module - Handles DOM updates and display functions
 */

/**
 * Update the submissions display
 */
function updateDisplay() {
    const list = document.getElementById('submissionsList');
    const submissions = window.getSubmissions();
    
    if (Object.keys(submissions).length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-8">No submissions yet... Be the first!</p>';
        return;
    }

    const isLocked = window.getDeadline() && Date.now() > window.getDeadline();
    
    // Wrap in grid container
    list.innerHTML = `
        <ul role="list" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            ${Object.keys(submissions).map(teamKey => {
                const sub = submissions[teamKey];
                const isNewlyRevealed = sub.revealed && !sub._wasRevealed;
                if (isNewlyRevealed) {
                    sub._wasRevealed = true; // Mark as seen
                }
                
                return `
                    <li class="submission-item overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow duration-200 ${isNewlyRevealed ? 'reveal-animation' : ''}">
                        <!-- Team header -->
                        <div class="border-b border-gray-200 px-6 py-4">
                            <div class="flex justify-between items-start">
                                <h3 class="team-name text-lg font-semibold text-gray-900" style="font-family: 'Inter', sans-serif;">${sub.teamName}</h3>
                                <span class="text-xs text-gray-500" style="font-family: 'Inter', sans-serif;">${new Date(sub.timestamp).toLocaleString()}</span>
                            </div>
                        </div>
                        <!-- Content -->
                        <div class="px-6 py-4">
                            ${!sub.revealed ? `
                                <div class="space-y-3">
                                    <div class="text-sm text-gray-600" style="font-family: 'Inter', sans-serif;">
                                        <span class="font-medium">Encrypted Hash:</span>
                                        <p class="mt-1 text-xs text-gray-500 break-all" style="font-family: 'Inter', sans-serif;">${sub.hash.substring(0, 32)}...</p>
                                    </div>
                                    ${isLocked && !window.getIsCountdownActive() ? `
                                        <button onclick="revealSubmission('${teamKey}')" class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" style="font-family: 'Inter', sans-serif;">
                                            🔓 Manual Reveal
                                        </button>
                                    ` : '<p class="text-xs text-gray-500" style="font-family: \'Inter\', sans-serif;">⏳ Will auto-reveal after countdown...</p>'}
                                </div>
                            ` : `
                                <div>
                                    <p class="text-sm font-medium text-gray-900 mb-3" style="font-family: 'Inter', sans-serif;">🏆 Keepers:</p>
                                    ${(() => {
                                        // Try to use cost data if available
                                        if (sub.keepersCostData) {
                                            try {
                                                const costData = JSON.parse(sub.keepersCostData);
                                                const keepers = costData.keepers || [];
                                                const totalCost = costData.totalCost || 0;
                                                const remainingBudget = costData.remainingBudget || 0;
                                                
                                                return `
                                                    <ul class="space-y-2 mb-4">
                                                        ${keepers.map(k => `
                                                            <li class="flex items-center justify-between text-sm text-gray-700">
                                                                <div class="flex items-center">
                                                                    <span class="mr-2">🏈</span>
                                                                    <span style="font-family: 'Inter', sans-serif;">${k.name}</span>
                                                                </div>
                                                                <span class="font-semibold text-indigo-600" style="font-family: 'Inter', sans-serif;">$${k.cost}</span>
                                                            </li>
                                                        `).join('')}
                                                    </ul>
                                                    <div class="border-t pt-3 mt-3">
                                                        <div class="flex justify-between items-center text-sm mb-2">
                                                            <span class="font-medium text-gray-900">💰 Total Cost:</span>
                                                            <span class="font-bold text-lg text-indigo-600">$${totalCost}</span>
                                                        </div>
                                                        <div class="flex justify-between items-center text-sm">
                                                            <span class="font-medium text-gray-900">💵 Remaining Budget:</span>
                                                            <span class="font-semibold text-green-600">$${remainingBudget}</span>
                                                        </div>
                                                    </div>
                                                `;
                                            } catch (e) {
                                                // Fallback to simple list if parsing fails
                                                console.log('Could not parse cost data:', e);
                                            }
                                        }
                                        
                                        // Fallback: Try to look up costs from TEAMS data
                                        const keepersList = sub.keepers.split('\n').filter(k => k.trim());
                                        let totalCost = 0;
                                        let keepersWithCosts = [];
                                        
                                        // Try to find costs from teams-data.js
                                        if (window.TEAMS) {
                                            // Find which team this is based on teamName
                                            const teamSlug = sub.teamName;
                                            const teamRoster = window.TEAMS[teamSlug];
                                            
                                            if (teamRoster) {
                                                keepersList.forEach(keeperName => {
                                                    const player = teamRoster.find(p => p.name === keeperName.trim());
                                                    if (player) {
                                                        keepersWithCosts.push({ name: player.name, cost: player.cost });
                                                        totalCost += player.cost;
                                                    } else {
                                                        keepersWithCosts.push({ name: keeperName, cost: 0 });
                                                    }
                                                });
                                                
                                                if (keepersWithCosts.length > 0 && totalCost > 0) {
                                                    return `
                                                        <ul class="space-y-2 mb-4">
                                                            ${keepersWithCosts.map(k => `
                                                                <li class="flex items-center justify-between text-sm text-gray-700">
                                                                    <div class="flex items-center">
                                                                        <span class="mr-2">🏈</span>
                                                                        <span style="font-family: 'Inter', sans-serif;">${k.name}</span>
                                                                    </div>
                                                                    ${k.cost > 0 ? `<span class="font-semibold text-indigo-600" style="font-family: 'Inter', sans-serif;">$${k.cost}</span>` : ''}
                                                                </li>
                                                            `).join('')}
                                                        </ul>
                                                        <div class="border-t pt-3 mt-3">
                                                            <div class="flex justify-between items-center text-sm mb-2">
                                                                <span class="font-medium text-gray-900">💰 Total Cost:</span>
                                                                <span class="font-bold text-lg text-indigo-600">$${totalCost}</span>
                                                            </div>
                                                            <div class="flex justify-between items-center text-sm">
                                                                <span class="font-medium text-gray-900">💵 Remaining Budget:</span>
                                                                <span class="font-semibold text-green-600">$${300 - totalCost}</span>
                                                            </div>
                                                        </div>
                                                    `;
                                                }
                                            }
                                        }
                                        
                                        // Ultimate fallback - just show names without costs
                                        return `
                                            <ul class="space-y-2">
                                                ${keepersList.map(k => `
                                                    <li class="flex items-center text-sm text-gray-700">
                                                        <span class="mr-2">🏈</span>
                                                        <span style="font-family: 'Inter', sans-serif;">${k}</span>
                                                    </li>
                                                `).join('')}
                                            </ul>
                                        `;
                                    })()}
                                </div>
                            `}
                        </div>
                    </li>
                `;
            }).join('')}
        </ul>
    `;
}

/**
 * Create confetti animation
 */
function createConfetti() {
    // disabled - confetti removed to keep the experience refined
    return;
}

/**
 * Create subtle confetti for post-reveal celebration
 */
function createSubtleConfetti() {
    // disabled
    return;
}

/**
 * Switch between submit and view tabs
 */
function switchTab(tabName) {
    const submitTab = document.getElementById('submitTab');
    const viewTab = document.getElementById('viewTab');
    const submitContent = document.getElementById('submitContent');
    const viewContent = document.getElementById('viewContent');
    
    if (tabName === 'submit') {
        // Activate submit tab
        submitTab.className = 'flex-1 px-4 py-3 text-center font-medium transition-colors bg-blue-50 text-blue-700 border-b-2 border-blue-500';
        viewTab.className = 'flex-1 px-4 py-3 text-center font-medium transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-50';
        submitContent.classList.remove('hidden');
        viewContent.classList.add('hidden');
    } else if (tabName === 'view') {
        // Activate view tab
        viewTab.className = 'flex-1 px-4 py-3 text-center font-medium transition-colors bg-blue-50 text-blue-700 border-b-2 border-blue-500';
        submitTab.className = 'flex-1 px-4 py-3 text-center font-medium transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-50';
        viewContent.classList.remove('hidden');
        submitContent.classList.add('hidden');
        // Refresh the submissions when switching to view tab
        updateDisplay();
    }
}

// Make functions globally accessible
window.updateDisplay = updateDisplay;
window.createConfetti = createConfetti;
window.createSubtleConfetti = createSubtleConfetti;
window.switchTab = switchTab;