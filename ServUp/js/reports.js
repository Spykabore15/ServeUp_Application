let salesOverTimeChartInstance = null;
let topSellingProductsChartInstance = null;
let stockLevelsChartInstance = null;
let salesTrendChartInstance = null;
let wastedProductsChartInstance = null;

const LOCAL_STORAGE_STOCK_KEY = 'servup_currentStock';
const LOCAL_STORAGE_ORDERS_KEY = 'servup_currentOrders';
const LOCAL_STORAGE_SUPPLIERS_KEY = 'servup_suppliers';
let allSuppliersCache = [];

document.addEventListener('DOMContentLoaded', () => {
    protectPage(); // Ensure user is logged in
    const loggedInUser = getLoggedInUser();

    if (loggedInUser) {
        document.getElementById('usernameDisplay').textContent = loggedInUser.username;
        // Role-based access for reports (optional, for now allow all logged-in users)
        // if (loggedInUser.role !== 'admin' && loggedInUser.role !== 'manager') { 
        //    document.querySelector('.container').innerHTML = '<p>Accès non autorisé à cette section.</p>';
        //    return;
        // }

        initializeCharts();

        // Event listener for the new date range selector
        const salesDateRangeSelector = document.getElementById('salesDateRange');
        if (salesDateRangeSelector) {
            salesDateRangeSelector.addEventListener('change', () => {
                // When the filter changes, reload only the sales chart data, which will apply the filter
                loadSalesDataAndRenderCharts(); 
            });
        }

        document.getElementById('exportSalesReport').addEventListener('click', exportSalesReportToCSV);
        document.getElementById('exportStockReport').addEventListener('click', exportStockReportToCSV);
        
        // Contact Supplier Modal Logic
        const contactSupplierBtn = document.getElementById('contactSupplierFromReportBtn');
        const contactSupplierModal = document.getElementById('contactSupplierModal');
        const closeContactSupplierModalBtn = document.getElementById('closeContactSupplierModal');
        const supplierSearchInput = document.getElementById('supplierSearchInput');

        if (contactSupplierBtn) {
            contactSupplierBtn.addEventListener('click', async () => {
                allSuppliersCache = await getSuppliersData(); // Load all suppliers on modal open
                displaySuppliersInModal(''); // Display all initially
                if (contactSupplierModal) contactSupplierModal.style.display = 'block';
            });
        }

        if (closeContactSupplierModalBtn) {
            closeContactSupplierModalBtn.addEventListener('click', () => {
                if (contactSupplierModal) contactSupplierModal.style.display = 'none';
            });
        }

        if (supplierSearchInput) {
            supplierSearchInput.addEventListener('input', (e) => {
                displaySuppliersInModal(e.target.value);
            });
        }

        // Close modal if clicked outside of it
        window.addEventListener('click', (event) => {
            if (event.target === contactSupplierModal) {
                contactSupplierModal.style.display = 'none';
            }
        });

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', logoutUser);
        }
    } else {
        logoutUser(); 
    }

    // Listen for storage changes to update charts dynamically
    window.addEventListener('storage', function(event) {
        if (event.key === LOCAL_STORAGE_STOCK_KEY) {
            console.log('Stock data changed in localStorage. Reloading stock chart.');
            if (document.getElementById('stockLevelsChart')) {
                loadStockDataAndRenderChart();
            }
        }
        if (event.key === LOCAL_STORAGE_SUPPLIERS_KEY) {
            console.log('[ReportsJS] Supplier data changed in localStorage. Invalidating cache and attempting to refresh modal if open.');
            allSuppliersCache = []; // Invalidate cache
            const contactSupplierModal = document.getElementById('contactSupplierModal');
            // If the modal is currently open, refresh its content
            if (contactSupplierModal && contactSupplierModal.style.display === 'block') {
                const supplierSearchInput = document.getElementById('supplierSearchInput');
                const currentSearchTerm = supplierSearchInput ? supplierSearchInput.value : '';
                // Re-fetch data and update display
                getSuppliersData().then(() => {
                    displaySuppliersInModal(currentSearchTerm);
                });
            }
        }
    });
});

function initializeCharts() {
    loadSalesDataAndRenderCharts();
    loadStockDataAndRenderChart();
    loadForecastDataAndRenderChart();
    loadWasteDataAndRenderChart();
}

// Helper function to safely get data from localStorage or initialize it (similar to dashboard.js)
function getDataFromLocalStorage(key, defaultData) {
    try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            // Ensure it returns a copy to prevent direct modification of the source if defaultData is a reference
            return Array.isArray(parsedData) ? [...parsedData] : [...defaultData]; 
        } else {
            localStorage.setItem(key, JSON.stringify(defaultData));
            return [...defaultData];
        }
    } catch (error) {
        console.error(`Error accessing or parsing ${key} from localStorage:`, error);
        localStorage.setItem(key, JSON.stringify(defaultData)); // Re-initialize on error
        return [...defaultData];
    }
}

function loadSalesDataAndRenderCharts() {
    let allOrders = getDataFromLocalStorage(LOCAL_STORAGE_ORDERS_KEY, [...mockOrders]); 
    const selectedRange = document.getElementById('salesDateRange') ? document.getElementById('salesDateRange').value : 'all';

    // Filter orders based on selectedRange
    const now = new Date();
    let filteredOrders = allOrders.filter(order => {
        const orderDate = new Date(order.date);
        if (order.status === 'annulé') return false; // Exclude cancelled orders from sales

        switch (selectedRange) {
            case '7days':
                const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6); // Include today
                return orderDate >= sevenDaysAgo && orderDate <= now;
            case '30days':
                const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
                return orderDate >= thirtyDaysAgo && orderDate <= now;
            case 'currentMonth':
                return orderDate.getFullYear() === now.getFullYear() && orderDate.getMonth() === now.getMonth();
            case 'lastMonth':
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return orderDate >= lastMonth && orderDate < startOfCurrentMonth;
            case 'all':
            default:
                return true;
        }
    });

    // Data for Sales Over Time Chart (e.g., daily revenue)
    const salesByDate = filteredOrders.reduce((acc, order) => {
        const date = new Date(order.date).toLocaleDateString('fr-FR');
        acc[date] = (acc[date] || 0) + order.amount;
        return acc;
    }, {});
    const sortedDates = Object.keys(salesByDate).sort((a, b) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')));
    const salesDates = sortedDates;
    const salesAmounts = sortedDates.map(date => salesByDate[date]);
    console.log('Sales Data for Chart:', { salesDates, salesAmounts }); // DEBUG LOG
    renderSalesOverTimeChart(salesDates, salesAmounts);

    // Data for Top Selling Products Chart
    const productCounts = {};
    const deliveredOrders = allOrders.filter(order => order.status === 'livré'); // Filter for delivered orders

    deliveredOrders.forEach(order => {
        if (order.items && Array.isArray(order.items)) { // Check if items array exists
            order.items.forEach(item => {
                if (item.name && typeof item.quantity === 'number') { // Check for name and quantity
                    productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
                }
            });
        }
    });
    const productNames = Object.keys(productCounts);
    const productQuantities = Object.values(productCounts);
    renderTopSellingProductsChart(productNames, productQuantities);
}

function renderSalesOverTimeChart(dates, amounts) {
    const ctx = document.getElementById('salesOverTimeChart').getContext('2d');
    if (salesOverTimeChartInstance) {
        salesOverTimeChartInstance.destroy();
    }
    const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 50; // Default if no amounts
    const suggestedMaxY = maxAmount > 0 ? Math.ceil(maxAmount * 1.2 / 10) * 10 : 50; // ~20% padding, round to next 10

    salesOverTimeChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Chiffre d\'affaires quotidien',
                data: amounts,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 10
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: suggestedMaxY,
                    ticks: {
                        maxTicksLimit: 8
                    }
                },
                x: {
                    ticks: {
                        autoSkip: false,
                        minRotation: 0,
                        maxRotation: 0
                    },
                    grid: {
                        offset: true
                    }
                }
            }
        }
    });
}

function renderTopSellingProductsChart(productNames, productQuantities) {
    const ctx = document.getElementById('topSellingProductsChart').getContext('2d');
    if (topSellingProductsChartInstance) {
        topSellingProductsChartInstance.destroy();
    }
    topSellingProductsChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: productNames,
            datasets: [{
                label: 'Quantité Vendue',
                data: productQuantities,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Produits Populaires'
                }
            }
        }
    });
}

function loadStockDataAndRenderChart() {
    let stockItemsData = getDataFromLocalStorage(LOCAL_STORAGE_STOCK_KEY, [...mockStock]);

    const itemNames = stockItemsData.map(item => item.name);
    const itemQuantities = stockItemsData.map(item => item.quantity);
    const itemThresholds = stockItemsData.map(item => item.threshold);

    renderStockLevelsChart(itemNames, itemQuantities, itemThresholds);
}

function renderStockLevelsChart(itemNames, itemQuantities, itemThresholds) {
    const ctx = document.getElementById('stockLevelsChart').getContext('2d');
    if (stockLevelsChartInstance) {
        stockLevelsChartInstance.destroy();
    }
    const maxQuantity = itemQuantities.length > 0 ? Math.max(...itemQuantities, ...itemThresholds) : 50;
    const suggestedMaxYStock = maxQuantity > 0 ? Math.ceil(maxQuantity * 1.15 / 10) * 10 : 50; // ~15% padding, round to next 10

    stockLevelsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: itemNames,
            datasets: [
                {
                    label: 'Quantité en Stock',
                    data: itemQuantities,
                    backgroundColor: itemQuantities.map((qty, index) => qty < itemThresholds[index] ? 'rgba(255, 99, 132, 0.7)' : 'rgba(75, 192, 192, 0.7)'),
                    borderColor: itemQuantities.map((qty, index) => qty < itemThresholds[index] ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)'),
                    borderWidth: 1,
                    barThickness: 30
                },
                {
                    label: 'Seuil d\'Alerte',
                    data: itemThresholds,
                    type: 'line',
                    fill: false,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    tension: 0.1,
                    pointRadius: 0, // Hide points for threshold line
                    borderDash: [5, 5] // Dashed line for threshold
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 10
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: suggestedMaxYStock,
                    ticks: {
                        maxTicksLimit: 8
                    }
                },
                x: {
                    ticks: {
                        autoSkip: false,
                        minRotation: 0,
                        maxRotation: 0
                    },
                    grid: {
                        offset: true
                    }
                }
            }
        }
    });
}

function loadForecastDataAndRenderChart() {
    // Simplified sales trend: generate some mock daily sales for the last 7 days for charting
    const labels = [];
    const dataPoints = [];
    let lastAmount = mockOrders.length > 0 ? mockOrders[mockOrders.length -1].amount : 50; // Start from a recent order or a default

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }));
        // Simulate some trend: increase if many orders, otherwise fluctuate
        const fluctuation = (Math.random() - 0.4) * 20; // Fluctuation between -8 and +12 approx
        lastAmount += (mockOrders.length > 10 ? 5 : 0) + fluctuation; // Base increase + fluctuation
        dataPoints.push(Math.max(0, lastAmount)); // Ensure non-negative
    }
    renderSalesTrendChart(labels, dataPoints);
}

function renderSalesTrendChart(labels, dataPoints) {
    const ctx = document.getElementById('salesTrendChart').getContext('2d');
    if (salesTrendChartInstance) {
        salesTrendChartInstance.destroy();
    }
    const maxDataPoint = dataPoints.length > 0 ? Math.max(...dataPoints) : 50;
    const suggestedMaxYTrend = maxDataPoint > 0 ? Math.ceil(maxDataPoint * 1.2 / 10) * 10 : 50;

    salesTrendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tendance des Ventes (Simulée)',
                data: dataPoints,
                borderColor: 'rgb(153, 102, 255)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 10
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: suggestedMaxYTrend,
                    ticks: {
                        maxTicksLimit: 8
                    }
                },
                x: {
                    ticks: {
                        autoSkip: false,
                        minRotation: 0,
                        maxRotation: 0
                    },
                    grid: {
                        offset: true
                    }
                }
            }
        }
    });
}

function loadWasteDataAndRenderChart() {
    const wasteItems = [...mockWasteData]; // Use a copy
    const productNames = wasteItems.map(item => item.productName);
    const quantitiesWasted = wasteItems.map(item => item.quantityWasted);
    // For simplicity, we'll use a bar chart. Could also use a pie chart.
    renderWastedProductsChart(productNames, quantitiesWasted);
}

function renderWastedProductsChart(productNames, quantitiesWasted) {
    const ctx = document.getElementById('wastedProductsChart').getContext('2d');
    if (wastedProductsChartInstance) {
        wastedProductsChartInstance.destroy();
    }
    const maxWaste = quantitiesWasted.length > 0 ? Math.max(...quantitiesWasted) : 10;
    const suggestedMaxYWaste = maxWaste > 0 ? Math.ceil(maxWaste * 1.2 / 5) * 5 : 10; // ~20% padding, round to next 5 for smaller values

    wastedProductsChartInstance = new Chart(ctx, {
        type: 'bar', // or 'pie'
        data: {
            labels: productNames,
            datasets: [{
                label: 'Quantité Gaspillée',
                data: quantitiesWasted,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
                barThickness: 30
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 10
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: suggestedMaxYWaste,
                    ticks: {
                        maxTicksLimit: 8
                    }
                },
                x: {
                    ticks: {
                        autoSkip: false,
                        minRotation: 0,
                        maxRotation: 0
                    },
                    grid: {
                        offset: true
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Produits les Plus Gaspillés'
                }
            }
        }
    });
}

function exportSalesReportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    // Header for combined sales data
    csvContent += "Type,Date/Produit,Valeur/Quantité\r\n";
    
    // Sales over time data
    const salesByDate = mockOrders.reduce((acc, order) => {
        const date = new Date(order.date).toLocaleDateString('fr-FR');
        acc[date] = (acc[date] || 0) + order.amount;
        return acc;
    }, {});
    const sortedDates = Object.keys(salesByDate).sort((a, b) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')));
    sortedDates.forEach(date => {
        csvContent += `"Revenu Quotidien",${date},${salesByDate[date].toFixed(2)}\r\n`;
    });

    // Top selling products data
    const productCounts = {};
    mockOrders.forEach(order => {
        order.items.forEach(item => {
            productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
        });
    });
    for (const productName in productCounts) {
        csvContent += `"Produit Vendu",${productName},${productCounts[productName]}\r\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rapport_ventes_detail.csv");
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
}

function exportStockReportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID Produit,Nom,Quantité,Prix Unitaire,Seuil Alerte\r\n";
    mockStock.forEach(item => {
        let row = `${item.id},${item.name},${item.quantity},${item.price},${item.threshold}`;
        csvContent += row + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rapport_stocks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Helper function to get supplier data (reverted to standard logic)
async function getSuppliersData() {
    if (allSuppliersCache.length > 0) {
        // console.log("[ReportsJS] Using cached supplier data.");
        return [...allSuppliersCache];
    }
    // console.log("[ReportsJS] No cache, fetching supplier data from localStorage or mock.");
    const suppliersData = localStorage.getItem(LOCAL_STORAGE_SUPPLIERS_KEY);
    if (suppliersData) {
        try {
            const parsedSuppliers = JSON.parse(suppliersData);
            allSuppliersCache = [...parsedSuppliers];
            // console.log("[ReportsJS] Loaded suppliers from localStorage:", JSON.parse(JSON.stringify(parsedSuppliers)));
            return parsedSuppliers;
        } catch (e) {
            console.error('[ReportsJS] Error parsing suppliers from localStorage:', e);
            localStorage.removeItem(LOCAL_STORAGE_SUPPLIERS_KEY); // Clear corrupted data
        }
    }
    // If no suppliers in localStorage or parsing failed, try to use mockSuppliers
    // This will also initialize localStorage if it was empty or cleared due to corruption
    if (typeof mockSuppliers !== 'undefined' && mockSuppliers.length > 0) {
        // console.log("[ReportsJS] Using mockSuppliers and initializing localStorage.");
        localStorage.setItem(LOCAL_STORAGE_SUPPLIERS_KEY, JSON.stringify(mockSuppliers));
        allSuppliersCache = [...mockSuppliers];
        return [...mockSuppliers];
    }
    // console.log("[ReportsJS] No supplier data found in localStorage or mockData. Returning empty array.");
    allSuppliersCache = [];
    return [];
}

function displaySuppliersInModal(currentSearchTerm) {
    const supplierListContainer = document.getElementById('supplierListContainer');
    const noResultsMsg = document.getElementById('noSupplierResultsMsg');
    if (!supplierListContainer || !noResultsMsg) {
        console.error("[TEST] Modal elements not found for display!");
        return;
    }

    supplierListContainer.innerHTML = '';
    const termToSearch = (typeof currentSearchTerm === 'string' ? currentSearchTerm : '').toLowerCase().trim();

    console.log(`[TEST] Filtering with processed search term: "${termToSearch}"`);
    if (allSuppliersCache.length === 0) {
        console.warn("[TEST] allSuppliersCache is EMPTY. No suppliers to filter.");
    }

    const filteredSuppliers = allSuppliersCache.filter(supplier => {
        if (termToSearch === '') {
            return true;
        }

        const sName = (supplier.name || '').toLowerCase();
        const sProducts = (supplier.productsOffered || '').toLowerCase();
        // const sContact = (supplier.contactPerson || '').toLowerCase(); // Temporarily remove contact search for simplicity

        const nameMatch = sName.includes(termToSearch);
        const productMatch = sProducts.includes(termToSearch);
        // const contactMatch = sContact.includes(termToSearch);

        if ((supplier.name || '').includes("Ferme de la Vallée")) {
            console.log(`[TEST] Checking "Ferme de la Vallée":`);
            console.log(`    Search Term: "${termToSearch}"`);
            console.log(`    Products Field (raw): "${supplier.productsOffered || ''}"`);
            console.log(`    Products Field (lowercase): "${sProducts}"`);
            console.log(`    Does products field include search term? ${productMatch}`);
        }
        
        return nameMatch || productMatch; // Simplified to name and product match for now
    });

    console.log("[TEST] Number of filtered suppliers:", filteredSuppliers.length);

    if (filteredSuppliers.length === 0) {
        noResultsMsg.style.display = 'block';
    } else {
        noResultsMsg.style.display = 'none';
        const ul = document.createElement('ul');
        ul.className = 'supplier-results-list';

        filteredSuppliers.forEach(supplier => {
            const li = document.createElement('li');
            li.className = 'supplier-result-item';
            li.innerHTML = `
                <strong>${supplier.name || 'Nom non disponible'}</strong>
                <p>Contact: ${supplier.contactPerson || 'N/A'}</p>
                <p>Email: ${supplier.email || 'N/A'} | Téléphone: ${supplier.phone || 'N/A'}</p>
                <p>Produits: ${supplier.productsOffered || 'N/A'}</p>
                ${supplier.email ? `<a href="mailto:${supplier.email}" class="action-button contact-email-btn">Contacter par Email</a>` : '<p><em>Email non disponible</em></p>'}
            `;
            ul.appendChild(li);
        });
        supplierListContainer.appendChild(ul);
    }
} 