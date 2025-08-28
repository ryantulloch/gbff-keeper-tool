/**
 * FantasyPros 2025 Draft Rankings Data Processing Module
 * Processes FantasyPros CSV data into clean JavaScript structure for GBFF Keepers app
 */

// Raw FantasyPros 2025 Draft Rankings data (Top 100 players)
// Converted from CSV format and cleaned
const FANTASY_PROS_DATA = [
  { rank: 1, name: "Ja'Marr Chase", team: "CIN", position: "WR1", positionType: "WR" },
  { rank: 2, name: "Bijan Robinson", team: "ATL", position: "RB1", positionType: "RB" },
  { rank: 3, name: "Jahmyr Gibbs", team: "DET", position: "RB2", positionType: "RB" },
  { rank: 4, name: "Saquon Barkley", team: "PHI", position: "RB3", positionType: "RB" },
  { rank: 5, name: "CeeDee Lamb", team: "DAL", position: "WR2", positionType: "WR" },
  { rank: 6, name: "Justin Jefferson", team: "MIN", position: "WR3", positionType: "WR" },
  { rank: 7, name: "Malik Nabers", team: "NYG", position: "WR4", positionType: "WR" },
  { rank: 8, name: "Nico Collins", team: "HOU", position: "WR5", positionType: "WR" },
  { rank: 9, name: "Christian McCaffrey", team: "SF", position: "RB4", positionType: "RB" },
  { rank: 10, name: "Amon-Ra St. Brown", team: "DET", position: "WR6", positionType: "WR" },
  { rank: 11, name: "Derrick Henry", team: "BAL", position: "RB5", positionType: "RB" },
  { rank: 12, name: "Puka Nacua", team: "LAR", position: "WR7", positionType: "WR" },
  { rank: 13, name: "Ashton Jeanty", team: "LV", position: "RB6", positionType: "RB" },
  { rank: 14, name: "Brian Thomas Jr.", team: "JAC", position: "WR8", positionType: "WR" },
  { rank: 15, name: "Drake London", team: "ATL", position: "WR9", positionType: "WR" },
  { rank: 16, name: "De'Von Achane", team: "MIA", position: "RB7", positionType: "RB" },
  { rank: 17, name: "A.J. Brown", team: "PHI", position: "WR10", positionType: "WR" },
  { rank: 18, name: "Brock Bowers", team: "LV", position: "TE1", positionType: "TE" },
  { rank: 19, name: "Jonathan Taylor", team: "IND", position: "RB8", positionType: "RB" },
  { rank: 20, name: "Josh Jacobs", team: "GB", position: "RB9", positionType: "RB" },
  { rank: 21, name: "Bucky Irving", team: "TB", position: "RB10", positionType: "RB" },
  { rank: 22, name: "Chase Brown", team: "CIN", position: "RB11", positionType: "RB" },
  { rank: 23, name: "Ladd McConkey", team: "LAC", position: "WR11", positionType: "WR" },
  { rank: 24, name: "Trey McBride", team: "ARI", position: "TE2", positionType: "TE" },
  { rank: 25, name: "Josh Allen", team: "BUF", position: "QB1", positionType: "QB" },
  { rank: 26, name: "Kyren Williams", team: "LAR", position: "RB12", positionType: "RB" },
  { rank: 27, name: "Lamar Jackson", team: "BAL", position: "QB2", positionType: "QB" },
  { rank: 28, name: "Tee Higgins", team: "CIN", position: "WR12", positionType: "WR" },
  { rank: 29, name: "Jaxon Smith-Njigba", team: "SEA", position: "WR13", positionType: "WR" },
  { rank: 30, name: "George Kittle", team: "SF", position: "TE3", positionType: "TE" },
  { rank: 31, name: "Tyreek Hill", team: "MIA", position: "WR14", positionType: "WR" },
  { rank: 32, name: "Mike Evans", team: "TB", position: "WR15", positionType: "WR" },
  { rank: 33, name: "Jayden Daniels", team: "WAS", position: "QB3", positionType: "QB" },
  { rank: 34, name: "Garrett Wilson", team: "NYJ", position: "WR16", positionType: "WR" },
  { rank: 35, name: "James Cook", team: "BUF", position: "RB13", positionType: "RB" },
  { rank: 36, name: "Davante Adams", team: "LAR", position: "WR17", positionType: "WR" },
  { rank: 37, name: "Omarion Hampton", team: "LAC", position: "RB14", positionType: "RB" },
  { rank: 38, name: "Jalen Hurts", team: "PHI", position: "QB4", positionType: "QB" },
  { rank: 39, name: "Kenneth Walker III", team: "SEA", position: "RB15", positionType: "RB" },
  { rank: 40, name: "Marvin Harrison Jr.", team: "ARI", position: "WR18", positionType: "WR" },
  { rank: 41, name: "Terry McLaurin", team: "WAS", position: "WR19", positionType: "WR" },
  { rank: 42, name: "Alvin Kamara", team: "NO", position: "RB16", positionType: "RB" },
  { rank: 43, name: "Breece Hall", team: "NYJ", position: "RB17", positionType: "RB" },
  { rank: 44, name: "DJ Moore", team: "CHI", position: "WR20", positionType: "WR" },
  { rank: 45, name: "Courtland Sutton", team: "DEN", position: "WR21", positionType: "WR" },
  { rank: 46, name: "Joe Burrow", team: "CIN", position: "QB5", positionType: "QB" },
  { rank: 47, name: "DK Metcalf", team: "PIT", position: "WR22", positionType: "WR" },
  { rank: 48, name: "TreVeyon Henderson", team: "NE", position: "RB18", positionType: "RB" },
  { rank: 49, name: "Chuba Hubbard", team: "CAR", position: "RB19", positionType: "RB" },
  { rank: 50, name: "James Conner", team: "ARI", position: "RB20", positionType: "RB" },
  { rank: 51, name: "DeVonta Smith", team: "PHI", position: "WR23", positionType: "WR" },
  { rank: 52, name: "Tetairoa McMillan", team: "CAR", position: "WR24", positionType: "WR" },
  { rank: 53, name: "Jameson Williams", team: "DET", position: "WR25", positionType: "WR" },
  { rank: 54, name: "Xavier Worthy", team: "KC", position: "WR26", positionType: "WR" },
  { rank: 55, name: "Calvin Ridley", team: "TEN", position: "WR27", positionType: "WR" },
  { rank: 56, name: "George Pickens", team: "DAL", position: "WR28", positionType: "WR" },
  { rank: 57, name: "Tony Pollard", team: "TEN", position: "RB21", positionType: "RB" },
  { rank: 58, name: "D'Andre Swift", team: "CHI", position: "RB22", positionType: "RB" },
  { rank: 59, name: "Zay Flowers", team: "BAL", position: "WR29", positionType: "WR" },
  { rank: 60, name: "RJ Harvey", team: "DEN", position: "RB23", positionType: "RB" },
  { rank: 61, name: "David Montgomery", team: "DET", position: "RB24", positionType: "RB" },
  { rank: 62, name: "Jaylen Waddle", team: "MIA", position: "WR30", positionType: "WR" },
  { rank: 63, name: "Isiah Pacheco", team: "KC", position: "RB25", positionType: "RB" },
  { rank: 64, name: "Sam LaPorta", team: "DET", position: "TE4", positionType: "TE" },
  { rank: 65, name: "Aaron Jones Sr.", team: "MIN", position: "RB26", positionType: "RB" },
  { rank: 66, name: "Patrick Mahomes II", team: "KC", position: "QB6", positionType: "QB" },
  { rank: 67, name: "Travis Hunter", team: "JAC", position: "WR31", positionType: "WR" },
  { rank: 68, name: "T.J. Hockenson", team: "MIN", position: "TE5", positionType: "TE" },
  { rank: 69, name: "Chris Olave", team: "NO", position: "WR32", positionType: "WR" },
  { rank: 70, name: "Baker Mayfield", team: "TB", position: "QB7", positionType: "QB" },
  { rank: 71, name: "Rome Odunze", team: "CHI", position: "WR33", positionType: "WR" },
  { rank: 72, name: "Rashee Rice", team: "KC", position: "WR34", positionType: "WR" },
  { rank: 73, name: "Tyrone Tracy Jr.", team: "NYG", position: "RB27", positionType: "RB" },
  { rank: 74, name: "Bo Nix", team: "DEN", position: "QB8", positionType: "QB" },
  { rank: 75, name: "Jerry Jeudy", team: "CLE", position: "WR35", positionType: "WR" },
  { rank: 76, name: "Ricky Pearsall", team: "SF", position: "WR36", positionType: "WR" },
  { rank: 77, name: "Emeka Egbuka", team: "TB", position: "WR37", positionType: "WR" },
  { rank: 78, name: "Kaleb Johnson", team: "PIT", position: "RB28", positionType: "RB" },
  { rank: 79, name: "Jaylen Warren", team: "PIT", position: "RB29", positionType: "RB" },
  { rank: 80, name: "Travis Kelce", team: "KC", position: "TE6", positionType: "TE" },
  { rank: 81, name: "Mark Andrews", team: "BAL", position: "TE7", positionType: "TE" },
  { rank: 82, name: "Kyler Murray", team: "ARI", position: "QB9", positionType: "QB" },
  { rank: 83, name: "Stefon Diggs", team: "NE", position: "WR38", positionType: "WR" },
  { rank: 84, name: "Dak Prescott", team: "DAL", position: "QB10", positionType: "QB" },
  { rank: 85, name: "Jakobi Meyers", team: "LV", position: "WR39", positionType: "WR" },
  { rank: 86, name: "David Njoku", team: "CLE", position: "TE8", positionType: "TE" },
  { rank: 87, name: "Jordan Mason", team: "MIN", position: "RB30", positionType: "RB" },
  { rank: 88, name: "Travis Etienne Jr.", team: "JAC", position: "RB31", positionType: "RB" },
  { rank: 89, name: "Deebo Samuel Sr.", team: "WAS", position: "WR40", positionType: "WR" },
  { rank: 90, name: "Evan Engram", team: "DEN", position: "TE9", positionType: "TE" },
  { rank: 91, name: "Jordan Addison", team: "MIN", position: "WR41", positionType: "WR" },
  { rank: 92, name: "Zach Charbonnet", team: "SEA", position: "RB32", positionType: "RB" },
  { rank: 93, name: "Brock Purdy", team: "SF", position: "QB11", positionType: "QB" },
  { rank: 94, name: "Justin Fields", team: "NYJ", position: "QB12", positionType: "QB" },
  { rank: 95, name: "Jauan Jennings", team: "SF", position: "WR42", positionType: "WR" },
  { rank: 96, name: "Matthew Golden", team: "GB", position: "WR43", positionType: "WR" },
  { rank: 97, name: "Javonte Williams", team: "DAL", position: "RB33", positionType: "RB" },
  { rank: 98, name: "Tucker Kraft", team: "GB", position: "TE10", positionType: "TE" },
  { rank: 99, name: "Justin Herbert", team: "LAC", position: "QB13", positionType: "QB" },
  { rank: 100, name: "Tyler Warren", team: "IND", position: "TE11", positionType: "TE" }
];

/**
 * Get all FantasyPros player data
 * @returns {Array} Array of all player objects with rank, name, team, position, positionType
 */
function getFantasyProsData() {
  return FANTASY_PROS_DATA;
}

/**
 * Find a player by name (case-insensitive, handles partial matches)
 * @param {string} name - Player name to search for
 * @returns {Object|null} Player object if found, null otherwise
 */
function getPlayerByName(name) {
  if (!name || typeof name !== 'string') return null;
  
  const searchName = name.toLowerCase().trim();
  
  // First try exact match
  let player = FANTASY_PROS_DATA.find(p => 
    p.name.toLowerCase() === searchName
  );
  
  // If no exact match, try partial match
  if (!player) {
    player = FANTASY_PROS_DATA.find(p => 
      p.name.toLowerCase().includes(searchName) || 
      searchName.includes(p.name.toLowerCase())
    );
  }
  
  return player || null;
}

/**
 * Get top players by position type with optional limit
 * @param {string} positionType - Position type (WR, RB, QB, TE, etc.)
 * @param {number} limit - Maximum number of players to return (default: 10)
 * @returns {Array} Array of player objects for the specified position
 */
function getTopPlayersByPosition(positionType, limit = 10) {
  if (!positionType || typeof positionType !== 'string') return [];
  
  const position = positionType.toUpperCase().trim();
  
  return FANTASY_PROS_DATA
    .filter(player => player.positionType === position)
    .slice(0, limit);
}

/**
 * Get players by NFL team
 * @param {string} team - NFL team abbreviation (e.g., "CIN", "LAR")
 * @param {number} limit - Maximum number of players to return (default: 5)
 * @returns {Array} Array of player objects for the specified team
 */
function getPlayersByTeam(team, limit = 5) {
  if (!team || typeof team !== 'string') return [];
  
  const teamCode = team.toUpperCase().trim();
  
  return FANTASY_PROS_DATA
    .filter(player => player.team === teamCode)
    .slice(0, limit);
}

/**
 * Get players within a rank range
 * @param {number} startRank - Starting rank (inclusive)
 * @param {number} endRank - Ending rank (inclusive)  
 * @returns {Array} Array of player objects within the rank range
 */
function getPlayersByRankRange(startRank, endRank) {
  if (typeof startRank !== 'number' || typeof endRank !== 'number') return [];
  if (startRank > endRank) return [];
  
  return FANTASY_PROS_DATA.filter(player => 
    player.rank >= startRank && player.rank <= endRank
  );
}

// Export functions for use in other modules
window.FantasyProsData = {
  getFantasyProsData,
  getPlayerByName,
  getTopPlayersByPosition,
  getPlayersByTeam,
  getPlayersByRankRange
};

// Also export individual functions for backward compatibility
window.getFantasyProsData = getFantasyProsData;
window.getPlayerByName = getPlayerByName;
window.getTopPlayersByPosition = getTopPlayersByPosition;
