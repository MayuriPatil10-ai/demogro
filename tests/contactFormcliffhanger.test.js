require('dotenv').config({ path: './tests/.env' });  // Load environment variables from .env file

const { chromium, firefox, webkit } = require('playwright');
const config = require('./config');  // Import the configuration from config.js
const cliffhangerPage = require('./cliffhangerPOM');  // Import the cliffhangerPage POM

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
        browser = await chromium.launch({
            headless: false,
            args: [
                '--no-sandbox',        // Disable sandboxing (optional for certain systems)
                '--disable-gpu'        // Disable GPU acceleration (optional)
            ],
            // Set the viewport size explicitly to simulate a full-screen experience
            viewport: { width: 1920, height: 1080 },  // Full HD resolution (adjust as needed)
        });

    } else if (browserType === 'firefox') {
        browser = await firefox.launch({ headless: false });
    } else if (browserType === 'webkit') {
        browser = await webkit.launch({ headless: false });
    } else {
        console.error(`Unsupported browser type: ${browserType}`);
        process.exit(1);
    }

    const page = await browser.newPage();
    const cliffhangerPageInstance = new cliffhangerPage(page);  // Instantiate the CliffhangerPage object

    try {
        // Navigate to the cliffhanger URL
        await cliffhangerPageInstance.navigateToCliffhanger(cliffhangerUrl);

        // Check if the page loaded successfully
        const isLoaded = await cliffhangerPageInstance.isPageLoaded();
        if (!isLoaded) {
            console.error('Cliffhanger page did not load.');
            return;
        }

        // Now interact with the Contact Form button
        await cliffhangerPageInstance.clickContactForm();
        console.log('Contact Form button clicked successfully.');

        await page.waitForTimeout(5000);  // Wait for 5 seconds after page load
        console.log('Waited for 5 seconds after launch');

        // Wait for the iframe to load
        const iframeSelector = 'iframe[src="https://widget-ui.growthemr.com/assets/widgets/new-form.html?bid=1968&fid=14940&agencyId=1"]';
        await page.waitForSelector(iframeSelector);

        // Locate the iframe by its src and interact with it
        const iframe = page.frame({ url: 'https://widget-ui.growthemr.com/assets/widgets/new-form.html?bid=1968&fid=14940&agencyId=1' });

        // Check for the text inside the iframe
        const contactFormLocator = iframe.locator('text="Lead Capture Form"');
        await contactFormLocator.waitFor();
        console.log('Contact Form Opened successfully: "Lead Capture Form" is visible.');

        // Wait for all form elements to be visible
        await iframe.locator(cliffhangerPageInstance.firstName).waitFor({ state: 'visible' });
        await iframe.locator(cliffhangerPageInstance.lastName).waitFor({ state: 'visible' });
        await iframe.locator(cliffhangerPageInstance.phoneNumber).waitFor({ state: 'visible' });
        await iframe.locator(cliffhangerPageInstance.emailAddress).waitFor({ state: 'visible' });
        await iframe.locator(cliffhangerPageInstance.instagram).waitFor({ state: 'visible' });
        await iframe.locator(cliffhangerPageInstance.lasertreatment).waitFor({ state: 'visible' });
        await iframe.locator(cliffhangerPageInstance.messageBox).waitFor({ state: 'visible' });
        await iframe.locator(cliffhangerPageInstance.submitbutton).waitFor({ state: 'visible' });
        console.log('All form elements are visible and ready for interaction.');

        // Fill out the contact form with dynamic data
        const dynamicData = {
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '1234567890',
            emailAddress: 'johndoe@example.com',
            instagram: 'john_instagram',
            lasertreatment: 'Yes',
            message: 'This is a test message.'
        };

        await iframe.locator(cliffhangerPageInstance.firstName).fill(dynamicData.firstName);
        await iframe.locator(cliffhangerPageInstance.lastName).fill(dynamicData.lastName);
        await iframe.locator(cliffhangerPageInstance.phoneNumber).fill(dynamicData.phoneNumber);
        await iframe.locator(cliffhangerPageInstance.emailAddress).fill(dynamicData.emailAddress);

        // Use check() for radio buttons
        await iframe.locator(cliffhangerPageInstance.instagram).check();  // Instagram radio button
        await iframe.locator(cliffhangerPageInstance.lasertreatment).check();  // Laser treatment radio button

        await iframe.locator(cliffhangerPageInstance.messageBox).fill(dynamicData.message);

        // **Define the file path here**
        const filePath = 'D:/abc.png';  // Define the actual file path here

        // Locate the hidden input element for file upload (inside the div or directly available in the iframe)
        const fileInputLocator = iframe.locator('input[type="file"]');

        // Wait for the file input element to be visible (or interactable)
        await fileInputLocator.setInputFiles(filePath);

        console.log('File uploaded successfully.');

        // Check the checkbox (if applicable)
        await iframe.locator(cliffhangerPageInstance.checkbox).check();

        // Submit the form
        await iframe.locator(cliffhangerPageInstance.submitbutton).click();
        console.log('Submit button clicked.');

        // Wait for 10 seconds after form submission
        await page.waitForTimeout(10000);  // Wait for 10 seconds after form submission
        console.log('Waited for 10 seconds after form submission');

        // // Scroll to the bottom of the page to ensure visibility of the "Thank You!" message
        // await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // // Wait for the "Thank You!" message
        // await page.waitForSelector('h1:has-text("Thank You!")', { state: 'visible', timeout: 15000 });
        // console.log('Thank You message is visible.');

        // // Optionally, check if the "Thank You!" message is correct
        // const thankYouText = await page.locator('h1:has-text("Thank You!")').innerText();
        // console.log('Thank You message text:', thankYouText);

    } catch (error) {
        console.error('Error during Cliffhanger page interaction or button click:', error);
    } finally {
        await browser.close();
    }
})();
