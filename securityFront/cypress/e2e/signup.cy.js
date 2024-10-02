describe('User Signup', () => {
    const appUrl = Cypress.config('baseUrl');

    it('should allow a user to sign up successfully with randomly generated data', () => {
        // Generate random name and email using faker
        const randomName = `Test User ${Math.floor(Math.random() * 1000)}`;
        const randomEmail = `testuser${Math.floor(Math.random() * 1000)}@example.com`;

        cy.visit(`${appUrl}/login`);

        // Click on the signup element
        cy.get('[cypress="sign_up"]').click();

        // Fill out the signup form with random values
        cy.get('input#name').type(randomName);
        cy.get('input#email').type(randomEmail);
        cy.get('input#password').type('password123');

        // Submit the form
        cy.get('button[type=submit]').contains('Sign Up').click();

        // Assert that the user is redirected to the home page
        cy.url().should('eq', `${appUrl}/`);

        // Assert that the token was saved in cookies and the user is logged in
        cy.getCookie('auth_token').should('exist');
        cy.contains(`Vulnerabilities`);
    });
});
