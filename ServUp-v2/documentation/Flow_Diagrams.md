# Flow Diagrams - ServUp-v2

This document contains comprehensive flow diagrams for the ServUp-v2 application.

## Table of Contents
1. [Authentication Flow](#authentication-flow)
2. [Order Management Flow](#order-management-flow)
3. [Product Management Flow](#product-management-flow)
4. [Request Processing Flow](#request-processing-flow)
5. [Application Navigation Flow](#application-navigation-flow)

---

## Authentication Flow

### Login Flow

```mermaid
flowchart TD
    Start([User Opens Login Page]) --> Input[User Enters Username/Password]
    Input --> Validate{Validate Input}
    Validate -->|Invalid| Error1[Show Validation Error]
    Error1 --> Input
    Validate -->|Valid| Send[Send POST /api/auth/login]
    Send --> Sanitize[Sanitize Input Middleware]
    Sanitize --> ValidateInput[Validate Input Middleware]
    ValidateInput -->|Invalid| Error2[Return 400 Error]
    Error2 --> Input
    ValidateInput -->|Valid| FindUser[Find User by Username/Email]
    FindUser --> UserExists{User Exists?}
    UserExists -->|No| InvalidCred[Return 401 Invalid Credentials]
    InvalidCred --> Input
    UserExists -->|Yes| CheckStatus{Check User Status}
    CheckStatus -->|pending| PendingError[Return 403 Pending Approval]
    CheckStatus -->|rejected| RejectedError[Return 403 Rejected]
    CheckStatus -->|active| CheckActive{Is Active?}
    CheckActive -->|No| InactiveError[Return 403 Deactivated]
    CheckActive -->|Yes| VerifyPass[Verify Password with bcrypt]
    VerifyPass --> PassValid{Password Valid?}
    PassValid -->|No| InvalidCred
    PassValid -->|Yes| UpdateLogin[Update last_login Timestamp]
    UpdateLogin --> GenerateToken[Generate JWT Token]
    GenerateToken --> StoreToken[Store Token in localStorage]
    StoreToken --> Redirect[Redirect to Dashboard]
    Redirect --> End([User Logged In])
    
    PendingError --> Input
    RejectedError --> Input
    InactiveError --> Input
```

### Signup Request Flow

```mermaid
flowchart TD
    Start([User Opens Signup Form]) --> Input[User Fills Signup Form]
    Input --> Validate{Validate Input}
    Validate -->|Invalid| Error1[Show Validation Error]
    Error1 --> Input
    Validate -->|Valid| Send[Send POST /api/auth/signup]
    Send --> Sanitize[Sanitize Input Middleware]
    Sanitize --> ValidateInput[Validate Input Middleware]
    ValidateInput -->|Invalid| Error2[Return 400 Error]
    Error2 --> Input
    ValidateInput -->|Valid| CheckExists{User Already Exists?}
    CheckExists -->|Yes| ExistsError[Return 400 User Exists]
    CheckExists -->|No| CreateUser[Create User with status='pending']
    CreateUser --> HashPass[Hash Password via Model Hook]
    HashPass --> SaveUser[Save User to Database]
    SaveUser --> Success[Return 201 Success Message]
    Success --> Message[Show: Wait for Admin Approval]
    Message --> End([Signup Request Submitted])
    
    ExistsError --> Input
```

### Logout Flow

```mermaid
flowchart TD
    Start([User Clicks Logout]) --> GetToken[Get JWT Token from Header]
    GetToken --> TokenExists{Token Exists?}
    TokenExists -->|No| DirectLogout[Clear Local Storage]
    TokenExists -->|Yes| Blacklist[Add Token to Blacklist]
    Blacklist --> SetExpiry[Set Token Expiry Date]
    SetExpiry --> Cleanup{Cleanup Expired?}
    Cleanup -->|Yes| CleanExpired[Remove Expired Tokens]
    Cleanup -->|No| DirectLogout
    CleanExpired --> DirectLogout
    DirectLogout --> ClearUser[Clear User State]
    ClearUser --> Redirect[Redirect to Login]
    Redirect --> End([User Logged Out])
```

---

## Order Management Flow

### Create Order Flow

```mermaid
flowchart TD
    Start([User Creates New Order]) --> Input[Enter Order Details]
    Input --> Items[Add Order Items]
    Items --> Validate{Validate Order Data}
    Validate -->|Invalid| Error1[Show Validation Error]
    Error1 --> Input
    Validate -->|Valid| Auth[Check Authentication Middleware]
    Auth -->|Not Authenticated| AuthError[Return 401]
    AuthError --> Input
    Auth -->|Authenticated| Sanitize[Sanitize Input]
    Sanitize --> ValidateOrder[Validate Order Data]
    ValidateOrder -->|Invalid| Error2[Return 400]
    Error2 --> Input
    ValidateOrder -->|Valid| StartTransaction[Begin Database Transaction]
    StartTransaction --> CheckItems{Has Items?}
    CheckItems -->|No| Rollback1[Rollback Transaction]
    Rollback1 --> Error3[Return 400: Order must have items]
    Error3 --> Input
    CheckItems -->|Yes| GenerateOrderNum[Generate Order Number ORD-XXXXXX]
    GenerateOrderNum --> CalculateTotal[Calculate Total Amount]
    CalculateTotal --> CreateOrder[Create Order Record]
    CreateOrder --> LoopItems[For Each Item]
    LoopItems --> CreateItem[Create OrderItem Record]
    CreateItem --> MoreItems{More Items?}
    MoreItems -->|Yes| LoopItems
    MoreItems -->|No| Commit[Commit Transaction]
    Commit --> FetchOrder[Fetch Complete Order with Relations]
    FetchOrder --> Success[Return 201 with Order Data]
    Success --> UpdateUI[Update Frontend State]
    UpdateUI --> Refresh[Refresh Order List]
    Refresh --> End([Order Created Successfully])
    
    style StartTransaction fill:#e1f5ff
    style Commit fill:#d4edda
    style Rollback1 fill:#f8d7da
```

### Update Order Flow

```mermaid
flowchart TD
    Start([User Updates Order]) --> Select[Select Order to Update]
    Select --> Input[Modify Order Details]
    Input --> Validate{Validate Updated Data}
    Validate -->|Invalid| Error1[Show Validation Error]
    Error1 --> Input
    Validate -->|Valid| Auth[Check Authentication]
    Auth -->|Not Authenticated| AuthError[Return 401]
    AuthError --> Input
    Auth -->|Authenticated| FindOrder[Find Order by ID]
    FindOrder --> OrderExists{Order Exists?}
    OrderExists -->|No| NotFound[Return 404 Not Found]
    NotFound --> Input
    OrderExists -->|Yes| UpdateOrder[Update Order Record]
    UpdateOrder --> FetchUpdated[Fetch Updated Order with Relations]
    FetchUpdated --> Success[Return 200 with Updated Order]
    Success --> UpdateUI[Update Frontend State]
    UpdateUI --> End([Order Updated Successfully])
```

### Order Status Flow

```mermaid
stateDiagram-v2
    [*] --> pending: Order Created
    pending --> preparing: Start Preparation
    preparing --> completed: Order Ready
    preparing --> cancelled: Cancel Order
    pending --> cancelled: Cancel Order
    completed --> [*]: Order Fulfilled
    cancelled --> [*]: Order Cancelled
    
    note right of pending
        Initial state when order is created
    end note
    
    note right of preparing
        Order is being prepared
    end note
    
    note right of completed
        Order is ready/completed
    end note
```

---

## Product Management Flow

### Add Product Flow

```mermaid
flowchart TD
    Start([User Adds New Product]) --> Input[Fill Product Form]
    Input --> Validate{Validate Product Data}
    Validate -->|Invalid| Error1[Show Validation Error]
    Error1 --> Input
    Validate -->|Valid| CheckSKU{SKU Provided?}
    CheckSKU -->|Yes| CheckSKUExists{SKU Already Exists?}
    CheckSKUExists -->|Yes| SKUError[Return 400: SKU Exists]
    SKUError --> Input
    CheckSKUExists -->|No| CreateProduct
    CheckSKU -->|No| CreateProduct[Create Product Record]
    CreateProduct --> SetDefaults[Set Default Values]
    SetDefaults --> SaveProduct[Save to Database]
    SaveProduct --> FetchProduct[Fetch Product with Category & Supplier]
    FetchProduct --> Success[Return 201 with Product Data]
    Success --> UpdateUI[Update Product List]
    UpdateUI --> End([Product Added Successfully])
```

### Product Stock Management Flow

```mermaid
flowchart TD
    Start([Check Product Stock]) --> GetProduct[Get Product Data]
    GetProduct --> CheckQuantity{Check Quantity}
    CheckQuantity -->|quantity = 0| OutOfStock[Status: out_of_stock]
    CheckQuantity -->|quantity <= threshold| LowStock[Status: low_stock]
    CheckQuantity -->|quantity > threshold| InStock[Status: in_stock]
    OutOfStock --> Alert1[Show Alert: Out of Stock]
    LowStock --> Alert2[Show Alert: Low Stock Warning]
    InStock --> Normal[Display Normal Status]
    Alert1 --> End([Stock Status Determined])
    Alert2 --> End
    Normal --> End
```

---

## Request Processing Flow

### API Request Middleware Chain

```mermaid
flowchart TD
    Start([Incoming HTTP Request]) --> CORS[CORS Middleware]
    CORS --> BodyParser[Body Parser Middleware]
    BodyParser --> RouteMatch{Route Matched?}
    RouteMatch -->|No| NotFound[Return 404 Not Found]
    RouteMatch -->|Yes| CheckAuth{Requires Auth?}
    CheckAuth -->|No| Sanitize
    CheckAuth -->|Yes| AuthMiddleware[Authentication Middleware]
    AuthMiddleware --> ExtractToken[Extract JWT Token]
    ExtractToken --> CheckBlacklist{Token Blacklisted?}
    CheckBlacklist -->|Yes| AuthError1[Return 401: Token Revoked]
    CheckBlacklist -->|No| VerifyToken[Verify JWT Token]
    VerifyToken --> TokenValid{Token Valid?}
    TokenValid -->|No| AuthError2[Return 401: Invalid Token]
    TokenValid -->|Yes| AttachUser[Attach User to Request]
    AttachUser --> CheckRole{Requires Role?}
    CheckRole -->|No| Sanitize[Sanitize Input Middleware]
    CheckRole -->|Yes| RoleMiddleware[Role Middleware]
    RoleMiddleware --> RoleCheck{User Has Required Role?}
    RoleCheck -->|No| RoleError[Return 403: Insufficient Permissions]
    RoleCheck -->|Yes| Sanitize
    Sanitize --> Validate[Validation Middleware]
    Validate --> Valid{Input Valid?}
    Valid -->|No| ValidationError[Return 400: Validation Error]
    Valid -->|Yes| RateLimit[Rate Limiter Middleware]
    RateLimit --> LimitCheck{Within Rate Limit?}
    LimitCheck -->|No| RateError[Return 429: Too Many Requests]
    LimitCheck -->|Yes| Controller[Execute Controller]
    Controller --> Success[Return Response]
    Success --> End([Request Complete])
    
    NotFound --> End
    AuthError1 --> End
    AuthError2 --> End
    RoleError --> End
    ValidationError --> End
    RateError --> End
```

### Authentication Middleware Detailed Flow

```mermaid
flowchart TD
    Start([Request with Authorization Header]) --> CheckHeader{Header Exists?}
    CheckHeader -->|No| Error1[Return 401: No Token]
    CheckHeader -->|Yes| Extract[Extract Bearer Token]
    Extract --> CheckFormat{Format Valid?}
    CheckFormat -->|No| Error2[Return 401: Invalid Format]
    CheckFormat -->|Yes| CheckBlacklist{Token Blacklisted?}
    CheckBlacklist -->|Yes| Error3[Return 401: Token Revoked]
    CheckBlacklist -->|No| Verify[Verify JWT Token]
    Verify --> Decode{Token Valid?}
    Decode -->|No| Error4[Return 401: Invalid/Expired]
    Decode -->|Yes| Attach[Attach User to req.user]
    Attach --> Next[Call next Middleware]
    Next --> End([Continue Request])
    
    Error1 --> End
    Error2 --> End
    Error3 --> End
    Error4 --> End
```

---

## Application Navigation Flow

### Frontend Router Flow

```mermaid
flowchart TD
    Start([User Navigates]) --> CheckAuth{Is Authenticated?}
    CheckAuth -->|No| CheckRoute{Route Requires Auth?}
    CheckRoute -->|Yes| RedirectLogin[Redirect to /login]
    CheckRoute -->|No| AllowAccess[Allow Access]
    CheckAuth -->|Yes| CheckLoginRoute{Is Login Route?}
    CheckLoginRoute -->|Yes| RedirectDashboard[Redirect to /dashboard]
    CheckLoginRoute -->|No| CheckRole{Route Requires Role?}
    CheckRole -->|No| AllowAccess
    CheckRole -->|Yes| CheckUserRole{User Has Required Role?}
    CheckUserRole -->|No| RedirectDashboard
    CheckUserRole -->|Yes| AllowAccess
    AllowAccess --> LoadComponent[Load Route Component]
    LoadComponent --> End([Page Loaded])
    RedirectLogin --> End
    RedirectDashboard --> End
```

### Role-Based Access Control

```mermaid
graph TB
    subgraph "User Roles"
        Admin[Admin]
        StockManager[Responsable Stocks]
        EmployeeManager[Responsable Employes]
        Employee[Employe]
    end
    
    subgraph "Accessible Routes"
        Admin --> AllRoutes[All Routes]
        StockManager --> Products[Products]
        StockManager --> Suppliers[Suppliers]
        StockManager --> Orders[Orders]
        StockManager --> Dashboard[Dashboard]
        StockManager --> Reports[Reports]
        EmployeeManager --> Employees[Employees]
        EmployeeManager --> Orders
        EmployeeManager --> Dashboard
        EmployeeManager --> Reports
        Employee --> Orders
        Employee --> Dashboard
    end
    
    style Admin fill:#ff6b6b
    style StockManager fill:#4ecdc4
    style EmployeeManager fill:#95e1d3
    style Employee fill:#ffe66d
```

---

## Order Processing Workflow

### Complete Order Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Auth
    participant DB
    participant Employee
    
    User->>Frontend: Create Order
    Frontend->>API: POST /api/orders
    API->>Auth: Verify Token
    Auth-->>API: User Authenticated
    API->>DB: Begin Transaction
    API->>DB: Create Order
    API->>DB: Create OrderItems
    API->>DB: Commit Transaction
    DB-->>API: Order Created
    API-->>Frontend: Return Order Data
    Frontend-->>User: Show Success
    
    User->>Frontend: Update Order Status
    Frontend->>API: PUT /api/orders/:id
    API->>DB: Update Order Status
    DB-->>API: Order Updated
    API-->>Frontend: Return Updated Order
    Frontend-->>User: Show Updated Status
    
    Note over Employee: Employee serves order
    Employee->>Frontend: Mark as Preparing
    Frontend->>API: PUT /api/orders/:id (status: preparing)
    API->>DB: Update Status
    DB-->>API: Updated
    API-->>Frontend: Success
    
    Employee->>Frontend: Mark as Completed
    Frontend->>API: PUT /api/orders/:id (status: completed)
    API->>DB: Update Status & Payment
    DB-->>API: Updated
    API-->>Frontend: Success
    Frontend-->>User: Order Completed
```

---

## Database Transaction Flow

### Order Creation with Transaction

```mermaid
flowchart TD
    Start([Create Order Request]) --> Begin[Begin Transaction]
    Begin --> CreateOrder[Create Order Record]
    CreateOrder --> OrderSuccess{Order Created?}
    OrderSuccess -->|No| Rollback1[Rollback Transaction]
    Rollback1 --> Error1[Return 500 Error]
    OrderSuccess -->|Yes| LoopItems[For Each Order Item]
    LoopItems --> CreateItem[Create OrderItem]
    CreateItem --> ItemSuccess{Item Created?}
    ItemSuccess -->|No| Rollback2[Rollback Transaction]
    Rollback2 --> Error2[Return 500 Error]
    ItemSuccess -->|Yes| MoreItems{More Items?}
    MoreItems -->|Yes| LoopItems
    MoreItems -->|No| Commit[Commit Transaction]
    Commit --> CommitSuccess{Commit Successful?}
    CommitSuccess -->|No| Error3[Return 500 Error]
    CommitSuccess -->|Yes| FetchData[Fetch Complete Order Data]
    FetchData --> Success[Return 201 Success]
    Success --> End([Order Created])
    
    Error1 --> End
    Error2 --> End
    Error3 --> End
    
    style Begin fill:#e1f5ff
    style Commit fill:#d4edda
    style Rollback1 fill:#f8d7da
    style Rollback2 fill:#f8d7da
```

---

## Notes

### Key Points:

1. **Authentication**: All protected routes require JWT token validation
2. **Authorization**: Role-based access control (RBAC) is enforced at route level
3. **Data Validation**: Input sanitization and validation occur at multiple layers
4. **Transaction Safety**: Critical operations use database transactions
5. **Error Handling**: Comprehensive error handling at each layer
6. **Security**: Token blacklisting, rate limiting, and input sanitization

### Status Enums:

- **User Status**: `pending`, `active`, `inactive`, `rejected`
- **Order Status**: `pending`, `preparing`, `completed`, `cancelled`
- **Payment Status**: `unpaid`, `paid`, `refunded`
- **Employee Status**: `active`, `inactive`, `on_leave`
- **Product Stock Status**: `out_of_stock`, `low_stock`, `in_stock`

