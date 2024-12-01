class cliffhangerPage {
    constructor(page) {
        this.page = page;
        this.pageTitleSelector = 'h1';  // Selector for any element that indicates the page is loaded (adjust accordingly)
        this.contactFormLink = "(//button[@class='feature-button'])[3]";
        this.firstName = "//input[@data-type1='First Name']";
        this.lastName = "//input[@data-type1='Last Name']";
        this.phoneNumber = "//input[@placeholder='Phone Number']";
        this.emailAddress = "//input[@placeholder='Email Address']";
        this.instagram = "//input[@value='Instagram']";
        this.lasertreatment = "//input[@value='Lasers']";
        this.fileUpload = "//div[@id='fileDropZone_112251']";
        this.choseFile = "//span[contains(text(), 'Choose file')]";
        this.messageBox = "//textarea[@placeholder='Message']";
        this.checkbox = "//input[@type='checkbox']";
        this.submitbutton = "//button[text()='Submit']";
        this.contactFormIframe = 'iframe[src="https://widget-ui.growthemr.com/assets/widgets/new-form.html?bid=1968&fid=14940&agencyId=1"]'; // iframe selector for the form
        this.thankYouMessageSelector = 'h1:has-text("Thank You!")';  // Selector for the "Thank You!" message
    }
    


    //Positive test cases
    // Method to navigate to the cliffhanger page
    async navigateToCliffhanger(url) {
        await this.page.goto(url, { timeout: 60000 });
        await this.page.waitForSelector(this.pageTitleSelector, { state: 'visible' });  // Wait for a title or element that confirms the page is loaded
        console.log('Cliffhanger page loaded successfully');
    }

    // Method to check if the page is loaded by confirming an element on the page
    async isPageLoaded() {
        const titleVisible = await this.page.isVisible(this.pageTitleSelector);
        return titleVisible;  // Returns true if the title is visible, indicating the page loaded
    }

    // Method to click the contact form button
    async clickContactForm() {
        await this.page.waitForSelector(this.contactFormLink, { state: 'visible' });
        await this.page.click(this.contactFormLink);
        console.log('Contact form button clicked.');
}
    // Method to check if the contact form iframe is open
    async isContactFormOpen() {
        try {
            // Wait for the iframe to be visible
            await this.page.waitForSelector(this.contactFormIframe, { state: 'visible' });
            console.log('Contact form is open.');
            return true;  // Return true if the iframe is visible, meaning the contact form is open
        } catch (error) {
            console.error('Contact form did not open.', error);
            return false;  // Return false if the iframe is not visible
        }
    }
 
    
    // Method to check if the contact form was successfully submitted
    async isContactFormSubmitted() {
        try {
            await page.pause();
            // Wait for the "Thank You!" message after submission
            await this.page.waitForSelector(this.thankYouMessageSelector, { state: 'visible', timeout: 15000 });
            console.log('Contact form was submitted successfully and "Thank You!" message is visible.');
            return true;  // Return true if the "Thank You!" message is visible, indicating successful submission
        } catch (error) {
            console.error('Contact form submission failed or "Thank You!" message not found.', error);
            return false;  // Return false if the "Thank You!" message is not found
        }
    }

}
module.exports = cliffhangerPage;
