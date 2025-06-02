document.addEventListener('DOMContentLoaded', () => {
    protectPage();
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    // DOM Elements
    const employeeTableBody = document.getElementById('employeeTableBody');
    const loadingMessage = document.getElementById('loadingMessageEmployee');
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const employeeFormContainer = document.getElementById('employeeFormContainer');
    const employeeForm = document.getElementById('employeeForm');
    const formTitle = document.getElementById('formTitleEmployee');
    const closeButton = document.querySelector('#employeeFormContainer .close-button');
    const actionsHeader = document.getElementById('actionsHeaderEmployee');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutButton = document.getElementById('logoutButton');
    const accessDeniedMessage = document.getElementById('accessDeniedMessageEmployee');
    const employeeSearchInput = document.getElementById('employeeSearch');
    const employeeRoleInput = document.getElementById('employeeRole');
    const employeePasswordInput = document.getElementById('employeePassword');
    const confirmEmployeePasswordInput = document.getElementById('confirmEmployeePassword');

    if (usernameDisplay) usernameDisplay.textContent = loggedInUser.username;
    if (logoutButton) logoutButton.addEventListener('click', logoutUser);

    const LOCAL_STORAGE_EMPLOYEES_KEY = 'servup_currentEmployees';

    // Role-based access control
    const canManageEmployees = checkUserRole(['admin', 'responsable_employes']);
    const canViewEmployees = checkUserRole(['admin', 'responsable_employes', 'employe']);

    if (!canViewEmployees) {
        if (employeeTableBody) employeeTableBody.innerHTML = '';
        if (loadingMessage) loadingMessage.style.display = 'none';
        if (addEmployeeBtn) addEmployeeBtn.style.display = 'none';
        if (employeeSearchInput) employeeSearchInput.style.display = 'none';
        if (accessDeniedMessage) accessDeniedMessage.style.display = 'block';
        const navEmployeesLink = document.getElementById('navEmployees');
        if (navEmployeesLink && navEmployeesLink.parentElement) navEmployeesLink.parentElement.style.display = 'none';
        return; 
    }

    if (canManageEmployees) {
        if (addEmployeeBtn) addEmployeeBtn.style.display = 'inline-block';
        if (actionsHeader) actionsHeader.style.display = 'table-cell';
    }

    let currentEditingEmployeeId = null;
    let currentEmployeeData = [];

    function saveEmployeeDataToLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_EMPLOYEES_KEY, JSON.stringify(currentEmployeeData));
    }

    function loadEmployeeDataFromLocalStorage() {
        const storedData = localStorage.getItem(LOCAL_STORAGE_EMPLOYEES_KEY);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                if (Array.isArray(parsedData)) {
                    currentEmployeeData = parsedData;
                } else {
                    console.warn('Employee data in localStorage was not an array. Initializing with default.');
                    currentEmployeeData = [ ...mockEmployees ];
                    saveEmployeeDataToLocalStorage();
                }
            } catch (error) {
                console.error('Error parsing employee data from localStorage:', error);
                currentEmployeeData = [ ...mockEmployees ];
                saveEmployeeDataToLocalStorage();
            }
        } else {
            currentEmployeeData = [ ...mockEmployees ]; 
            saveEmployeeDataToLocalStorage();
        }
    }
    
    loadEmployeeDataFromLocalStorage();

    function renderEmployeeTable(searchTerm = '') {
        if (!employeeTableBody) return;
        employeeTableBody.innerHTML = ''; 

        if (loadingMessage) {
            loadingMessage.textContent = 'Chargement des employés...';
            loadingMessage.style.display = 'block';
        }

        const filteredData = currentEmployeeData.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            emp.position.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredData.length === 0) {
            if (loadingMessage) {
                loadingMessage.textContent = searchTerm ? 'Aucun employé ne correspond à votre recherche.' : 'Aucun employé enregistré. Ajoutez des employés pour les voir ici.';
            }
            return;
        }
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }

        filteredData.forEach(emp => {
            const row = employeeTableBody.insertRow();
            row.insertCell().textContent = emp.name;
            row.insertCell().textContent = emp.position;
            row.insertCell().textContent = emp.status;
            row.insertCell().textContent = emp.role;

            if (canManageEmployees) {
                const actionsCell = row.insertCell();
                const editButton = document.createElement('button');
                editButton.textContent = 'Modifier';
                editButton.className = 'action-button edit-btn';
                editButton.onclick = () => openEditForm(emp.id);
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Supprimer';
                deleteButton.className = 'action-button delete-btn';
                deleteButton.onclick = () => deleteEmployee(emp.id);
                actionsCell.appendChild(deleteButton);
            } else if (actionsHeader.style.display !== 'none') {
                 row.insertCell().textContent = '';
            }
        });
    }

    function populateRoleDropdown() {
        if (!employeeRoleInput) return;
        employeeRoleInput.innerHTML = '';

        const currentUserRole = loggedInUser.role;
        let availableRoles = [];

        if (currentUserRole === 'admin') {
            availableRoles = ['admin', 'responsable_stocks', 'responsable_employes', 'employe'];
        } else if (currentUserRole === 'responsable_employes') {
            availableRoles = ['employe'];
        }

        availableRoles.forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role.charAt(0).toUpperCase() + role.slice(1);
            employeeRoleInput.appendChild(option);
        });
    }

    function openAddForm() {
        currentEditingEmployeeId = null;
        formTitle.textContent = 'Ajouter un Employé';
        employeeForm.reset();
        populateRoleDropdown();
        if (employeePasswordInput) employeePasswordInput.required = true;
        if (confirmEmployeePasswordInput) confirmEmployeePasswordInput.required = true;
        document.getElementById('formErrorEmployee').textContent = '';
        employeeFormContainer.style.display = 'flex';
    }

    function openEditForm(employeeId) {
        const emp = currentEmployeeData.find(e => e.id === employeeId);
        if (emp) {
            currentEditingEmployeeId = emp.id;
            formTitle.textContent = 'Modifier l\'Employé';
            document.getElementById('employeeId').value = emp.id;
            document.getElementById('employeeName').value = emp.name;
            document.getElementById('employeePosition').value = emp.position;
            document.getElementById('employeeStatus').value = emp.status;
            
            populateRoleDropdown();
            if(employeeRoleInput) employeeRoleInput.value = emp.role;
            
            if (employeePasswordInput) {
                employeePasswordInput.value = ''; 
                employeePasswordInput.required = false;
                employeePasswordInput.placeholder = "Laissez vide pour ne pas changer";
            }
            if (confirmEmployeePasswordInput) {
                confirmEmployeePasswordInput.value = '';
                confirmEmployeePasswordInput.required = false;
                 confirmEmployeePasswordInput.placeholder = "Laissez vide pour ne pas changer";
            }

            document.getElementById('formErrorEmployee').textContent = '';
            employeeFormContainer.style.display = 'flex';
        }
    }

    function closeForm() {
        employeeFormContainer.style.display = 'none';
        employeeForm.reset();
        document.getElementById('formErrorEmployee').textContent = '';
    }

    function saveEmployee(event) {
        event.preventDefault();
        const name = document.getElementById('employeeName').value.trim();
        const position = document.getElementById('employeePosition').value.trim();
        const status = document.getElementById('employeeStatus').value;
        const role = employeeRoleInput ? employeeRoleInput.value : 'employe';
        const password = employeePasswordInput ? employeePasswordInput.value : '';
        const confirmPassword = confirmEmployeePasswordInput ? confirmEmployeePasswordInput.value : '';
        const formError = document.getElementById('formErrorEmployee');
        formError.textContent = '';

        if (!name || !position || !role) {
            // formError.textContent = 'Veuillez remplir tous les champs obligatoires (Nom, Poste, Rôle).';
            showToast('Veuillez remplir tous les champs obligatoires (Nom, Poste, Rôle).', 'error');
            return;
        }

        if (currentEditingEmployeeId === null && !password) {
             // formError.textContent = 'Le mot de passe est requis pour un nouvel employé.';
             showToast('Le mot de passe est requis pour un nouvel employé.', 'error');
             if (employeePasswordInput) employeePasswordInput.required = true;
             if (confirmEmployeePasswordInput) confirmEmployeePasswordInput.required = true;
             return;
        }
        if (password && password !== confirmPassword) {
            // formError.textContent = 'Les mots de passe ne correspondent pas.';
            showToast('Les mots de passe ne correspondent pas.', 'error');
            return;
        }
        if (password && password.length < 4) {
            // formError.textContent = 'Le mot de passe doit comporter au moins 4 caractères.';
            showToast('Le mot de passe doit comporter au moins 4 caractères.', 'error');
            return;
        }

        let actionMessage = '';
        if (currentEditingEmployeeId) { 
            const index = currentEmployeeData.findIndex(e => e.id === currentEditingEmployeeId);
            if (index > -1) {
                const updatedEmployee = { 
                    ...currentEmployeeData[index], 
                    name, 
                    position, 
                    status, 
                    role 
                };
                if (password) {
                    updatedEmployee.password = password;
                } else {
                    updatedEmployee.password = currentEmployeeData[index].password;
                }
                currentEmployeeData[index] = updatedEmployee;
                actionMessage = 'Informations de l\'employé modifiées avec succès!';
            }
        } else { 
            const newId = currentEmployeeData.length > 0 ? Math.max(...currentEmployeeData.map(e => e.id)) + 1 : 1;
            currentEmployeeData.push({ id: newId, name, position, status, role, password: password });
            actionMessage = 'Nouvel employé ajouté avec succès!';
        }
        
        saveEmployeeDataToLocalStorage();
        renderEmployeeTable(employeeSearchInput ? employeeSearchInput.value : '');
        closeForm();
        if (actionMessage) {
            showToast(actionMessage, 'success');
        }
    }

    function deleteEmployee(employeeId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
            currentEmployeeData = currentEmployeeData.filter(e => e.id !== employeeId);
            saveEmployeeDataToLocalStorage();
            renderEmployeeTable(employeeSearchInput ? employeeSearchInput.value : '');
            showToast('Employé supprimé avec succès!', 'success');
        }
    }

    // Event Listeners
    if (addEmployeeBtn && canManageEmployees) {
        addEmployeeBtn.addEventListener('click', openAddForm);
    }
    if (closeButton) {
        closeButton.addEventListener('click', closeForm);
    }
    if (employeeForm && canManageEmployees) {
        employeeForm.addEventListener('submit', saveEmployee);
    }
    if (employeeSearchInput) {
        employeeSearchInput.addEventListener('input', (e) => {
            renderEmployeeTable(e.target.value);
        });
    }
    
    window.onclick = function(event) {
        if (event.target === employeeFormContainer) {
            closeForm();
        }
    }

    // Initial render
    renderEmployeeTable();
}); 