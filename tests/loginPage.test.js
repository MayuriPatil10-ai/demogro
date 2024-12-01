require('dotenv').config({ path: './tests/.env' });  // Load environment variables from .env file

const { chromium, firefox, webkit } = require('playwright');
const config = require('./config');  // Import the configuration from config.js
const LoginPage = require('./emrPOM');  // Import the POM for login

(async () => {
    const { browserType, loginUrl, username, password } = config;  // Destructure values from config

    console.log('Browser Type:', browserType);
    console.log('Login URL:', loginUrl);
    console.log('Username:', username);  // This will show the username from the selected profile
    console.log('Password:', password);  // This will show the password from the selected profile

    // Check if loginUrl is set
    if (!loginUrl) {
        console.error('Error: LOGIN_URL is not set.');
        process.exit(1);
    }

    // Launch the appropriate browser based on the environment variable
    let browser;
    if (browserType === 'chromium') {
        browser = await chromium.launch({ headless: false });
    } else if (browserType === 'firefox') {
        browser = await firefox.launch({ headless: true });
    } else if (browserType === 'webkit') {
        browser = await webkit.launch({ headless: true });
    } else {
        console.error(`Unsupported browser type: ${browserType}`);
        process.exit(1);
    }

    const page = await browser.newPage();
    const loginPage = new LoginPage(page);  // Instantiate the LoginPage object

    try {
        // Navigate to the login page
        await loginPage.navigate(loginUrl);

        // Perform login using the credentials from the selected profile
        await loginPage.login(username, password);
        console.log('Login attempted');

        await page.waitForTimeout(5000);  // Wait for 5000 ms (5 seconds)
        console.log('Waited for 5 seconds after login');

        const isBusinessSolutionVisible = await page.isVisible('text="Business Selection"');  // Locate the text directly
    
        if (isBusinessSolutionVisible) {
            console.log('Login successful: "Business Solution" text is visible.');
        } else {
            console.log('Login failed: "Business Solution" text is not visible.');
        }

    } catch (error) {
        console.error('Error during login:', error);
    } finally {
        await browser.close();
    }







})();
