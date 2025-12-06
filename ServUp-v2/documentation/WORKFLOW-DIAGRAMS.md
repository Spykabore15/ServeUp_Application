# ServUp v2.0 - Workflow Diagrams

This document contains flowcharts and workflow diagrams for the main processes in ServUp v2.0. These diagrams are essential for understanding the system's operation and are required for the academic project report.

---

## 1. User Authentication and Login Workflow

This flowchart shows the complete user authentication process, from initial login attempt to successful authentication and token management.

```mermaid
flowchart TD
    A[User Opens Application] --> B{Already Authenticated?}
    B -->|Yes| C[Redirect to Dashboard]
    B -->|No| D[Display Login Page]
    
    D --> E[User Enters Credentials]
    E --> F[Frontend: Validate Input]
    F -->|Invalid Format| G[Show Validation Error]
    G --> E
    
    F -->|Valid| H[POST /api/auth/login]
    H --> I{Backend: User Exists?}
    I -->|No| J[Return 401: Invalid Credentials]
    J --> K[Frontend: Show Error Message]
    K --> E
    
    I -->|Yes| L{Account Active?}
    L -->|No| M[Return 403: Account Deactivated]
    M --> K
    
    L -->|Yes| N[Verify Password with bcrypt]
    N -->|Invalid| J
    N -->|Valid| O[Update last_login Timestamp]
    
    O --> P[Generate JWT Token]
    P --> Q[Return Token + User Data]
    Q --> R[Frontend: Store Token in localStorage]
    R --> S[Store User Data in Pinia Store]
    S --> T[Redirect to Dashboard]
    
    T --> U[Vue Router Guard: Check Authentication]
    U -->|Authenticated| V[Load Dashboard]
    V --> W[Fetch Dashboard Statistics]
    W --> X[Display Dashboard Based on Role]
    
    style A fill:#e1f5ff
    style D fill:#e1f5ff
    style T fill:#90EE90
    style V fill:#90EE90
    style J fill:#ffcccb
    style M fill:#ffcccb
```

---

## 2. Order Creation Workflow

This flowchart illustrates the complete order creation and processing workflow, including inventory updates and payment tracking.

```mermaid
flowchart TD
    A[User Navigates to Orders Page] --> B{User Role Check}
    B -->|Employee/Manager| C[Display Orders List]
    B -->|Unauthorized| D[Redirect to Dashboard]
    
    C --> E[User Clicks Create Order]
    E --> F[Display Order Form]
    F --> G[User Enters Customer Name]
    G --> H[User Selects Products]
    H --> I[User Enters Quantities]
    
    I --> J{Validate Quantities}
    J -->|Quantity > Stock| K[Show Error: Insufficient Stock]
    K --> I
    J -->|Valid| L[Calculate Order Total]
    
    L --> M[User Confirms Order]
    M --> N[POST /api/orders]
    N --> O[Backend: Validate Request]
    O -->|Invalid| P[Return 400: Validation Error]
    P --> Q[Frontend: Display Error]
    Q --> F
    
    O -->|Valid| R[Create Order Record]
    R --> S[Set Status: 'pending']
    S --> T[Generate Order Number]
    T --> U[Get Current User Employee ID]
    
    U --> V[Create Order Items]
    V --> W[For Each Item:]
    W --> X[Check Product Availability]
    X -->|Insufficient Stock| Y[Return Error: Product Unavailable]
    Y --> Q
    
    X -->|Available| Z[Create Order Item]
    Z --> AA[Store Product Snapshot]
    AA --> AB[Calculate Subtotal]
    AB --> AC[Add to Order Total]
    AC --> AD{More Items?}
    AD -->|Yes| W
    AD -->|No| AE[Update Order Total Amount]
    
    AE --> AF[Set Payment Status: 'unpaid']
    AF --> AG[Save Order to Database]
    AG --> AH[Return Order with Items]
    AH --> AI[Frontend: Display Success Message]
    AI --> AJ[Redirect to Orders List]
    AJ --> AK[Update Orders List]
    
    AK --> AL{Update Inventory?}
    AL -->|Order Status: completed| AM[Deduct Stock Quantities]
    AM --> AN[Update Product Quantities]
    AN --> AO[Check Low Stock Thresholds]
    AO --> AP[Trigger Low Stock Alerts if Needed]
    
    style A fill:#e1f5ff
    style M fill:#fff4e1
    style AG fill:#90EE90
    style AI fill:#90EE90
    style K fill:#ffcccb
    style P fill:#ffcccb
    style Y fill:#ffcccb
```

---

## 3. Employee Management Workflow (Admin/HR Manager)

This flowchart shows the employee management workflow including creation, updating, and deletion processes with role-based access control.

```mermaid
flowchart TD
    A[Admin/HR Manager Navigates to Employees] --> B{Check User Role}
    B -->|Not Authorized| C[Redirect to Dashboard]
    B -->|Authorized| D[Display Employees List]
    
    D --> E[User Action Selection]
    E -->|View| F[Display Employee Details]
    E -->|Create| G[Click Add Employee]
    E -->|Edit| H[Click Edit Employee]
    E -->|Delete| I[Click Delete Employee]
    E -->|Search/Filter| J[Enter Search Criteria]
    
    J --> K[Filter Employees List]
    K --> D
    
    G --> L[Display Employee Form]
    L --> M[User Enters Employee Data]
    M --> N{Validate Required Fields}
    N -->|Invalid| O[Show Validation Errors]
    O --> M
    
    N -->|Valid| P[POST /api/employees]
    P --> Q[Backend: Check Role Authorization]
    Q -->|Unauthorized| R[Return 403: Forbidden]
    R --> S[Frontend: Show Error]
    
    Q -->|Authorized| T[Validate Input Data]
    T -->|Invalid| U[Return 400: Validation Error]
    U --> S
    
    T -->|Valid| V[Check Email Uniqueness]
    V -->|Duplicate| W[Return 400: Email Exists]
    W --> S
    
    V -->|Unique| X[Create Employee Record]
    X --> Y[Set Status: 'active']
    Y --> Z[Save to Database]
    Z --> AA[Return Created Employee]
    AA --> AB[Frontend: Show Success Message]
    AB --> AC[Refresh Employees List]
    
    H --> AD[Load Employee Data]
    AD --> AE[Display Edit Form with Data]
    AE --> AF[User Modifies Data]
    AF --> AG[PUT /api/employees/:id]
    AG --> Q
    
    AG -->|Authorized & Valid| AH[Update Employee Record]
    AH --> AI[Save Changes to Database]
    AI --> AJ[Return Updated Employee]
    AJ --> AB
    
    I --> AK[Confirm Deletion]
    AK -->|Cancel| D
    AK -->|Confirm| AL[DELETE /api/employees/:id]
    AL --> Q
    
    AL -->|Authorized| AM[Check Employee in Use]
    AM -->|Has Orders| AN[Return Error: Cannot Delete]
    AN --> S
    
    AM -->|Not in Use| AO[Delete Employee Record]
    AO --> AP[Return Success]
    AP --> AB
    
    style A fill:#e1f5ff
    style Z fill:#90EE90
    style AI fill:#90EE90
    style AB fill:#90EE90
    style R fill:#ffcccb
    style U fill:#ffcccb
    style W fill:#ffcccb
    style AN fill:#ffcccb
```

---

## 4. Product Management Workflow (Admin/Stock Manager)

This flowchart illustrates the product and inventory management process, including stock tracking, low-stock alerts, and supplier relationships.

```mermaid
flowchart TD
    A[Admin/Stock Manager Navigates to Products] --> B{Check User Role}
    B -->|Not Authorized| C[Redirect to Dashboard]
    B -->|Authorized| D[Display Products List]
    
    D --> E[Load Products with Filters]
    E --> F[Display: Name, Category, Quantity, Threshold, Supplier]
    F --> G[Check for Low Stock Items]
    G -->|Quantity <= Threshold| H[Highlight in Red/Yellow]
    G -->|Quantity > Threshold| I[Normal Display]
    
    D --> J[User Action Selection]
    J -->|Create| K[Click Add Product]
    J -->|Edit| L[Click Edit Product]
    J -->|Delete| M[Click Delete Product]
    J -->|View Low Stock| N[Click Low Stock Filter]
    
    N --> O[GET /api/products/low-stock]
    O --> P[Backend: Query Products]
    P --> Q[Filter: quantity <= threshold]
    Q --> R[Return Low Stock Products]
    R --> D
    
    K --> S[Display Product Form]
    S --> T[User Enters Product Data]
    T --> U[Select Category from Dropdown]
    U --> V[Select Supplier from Dropdown]
    V --> W[Enter Quantity & Threshold]
    W --> X[Enter Price per Unit]
    
    X --> Y{Validate Data}
    Y -->|Invalid| Z[Show Validation Errors]
    Z --> T
    
    Y -->|Valid| AA[POST /api/products]
    AA --> AB[Backend: Check Role Authorization]
    AB -->|Unauthorized| AC[Return 403: Forbidden]
    
    AB -->|Authorized| AD[Validate Input]
    AD -->|Invalid| AE[Return 400: Validation Error]
    
    AD -->|Valid| AF[Check SKU Uniqueness]
    AF -->|Duplicate| AG[Return 400: SKU Exists]
    
    AF -->|Unique| AH[Create Product Record]
    AH --> AI[Set is_active: true]
    AI --> AJ[Link to Category]
    AJ --> AK[Link to Supplier]
    AK --> AL[Save to Database]
    AL --> AM[Return Created Product]
    AM --> AN[Frontend: Show Success]
    AN --> AO[Refresh Products List]
    
    L --> AP[Load Product Data]
    AP --> AQ[Display Edit Form]
    AQ --> AR[User Updates Quantity]
    AR --> AS[PUT /api/products/:id]
    AS --> AB
    
    AS -->|Authorized & Valid| AT[Update Product Record]
    AT --> AU{Quantity Changed?}
    AU -->|Yes| AV[Check if Below Threshold]
    AV -->|Below| AW[Trigger Low Stock Alert]
    AV -->|Above| AX[No Alert Needed]
    AU -->|No| AX
    
    AW --> AY[Save Changes]
    AX --> AY
    AY --> AZ[Return Updated Product]
    AZ --> AN
    
    M --> BA[Confirm Deletion]
    BA -->|Cancel| D
    BA -->|Confirm| BB[DELETE /api/products/:id]
    BB --> AB
    
    BB -->|Authorized| BC[Check Product in Orders]
    BC -->|Has Order Items| BD[Soft Delete: Set is_active = false]
    BC -->|No Orders| BE[Hard Delete or Soft Delete]
    
    BD --> BF[Return Success]
    BE --> BF
    BF --> AN
    
    style A fill:#e1f5ff
    style AL fill:#90EE90
    style AY fill:#90EE90
    style AN fill:#90EE90
    style H fill:#fff4e1
    style AC fill:#ffcccb
    style AE fill:#ffcccb
    style AG fill:#ffcccb
```

---

## 5. Role-Based Access Control (RBAC) Workflow

This flowchart demonstrates how the system enforces role-based access control at both frontend and backend levels.

```mermaid
flowchart TD
    A[User Makes Request] --> B{Request Type?}
    B -->|Navigation| C[Vue Router Guard]
    B -->|API Call| D[Frontend: Check Token]
    
    C --> E{Has Valid Token?}
    E -->|No| F[Redirect to /login]
    E -->|Yes| G{Route Requires Auth?}
    G -->|No| H[Allow Access]
    G -->|Yes| I{User Role in Token?}
    
    I --> J{Route Has Role Requirements?}
    J -->|No| H
    J -->|Yes| K{User Role Matches?}
    K -->|No| L[Redirect to Dashboard]
    K -->|Yes| H
    
    D --> M{Token Valid?}
    M -->|No| N[Redirect to Login]
    M -->|Yes| O[Add Token to Request Header]
    O --> P[Send API Request]
    
    P --> Q[Backend: Auth Middleware]
    Q --> R{Token Present?}
    R -->|No| S[Return 401: Unauthorized]
    R -->|Yes| T[Verify JWT Token]
    
    T -->|Invalid/Expired| U[Return 401: Invalid Token]
    T -->|Valid| V[Extract User Info from Token]
    V --> W[Attach User to Request Object]
    
    W --> X{Route Has Role Middleware?}
    X -->|No| Y[Continue to Controller]
    X -->|Yes| Z[Role Middleware: Check Required Roles]
    
    Z --> AA{User Role in Allowed Roles?}
    AA -->|No| AB[Return 403: Forbidden]
    AA -->|Yes| Y
    
    Y --> AC[Controller: Process Request]
    AC --> AD[Return Response]
    AD --> AE[Frontend: Handle Response]
    
    AE --> AF{Response Status?}
    AF -->|401| AG[Clear Token & Redirect to Login]
    AF -->|403| AH[Show Error: Access Denied]
    AF -->|200/201| AI[Update UI with Data]
    
    style A fill:#e1f5ff
    style H fill:#90EE90
    style Y fill:#90EE90
    style AI fill:#90EE90
    style S fill:#ffcccb
    style U fill:#ffcccb
    style AB fill:#ffcccb
    style AG fill:#fff4e1
    style AH fill:#fff4e1
```

---

## 6. API Request Processing Flow

This flowchart shows the complete flow of an API request from frontend to database and back, including validation, authentication, and error handling.

```mermaid
flowchart TD
    A[Frontend: User Action] --> B[Service Layer: Prepare Request]
    B --> C{Request Type?}
    C -->|GET| D[Axios GET Request]
    C -->|POST| E[Axios POST Request]
    C -->|PUT| F[Axios PUT Request]
    C -->|DELETE| G[Axios DELETE Request]
    
    D --> H{Requires Auth?}
    E --> H
    F --> H
    G --> H
    
    H -->|Yes| I[Add Authorization Header with JWT]
    H -->|No| J[Send Request Without Token]
    I --> K[Send Request to Backend]
    J --> K
    
    K --> L[Express Server Receives Request]
    L --> M[Request Logging Middleware]
    M --> N[Parse JSON Body]
    N --> O[Check Route]
    
    O --> P{Public Route?}
    P -->|Yes| Q[Skip Authentication]
    P -->|No| R[Auth Middleware]
    
    R --> S{Token Valid?}
    S -->|No| T[Return 401: Unauthorized]
    S -->|Yes| U[Extract User from Token]
    
    Q --> V{Has Role Middleware?}
    U --> V
    
    V -->|Yes| W[Check User Role]
    W -->|Not Authorized| X[Return 403: Forbidden]
    W -->|Authorized| Y[Continue to Validation]
    V -->|No| Y
    
    Y --> Z[Validation Middleware]
    Z --> AA{Input Valid?}
    AA -->|No| AB[Return 400: Validation Error]
    AA -->|Yes| AC[Controller Function]
    
    AC --> AD{Operation Type?}
    AD -->|Create| AE[Controller: Create Logic]
    AD -->|Read| AF[Controller: Read Logic]
    AD -->|Update| AG[Controller: Update Logic]
    AD -->|Delete| AH[Controller: Delete Logic]
    
    AE --> AI[Sequelize Model: Create]
    AF --> AJ[Sequelize Model: Find]
    AG --> AK[Sequelize Model: Update]
    AH --> AL[Sequelize Model: Delete]
    
    AI --> AM[Database Query]
    AJ --> AM
    AK --> AM
    AL --> AM
    
    AM --> AN[PostgreSQL Executes Query]
    AN --> AO{Query Success?}
    AO -->|No| AP[Database Error]
    AO -->|Yes| AQ[Return Data]
    
    AP --> AR[Controller: Handle Error]
    AR --> AS[Return 500: Server Error]
    
    AQ --> AT[Controller: Format Response]
    AT --> AU[Return JSON Response]
    
    AU --> AV[Frontend: Receive Response]
    AV --> AW{Response Status?}
    
    AW -->|200/201| AX[Update Pinia Store]
    AW -->|400| AY[Show Validation Errors]
    AW -->|401| AZ[Clear Auth & Redirect to Login]
    AW -->|403| BA[Show Access Denied Error]
    AW -->|404| BB[Show Not Found Error]
    AW -->|500| BC[Show Server Error]
    
    AX --> BD[Update UI Component]
    BD --> BE[User Sees Updated Data]
    
    style A fill:#e1f5ff
    style K fill:#fff4e1
    style AN fill:#cfe2ff
    style AU fill:#90EE90
    style BD fill:#90EE90
    style BE fill:#90EE90
    style T fill:#ffcccb
    style X fill:#ffcccb
    style AB fill:#ffcccb
    style AS fill:#ffcccb
```

---

## 7. System Architecture Flow

This flowchart illustrates the overall system architecture and data flow between different layers of the application.

```mermaid
flowchart TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Vue.js Frontend Application]
        C[Pinia State Management]
        D[Vue Router]
        E[Axios HTTP Client]
    end
    
    subgraph "Network Layer"
        F[HTTP/HTTPS Requests]
        G[JWT Tokens]
    end
    
    subgraph "Backend Server (Node.js + Express)"
        H[Express Server]
        I[CORS Middleware]
        J[Auth Middleware]
        K[Role Middleware]
        L[Validation Middleware]
        M[Controllers]
        N[Services]
    end
    
    subgraph "Data Layer"
        O[Sequelize ORM]
        P[Models]
        Q[Database Connection Pool]
    end
    
    subgraph "Database (PostgreSQL)"
        R[(PostgreSQL Database)]
        S[Users Table]
        T[Employees Table]
        U[Products Table]
        V[Orders Table]
        W[Other Tables...]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    E --> F
    F --> G
    G --> H
    
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N --> O
    
    O --> P
    P --> Q
    Q --> R
    
    R --> S
    R --> T
    R --> U
    R --> V
    R --> W
    
    W --> Q
    Q --> P
    P --> O
    O --> N
    N --> M
    M --> H
    H --> F
    F --> E
    E --> C
    C --> B
    B --> A
    
    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style H fill:#fff4e1
    style R fill:#cfe2ff
    style S fill:#cfe2ff
    style T fill:#cfe2ff
    style U fill:#cfe2ff
    style V fill:#cfe2ff
    style W fill:#cfe2ff
```

---

## 8. Dashboard Data Loading Workflow

This flowchart shows how the dashboard loads and displays data based on user roles.

```mermaid
flowchart TD
    A[User Logs In Successfully] --> B[Redirect to Dashboard]
    B --> C[Vue Router: Load DashboardView]
    C --> D[Component: Mounted]
    D --> E[Check User Role from Store]
    
    E --> F{Role?}
    F -->|admin| G[Load All Statistics]
    F -->|responsable_stocks| H[Load Stock-Related Stats]
    F -->|responsable_employes| I[Load Employee Stats]
    F -->|employe| J[Load Limited Stats]
    
    G --> K[GET /api/dashboard/stats]
    H --> K
    I --> K
    J --> K
    
    K --> L[Backend: Dashboard Controller]
    L --> M[Check User Role]
    M --> N{Build Stats Query}
    
    N -->|admin| O[Include All Data]
    N -->|stock_manager| P[Include Products, Suppliers, Orders]
    N -->|hr_manager| Q[Include Employees, Users]
    N -->|employe| R[Include Only Orders]
    
    O --> S[Query Database]
    P --> S
    Q --> S
    R --> S
    
    S --> T[Aggregate Statistics]
    T --> U[Calculate KPIs]
    U --> V[Format Response]
    V --> W[Return JSON Data]
    
    W --> X[Frontend: Receive Data]
    X --> Y[Update Dashboard Store]
    Y --> Z[Component: Render Statistics Cards]
    
    Z --> AA{Display Role-Specific Widgets}
    AA -->|admin| AB[Show All: Products, Employees, Orders, Revenue]
    AA -->|stock_manager| AC[Show: Products, Low Stock, Suppliers]
    AA -->|hr_manager| AD[Show: Employees, Active Staff, Reports]
    AA -->|employe| AE[Show: Recent Orders, Personal Stats]
    
    AB --> AF[Render Charts with Chart.js]
    AC --> AF
    AD --> AF
    AE --> AF
    
    AF --> AG[Display Dashboard to User]
    
    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style W fill:#90EE90
    style AG fill:#90EE90
```

---

## How to Use These Diagrams

### For Academic Report

1. **Copy the Mermaid code** from each diagram
2. **Use a Mermaid renderer** such as:
   - [Mermaid Live Editor](https://mermaid.live/) - Online tool
   - VS Code with Mermaid extension
   - GitHub/GitLab (renders Mermaid automatically)
   - Include in LaTeX/Word documents (convert to image first)

### Converting to Images

1. **Online Conversion:**
   - Go to [Mermaid Live Editor](https://mermaid.live/)
   - Paste the Mermaid code
   - Click "Export" → Save as PNG/SVG

2. **VS Code:**
   - Install "Markdown Preview Mermaid Support" extension
   - Preview the markdown file
   - Right-click diagram → Save as image

3. **Command Line:**
   - Install Mermaid CLI: `npm install -g @mermaid-js/mermaid-cli`
   - Convert: `mmdc -i diagram.mmd -o diagram.png`

### Including in Report

- **Figure 1:** User Authentication and Login Workflow
- **Figure 2:** Order Creation Workflow
- **Figure 3:** Employee Management Workflow
- **Figure 4:** Product Management Workflow
- **Figure 5:** Role-Based Access Control Workflow
- **Figure 6:** API Request Processing Flow
- **Figure 7:** System Architecture Flow
- **Figure 8:** Dashboard Data Loading Workflow

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Author:** ServUp Development Team

