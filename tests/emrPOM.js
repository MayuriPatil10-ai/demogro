class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = "//input[@placeholder='Enter your email']"; 
        this.passwordInput = "//input[@id='password']"; 
        this.loginButton = "//button[@type='submit']"; 
    }

    // Method to navigate to the login page
    async navigate(url) {
        await this.page.goto(url, { timeout: 60000 });
        await this.page.waitForSelector(this.usernameInput, { state: 'visible' });
        console.log('Username field is visible');
    }

    // Method to perform login
    async login(username, password) {
        await this.page.fill(this.usernameInput, username);
        console.log('Entered username');
        await this.page.fill(this.passwordInput, password);
        console.log('Entered password');
        await this.page.click(this.loginButton);
        console.log('Login button clicked');
    }
}

module.exports = LoginPage;
