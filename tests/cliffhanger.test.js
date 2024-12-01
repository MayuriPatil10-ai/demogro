require('dotenv').config({ path: './tests/.env' });  // Load environment variables from .env file

const { chromium, firefox, webkit } = require('playwright');
const config = require('./config');  // Import the configuration from config.js
const CliffhangerPage = require('./cliffhangerPOM');

(async () => {
    const { browserType, cliffhangerUrl } = config;  // Destructure values from config

    console.log('Browser Type:', browserType);
    console.log('Cliffhanger URL:', cliffhangerUrl);

    // Check if cliffhangerUrl is set
    if (!cliffhangerUrl) {
        console.error('Error: CLIFFHANGER_URL is not set.');
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
    const cliffhangerPageInstance = new CliffhangerPage(page);  // Instantiate the CliffhangerPage object

    try {
        // Navigate to the cliffhanger page
        await cliffhangerPageInstance.navigateToCliffhanger(cliffhangerUrl);  // Use the instance

        await page.waitForTimeout(5000);  // Wait for 5000 ms (5 seconds)
        console.log('Waited for 5 seconds after launch');

        // Check if the page is loaded successfully
        const isLoaded = await cliffhangerPageInstance.isPageLoaded();  // Use the instance
        if (isLoaded) {
            console.log('Cliffhanger page opened successfully.');
        } else {
            console.log('Failed to load the Cliffhanger page.');
        }

        const isbottom = await page.isVisible('text="Please click on the bottom right corner. Your Chatbot is available."');  // Locate the text directly
    
        if (isbottom) {
            console.log('Loaded successful: "Please click on the bottom right corner. Your Chatbot is available.');
        } else {
            console.log('Loading failed: "Please click on the bottom right corner. Your Chatbot is available.');
        }

        return { browser, page, cliffhangerPageInstance };

    } catch (error) {
        console.error('Error during cliffhanger page navigation:', error);
    } finally {
        await browser.close();
    }
})();
