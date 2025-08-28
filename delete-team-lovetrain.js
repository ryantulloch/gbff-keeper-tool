// One-time script to delete "Team lovetrain" from Firebase
// Run this in the browser console when the app is loaded

function deleteTeamLovetrain() {
    // Check if Firebase is connected
    if (!window.getDb || !window.getFirebaseConnected()) {
        console.error('Firebase not connected! Load the main app first.');
        return;
    }
    
    // Try multiple possible key formats for "Team lovetrain"
    const possibleKeys = [
        'Team lovetrain',
        'Team_lovetrain', 
        'team-lovetrain',
        'team_lovetrain',
        'teamlovetrain'
    ];
    
    console.log('Checking for Team lovetrain submissions...');
    
    const submissions = window.getSubmissions();
    console.log('Available submission keys:', Object.keys(submissions));
    
    let foundKey = null;
    for (const key of possibleKeys) {
        if (submissions[key]) {
            foundKey = key;
            console.log('Found Team lovetrain with key:', key);
            break;
        }
    }
    
    if (!foundKey) {
        console.log('Team lovetrain not found in database');
        return;
    }
    
    // Delete the submission
    window.getDb().ref('submissions/' + foundKey).remove().then(() => {
        console.log('✅ Team lovetrain deleted successfully from Firebase!');
        console.log('Deleted key:', foundKey);
        
        // Update local cache
        const updatedSubmissions = { ...window.getSubmissions() };
        delete updatedSubmissions[foundKey];
        window.setSubmissions(updatedSubmissions);
        
        if (typeof window.updateDisplay === 'function') {
            window.updateDisplay();
        }
    }).catch((error) => {
        console.error('❌ Error deleting Team lovetrain:', error);
    });
}

// Auto-run the deletion
deleteTeamLovetrain();