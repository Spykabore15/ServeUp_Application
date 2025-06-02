document.addEventListener('DOMContentLoaded', () => {
    protectPage();
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    // DOM Elements
    const orderTableBody = document.getElementById('orderTableBody');
    const loadingMessage = document.getElementById('loadingMessageOrder');
    const addOrderBtn = document.getElementById('addOrderBtn');
    const orderFormContainer = document.getElementById('orderFormContainer');
    const orderForm = document.getElementById('orderForm');
    const formTitle = document.getElementById('formTitleOrder');
    const closeButton = document.querySelector('#orderFormContainer .close-button');
    const actionsHeader = document.getElementById('actionsHeaderOrder');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutButton = document.getElementById('logoutButton');
    const accessDeniedMessage = document.getElementById('accessDeniedMessageOrder');
    const refreshOrdersButton = document.getElementById('refreshOrdersButton');

    if (usernameDisplay) usernameDisplay.textContent = loggedInUser.username;
    if (logoutButton) logoutButton.addEventListener('click', logoutUser);

    const LOCAL_STORAGE_ORDERS_KEY = 'servup_currentOrders'; // Defined for consistency

    // Role-based access
    const isAdmin = checkUserRole(['admin']);
    // For MVP, all roles that can see the page can change status and view.
    const canViewOrders = checkUserRole(['admin', 'responsable_stocks', 'responsable_employes', 'employe']);
    const canChangeStatus = canViewOrders; // As per current interpretation

    if (!canViewOrders) {
        if (orderTableBody) orderTableBody.innerHTML = '';
        if (loadingMessage) loadingMessage.style.display = 'none';
        if (addOrderBtn) addOrderBtn.style.display = 'none';
        if (accessDeniedMessage) accessDeniedMessage.style.display = 'block';
        // Hide nav link if necessary (though dashboard.js should also handle this)
        const navOrdersLink = document.getElementById('navOrders');
        if (navOrdersLink && navOrdersLink.parentElement) navOrdersLink.parentElement.style.display = 'none';
        return;
    }

    if (isAdmin) {
        if (addOrderBtn) addOrderBtn.style.display = 'inline-block';
        if (actionsHeader) actionsHeader.style.display = 'table-cell'; 
    }

    let currentOrderData = []; // Will be populated from localStorage or mockOrders

    function saveOrderDataToLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(currentOrderData));
    }

    function loadOrderDataFromLocalStorage() {
        const storedData = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                if (Array.isArray(parsedData)) {
                    currentOrderData = parsedData;
                } else {
                    console.warn('Order data in localStorage was not an array. Initializing with default.');
                    currentOrderData = [ ...mockOrders ]; // Ensure mockOrders is accessible here
                    saveOrderDataToLocalStorage();
                }
            } catch (error) {
                console.error('Error parsing order data from localStorage:', error);
                currentOrderData = [ ...mockOrders ];
                saveOrderDataToLocalStorage();
            }
        } else {
            currentOrderData = [ ...mockOrders ];
            saveOrderDataToLocalStorage();
        }
    }

    loadOrderDataFromLocalStorage();

    function renderOrderTable() {
        if (!orderTableBody) return;
        orderTableBody.innerHTML = '';

        if (loadingMessage) {
            loadingMessage.textContent = 'Chargement des commandes...';
            loadingMessage.style.display = 'block';
        }

        if (currentOrderData.length === 0) {
            if (loadingMessage) {
                loadingMessage.textContent = 'Aucune commande enregistrée. Les nouvelles commandes apparaîtront ici.';
            }
            return;
        }
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }

        currentOrderData.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

        currentOrderData.forEach(order => {
            const row = orderTableBody.insertRow();
            row.insertCell().textContent = order.id;
            row.insertCell().textContent = order.client;
            row.insertCell().textContent = new Date(order.date).toLocaleDateString('fr-FR');
            const amountCell = row.insertCell();
            amountCell.textContent = `${order.amount.toFixed(2)} €`;
            amountCell.classList.add('order-amount');

            const statusCell = row.insertCell();
            if (canChangeStatus) {
                const statusSelect = document.createElement('select');
                statusSelect.className = 'status-select';
                ['en cours', 'livré', 'annulé'].forEach(s => {
                    const option = document.createElement('option');
                    option.value = s;
                    option.textContent = s.charAt(0).toUpperCase() + s.slice(1);
                    if (s === order.status) option.selected = true;
                    statusSelect.appendChild(option);
                });
                statusSelect.value = order.status;
                statusSelect.classList.add(`status-${order.status.replace(' ', '-')}`); // for styling
                statusSelect.onchange = (e) => updateOrderStatus(order.id, e.target.value);
                statusCell.appendChild(statusSelect);
            } else {
                statusCell.textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                statusCell.classList.add(`status-${order.status.replace(' ', '-')}`);
            }

            if (isAdmin) {
                const actionsCell = row.insertCell();
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer';
                deleteButton.className = 'action-button delete-btn';
                deleteButton.onclick = () => deleteOrder(order.id);
                actionsCell.appendChild(deleteButton);
            } else if (actionsHeader.style.display !== 'none') {
                row.insertCell().textContent = ''; // Placeholder if actions column visible but no actions for user
            }
        });
    }

    function updateOrderStatus(orderId, newStatus) {
        const orderIndex = currentOrderData.findIndex(o => o.id === orderId);
        if (orderIndex > -1) {
            currentOrderData[orderIndex].status = newStatus;
            saveOrderDataToLocalStorage();
            renderOrderTable(); // Re-render to reflect status color change and selection
            showToast(`Statut de la commande ${orderId} mis à jour.`, 'info');
        }
    }

    function openAddForm() {
        formTitle.textContent = 'Ajouter une Commande';
        orderForm.reset();
        document.getElementById('orderId').value = ''; // Clear any potential ID from previous edits if form was reused
        document.getElementById('orderDate').valueAsDate = new Date(); // Default to today
        document.getElementById('formErrorOrder').textContent = '';
        orderFormContainer.style.display = 'flex';
    }

    function closeForm() {
        orderFormContainer.style.display = 'none';
        orderForm.reset();
        document.getElementById('formErrorOrder').textContent = '';
    }

    function saveOrder(event) {
        event.preventDefault();
        const client = document.getElementById('orderClient').value.trim();
        const date = document.getElementById('orderDate').value;
        const amount = parseFloat(document.getElementById('orderAmount').value);
        const status = document.getElementById('orderStatusModal').value;
        const formError = document.getElementById('formErrorOrder');
        formError.textContent = '';

        if (!client || !date || isNaN(amount) || amount < 0) {
            // formError.textContent = 'Veuillez remplir tous les champs correctement.';
            showToast('Veuillez remplir tous les champs correctement.', 'error');
            return;
        }

        // For MVP, adding new order only. Editing could be added similarly to other modules.
        const newOrderId = `CMD${String(Date.now()).slice(-5)}${String(currentOrderData.length + 1).padStart(3,'0')}`;
        currentOrderData.push({ id: newOrderId, client, date, status, amount });
        
        saveOrderDataToLocalStorage();
        renderOrderTable();
        closeForm();
        showToast(`Commande ${newOrderId} ajoutée avec succès!`, 'success');
    }

    function deleteOrder(orderId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            currentOrderData = currentOrderData.filter(o => o.id !== orderId);
            saveOrderDataToLocalStorage();
            renderOrderTable();
            showToast(`Commande ${orderId} supprimée avec succès!`, 'success');
        }
    }

    // Event Listeners
    if (addOrderBtn && isAdmin) {
        addOrderBtn.addEventListener('click', openAddForm);
    }
    if (closeButton) {
        closeButton.addEventListener('click', closeForm);
    }
    if (orderForm && isAdmin) { // Only admin can submit the add order form
        orderForm.addEventListener('submit', saveOrder);
    }
    
    window.onclick = function(event) {
        if (event.target === orderFormContainer) {
            closeForm();
        }
    }

    // Initial render
    renderOrderTable();

    if (refreshOrdersButton) {
        refreshOrdersButton.addEventListener('click', () => {
            loadOrderDataFromLocalStorage(); // Reload data
            renderOrderTable();
        });
    }
}); 