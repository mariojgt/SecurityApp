describe('User Login', () => {
    const appUrl = Cypress.config('baseUrl');

    it('should allow a user to log in successfully', () => {
        cy.visit(`${appUrl}/login`);

        // Fill out the login form
        cy.get('input#email').type('test@example.com');
        cy.get('input#password').type('password');

        // Submit the form
        cy.get('button[type=submit]').contains('Login').click();

        // Assert that the user is redirected to the home page
        cy.url().should('eq', `${appUrl}/`);

        // Assert that the token was saved in cookies and the user is logged in
        cy.getCookie('auth_token').should('exist');
        cy.contains('Vulnerabilities');
    });

    it('should show an error for invalid login credentials', () => {
        cy.visit(`${appUrl}/login`);

        // Fill out the login form with invalid credentials
        cy.get('input#email').type('wrongemail@example.com');
        cy.get('input#password').type('wrongpassword');

        // Submit the form
        cy.get('button[type=submit]').contains('Login').click();

        // Assert that an error message is shown
        cy.contains('Login failed').should('be.visible');
    });
});
