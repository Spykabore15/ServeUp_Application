document.addEventListener('DOMContentLoaded', () => {
    protectPage();
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return; // Should be handled by protectPage, but as a safeguard

    // DOM Elements
    const stockTableBody = document.getElementById('stockTableBody');
    const loadingMessage = document.getElementById('loadingMessage');
    const addProductBtn = document.getElementById('addProductBtn');
    const productFormContainer = document.getElementById('productFormContainer');
    const productForm = document.getElementById('productForm');
    const formTitle = document.getElementById('formTitle');
    const closeButton = document.querySelector('.modal .close-button');
    const actionsHeader = document.getElementById('actionsHeader');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutButton = document.getElementById('logoutButton');
    const accessDeniedMessage = document.getElementById('accessDeniedMessage');
    const refreshStocksButton = document.getElementById('refreshStocksButton');

    if (usernameDisplay) usernameDisplay.textContent = loggedInUser.username;
    if (logoutButton) logoutButton.addEventListener('click', logoutUser);

    // Role-based access control
    const canManageStocks = checkUserRole(['admin', 'responsable_stocks']);
    const canViewStocks = checkUserRole(['admin', 'responsable_stocks', 'employe']);

    if (!canViewStocks) {
        if (stockTableBody) stockTableBody.innerHTML = '';
        if (loadingMessage) loadingMessage.style.display = 'none';
        if (addProductBtn) addProductBtn.style.display = 'none';
        if (accessDeniedMessage) accessDeniedMessage.style.display = 'block';
        // Hide nav links if necessary (already handled in dashboard.js, but good for direct page access)
        const navStocksLink = document.getElementById('navStocks');
        if (navStocksLink && navStocksLink.parentElement) navStocksLink.parentElement.style.display = 'none';
        return; // Stop further execution if no view rights
    }

    if (canManageStocks) {
        if (addProductBtn) addProductBtn.style.display = 'inline-block';
        if (actionsHeader) actionsHeader.style.display = 'table-cell';
    }

    let currentEditingProductId = null;

    // Load initial stock data from mockData.js (or localStorage if implemented)
    let currentStockData = [ ...mockStock ]; // Create a mutable copy

    const LOCAL_STORAGE_STOCK_KEY = 'servup_currentStock'; // Defined for consistency

    function saveStockDataToLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_STOCK_KEY, JSON.stringify(currentStockData));
    }

    function loadStockDataFromLocalStorage() {
        const storedData = localStorage.getItem(LOCAL_STORAGE_STOCK_KEY);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                if (Array.isArray(parsedData)) {
                    currentStockData = parsedData;
                } else {
                    console.warn('Stock data in localStorage was not an array. Initializing with default.');
                    currentStockData = [ ...mockStock ];
                    saveStockDataToLocalStorage(); // Save the default structure
                }
            } catch (error) {
                console.error('Error parsing stock data from localStorage:', error);
                currentStockData = [ ...mockStock ];
                saveStockDataToLocalStorage(); // Re-initialize with default on error
            }
        } else {
            // Initialize with mockStock if nothing in localStorage
            currentStockData = [ ...mockStock ];
            saveStockDataToLocalStorage();
        }
    }
    
    loadStockDataFromLocalStorage();

    function renderStockTable() {
        if (!stockTableBody) return;
        stockTableBody.innerHTML = ''; // Clear existing rows

        if (loadingMessage) { // Ensure loadingMessage element exists
            loadingMessage.textContent = 'Chargement des données...';
            loadingMessage.style.display = 'block';
        }

        if (currentStockData.length === 0) {
            if (loadingMessage) {
                loadingMessage.textContent = 'Aucun produit en stock. Cliquez sur "Ajouter Produit" pour en créer un.';
                // Ensure it remains visible if no data
            }
            return;
        }
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }

        currentStockData.forEach(item => {
            const row = stockTableBody.insertRow();
            row.insertCell().textContent = item.name;
            row.insertCell().textContent = item.quantity;
            row.insertCell().textContent = item.threshold;

            const statusCell = row.insertCell();
            if (item.quantity < item.threshold) {
                statusCell.textContent = 'Stock Faible';
                statusCell.className = 'low-stock-alert';
                row.classList.add('low-stock-alert-row'); // Optional: for full row styling
            } else {
                statusCell.textContent = 'OK';
                statusCell.className = 'stock-ok';
            }

            if (canManageStocks) {
                const actionsCell = row.insertCell();
                const editButton = document.createElement('button');
                editButton.textContent = 'Modifier';
                editButton.className = 'action-button edit-btn';
                editButton.onclick = () => openEditForm(item.id);
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer';
                deleteButton.className = 'action-button delete-btn';
                deleteButton.onclick = () => deleteProduct(item.id);
                actionsCell.appendChild(deleteButton);
            } else if (actionsHeader.style.display !== 'none') {
                // Add an empty cell if actions column is visible but user can't manage
                 row.insertCell().textContent = '';
            }
        });
    }

    function openAddForm() {
        currentEditingProductId = null;
        formTitle.textContent = 'Ajouter un Produit';
        productForm.reset();
        document.getElementById('formError').textContent = '';
        productFormContainer.style.display = 'flex';
    }

    function openEditForm(productId) {
        const item = currentStockData.find(p => p.id === productId);
        if (item) {
            currentEditingProductId = item.id;
            formTitle.textContent = 'Modifier le Produit';
            document.getElementById('productId').value = item.id;
            document.getElementById('productName').value = item.name;
            document.getElementById('productQuantity').value = item.quantity;
            document.getElementById('productThreshold').value = item.threshold;
            document.getElementById('formError').textContent = '';
            productFormContainer.style.display = 'flex';
        }
    }

    function closeForm() {
        productFormContainer.style.display = 'none';
        productForm.reset();
        document.getElementById('formError').textContent = '';
    }

    function saveProduct(event) {
        event.preventDefault();
        const name = document.getElementById('productName').value.trim();
        const quantity = parseInt(document.getElementById('productQuantity').value, 10);
        const threshold = parseInt(document.getElementById('productThreshold').value, 10);
        const formError = document.getElementById('formError');
        formError.textContent = '';


        if (!name || isNaN(quantity) || isNaN(threshold) || quantity < 0 || threshold < 0) {
            // formError.textContent = 'Veuillez remplir tous les champs correctement.';
            showToast('Veuillez remplir tous les champs correctement.', 'error');
            return;
        }

        let actionMessage = '';
        if (currentEditingProductId) { // Editing existing product
            const index = currentStockData.findIndex(p => p.id === currentEditingProductId);
            if (index > -1) {
                currentStockData[index] = { ...currentStockData[index], name, quantity, threshold };
                actionMessage = 'Produit modifié avec succès!';
            }
        } else { // Adding new product
            const newId = currentStockData.length > 0 ? Math.max(...currentStockData.map(p => p.id)) + 1 : 1;
            currentStockData.push({ id: newId, name, quantity, threshold });
            actionMessage = 'Produit ajouté avec succès!';
        }
        
        saveStockDataToLocalStorage();
        renderStockTable();
        closeForm();
        if (actionMessage) {
            showToast(actionMessage, 'success');
        }
    }

    function deleteProduct(productId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            currentStockData = currentStockData.filter(p => p.id !== productId);
            saveStockDataToLocalStorage();
            renderStockTable();
            showToast('Produit supprimé avec succès!', 'success');
        }
    }

    // Event Listeners
    if (addProductBtn && canManageStocks) {
        addProductBtn.addEventListener('click', openAddForm);
    }
    if (closeButton) {
        closeButton.addEventListener('click', closeForm);
    }
    if (productForm && canManageStocks) {
        productForm.addEventListener('submit', saveProduct);
    }
    
    // Close modal if clicked outside the content
    window.onclick = function(event) {
        if (event.target === productFormContainer) {
            closeForm();
        }
    }

    // Initial render
    renderStockTable();

    if (refreshStocksButton) {
        refreshStocksButton.addEventListener('click', () => {
            loadStockDataFromLocalStorage(); // Reload data, potentially from mock if localStorage is cleared/changed
            renderStockTable();
        });
    }
}); 