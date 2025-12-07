# ServUp V2 - System Flowcharts

This document contains flowcharts for all major workflows in the ServUp v2.0 system. These diagrams can be rendered using Mermaid-compatible viewers or exported to visual diagramming tools.

---

## 1. Authentication & Login Flow

This flowchart shows the complete user authentication process using JWT tokens.

```mermaid
flowchart TD
    Start([User Opens Application]) --> CheckToken{Token exists<br/>in localStorage?}
    
    CheckToken -->|Yes| ValidateToken[Validate Token<br/>with Backend]
    CheckToken -->|No| ShowLogin[Show Login Page]
    
    ValidateToken --> TokenValid{Token Valid?}
    TokenValid -->|Yes| RedirectDashboard[Redirect to Dashboard]
    TokenValid -->|No| ShowLogin
    
    ShowLogin --> EnterCredentials[User Enters<br/>Username & Password]
    EnterCredentials --> SubmitForm[User Clicks Login]
    
    SubmitForm --> APICall[POST /api/auth/login<br/>with credentials]
    
    APICall --> BackendValidate[Backend:<br/>- Find user by username<br/>- Verify password with bcrypt]
    
    BackendValidate --> CredentialsValid{Credentials<br/>Valid?}
    
    CredentialsValid -->|No| ShowError[Show Error Message<br/>Invalid credentials]
    ShowError --> EnterCredentials
    
    CredentialsValid -->|Yes| CheckActive{User is_active<br/>= true?}
    
    CheckActive -->|No| ShowError2[Show Error:<br/>Account disabled]
    ShowError2 --> EnterCredentials
    
    CheckActive -->|Yes| GenerateJWT[Generate JWT Token<br/>with user data]
    
    GenerateJWT --> UpdateLogin[Update last_login<br/>timestamp]
    
    UpdateLogin --> StoreToken[Store Token & User<br/>in localStorage]
    
    StoreToken --> SetAuthState[Set Authentication State<br/>in Pinia Store]
    
    SetAuthState --> RedirectDashboard
    
    RedirectDashboard --> ProtectedRoute[Access Protected Route]
    
    ProtectedRoute --> IncludeToken[Include Token in<br/>Authorization Header]
    
    IncludeToken --> MiddlewareCheck[Backend Middleware:<br/>Verify JWT Token]
    
    MiddlewareCheck --> TokenValid2{Token Valid<br/>& Not Expired?}
    
    TokenValid2 -->|No| RedirectLogin[Redirect to Login]
    TokenValid2 -->|Yes| CheckRole{Role has<br/>permission?}
    
    CheckRole -->|No| Show403[Show 403 Forbidden]
    CheckRole -->|Yes| GrantAccess[Grant Access to Resource]
    
    GrantAccess --> End([End])
    RedirectLogin --> ShowLogin
    Show403 --> End
```

---

## 2. Order Creation Flow

This flowchart shows the complete process of creating a new order in the system.

```mermaid
flowchart TD
    Start([User Navigates to<br/>Orders Page]) --> CheckAuth{User<br/>Authenticated?}
    
    CheckAuth -->|No| RedirectLogin[Redirect to Login]
    CheckAuth -->|Yes| LoadProducts[Load Available Products<br/>from API]
    
    LoadProducts --> DisplayForm[Display Order Creation Form]
    
    DisplayForm --> EnterCustomer[User Enters:<br/>- Customer Name<br/>- Table Number]
    
    EnterCustomer --> AddItems[User Adds Items:<br/>- Select Product<br/>- Enter Quantity]
    
    AddItems --> CalculateTotal[Calculate Order Total:<br/>Sum of item subtotals]
    
    CalculateTotal --> DisplayTotal[Display Total Amount]
    
    DisplayTotal --> MoreItems{Add More<br/>Items?}
    
    MoreItems -->|Yes| AddItems
    MoreItems -->|No| ReviewOrder[Review Order Details]
    
    ReviewOrder --> SubmitOrder{Click<br/>Submit?}
    
    SubmitOrder -->|Cancel| DisplayForm
    SubmitOrder -->|Yes| ValidateForm[Frontend Validation:<br/>- Customer name required<br/>- At least one item<br/>- Quantities > 0]
    
    ValidateForm --> ValidationPass{Validation<br/>Passed?}
    
    ValidationPass -->|No| ShowErrors[Show Validation Errors]
    ShowErrors --> ReviewOrder
    
    ValidationPass -->|Yes| APICall[POST /api/orders<br/>with order data]
    
    APICall --> BackendValidate[Backend Validation:<br/>- Auth middleware<br/>- Input validation]
    
    BackendValidate --> CreateOrder[Create Order Record<br/>in Database]
    
    CreateOrder --> GenerateOrderNum[Generate Order Number<br/>CMD001, CMD002, etc.]
    
    GenerateOrderNum --> CreateItems[Create Order Items:<br/>For each item in order]
    
    CreateItems --> UpdateInventory{Update Product<br/>Inventory?}
    
    UpdateInventory -->|Yes| DecrementStock[Decrement Product Quantity<br/>in products table]
    
    DecrementStock --> CheckLowStock{Quantity <=<br/>Threshold?}
    
    CheckLowStock -->|Yes| LogLowStock[Log Low Stock Alert]
    
    CheckLowStock -->|No| CalculateOrderTotal
    UpdateInventory -->|No| CalculateOrderTotal
    
    CalculateOrderTotal[Calculate Total Amount<br/>from order items]
    
    CalculateOrderTotal --> UpdateOrderTotal[Update order.total_amount]
    
    UpdateOrderTotal --> AuditLog[Create Audit Log Entry]
    
    AuditLog --> ReturnSuccess[Return Success Response<br/>with order data]
    
    ReturnSuccess --> ShowSuccess[Show Success Message<br/>Order Created!]
    
    ShowSuccess --> RefreshList[Refresh Orders List]
    
    RefreshList --> End([End])
    
    RedirectLogin --> End
```

---

## 3. Product Management Flow

This flowchart shows the workflow for managing products (create, update, delete) with role-based access control.

```mermaid
flowchart TD
    Start([User Navigates to<br/>Products Page]) --> CheckAuth{User<br/>Authenticated?}
    
    CheckAuth -->|No| RedirectLogin[Redirect to Login]
    CheckAuth -->|Yes| CheckRole{User Role:<br/>Admin or<br/>Stock Manager?}
    
    CheckRole -->|No| ShowReadOnly[Show Products List<br/>Read-Only Mode]
    CheckRole -->|Yes| ShowFullAccess[Show Products List<br/>with CRUD Actions]
    
    ShowReadOnly --> End([End])
    
    ShowFullAccess --> UserAction{User Action?}
    
    UserAction -->|View| LoadProducts[Load Products from API<br/>GET /api/products]
    UserAction -->|Create| ShowCreateForm[Show Create Product Form]
    UserAction -->|Update| ShowEditForm[Show Edit Product Form]
    UserAction -->|Delete| ShowDeleteConfirm[Show Delete Confirmation]
    
    LoadProducts --> DisplayProducts[Display Products List<br/>with pagination]
    DisplayProducts --> End
    
    ShowCreateForm --> FillForm[User Fills Form:<br/>- Name, Description<br/>- Category, Supplier<br/>- Quantity, Unit<br/>- Price, Threshold<br/>- SKU, Expiration]
    
    FillForm --> ValidateCreate[Frontend Validation]
    
    ValidateCreate --> ValidationPass{Valid?}
    
    ValidationPass -->|No| ShowErrors[Show Validation Errors]
    ShowErrors --> FillForm
    
    ValidationPass -->|Yes| APICreate[POST /api/products<br/>with product data]
    
    APICreate --> BackendValidate[Backend:<br/>- Auth middleware<br/>- Role check<br/>- Input validation]
    
    BackendValidate --> CreateProduct[Create Product in Database]
    
    CreateProduct --> AuditLog[Create Audit Log]
    
    AuditLog --> ReturnSuccess[Return Success Response]
    
    ReturnSuccess --> ShowSuccess[Show Success Message]
    
    ShowSuccess --> RefreshList[Refresh Products List]
    RefreshList --> End
    
    ShowEditForm --> LoadProductData[Load Product Data<br/>GET /api/products/:id]
    
    LoadProductData --> PrefillForm[Prefill Form with<br/>Existing Data]
    
    PrefillForm --> EditFields[User Edits Fields]
    
    EditFields --> ValidateUpdate[Frontend Validation]
    
    ValidateUpdate --> ValidationPass2{Valid?}
    
    ValidationPass2 -->|No| ShowErrors2[Show Validation Errors]
    ShowErrors2 --> EditFields
    
    ValidationPass2 -->|Yes| APIUpdate[PUT /api/products/:id<br/>with updated data]
    
    APIUpdate --> BackendValidate2[Backend Validation]
    
    BackendValidate2 --> UpdateProduct[Update Product in Database]
    
    UpdateProduct --> AuditLog2[Create Audit Log]
    
    AuditLog2 --> ReturnSuccess2[Return Success Response]
    
    ReturnSuccess2 --> ShowSuccess2[Show Success Message]
    
    ShowSuccess2 --> RefreshList
    
    ShowDeleteConfirm --> ConfirmDelete{User<br/>Confirms?}
    
    ConfirmDelete -->|No| ShowFullAccess
    ConfirmDelete -->|Yes| APIDelete[DELETE /api/products/:id]
    
    APIDelete --> BackendValidate3[Backend:<br/>- Auth & Role check]
    
    BackendValidate3 --> SoftDelete[Set is_active = false<br/>Soft Delete]
    
    SoftDelete --> AuditLog3[Create Audit Log]
    
    AuditLog3 --> ReturnSuccess3[Return Success Response]
    
    ReturnSuccess3 --> ShowSuccess3[Show Success Message]
    
    ShowSuccess3 --> RefreshList
    
    RedirectLogin --> End
```

---

## 4. Employee Management Flow

This flowchart shows the workflow for managing employees, accessible only to Admin and HR Manager roles.

```mermaid
flowchart TD
    Start([User Navigates to<br/>Employees Page]) --> CheckAuth{User<br/>Authenticated?}
    
    CheckAuth -->|No| RedirectLogin[Redirect to Login]
    CheckAuth -->|Yes| CheckRole{User Role:<br/>Admin or<br/>HR Manager?}
    
    CheckRole -->|No| Show403[Show 403 Forbidden<br/>Access Denied]
    CheckRole -->|Yes| LoadEmployees[Load Employees from API<br/>GET /api/employees]
    
    LoadEmployees --> DisplayEmployees[Display Employees List<br/>with filters & pagination]
    
    DisplayEmployees --> UserAction{User Action?}
    
    UserAction -->|View Stats| LoadStats[GET /api/employees/stats]
    UserAction -->|Create| ShowCreateForm[Show Create Employee Form]
    UserAction -->|Update| ShowEditForm[Show Edit Employee Form]
    UserAction -->|Delete| ShowDeleteConfirm[Show Delete Confirmation]
    
    LoadStats --> DisplayStats[Display Employee Statistics]
    DisplayStats --> End([End])
    
    ShowCreateForm --> FillForm[User Fills Form:<br/>- First Name, Last Name<br/>- Position, Email<br/>- Phone, Hire Date<br/>- Salary, Address<br/>- Emergency Contact]
    
    FillForm --> ValidateCreate[Frontend Validation:<br/>- Required fields<br/>- Email format<br/>- Date validation]
    
    ValidateCreate --> ValidationPass{Valid?}
    
    ValidationPass -->|No| ShowErrors[Show Validation Errors]
    ShowErrors --> FillForm
    
    ValidationPass -->|Yes| APICreate[POST /api/employees<br/>with employee data]
    
    APICreate --> BackendValidate[Backend:<br/>- Auth middleware<br/>- Role check<br/>- Input validation]
    
    BackendValidate --> CreateEmployee[Create Employee in Database]
    
    CreateEmployee --> AuditLog[Create Audit Log Entry]
    
    AuditLog --> ReturnSuccess[Return Success Response]
    
    ReturnSuccess --> ShowSuccess[Show Success Message]
    
    ShowSuccess --> RefreshList[Refresh Employees List]
    RefreshList --> End
    
    ShowEditForm --> LoadEmployeeData[Load Employee Data<br/>GET /api/employees/:id]
    
    LoadEmployeeData --> PrefillForm[Prefill Form with<br/>Existing Data]
    
    PrefillForm --> EditFields[User Edits Fields]
    
    EditFields --> ValidateUpdate[Frontend Validation]
    
    ValidateUpdate --> ValidationPass2{Valid?}
    
    ValidationPass2 -->|No| ShowErrors2[Show Validation Errors]
    ShowErrors2 --> EditFields
    
    ValidationPass2 -->|Yes| APIUpdate[PUT /api/employees/:id<br/>with updated data]
    
    APIUpdate --> BackendValidate2[Backend Validation]
    
    BackendValidate2 --> UpdateEmployee[Update Employee in Database]
    
    UpdateEmployee --> AuditLog2[Create Audit Log]
    
    AuditLog2 --> ReturnSuccess2[Return Success Response]
    
    ReturnSuccess2 --> ShowSuccess2[Show Success Message]
    
    ShowSuccess2 --> RefreshList
    
    ShowDeleteConfirm --> ConfirmDelete{User<br/>Confirms?}
    
    ConfirmDelete -->|No| DisplayEmployees
    ConfirmDelete -->|Yes| APIDelete[DELETE /api/employees/:id]
    
    APIDelete --> BackendValidate3[Backend:<br/>- Auth & Role check]
    
    BackendValidate3 --> SetInactive[Set status = 'inactive'<br/>Soft Delete]
    
    SetInactive --> AuditLog3[Create Audit Log]
    
    AuditLog3 --> ReturnSuccess3[Return Success Response]
    
    ReturnSuccess3 --> ShowSuccess3[Show Success Message]
    
    ShowSuccess3 --> RefreshList
    
    RedirectLogin --> End
    Show403 --> End
```

---

## 5. Access Request Approval Flow

This flowchart shows the workflow for handling access requests from new users.

```mermaid
flowchart TD
    Start([New User Wants Access]) --> PublicForm[Public Access Request Form<br/>POST /api/access-requests]
    
    PublicForm --> FillRequest[User Fills Request:<br/>- Full Name<br/>- Email, Phone<br/>- Requested Role<br/>- Reason]
    
    FillRequest --> ValidateRequest[Frontend Validation]
    
    ValidateRequest --> ValidationPass{Valid?}
    
    ValidationPass -->|No| ShowErrors[Show Validation Errors]
    ShowErrors --> FillRequest
    
    ValidationPass -->|Yes| SubmitRequest[Submit Access Request]
    
    SubmitRequest --> CreateRequest[Create Request in Database<br/>status = 'pending']
    
    CreateRequest --> ShowThankYou[Show Thank You Message<br/>Request Submitted]
    
    ShowThankYou --> NotifyAdmin[Admin Notification<br/>New Request Available]
    
    NotifyAdmin --> AdminLogin[Admin Logs In]
    
    AdminLogin --> CheckRequests[Admin Checks<br/>Pending Requests<br/>GET /api/access-requests]
    
    CheckRequests --> DisplayRequests[Display Pending Requests List]
    
    DisplayRequests --> SelectRequest[Admin Selects Request]
    
    SelectRequest --> ReviewDetails[Review Request Details:<br/>- Full Name, Email<br/>- Requested Role<br/>- Reason]
    
    ReviewDetails --> AdminDecision{Admin Decision?}
    
    AdminDecision -->|Approve| ShowApproveForm[Show Approval Form]
    AdminDecision -->|Deny| ShowDenyForm[Show Denial Form]
    AdminDecision -->|Pending| DisplayRequests
    
    ShowApproveForm --> EnterNotes[Admin Enters Review Notes<br/>Optional]
    
    EnterNotes --> ConfirmApprove{Confirm<br/>Approval?}
    
    ConfirmApprove -->|Cancel| ReviewDetails
    ConfirmApprove -->|Yes| APIApprove[PUT /api/access-requests/:id/approve]
    
    APIApprove --> UpdateStatus[Update Request:<br/>- status = 'approved'<br/>- reviewed_by = admin_id<br/>- reviewed_at = now<br/>- review_notes]
    
    UpdateStatus --> CreateUser[Create User Account:<br/>- username from email<br/>- password from request<br/>- role = requested_role]
    
    CreateUser --> HashPassword[Hash Password with bcrypt]
    
    HashPassword --> SaveUser[Save User to Database]
    
    SaveUser --> AuditLog[Create Audit Log Entry]
    
    AuditLog --> NotifyUser[Notify User<br/>Account Created]
    
    NotifyUser --> ShowSuccess[Show Success Message<br/>Request Approved]
    
    ShowSuccess --> RefreshList[Refresh Requests List]
    
    RefreshList --> End([End])
    
    ShowDenyForm --> EnterDenyNotes[Admin Enters Denial Reason]
    
    EnterDenyNotes --> ConfirmDeny{Confirm<br/>Denial?}
    
    ConfirmDeny -->|Cancel| ReviewDetails
    ConfirmDeny -->|Yes| APIDeny[PUT /api/access-requests/:id/deny]
    
    APIDeny --> UpdateStatusDeny[Update Request:<br/>- status = 'denied'<br/>- reviewed_by = admin_id<br/>- reviewed_at = now<br/>- review_notes]
    
    UpdateStatusDeny --> AuditLog2[Create Audit Log Entry]
    
    AuditLog2 --> NotifyUserDeny[Notify User<br/>Request Denied]
    
    NotifyUserDeny --> ShowDenied[Show Message<br/>Request Denied]
    
    ShowDenied --> RefreshList
```

---

## 6. System Request Flow (API Call)

This flowchart shows the general flow of any API request through the system, including middleware and error handling.

```mermaid
flowchart TD
    Start([Frontend Makes API Request]) --> AddToken{Request Requires<br/>Authentication?}
    
    AddToken -->|Yes| IncludeToken[Add JWT Token to<br/>Authorization Header]
    AddToken -->|No| SendRequest[Send HTTP Request<br/>to Backend]
    
    IncludeToken --> SendRequest
    
    SendRequest --> RateLimit[Rate Limiter Middleware<br/>Check Request Rate]
    
    RateLimit --> RateExceeded{Rate Limit<br/>Exceeded?}
    
    RateExceeded -->|Yes| Return429[Return 429<br/>Too Many Requests]
    RateExceeded -->|No| SecurityHeaders[Security Headers Middleware<br/>Add Helmet headers]
    
    Return429 --> End([End])
    
    SecurityHeaders --> CORS[CORS Middleware<br/>Check Origin]
    
    CORS --> CORSValid{Origin<br/>Allowed?}
    
    CORSValid -->|No| Return403[Return 403<br/>CORS Error]
    CORSValid -->|Yes| SanitizeInput[Input Sanitization Middleware<br/>Sanitize request body]
    
    Return403 --> End
    
    SanitizeInput --> ParseBody[Parse Request Body<br/>JSON/URL-encoded]
    
    ParseBody --> AuthCheck{Route Requires<br/>Authentication?}
    
    AuthCheck -->|Yes| AuthMiddleware[Authentication Middleware<br/>Verify JWT Token]
    
    AuthMiddleware --> TokenValid{Token Valid<br/>& Not Expired?}
    
    TokenValid -->|No| Return401[Return 401<br/>Unauthorized]
    TokenValid -->|Yes| RoleCheck{Route Requires<br/>Specific Role?}
    
    Return401 --> End
    
    AuthCheck -->|No| ValidateInput
    
    RoleCheck -->|Yes| RoleMiddleware[Role Middleware<br/>Check User Role]
    
    RoleCheck -->|No| ValidateInput[Input Validation Middleware<br/>Validate request data]
    
    RoleMiddleware --> RoleValid{Role Has<br/>Permission?}
    
    RoleValid -->|No| Return403Role[Return 403<br/>Forbidden]
    RoleValid -->|Yes| ValidateInput
    
    Return403Role --> End
    
    ValidateInput --> ValidationPass{Validation<br/>Passed?}
    
    ValidationPass -->|No| Return400[Return 400<br/>Validation Errors]
    ValidationPass -->|Yes| Controller[Controller Function<br/>Business Logic]
    
    Return400 --> End
    
    Controller --> DatabaseOp[Database Operation<br/>via Sequelize ORM]
    
    DatabaseOp --> OpSuccess{Operation<br/>Successful?}
    
    OpSuccess -->|No| HandleError[Error Handler Middleware<br/>Catch & Format Error]
    
    HandleError --> LogError[Log Error to File<br/>winston logger]
    
    LogError --> ReturnError[Return Error Response<br/>500 or specific status]
    
    ReturnError --> End
    
    OpSuccess -->|Yes| AuditLog[Create Audit Log Entry<br/>if applicable]
    
    AuditLog --> FormatResponse[Format Success Response<br/>Standard format]
    
    FormatResponse --> Return200[Return 200 OK<br/>with data]
    
    Return200 --> FrontendReceive[Frontend Receives Response]
    
    FrontendReceive --> ProcessResponse[Process Response Data]
    
    ProcessResponse --> UpdateUI[Update UI/State]
    
    UpdateUI --> End
```

---

## 7. Dashboard Data Loading Flow

This flowchart shows how dashboard statistics are loaded and displayed.

```mermaid
flowchart TD
    Start([User Opens Dashboard]) --> CheckAuth{User<br/>Authenticated?}
    
    CheckAuth -->|No| RedirectLogin[Redirect to Login]
    CheckAuth -->|Yes| LoadDashboard[Load Dashboard View]
    
    LoadDashboard --> ParallelLoad[Parallel API Calls]
    
    ParallelLoad --> Call1[GET /api/dashboard/stats]
    ParallelLoad --> Call2[GET /api/dashboard/activity]
    ParallelLoad --> Call3[GET /api/products/low-stock]
    
    Call1 --> ProcessStats[Process Statistics Data]
    Call2 --> ProcessActivity[Process Activity Data]
    Call3 --> ProcessLowStock[Process Low Stock Data]
    
    ProcessStats --> DisplayStats[Display Statistics Cards:<br/>- Total Orders<br/>- Total Products<br/>- Total Employees<br/>- Low Stock Alerts]
    
    ProcessActivity --> DisplayActivity[Display Recent Activity:<br/>- Recent Orders<br/>- Recent Users<br/>- System Events]
    
    ProcessLowStock --> DisplayAlerts[Display Low Stock Alerts<br/>if any]
    
    DisplayStats --> WaitAll[Wait for All Requests]
    DisplayActivity --> WaitAll
    DisplayAlerts --> WaitAll
    
    WaitAll --> AllLoaded{All Data<br/>Loaded?}
    
    AllLoaded -->|No| ShowLoading[Show Loading Indicators]
    ShowLoading --> WaitAll
    
    AllLoaded -->|Yes| HideLoading[Hide Loading Indicators]
    
    HideLoading --> RenderCharts[Render Charts & Graphs<br/>if applicable]
    
    RenderCharts --> End([Dashboard Ready])
    
    RedirectLogin --> End
```

---

## Flowchart Usage Instructions

### Rendering Mermaid Flowcharts

1. **GitHub/GitLab**: These flowcharts will render automatically in markdown files
2. **VS Code**: Install "Markdown Preview Mermaid Support" extension
3. **Online**: Use https://mermaid.live/ to view and export
4. **Documentation Tools**: Most modern documentation tools support Mermaid

### Exporting to Visual Tools

To use these in draw.io, Lucidchart, or other tools:

1. Copy the flowchart logic
2. Recreate manually using the flowchart shapes
3. Use the decision points (diamonds) and process boxes (rectangles) as shown
4. Follow the flow from top to bottom

### Customization

You can modify these flowcharts by:
- Adding more decision points
- Including additional error handling
- Adding more detailed steps
- Including specific API endpoints
- Adding database operation details

---

**Version:** 1.0  
**Last Updated:** November 2024  
**Author:** ServUp Development Team

