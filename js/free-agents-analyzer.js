/**
 * Free Agents Analyzer
 * Analyzes revealed keepers to determine top available free agents
 */

// Global variable to store analysis results
window.availableFreeAgents = null;

/**
 * Main analysis function - determines which top players are still available
 * @param {Object} revealedKeepers - Object with team keys and keeper data
 * @returns {Object} Analysis results with all players and by position
 */
function analyzeAvailableFreeAgents(revealedKeepers) {
    try {
        console.log('Starting free agent analysis...');
        
        // Get all FantasyPros data
        const fantasyProsData = window.getFantasyProsData();
        if (!fantasyProsData || fantasyProsData.length === 0) {
            console.error('No FantasyPros data available');
            return null;
        }
        
        // Collect all keeper names from all teams
        const allKeeperNames = [];
        
        Object.entries(revealedKeepers).forEach(([teamKey, submission]) => {
            if (submission.revealed && submission.keepers) {
                // Handle both string format (legacy) and array format
                let keepersList = [];
                if (typeof submission.keepers === 'string') {
                    keepersList = submission.keepers.split('\n').filter(k => k.trim());
                } else if (Array.isArray(submission.keepers)) {
                    keepersList = submission.keepers.map(k => typeof k === 'string' ? k : k.name);
                }
                
                keepersList.forEach(keeperName => {
                    if (keeperName && keeperName.trim()) {
                        allKeeperNames.push(keeperName.trim());
                    }
                });
            }
        });
        
        console.log(`Found ${allKeeperNames.length} total keepers:`, allKeeperNames);
        
        // Match keepers to FantasyPros players and mark as taken
        const takenPlayers = new Set();
        
        allKeeperNames.forEach(keeperName => {
            const matchedPlayer = matchKeeperToFantasyPros(keeperName);
            if (matchedPlayer) {
                takenPlayers.add(matchedPlayer.name);
                console.log(`Matched "${keeperName}" to "${matchedPlayer.name}" (Rank ${matchedPlayer.rank})`);
            } else {
                console.log(`No match found for "${keeperName}"`);
            }
        });
        
        // Filter out taken players to get available free agents
        const availablePlayers = fantasyProsData.filter(player => !takenPlayers.has(player.name));
        
        console.log(`${takenPlayers.size} players taken, ${availablePlayers.length} available`);
        
        // Create results object with all available players and by position
        const results = {
            all: availablePlayers,
            byPosition: {
                QB: availablePlayers.filter(p => p.positionType === 'QB'),
                RB: availablePlayers.filter(p => p.positionType === 'RB'),
                WR: availablePlayers.filter(p => p.positionType === 'WR'),
                TE: availablePlayers.filter(p => p.positionType === 'TE')
            }
        };
        
        // Store globally for UI access
        window.availableFreeAgents = results;
        
        console.log('Free agent analysis complete:', {
            totalAvailable: results.all.length,
            QB: results.byPosition.QB.length,
            RB: results.byPosition.RB.length,
            WR: results.byPosition.WR.length,
            TE: results.byPosition.TE.length
        });
        
        return results;
        
    } catch (error) {
        console.error('Error in free agent analysis:', error);
        return null;
    }
}

/**
 * Match a keeper name to a FantasyPros player using fuzzy matching
 * @param {string} keeperName - Name of the keeper to match
 * @returns {Object|null} Matched FantasyPros player object or null
 */
function matchKeeperToFantasyPros(keeperName) {
    if (!keeperName || typeof keeperName !== 'string') return null;
    
    const fantasyProsData = window.getFantasyProsData();
    if (!fantasyProsData) return null;
    
    // Normalize the keeper name
    const normalizedKeeper = normalizePlayerName(keeperName);
    
    // Try exact match first
    let match = fantasyProsData.find(player => 
        normalizePlayerName(player.name) === normalizedKeeper
    );
    
    if (match) return match;
    
    // Try partial matching - keeper name contains FantasyPros name or vice versa
    match = fantasyProsData.find(player => {
        const normalizedPlayer = normalizePlayerName(player.name);
        return normalizedKeeper.includes(normalizedPlayer) || 
               normalizedPlayer.includes(normalizedKeeper);
    });
    
    if (match) return match;
    
    // Try fuzzy matching for close names
    match = fantasyProsData.find(player => {
        const normalizedPlayer = normalizePlayerName(player.name);
        return calculateSimilarity(normalizedKeeper, normalizedPlayer) > 0.8;
    });
    
    if (match) return match;
    
    // Try matching by individual words (for cases like "Sam LaPorta" vs "Sam Laporta")
    const keeperWords = normalizedKeeper.split(' ').filter(w => w.length > 1);
    match = fantasyProsData.find(player => {
        const playerWords = normalizePlayerName(player.name).split(' ').filter(w => w.length > 1);
        
        // Check if most words match
        let matchingWords = 0;
        keeperWords.forEach(keeperWord => {
            if (playerWords.some(playerWord => 
                calculateSimilarity(keeperWord, playerWord) > 0.8
            )) {
                matchingWords++;
            }
        });
        
        // Require at least 75% of words to match
        return matchingWords / Math.max(keeperWords.length, playerWords.length) > 0.75;
    });
    
    return match || null;
}

/**
 * Get top available players by position
 * @param {string} position - Position type (QB, RB, WR, TE)
 * @param {number} limit - Maximum number of players to return (default: 10)
 * @returns {Array} Array of available players for the position
 */
function getTopAvailableByPosition(position, limit = 10) {
    if (!window.availableFreeAgents) {
        console.log('No free agent analysis available');
        return [];
    }
    
    const positionPlayers = window.availableFreeAgents.byPosition[position.toUpperCase()];
    if (!positionPlayers) {
        console.log(`No players found for position: ${position}`);
        return [];
    }
    
    return positionPlayers.slice(0, limit);
}

/**
 * Normalize player name for matching
 * @param {string} name - Player name to normalize
 * @returns {string} Normalized name
 */
function normalizePlayerName(name) {
    if (!name) return '';
    
    return name
        .toLowerCase()
        .trim()
        // Remove common suffixes
        .replace(/\s+(jr\.?|sr\.?|iii|iv|v)$/i, '')
        // Remove periods and commas
        .replace(/[.,]/g, '')
        // Normalize apostrophes and hyphens
        .replace(/['`]/g, "'")
        .replace(/[-–—]/g, '-')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Calculate similarity between two strings using Levenshtein-like algorithm
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score between 0 and 1
 */
function calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1;
    
    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate edit distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
function getEditDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
        Array(str1.length + 1).fill(null)
    );
    
    for (let i = 0; i <= str1.length; i++) {
        matrix[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j++) {
        matrix[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,        // deletion
                matrix[j - 1][i] + 1,        // insertion
                matrix[j - 1][i - 1] + indicator // substitution
            );
        }
    }
    
    return matrix[str2.length][str1.length];
}

// Export functions globally
window.analyzeAvailableFreeAgents = analyzeAvailableFreeAgents;
window.matchKeeperToFantasyPros = matchKeeperToFantasyPros;
window.getTopAvailableByPosition = getTopAvailableByPosition;