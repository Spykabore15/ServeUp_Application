const LOCAL_STORAGE_STOCK_KEY = 'servup_currentStock';
const LOCAL_STORAGE_ORDERS_KEY = 'servup_currentOrders';
const LOCAL_STORAGE_EMPLOYEES_KEY = 'servup_currentEmployees';

document.addEventListener('DOMContentLoaded', () => {
    protectPage(); // Ensure user is logged in
    const loggedInUser = getLoggedInUser();

    if (loggedInUser) {
        document.getElementById('usernameDisplay').textContent = loggedInUser.username;
        document.getElementById('welcomeUsername').textContent = loggedInUser.username;
        document.getElementById('userRoleDisplay').textContent = loggedInUser.role;

        loadDashboardData(loggedInUser); // Initial load, no longer passes mock data directly

        // Refresh button remains, useful for manual refresh or if localStorage sync is ever questioned
        const refreshButton = document.getElementById('refreshDashboardButton');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => loadDashboardData(loggedInUser));
        }

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', logoutUser);
        }

        // Listen for storage changes to update dashboard dynamically
        window.addEventListener('storage', function(event) {
            if (event.key === LOCAL_STORAGE_STOCK_KEY || 
                event.key === LOCAL_STORAGE_ORDERS_KEY || 
                event.key === LOCAL_STORAGE_EMPLOYEES_KEY) {
                console.log(`Dashboard data changed in localStorage for key: ${event.key}. Reloading dashboard.`);
                loadDashboardData(loggedInUser);
            }
        });

    } else {
        logoutUser();
    }
});

// Helper function to safely get data from localStorage or initialize it
function getDataFromLocalStorage(key, defaultData) {
    try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            return Array.isArray(parsedData) ? parsedData : defaultData;
        } else {
            localStorage.setItem(key, JSON.stringify(defaultData));
            return defaultData;
        }
    } catch (error) {
        console.error(`Error accessing or parsing ${key} from localStorage:`, error);
        localStorage.setItem(key, JSON.stringify(defaultData)); // Re-initialize on error
        return defaultData;
    }
}

function loadDashboardData(loggedInUser) {
    // Fetch data from localStorage, falling back to mockData and initializing localStorage if needed
    const stock = getDataFromLocalStorage(LOCAL_STORAGE_STOCK_KEY, [...mockStock]);
    const orders = getDataFromLocalStorage(LOCAL_STORAGE_ORDERS_KEY, [...mockOrders]);
    const employees = getDataFromLocalStorage(LOCAL_STORAGE_EMPLOYEES_KEY, [...mockEmployees]);

    // General statistics
    document.getElementById('totalEmployees').textContent = employees.length;
    document.getElementById('totalStockItems').textContent = stock.length;
    const lowStockCount = stock.filter(item => item.quantity < item.threshold).length;
    document.getElementById('lowStockAlerts').textContent = lowStockCount > 0 ? `${lowStockCount} produit(s)` : 'Aucune';
    const pendingOrdersCount = orders.filter(order => order.status === 'en cours').length;
    document.getElementById('pendingOrders').textContent = pendingOrdersCount > 0 ? `${pendingOrdersCount} commande(s)` : 'Aucune';

    // Sales and Performance Statistics
    const completedOrders = orders.filter(order => order.status === 'complétée' || order.status === 'livré'); // Consider both for revenue
    const dailyRevenue = completedOrders.reduce((sum, order) => sum + order.amount, 0); // Use order.amount
    const dailyCompletedOrders = completedOrders.length;
    const averageOrderValue = dailyCompletedOrders > 0 ? (dailyRevenue / dailyCompletedOrders) : 0;

    document.getElementById('dailyRevenue').textContent = dailyRevenue.toFixed(2);
    document.getElementById('dailyCompletedOrders').textContent = dailyCompletedOrders;
    document.getElementById('averageOrderValue').textContent = averageOrderValue.toFixed(2);

    // Show/hide content and nav links based on role
    const userRole = loggedInUser.role;

    document.getElementById('adminContent').style.display = 'none';
    document.getElementById('stockManagerContent').style.display = 'none';
    document.getElementById('hrManagerContent').style.display = 'none';
    document.getElementById('employeeContent').style.display = 'none';

    const navStocks = document.getElementById('navStocks');
    const navEmployees = document.getElementById('navEmployees');

    if (userRole === 'admin') {
        document.getElementById('adminContent').style.display = 'block';
        if(navStocks) navStocks.style.display = 'list-item';
        if(navEmployees) navEmployees.style.display = 'list-item';
    } else {
        if(navStocks) navStocks.style.display = 'none';
        if(navEmployees) navEmployees.style.display = 'none';

        if (userRole === 'responsable_stocks') {
            document.getElementById('stockManagerContent').style.display = 'block';
            if(navStocks) navStocks.style.display = 'list-item';
        }

        if (userRole === 'responsable_employes') {
            document.getElementById('hrManagerContent').style.display = 'block';
            if(navEmployees) navEmployees.style.display = 'list-item';
        }

        if (userRole === 'employe') {
            document.getElementById('employeeContent').style.display = 'block';
        }
    }
}