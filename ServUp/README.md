# ServUp

## Project Structure

- `login.html`: Login page
- `dashboard.html`: Dashboard page
- `stocks.html`: Stock management page
- `employees.html`: Employee management page
- `orders.html`: Order management page
- `settings.html`: Settings page
- `css/`: Contains stylesheets
  - `style.css`: Main stylesheet for the application
- `js/`: Contains JavaScript files
  - `login.js`: Handles login logic
  - `dashboard.js`: Handles dashboard logic
  - `stocks.js`: Handles stock management logic
  - `employees.js`: Handles employee management logic
  - `orders.js`: Handles order management logic
  - `settings.js`: Handles settings logic
  - `auth.js`: Handles authentication and session management
  - `utils.js`: Utility functions
  - `mockData.js`: Contains simulated data for the application

## How to Test

1. Open `login.html` in your web browser.
2. Use one of the following credentials to log in:
    - **Admin:**
        - Username: `admin`
        - Password: `adminpassword`
    - **Stock Manager:**
        - Username: `stockmanager`
        - Password: `stockpassword`
    - **HR Manager:**
        - Username: `hrmanager`
        - Password: `hrpassword`
    - **Employee:**
        - Username: `employee`
        - Password: `employeepassword`

## Available Roles

- `admin`: Full access to all modules.
- `responsable_stocks`: Can manage stock inventory.
- `responsable_employes`: Can manage employees.
- `employe`: Read-only access to data. 