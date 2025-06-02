const LOCAL_STORAGE_SUPPLIERS_KEY = 'servup_suppliers';
// let mockSuppliers = []; // This line is removed as mockSuppliers will be global from mockData.js

document.addEventListener('DOMContentLoaded', () => {
    protectPage();
    const loggedInUser = getLoggedInUser();

    if (loggedInUser) {
        document.getElementById('usernameDisplay').textContent = loggedInUser.username;
        setupSupplierPage(loggedInUser);
        loadAndRenderSuppliers();
    } else {
        logoutUser(); // Should redirect to login
    }

    // Modal handling (similar to stocks.js)
    const modal = document.getElementById('supplierFormContainer');
    const addSupplierBtn = document.getElementById('addSupplierBtn');
    const closeButton = modal.querySelector('.close-button');

    if (addSupplierBtn) {
        addSupplierBtn.onclick = function() {
            document.getElementById('formTitle').textContent = 'Ajouter un Fournisseur';
            document.getElementById('supplierForm').reset();
            document.getElementById('supplierId').value = '';
            document.getElementById('formError').textContent = '';
            document.getElementById('formError').style.display = 'none';
            modal.style.display = 'block';
        }
    }

    if (closeButton) {
        closeButton.onclick = function() {
            modal.style.display = 'none';
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    const supplierForm = document.getElementById('supplierForm');
    if (supplierForm) {
        supplierForm.addEventListener('submit', handleSupplierFormSubmit);
    }
    
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }
});

function setupSupplierPage(user) {
    const addSupplierBtn = document.getElementById('addSupplierBtn');
    const actionsHeader = document.getElementById('actionsHeader');
    // For now, let's assume 'manager' or 'admin' can add/edit/delete suppliers.
    // 'employe' might only have read access or no access depending on requirements.
    if (user.role === 'admin' || user.role === 'manager') {
        if (addSupplierBtn) addSupplierBtn.style.display = 'inline-block';
        if (actionsHeader) actionsHeader.style.display = 'table-cell'; 
    } else {
        if (addSupplierBtn) addSupplierBtn.style.display = 'none';
        if (actionsHeader) actionsHeader.style.display = 'none';
        // If regular employees should not see suppliers at all, redirect or show access denied more prominently.
        // For now, they can view but not edit.
    }
}

function getSuppliersFromLocalStorage() {
    const suppliersData = localStorage.getItem(LOCAL_STORAGE_SUPPLIERS_KEY);
    if (suppliersData) {
        try {
            return JSON.parse(suppliersData);
        } catch (e) {
            console.error('Error parsing suppliers from localStorage:', e);
            return []; // Return empty array on error
        }
    } else {
        // If no suppliers in localStorage, use the global mockSuppliers from mockData.js if available
        if (typeof mockSuppliers !== 'undefined' && mockSuppliers.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_SUPPLIERS_KEY, JSON.stringify(mockSuppliers));
            return [...mockSuppliers];
        }
        return []; // Default to empty array if nothing in localStorage and no mock data
    }
}

function saveSuppliersToLocalStorage(suppliers) {
    localStorage.setItem(LOCAL_STORAGE_SUPPLIERS_KEY, JSON.stringify(suppliers));
}

function loadAndRenderSuppliers() {
    const loadingMessage = document.getElementById('loadingMessage');
    const noSuppliersMessage = document.getElementById('noSuppliersMessage');
    const suppliersTableBody = document.getElementById('suppliersTableBody');
    const loggedInUser = getLoggedInUser();

    if (loadingMessage) loadingMessage.style.display = 'block';
    if (suppliersTableBody) suppliersTableBody.innerHTML = ''; // Clear existing rows

    // Simulate async loading if needed, for now direct fetch
    const suppliers = getSuppliersFromLocalStorage();

    if (loadingMessage) loadingMessage.style.display = 'none';

    if (suppliers.length === 0) {
        if (noSuppliersMessage) noSuppliersMessage.style.display = 'block';
    } else {
        if (noSuppliersMessage) noSuppliersMessage.style.display = 'none';
        suppliers.forEach(supplier => {
            const row = suppliersTableBody.insertRow();
            row.insertCell().textContent = supplier.name || 'N/A';
            row.insertCell().textContent = supplier.contactPerson || 'N/A';
            row.insertCell().textContent = supplier.email || 'N/A';
            row.insertCell().textContent = supplier.phone || 'N/A';
            row.insertCell().textContent = supplier.productsOffered || 'N/A';
            row.insertCell().textContent = supplier.references || 'N/A';

            const actionsCell = row.insertCell();
            if (loggedInUser && (loggedInUser.role === 'admin' || loggedInUser.role === 'manager')) {
                actionsCell.style.display = 'table-cell'; // Ensure visible based on earlier setup
                const editButton = document.createElement('button');
                editButton.textContent = 'Modifier';
                editButton.classList.add('action-button', 'edit-btn');
                editButton.onclick = () => loadSupplierForEdit(supplier.id);
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer';
                deleteButton.classList.add('action-button', 'delete-btn');
                deleteButton.onclick = () => deleteSupplier(supplier.id);
                actionsCell.appendChild(deleteButton);
            } else {
                actionsCell.style.display = 'none';
            }
        });
    }
}

function handleSupplierFormSubmit(event) {
    event.preventDefault();
    const formError = document.getElementById('formError');
    formError.textContent = '';
    formError.style.display = 'none';

    const supplierId = document.getElementById('supplierId').value;
    const supplier = {
        id: supplierId ? supplierId : Date.now().toString(), // Use existing ID for edit, new for add
        name: document.getElementById('supplierName').value.trim(),
        contactPerson: document.getElementById('contactPerson').value.trim(),
        email: document.getElementById('supplierEmail').value.trim(),
        phone: document.getElementById('supplierPhone').value.trim(),
        address: document.getElementById('supplierAddress').value.trim(),
        productsOffered: document.getElementById('productsOffered').value.trim(),
        references: document.getElementById('supplierReferences').value.trim(),
    };

    if (!supplier.name) {
        formError.textContent = 'Le nom du fournisseur est requis.';
        formError.style.display = 'block';
        return;
    }

    let suppliers = getSuppliersFromLocalStorage();
    if (supplierId) { // Editing existing supplier
        suppliers = suppliers.map(s => s.id === supplierId ? supplier : s);
    } else { // Adding new supplier
        suppliers.push(supplier);
    }
    saveSuppliersToLocalStorage(suppliers);
    loadAndRenderSuppliers();
    document.getElementById('supplierFormContainer').style.display = 'none';
}

function loadSupplierForEdit(supplierId) {
    const suppliers = getSuppliersFromLocalStorage();
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
        document.getElementById('formTitle').textContent = 'Modifier le Fournisseur';
        document.getElementById('supplierId').value = supplier.id;
        document.getElementById('supplierName').value = supplier.name || '';
        document.getElementById('contactPerson').value = supplier.contactPerson || '';
        document.getElementById('supplierEmail').value = supplier.email || '';
        document.getElementById('supplierPhone').value = supplier.phone || '';
        document.getElementById('supplierAddress').value = supplier.address || '';
        document.getElementById('productsOffered').value = supplier.productsOffered || '';
        document.getElementById('supplierReferences').value = supplier.references || '';
        document.getElementById('formError').textContent = '';
        document.getElementById('formError').style.display = 'none';
        document.getElementById('supplierFormContainer').style.display = 'block';
    }
}

function deleteSupplier(supplierId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
        let suppliers = getSuppliersFromLocalStorage();
        suppliers = suppliers.filter(s => s.id !== supplierId);
        saveSuppliersToLocalStorage(suppliers);
        loadAndRenderSuppliers();
    }
}

// Note: Ensure mockData.js includes a 'mockSuppliers' array for initial data if desired.
// Example in mockData.js:
// let mockSuppliers = [
//   {
//     id: 'sup1',
//     name: 'Ferme de la Vallée',
//     contactPerson: 'Jean Dupont',
//     email: 'jean.dupont@fermevallee.com',
//     phone: '0123456789',
//     address: '1 Rue de la Ferme, 75000 Campagne',
//     productsOffered: 'Légumes bio, Fruits de saison',
//     references: 'Fournisseur principal pour les légumes.'
//   }
// ]; 