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
    { name: 'Brandon Aiyuk', cost: 23 }, { name: 'Justin Fields', cost: 6 }
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
    { name: 'Josh Downs', cost: 7 }, { name: 'Mike Gesicki', cost: 5 },
    { name: 'Sam Laporta', cost: 15 }, { name: 'Juan Jennings', cost: 10 }
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
    { name: 'Darnell Mooney', cost: 5 }, { name: 'Drew Lock', cost: 10 },
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