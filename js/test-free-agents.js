
/**
 * Safe Testing Mechanism for Top Free Agents Feature
 * NO DATABASE CHANGES - PURE TESTING WITH MOCK DATA
 * 
 * Instructions:
 * 1. Open browser console
 * 2. Run: testFreeAgents()
 * 3. To reset: resetTest()
 * 
 * This will simulate the complete free agent analysis and UI without touching Firebase
 */

// Mock keeper submissions based on realistic keeper selections from existing teams
const MOCK_SUBMISSIONS = {
    'ryan-gies': { 
        keepers: "Mike Evans\nGeorge Kittle\nJaxon Smith-Njigba\nKirk Cousins", 
        teamName: 'Ryan Gies' 
    },
    'mike-loseth': { 
        keepers: "Christian McCaffrey\nJalen Hurts\nGarrett Wilson\nBrock Bowers", 
        teamName: 'Mike Loseth' 
    },
    'danny-willox': { 
        keepers: "Derrick Henry\nMarvin Harrison Jr.\nDK Metcalf\nKyler Murray", 
        teamName: 'Danny Willox' 
    },
    'mike-malecha': { 
        keepers: "Davante Adams\nDeebo Samuel Sr.\nJoe Mixon\nCaleb Williams", 
        teamName: 'Mike Malecha' 
    },
    'codie-k': { 
        keepers: "Breece Hall\nPatrick Mahomes\nAlvin Kamara\nIsiah Pacheco", 
        teamName: 'Codie K' 
    },
    'cody-johnstone': { 
        keepers: "Saquon Barkley\nJordan Addison\nTee Higgins\nStefon Diggs", 
        teamName: 'Cody Johnstone' 
    },
    'taylor-garrett': { 
        keepers: "Justin Jefferson\nJa'Marr Chase\nJonathan Taylor\nJayden Daniels", 
        teamName: 'Taylor Garrett' 
    },
    'randy-s': { 
        keepers: "A.J. Brown\nMark Andrews\nJames Cook\nTerry McLaurin", 
        teamName: 'Randy S' 
    },
    'ryan-t': { 
        keepers: "Bijan Robinson\nJahmyr Gibbs\nTyreek Hill\nPuka Nacua", 
        teamName: 'Ryan T' 
    },
    'jon-probe': { 
        keepers: "Josh Jacobs\nTravis Kelce\nAmon-Ra St. Brown\nJoe Burrow", 
        teamName: 'Jon Probe' 
    }
    // Left out 'tako' and 'will-redl' to simulate some teams not submitting yet
};

// Comprehensive NFL player database with positions and rankings
// Based on typical fantasy football consensus rankings
const NFL_PLAYER_DATABASE = {
    // Quarterbacks
    'Josh Allen': { position: 'QB', rank: 1, team: 'BUF' },
    'Lamar Jackson': { position: 'QB', rank: 2, team: 'BAL' },
    'Josh Jacobs': { position: 'RB', rank: 3, team: 'GB' },
    'Dak Prescott': { position: 'QB', rank: 4, team: 'DAL' },
    'Aaron Rodgers': { position: 'QB', rank: 5, team: 'NYJ' },
    'Tua Tagovailoa': { position: 'QB', rank: 6, team: 'MIA' },
    'Geno Smith': { position: 'QB', rank: 7, team: 'SEA' },
    'Russell Wilson': { position: 'QB', rank: 8, team: 'PIT' },
    'Jordan Love': { position: 'QB', rank: 9, team: 'GB' },
    'Trevor Lawrence': { position: 'QB', rank: 10, team: 'JAX' },
    'C.J. Stroud': { position: 'QB', rank: 11, team: 'HOU' },
    'Anthony Richardson': { position: 'QB', rank: 12, team: 'IND' },
    'Jared Goff': { position: 'QB', rank: 13, team: 'DET' },
    'Brock Purdy': { position: 'QB', rank: 14, team: 'SF' },
    'Bo Nix': { position: 'QB', rank: 15, team: 'DEN' },
    
    // Running Backs
    'Christian McCaffrey': { position: 'RB', rank: 1, team: 'SF' },
    'Saquon Barkley': { position: 'RB', rank: 2, team: 'PHI' },
    'Bijan Robinson': { position: 'RB', rank: 3, team: 'ATL' },
    'Breece Hall': { position: 'RB', rank: 4, team: 'NYJ' },
    'Jonathan Taylor': { position: 'RB', rank: 5, team: 'IND' },
    'Derrick Henry': { position: 'RB', rank: 6, team: 'BAL' },
    'Alvin Kamara': { position: 'RB', rank: 7, team: 'NO' },
    'Jahmyr Gibbs': { position: 'RB', rank: 8, team: 'DET' },
    'Kenneth Walker III': { position: 'RB', rank: 9, team: 'SEA' },
    'Joe Mixon': { position: 'RB', rank: 10, team: 'HOU' },
    'Aaron Jones Sr.': { position: 'RB', rank: 11, team: 'MIN' },
    'James Cook': { position: 'RB', rank: 12, team: 'BUF' },
    'Kyren Williams': { position: 'RB', rank: 13, team: 'LAR' },
    'Tony Pollard': { position: 'RB', rank: 14, team: 'TEN' },
    'Rhamondre Stevenson': { position: 'RB', rank: 15, team: 'NE' },
    'Nick Chubb': { position: 'RB', rank: 16, team: 'CLE' },
    'Isiah Pacheco': { position: 'RB', rank: 17, team: 'KC' },
    'James Conner': { position: 'RB', rank: 18, team: 'ARI' },
    'D\'Andre Swift': { position: 'RB', rank: 19, team: 'CHI' },
    'Najee Harris': { position: 'RB', rank: 20, team: 'PIT' },
    'Austin Ekeler': { position: 'RB', rank: 21, team: 'WAS' },
    'Travis Etienne Jr.': { position: 'RB', rank: 22, team: 'JAX' },
    'Rachaad White': { position: 'RB', rank: 23, team: 'TB' },
    'David Montgomery': { position: 'RB', rank: 24, team: 'DET' },
    'Raheem Mostert': { position: 'RB', rank: 25, team: 'MIA' },
    
    // Wide Receivers
    'Tyreek Hill': { position: 'WR', rank: 1, team: 'MIA' },
    'Davante Adams': { position: 'WR', rank: 2, team: 'LV' },
    'Stefon Diggs': { position: 'WR', rank: 3, team: 'HOU' },
    'A.J. Brown': { position: 'WR', rank: 4, team: 'PHI' },
    'Cooper Kupp': { position: 'WR', rank: 5, team: 'LAR' },
    'Mike Evans': { position: 'WR', rank: 6, team: 'TB' },
    'CeeDee Lamb': { position: 'WR', rank: 7, team: 'DAL' },
    'Amon-Ra St. Brown': { position: 'WR', rank: 8, team: 'DET' },
    'DK Metcalf': { position: 'WR', rank: 9, team: 'SEA' },
    'Keenan Allen': { position: 'WR', rank: 10, team: 'CHI' },
    'DeVonta Smith': { position: 'WR', rank: 11, team: 'PHI' },
    'Chris Godwin': { position: 'WR', rank: 12, team: 'TB' },
    'Amari Cooper': { position: 'WR', rank: 13, team: 'CLE' },
    'DJ Moore': { position: 'WR', rank: 14, team: 'CHI' },
    'Terry McLaurin': { position: 'WR', rank: 15, team: 'WAS' },
    'Michael Pittman Jr.': { position: 'WR', rank: 16, team: 'IND' },
    'Jaylen Waddle': { position: 'WR', rank: 17, team: 'MIA' },
    'Tee Higgins': { position: 'WR', rank: 18, team: 'CIN' },
    'Calvin Ridley': { position: 'WR', rank: 19, team: 'TEN' },
    'Diontae Johnson': { position: 'WR', rank: 20, team: 'CAR' },
    'Courtland Sutton': { position: 'WR', rank: 21, team: 'DEN' },
    'Christian Kirk': { position: 'WR', rank: 22, team: 'JAX' },
    'George Pickens': { position: 'WR', rank: 23, team: 'PIT' },
    'Chris Olave': { position: 'WR', rank: 24, team: 'NO' },
    'Jordan Addison': { position: 'WR', rank: 25, team: 'MIN' },
    'Nico Collins': { position: 'WR', rank: 26, team: 'HOU' },
    'Zay Flowers': { position: 'WR', rank: 27, team: 'BAL' },
    'Malik Nabers': { position: 'WR', rank: 28, team: 'NYG' },
    'Rome Odunze': { position: 'WR', rank: 29, team: 'CHI' },
    'Marvin Harrison Jr.': { position: 'WR', rank: 30, team: 'ARI' },
    'Tank Dell': { position: 'WR', rank: 31, team: 'HOU' },
    'Rashee Rice': { position: 'WR', rank: 32, team: 'KC' },
    'Xavier Worthy': { position: 'WR', rank: 33, team: 'KC' },
    'Brian Thomas Jr.': { position: 'WR', rank: 34, team: 'JAX' },
    'Ladd McConkey': { position: 'WR', rank: 35, team: 'LAC' },
    
    // Tight Ends
    'Travis Kelce': { position: 'TE', rank: 1, team: 'KC' },
    'Mark Andrews': { position: 'TE', rank: 2, team: 'BAL' },
    'George Kittle': { position: 'TE', rank: 3, team: 'SF' },
    'T.J. Hockenson': { position: 'TE', rank: 4, team: 'MIN' },
    'Kyle Pitts': { position: 'TE', rank: 5, team: 'ATL' },
    'Sam Laporta': { position: 'TE', rank: 6, team: 'DET' },
    'Evan Engram': { position: 'TE', rank: 7, team: 'JAX' },
    'Dallas Goedert': { position: 'TE', rank: 8, team: 'PHI' },
    'Trey McBride': { position: 'TE', rank: 9, team: 'ARI' },
    'Jake Ferguson': { position: 'TE', rank: 10, team: 'DAL' },
    'Pat Freiermuth': { position: 'TE', rank: 11, team: 'PIT' },
    'David Njoku': { position: 'TE', rank: 12, team: 'CLE' },
    'Dalton Kincaid': { position: 'TE', rank: 13, team: 'BUF' },
    'Cole Kmet': { position: 'TE', rank: 14, team: 'CHI' },
    'Hunter Henry': { position: 'TE', rank: 15, team: 'NE' },
    'Brock Bowers': { position: 'TE', rank: 16, team: 'LV' },
    'Jonnu Smith': { position: 'TE', rank: 17, team: 'MIA' },
    'Tucker Kraft': { position: 'TE', rank: 18, team: 'GB' },
    'Isaiah Likely': { position: 'TE', rank: 19, team: 'BAL' },
    'Cade Otton': { position: 'TE', rank: 20, team: 'TB' }
};

// Store original state for cleanup
let originalState = {
    headerTitle: null,
    headerSubtitle: null,
    pageTitle: null,
    tabsContainer: null,
    submissions: null
};

/**
 * Extract all unique keepers from mock submissions
 */
function getKeptPlayers() {
    const keptPlayers = new Set();
    
    Object.values(MOCK_SUBMISSIONS).forEach(submission => {
        const keepers = submission.keepers.split('\n').map(k => k.trim()).filter(k => k);
        keepers.forEach(keeper => keptPlayers.add(keeper));
    });
    
    return Array.from(keptPlayers);
}

/**
 * Analyze and return top free agents by position
 */
function analyzeFreeAgents() {
    const keptPlayers = getKeptPlayers();
    console.log('Kept Players:', keptPlayers);
    
    const freeAgents = {
        all: [],
        QB: [],
        RB: [],
        WR: [],
        TE: []
    };
    
    // Find all players not kept
    Object.entries(NFL_PLAYER_DATABASE).forEach(([playerName, playerData]) => {
        if (!keptPlayers.includes(playerName)) {
            const freeAgent = {
                name: playerName,
                position: playerData.position,
                rank: playerData.rank,
                team: playerData.team,
                overallRank: playerData.rank // For sorting
            };
            
            freeAgents.all.push(freeAgent);
            freeAgents[playerData.position].push(freeAgent);
        }
    });
    
    // Sort each position by rank
    Object.keys(freeAgents).forEach(position => {
        freeAgents[position].sort((a, b) => a.rank - b.rank);
    });
    
    console.log('Free Agents Analysis:', freeAgents);
    return freeAgents;
}

/**
 * Create and show the tabbed free agents interface
 */
function createFreeAgentsUI(freeAgents) {
    const container = document.getElementById('tabsContainer');
    if (!container) {
        console.error('Tabs container not found');
        return;
    }
    
    // Hide original tabs and create new free agents interface
    const originalTabs = container.innerHTML;
    originalState.tabsContainer = originalTabs;
    
    container.innerHTML = `
        <div class="flex bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <button id="freeAgentsTab-all" onclick="showFreeAgentsPosition('all')" 
                    class="flex-1 px-6 py-4 text-center font-semibold transition-all relative group bg-white border-b-2 border-blue-500 text-slate-800">
                <div class="flex items-center justify-center gap-2">
                    <span class="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                        <i class="fas fa-users text-white text-sm"></i>
                    </span>
                    <span style="font-family: 'Inter', sans-serif;">All (${freeAgents.all.length})</span>
                </div>
            </button>
            <button id="freeAgentsTab-QB" onclick="showFreeAgentsPosition('QB')"
                    class="flex-1 px-6 py-4 text-center font-semibold transition-all relative group text-slate-600 hover:text-slate-800 hover:bg-white/50">
                <div class="flex items-center justify-center gap-2">
                    <span class="inline-flex items-center justify-center w-8 h-8 bg-slate-200 rounded-lg group-hover:bg-slate-300 transition-colors">
                        <i class="fas fa-football-ball text-slate-600 text-sm"></i>
                    </span>
                    <span style="font-family: 'Inter', sans-serif;">QB (${freeAgents.QB.length})</span>
                </div>
            </button>
            <button id="freeAgentsTab-RB" onclick="showFreeAgentsPosition('RB')"
                    class="flex-1 px-6 py-4 text-center font-semibold transition-all relative group text-slate-600 hover:text-slate-800 hover:bg-white/50">
                <div class="flex items-center justify-center gap-2">
                    <span class="inline-flex items-center justify-center w-8 h-8 bg-slate-200 rounded-lg group-hover:bg-slate-300 transition-colors">
                        <i class="fas fa-running text-slate-600 text-sm"></i>
                    </span>
                    <span style="font-family: 'Inter', sans-serif;">RB (${freeAgents.RB.length})</span>
                </div>
            </button>
            <button id="freeAgentsTab-WR" onclick="showFreeAgentsPosition('WR')"
                    class="flex-1 px-6 py-4 text-center font-semibold transition-all relative group text-slate-600 hover:text-slate-800 hover:bg-white/50">
                <div class="flex items-center justify-center gap-2">
                    <span class="inline-flex items-center justify-center w-8 h-8 bg-slate-200 rounded-lg group-hover:bg-slate-300 transition-colors">
                        <i class="fas fa-hands-catching text-slate-600 text-sm"></i>
                    </span>
                    <span style="font-family: 'Inter', sans-serif;">WR (${freeAgents.WR.length})</span>
                </div>
            </button>
            <button id="freeAgentsTab-TE" onclick="showFreeAgentsPosition('TE')"
                    class="flex-1 px-6 py-4 text-center font-semibold transition-all relative group text-slate-600 hover:text-slate-800 hover:bg-white/50">
                <div class="flex items-center justify-center gap-2">
                    <span class="inline-flex items-center justify-center w-8 h-8 bg-slate-200 rounded-lg group-hover:bg-slate-300 transition-colors">
                        <i class="fas fa-hand-fist text-slate-600 text-sm"></i>
                    </span>
                    <span style="font-family: 'Inter', sans-serif;">TE (${freeAgents.TE.length})</span>
                </div>
            </button>
        </div>
        
        <div id="freeAgentsContent" class="p-8 bg-gradient-to-br from-white via-slate-50/50 to-white">
            <div id="freeAgentsPlayersList">
                <!-- Players will be populated here -->
            </div>
        </div>
    `;
    
    // Show the all position by default
    showFreeAgentsPosition('all');
}

/**
 * Show free agents for a specific position
 */
function showFreeAgentsPosition(position) {
    const freeAgents = window.currentFreeAgents;
    if (!freeAgents) return;
    
    // Update tab styling
    document.querySelectorAll('[id^="freeAgentsTab-"]').forEach(tab => {
        tab.className = "flex-1 px-6 py-4 text-center font-semibold transition-all relative group text-slate-600 hover:text-slate-800 hover:bg-white/50";
    });
    
    const activeTab = document.getElementById(`freeAgentsTab-${position}`);
    if (activeTab) {
        activeTab.className = "flex-1 px-6 py-4 text-center font-semibold transition-all relative group bg-white border-b-2 border-blue-500 text-slate-800";
    }
    
    // Display players for this position
    const playersList = document.getElementById('freeAgentsPlayersList');
    if (!playersList) return;
    
    const players = freeAgents[position] || [];
    
    if (players.length === 0) {
        playersList.innerHTML = `
            <div class="text-center py-16">
                <div class="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-4">
                    <i class="fas fa-user-slash text-3xl text-slate-400"></i>
                </div>
                <p class="text-slate-600 font-medium">No free agents at ${position === 'all' ? 'any position' : position}</p>
                <p class="text-slate-400 text-sm mt-1">All top players at this position have been kept</p>
            </div>
        `;
        return;
    }
    
    // Create player cards grid
    const playerCards = players.slice(0, 50).map(player => `
        <div class="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all card-hover">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span class="text-white font-bold text-sm">${player.position}</span>
                    </div>
                    <div>
                        <h3 class="font-semibold text-slate-800">${player.name}</h3>
                        <p class="text-sm text-slate-500">${player.team}</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-xs text-slate-400 uppercase tracking-wide">Rank</div>
                    <div class="text-lg font-bold text-slate-700">#${player.rank}</div>
                </div>
            </div>
            <div class="flex items-center justify-between text-xs text-slate-500">
                <span>Available</span>
                <span class="text-green-600 font-medium">✓ Free Agent</span>
            </div>
        </div>
    `).join('');
    
    playersList.innerHTML = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-800 mb-2">
                Top ${position === 'all' ? 'Free Agents' : position + ' Free Agents'}
            </h2>
            <p class="text-slate-600">
                ${players.length} available player${players.length !== 1 ? 's' : ''} not kept by any team
                ${players.length > 50 ? ` (showing top 50)` : ''}
            </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            ${playerCards}
        </div>
    `;
}

/**
 * Update page header for testing mode
 */
function updateHeaderForTesting() {
    // Store original values
    const headerTitle = document.getElementById('headerTitle');
    const headerSubtitle = document.getElementById('headerSubtitle');
    
    if (headerTitle) {
        originalState.headerTitle = headerTitle.innerHTML;
        const titleSpan = headerTitle.querySelector('span');
        if (titleSpan) {
            titleSpan.textContent = 'GBFF Free Agents - TEST MODE';
        }
    }
    
    if (headerSubtitle) {
        originalState.headerSubtitle = headerSubtitle.textContent;
        headerSubtitle.textContent = 'Testing Top Free Agents Feature (Safe Mode - No Database Changes)';
    }
    
    // Update page title
    originalState.pageTitle = document.title;
    document.title = 'GBFF Free Agents - TEST MODE';
}

/**
 * Show mock submissions data in console for verification
 */
function showMockSubmissions() {
    console.log('\n=== MOCK KEEPER SUBMISSIONS ===');
    Object.entries(MOCK_SUBMISSIONS).forEach(([teamKey, data]) => {
        console.log(`${data.teamName}:`);
        console.log(`  Keepers: ${data.keepers}`);
    });
    console.log('\n=== TEAMS NOT SUBMITTED ===');
    console.log('Tako, Will Redl (simulating some teams not submitting yet)');
}

/**
 * Main test function - safe testing with no Firebase interaction
 */
window.testFreeAgents = function() {
    console.clear();
    console.log('🧪 STARTING FREE AGENTS TEST MODE');
    console.log('⚠️  SAFE MODE: No database changes will be made');
    console.log('=====================================\n');
    
    try {
        // Show mock data
        showMockSubmissions();
        
        // Analyze free agents
        const freeAgents = analyzeFreeAgents();
        window.currentFreeAgents = freeAgents;
        
        // Update header
        updateHeaderForTesting();
        
        // Hide other sections
        const elementsToHide = [
            'instructionsSection',
            'statusBar',  
            'commissionerSection'
        ];
        
        elementsToHide.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
        
        // Create and show free agents UI
        createFreeAgentsUI(freeAgents);
        
        // Make position switching function global
        window.showFreeAgentsPosition = showFreeAgentsPosition;
        
        console.log('\n✅ FREE AGENTS TEST MODE ACTIVATED');
        console.log('📊 Analysis Complete:');
        console.log(`   • All Positions: ${freeAgents.all.length} free agents`);
        console.log(`   • Quarterbacks: ${freeAgents.QB.length} available`);
        console.log(`   • Running Backs: ${freeAgents.RB.length} available`);
        console.log(`   • Wide Receivers: ${freeAgents.WR.length} available`);
        console.log(`   • Tight Ends: ${freeAgents.TE.length} available`);
        console.log('\n🎮 TEST THE INTERFACE:');
        console.log('   • Click different position tabs');
        console.log('   • Test mobile responsiveness');
        console.log('   • Verify player cards display correctly');
        console.log('\n🔄 To reset: run resetTest()');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.error('Stack trace:', error.stack);
    }
};

/**
 * Reset function to restore original state
 */
window.resetTest = function() {
    console.log('🔄 RESETTING TEST MODE...');
    
    try {
        // Restore header
        const headerTitle = document.getElementById('headerTitle');
        const headerSubtitle = document.getElementById('headerSubtitle');
        
        if (headerTitle && originalState.headerTitle) {
            headerTitle.innerHTML = originalState.headerTitle;
        }
        
        if (headerSubtitle && originalState.headerSubtitle) {
            headerSubtitle.textContent = originalState.headerSubtitle;
        }
        
        if (originalState.pageTitle) {
            document.title = originalState.pageTitle;
        }
        
        // Restore tabs container
        const container = document.getElementById('tabsContainer');
        if (container && originalState.tabsContainer) {
            container.innerHTML = originalState.tabsContainer;
        }
        
        // Show hidden sections
        const elementsToShow = [
            'instructionsSection',
            'statusBar',
            'commissionerSection'
        ];
        
        elementsToShow.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = '';
            }
        });
        
        // Clean up global functions
        delete window.currentFreeAgents;
        delete window.showFreeAgentsPosition;
        
        console.log('✅ Reset complete - back to normal mode');
        
    } catch (error) {
        console.error('❌ Reset failed:', error);
        // Force page reload as fallback
        console.log('🔄 Forcing page reload as fallback...');
        setTimeout(() => window.location.reload(), 1000);
    }
};

/**
 * Edge case testing functions
 */
window.testEdgeCases = function() {
    console.log('\n🧪 TESTING EDGE CASES...');
    
    // Test with no free agents
    console.log('Testing empty position...');
    const emptyFreeAgents = { all: [], QB: [], RB: [], WR: [], TE: [] };
    window.currentFreeAgents = emptyFreeAgents;
    showFreeAgentsPosition('QB');
    
    console.log('✅ Edge case testing complete');
};

/**
 * Test mobile responsiveness helper
 */
window.testMobileView = function() {
    console.log('\n📱 TESTING MOBILE RESPONSIVENESS...');
    
    // Simulate mobile viewport
    const viewport = document.querySelector('meta[name=viewport]');
    console.log('Current viewport:', viewport?.content);
    
    // Check if cards stack properly on mobile
    const cards = document.querySelectorAll('.card-hover');
    console.log(`Found ${cards.length} player cards for mobile testing`);
    
    console.log('✅ Mobile test helpers ready');
    console.log('💡 Manually resize browser window to test responsive design');
};

// Initialize when script loads
console.log('🧪 Free Agents Testing Framework Loaded');
console.log('📋 Available commands:');
console.log('   • testFreeAgents() - Run full test');
console.log('   • resetTest() - Reset to normal mode');
console.log('   • testEdgeCases() - Test edge cases');
console.log('   • testMobileView() - Test mobile responsiveness');