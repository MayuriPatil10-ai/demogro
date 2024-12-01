require('dotenv').config({ path: './tests/.env' });  // Load environment variables from .env file
const fs = require('fs');
const path = require('path');

// Fetch the profile name from the environment variable
const profileName = process.env.PROFILE;

// Validate the PROFILE environment variable
if (!profileName) {
    console.error("Error: PROFILE is not set in the .env file.");
    process.exit(1);
}

// Construct the path for the profile JSON file relative to the 'tests/test_data' directory
const profileFilePath = path.join(__dirname, 'test_data', `test_data_${profileName}.json`);

// Ensure the profile JSON file exists
if (!fs.existsSync(profileFilePath)) {
    console.error(`Error: Profile data file '${profileFilePath}' does not exist.`);
    process.exit(1);
}

// Read the profile data (username, password, loginUrl)
const profileData = JSON.parse(fs.readFileSync(profileFilePath, 'utf-8'));

// Export the configuration
module.exports = {
    browserType: process.env.BROWSER || 'chromium',  // Default to 'chromium' if not set
    loginUrl: profileData.loginUrl,
    username: profileData.username,
    password: profileData.password,
    cliffhangerUrl: profileData.cliffhangerUrl
};
