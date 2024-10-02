# Setup Process

# Tools you need to have installed
- Docker
- Docker Compose
- Composer
- Node.js
- NPM
- Php
- Postman

## MySQL Setup
Navigate to the `mysql` folder and run the following commands:

1. `docker-compose up -d` or, if you have a Makefile, run `make start`.
2. A PhpMyAdmin container is also provided to help manage the database.

## Server Setup (Laravel)
Navigate to the `securityOps` folder (the Laravel folder) and run the following commands:

1. Install dependencies: `composer install`
2. Configure the `.env` file.
3. Run migrations: `php artisan migrate`
4. Seed the database: `php artisan db:seed`
5. Generate the encryption key: `php artisan key:generate`
6. Start the server: `php artisan serve`
optional: `php artisan test`

## Client Setup (Frontend)
Navigate to the `securityFront` folder (the client folder) and run the following commands:

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Configure the `.env` file.
4. Use the following credentials to log in:
   - **Email:** `test@example.com`
   - **Password:** `password`
optional: `npm run cy:open` to run the Cypress tests


### Note:
The provided `.env.example` file contains most of the required configurations, allowing you to set up the system quickly and easily.

optional: There is a postman collection in the root folder that you can use to test the API endpoints.
