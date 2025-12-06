# Diagram Creation Guide for ServUp v2.0 Report

This guide provides step-by-step instructions for creating all required diagrams for your academic project report.

## 📋 Table of Contents

1. [Recommended Tools](#recommended-tools)
2. [Diagram Types Required](#diagram-types-required)
3. [How to Create Each Diagram](#how-to-create-each-diagram)
4. [Export and Formatting Tips](#export-and-formatting-tips)
5. [Templates and Examples](#templates-and-examples)

---

## 🛠️ Recommended Tools

### **Option 1: draw.io (diagrams.net) - FREE & RECOMMENDED** ⭐

**Why Choose This:**
- ✅ Completely free
- ✅ Works in browser (no installation needed)
- ✅ Can also download desktop app
- ✅ Professional quality output
- ✅ Easy to use
- ✅ Export to PNG, SVG, PDF
- ✅ Academic-friendly

**How to Access:**
1. Go to: https://app.diagrams.net/ (or https://draw.io)
2. Choose where to save: Device, Google Drive, or OneDrive
3. Select a template or start blank
4. Start creating!

### **Option 2: Lucidchart - Professional but Paid**

**Features:**
- Professional templates
- Collaboration features
- More advanced features
- **Free tier available** (limited diagrams)

**Access:** https://www.lucidchart.com/

### **Option 3: Microsoft Visio** (If Available)

**Features:**
- Professional diagramming tool
- Microsoft Office integration
- Requires license

### **Option 4: PlantUML** (For Text-Based Diagrams)

**Features:**
- Code-based diagram creation
- Good for version control
- Requires learning syntax
- Free and open-source

**Access:** http://www.plantuml.com/

### **Option 5: Online Flowchart Tools**

- **Creately:** https://creately.com/
- **Whimsical:** https://whimsical.com/
- **Miro:** https://miro.com/

---

## 📊 Diagram Types Required

Based on your report structure, you need to create:

1. ✅ **System Architecture Diagram** (3-tier architecture)
2. ✅ **ERD (Entity-Relationship Diagram)** - Already exists at `images/ERD_diagram.png`
3. ✅ **Component Structure Diagram** (Vue.js components)
4. ✅ **Authentication Flow Diagram** (JWT login process)
5. ✅ **Workflow Diagrams:**
   - User Login Workflow
   - Order Creation Workflow
   - Employee Management Workflow

---

## 🎨 How to Create Each Diagram

### 1. System Architecture Diagram

**Purpose:** Show the overall system structure (Frontend, Backend, Database layers)

**What to Include:**
- Presentation Layer (Frontend: Vue.js 3)
- Business Logic Layer (Backend: Node.js/Express)
- Data Layer (Database: PostgreSQL)
- Docker containers
- Technologies used
- Data flow arrows

**Steps in draw.io:**

1. **Create New Diagram:**
   - Open draw.io
   - Select "Blank Diagram"
   - Name it "System Architecture"

2. **Add Layers (Use Containers/Rectangles):**
   ```
   ┌─────────────────────────────────────┐
   │   PRESENTATION LAYER                │
   │   Vue.js 3 + Vite                   │
   │   • LoginView                       │
   │   • DashboardView                   │
   │   • ProductsView                    │
   │   • Pinia Stores                    │
   └─────────────────────────────────────┘
              ↓ HTTP/REST API
   ┌─────────────────────────────────────┐
   │   BUSINESS LOGIC LAYER              │
   │   Node.js + Express.js              │
   │   • RESTful API                     │
   │   • Controllers                     │
   │   • Middleware (Auth, Validation)   │
   │   • JWT Authentication              │
   └─────────────────────────────────────┘
              ↓ SQL Queries
   ┌─────────────────────────────────────┐
   │   DATA LAYER                        │
   │   PostgreSQL (Docker)               │
   │   • Sequelize ORM                   │
   │   • 9 Tables                        │
   │   • Migrations & Seeders            │
   └─────────────────────────────────────┘
   ```

3. **Add Details:**
   - Include technologies (Vue.js, Express, PostgreSQL)
   - Add arrows showing data flow
   - Label connections (HTTP/REST, SQL)
   - Add Docker container notation

4. **Formatting:**
   - Use consistent colors for each layer
   - Add shadows for depth
   - Use clear, readable fonts (Arial, Calibri)
   - Keep it clean and professional

**Example Structure:**
```
┌─────────────────────────────────────────────┐
│         CLIENT (Web Browser)                │
│         http://localhost:5173               │
└──────────────────┬──────────────────────────┘
                   │ HTTPS
                   ↓
┌─────────────────────────────────────────────┐
│         FRONTEND LAYER                      │
│         Vue.js 3 Application                │
│  ┌─────────────┐  ┌─────────────┐          │
│  │   Router    │  │   Pinia     │          │
│  │ (Vue Router)│  │   Stores    │          │
│  └─────────────┘  └─────────────┘          │
│         Components & Views                  │
└──────────────────┬──────────────────────────┘
                   │ REST API (Axios)
                   ↓
┌─────────────────────────────────────────────┐
│         BACKEND LAYER                       │
│         Node.js + Express.js                │
│  ┌─────────────┐  ┌─────────────┐          │
│  │  Routes     │  │ Controllers │          │
│  └─────────────┘  └─────────────┘          │
│  ┌─────────────┐  ┌─────────────┐          │
│  │ Middleware  │  │  Validators │          │
│  │ (Auth, RBAC)│  │             │          │
│  └─────────────┘  └─────────────┘          │
└──────────────────┬──────────────────────────┘
                   │ SQL (Sequelize ORM)
                   ↓
┌─────────────────────────────────────────────┐
│         DATA LAYER (Docker Container)       │
│         PostgreSQL 16                       │
│  ┌─────────────────────────────────────┐   │
│  │         Database Tables             │   │
│  │  users, employees, products, etc.   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

### 2. ERD (Entity-Relationship Diagram)

**Status:** ✅ Already created at `images/ERD_diagram.png`

**If you need to recreate or improve it:**

1. **Use draw.io ERD Template:**
   - Open draw.io
   - File → New → Software → Entity Relationship

2. **Add All 9 Entities:**
   - Users, Employees, Products, Categories, Suppliers
   - Orders, OrderItems, WasteRecords, AuditLogs

3. **Add Attributes:**
   - Primary Keys (PK)
   - Foreign Keys (FK)
   - Regular attributes
   - Data types

4. **Add Relationships:**
   - One-to-Many (1:N)
   - One-to-One (1:1)
   - Use crow's foot notation

5. **Format:**
   - Use consistent colors
   - Clear labels
   - Proper cardinality notation

**You can also use:**
- **dbdiagram.io** - Excellent for ERD (https://dbdiagram.io/)
- **pgAdmin** - Can generate ERD from existing database
- **MySQL Workbench** - If you have the database exported

---

### 3. Component Structure Diagram

**Purpose:** Show Vue.js component hierarchy

**What to Include:**
- Root component (App.vue)
- Layout components (AppLayout)
- Views (LoginView, DashboardView, etc.)
- Reusable components
- Router relationships

**Steps in draw.io:**

1. **Create New Diagram:**
   - Select "Blank Diagram"
   - Name it "Component Structure"

2. **Structure:**
   ```
   App.vue (Root)
   ├── RouterView
   │   ├── LoginView (if not authenticated)
   │   └── AppLayout (if authenticated)
   │       ├── Navigation/Sidebar
   │       ├── Header
   │       └── RouterView (nested)
   │           ├── DashboardView
   │           ├── ProductsView
   │           ├── EmployeesView
   │           ├── OrdersView
   │           ├── SuppliersView
   │           ├── UsersView
   │           ├── ReportsView
   │           └── SettingsView
   ```

3. **Add Details:**
   - Show which components import which
   - Show props and events
   - Show Pinia store connections

**Example:**
```
┌──────────────────────┐
│      App.vue         │
│   (Root Component)   │
└──────────┬───────────┘
           │
           ↓
    ┌──────────────┐
    │  Vue Router  │
    └──────┬───────┘
           │
      ┌────┴────┐
      │         │
      ↓         ↓
┌──────────┐  ┌──────────────────────┐
│LoginView │  │    AppLayout.vue     │
│          │  │  ┌────────────────┐  │
│          │  │  │   SidebarNav   │  │
│          │  │  └────────────────┘  │
└──────────┘  │  ┌────────────────┐  │
              │  │  RouterView    │  │
              │  │  (Nested)      │  │
              │  └────────────────┘  │
              └──────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │Dashboard │  │ Products │  │Employees │
    │  View    │  │  View    │  │  View    │
    └──────────┘  └──────────┘  └──────────┘
```

---

### 4. Authentication Flow Diagram

**Purpose:** Show the JWT authentication process

**What to Include:**
- User login steps
- JWT token generation
- Token storage
- Protected route access
- Token validation

**Steps in draw.io:**

1. **Use Flowchart Template:**
   - Open draw.io
   - File → New → Flowchart → Basic Flowchart

2. **Create Flow:**
   ```
   Start
   ↓
   User enters credentials
   ↓
   Frontend sends POST /api/auth/login
   ↓
   Backend validates credentials
   ↓
   [Valid?]
   ├─ Yes → Generate JWT token
   │         ↓
   │       Store token (localStorage)
   │         ↓
   │       Redirect to Dashboard
   │         ↓
   │       Include token in API requests
   │         ↓
   │       Backend validates token
   │         ↓
   │       [Valid?]
   │       ├─ Yes → Grant access
   │       └─ No → Redirect to login
   │
   └─ No → Show error message
           ↓
         End
   ```

3. **Add Decision Points:**
   - Use diamond shapes for decisions
   - Use rectangles for processes
   - Use rounded rectangles for start/end

**Example Flowchart:**
```
    ┌──────────┐
    │   Start  │
    │ (Login   │
    │  Page)   │
    └─────┬────┘
          │
          ↓
    ┌─────────────────┐
    │ User enters     │
    │ username &      │
    │ password        │
    └─────┬───────────┘
          │
          ↓
    ┌─────────────────┐
    │ POST /api/auth/ │
    │     login       │
    │ (Axios request) │
    └─────┬───────────┘
          │
          ↓
    ┌─────────────────┐
    │ Backend:        │
    │ - Find user     │
    │ - Verify pwd    │
    │   (bcrypt)      │
    └─────┬───────────┘
          │
          ↓
    ┌───────────┐
    │ Valid?    │ ◄──┐
    └─────┬─────┘    │
      Yes │   No     │
          ↓          │
    ┌───────────┐   │
    │ Generate  │   │
    │ JWT Token │   │
    └─────┬─────┘   │
          │         │
          ↓         │
    ┌───────────┐   │
    │ Store in  │   │
    │localStorage│  │
    └─────┬─────┘   │
          │         │
          ↓         │
    ┌───────────┐   │
    │Redirect to│   │
    │ Dashboard │   │
    └─────┬─────┘   │
          │         │
          ↓         │
    ┌───────────┐   │
    │ API Request│  │
    │ + Token in │  │
    │  Header    │  │
    └─────┬─────┘   │
          │         │
          ↓         │
    ┌───────────┐   │
    │ Validate  │   │
    │  Token    │───┘
    └─────┬─────┘
      Valid │
          ↓
    ┌───────────┐
    │   Grant   │
    │  Access   │
    └───────────┘
```

---

### 5. Workflow Diagrams

#### A. User Login Workflow

Similar to Authentication Flow but more detailed:

```
┌─────────────┐
│ User opens  │
│ application │
└──────┬──────┘
       │
       ↓
┌──────────────────┐
│ Check localStorage│
│ for token        │
└──────┬───────────┘
       │
   ┌───┴───┐
   │Exists?│
   └───┬───┘
   Yes │  No
       │   │
       │   ↓
       │   ┌──────────────┐
       │   │ Show Login   │
       │   │    Page      │
       │   └──────┬───────┘
       │          │
       │          ↓
       │   ┌──────────────┐
       │   │ User enters  │
       │   │ credentials  │
       │   └──────┬───────┘
       │          │
       ↓          │
┌──────────────┐ │
│ Validate     │ │
│ token        │ │
│ (middleware) │ │
└──────┬───────┘ │
   Valid│        │
       │         │
       │         ↓
       │   ┌──────────────┐
       │   │ Submit form  │
       │   └──────┬───────┘
       │          │
       └──────────┘
             │
             ↓
      ┌──────────────┐
      │ API Call     │
      │ /auth/login  │
      └──────┬───────┘
             │
       ┌─────┴─────┐
    Success │  Error
       │    │     │
       │    │     ↓
       │    │  ┌──────────────┐
       │    │  │ Show error   │
       │    │  │ message      │
       │    │  └──────────────┘
       │    │
       ↓    │
┌──────────────┐
│ Store token  │
│ & redirect   │
│ to dashboard │
└──────────────┘
```

#### B. Order Creation Workflow

```
┌─────────────┐
│ Navigate to │
│ Orders Page │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Click "New  │
│   Order"    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Select      │
│ Customer/   │
│ Table       │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Add Items   │
│ (Products)  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Calculate   │
│ Total       │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Click       │
│ "Submit"    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ POST /api/  │
│   orders    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Backend:    │
│ - Create    │
│   order     │
│ - Create    │
│   items     │
│ - Update    │
│   inventory │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Success:    │
│ - Show      │
│   confirmation│
│ - Refresh   │
│   list      │
└─────────────┘
```

#### C. Employee Management Workflow

```
┌─────────────┐
│ HR Manager  │
│ logs in     │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Navigate to │
│ Employees   │
└──────┬──────┘
       │
       ↓
   ┌───┴───┐
   │Action?│
   └───┬───┘
       │
   ┌───┼───┬────────┐
   │   │   │        │
Create│View│Update  │Delete
   │   │   │        │
   ↓   ↓   ↓        ↓
[Forms][List][Edit] [Confirm]
   │   │   │        │
   │   ↓   │        │
   │ API   │        │
   │ GET   │        │
   │       │        │
   ↓       ↓        ↓
   │   ┌───┴────────┘
   │   │
   ↓   ↓
   POST/PUT/DELETE
   /api/employees
   │
   ↓
┌─────────────┐
│ Backend:    │
│ - Validate  │
│ - Process   │
│ - Update DB │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Success:    │
│ - Refresh   │
│   list      │
│ - Show      │
│   message   │
└─────────────┘
```

---

## 💾 Export and Formatting Tips

### Export Settings for Academic Reports

1. **In draw.io:**
   - File → Export as → PNG
   - Resolution: **300 DPI** (for print quality)
   - Border: 10-20px (for white space)
   - Background: White or transparent
   - Format: PNG or SVG

2. **For Word/Document:**
   - Export as PNG (300 DPI)
   - Or export as SVG and insert into Word
   - Ensure diagrams fit within page margins

3. **Naming Convention:**
   - `Figure-1-System-Architecture.png`
   - `Figure-2-ERD.png`
   - `Figure-3-Authentication-Flow.png`
   - etc.

### Formatting Best Practices

1. **Colors:**
   - Use consistent color scheme
   - Avoid too many colors (2-3 colors max)
   - Ensure good contrast for printing
   - Use grayscale for black/white printing

2. **Text:**
   - Font: Arial, Calibri, or Times New Roman (match your report)
   - Font size: 10-12pt minimum
   - Bold for headings
   - Clear labels

3. **Layout:**
   - Left-to-right or top-to-bottom flow
   - Align elements properly
   - Consistent spacing
   - Use grid/snap to align

4. **Legends:**
   - Add legend if using symbols
   - Explain abbreviations
   - Add notes if needed

---

## 📝 Templates and Examples

### Quick Reference: draw.io Shapes

- **Rectangle:** Process/Action
- **Diamond:** Decision/Choice
- **Rounded Rectangle:** Start/End
- **Parallelogram:** Input/Output
- **Circle:** Connector
- **Cylinder:** Database
- **Box with Shadow:** Container/Layer

### Color Suggestions

- **Primary Color:** Blue (#2196F3)
- **Secondary Color:** Green (#4CAF50)
- **Error/Warning:** Red (#F44336)
- **Background:** White or Light Gray (#F5F5F5)

---

## ✅ Checklist

Before including diagrams in your report:

- [ ] All diagrams are high-resolution (300 DPI)
- [ ] Text is readable when printed
- [ ] Diagrams have consistent style
- [ ] All diagrams are referenced in text
- [ ] Each diagram has a caption (Figure X: Description)
- [ ] Diagrams fit within page margins
- [ ] Colors work for black/white printing
- [ ] No blurry or pixelated images

---

## 🚀 Quick Start

**Fastest way to create all diagrams:**

1. **Open draw.io:** https://app.diagrams.net/
2. **Create separate files for each diagram type**
3. **Start with System Architecture** (easiest)
4. **Then do Authentication Flow** (uses flowchart template)
5. **Then Component Structure** (tree diagram)
6. **Workflow diagrams** (can reuse flowchart template)
7. **Export all as PNG (300 DPI)**
8. **Insert into your report**

**Estimated Time:** 2-4 hours for all diagrams

---

## 📚 Additional Resources

- **draw.io Tutorials:** https://www.draw.io/learn/
- **Flowchart Symbols Guide:** https://www.draw.io/doc/faq/shapes
- **ERD Notation Guide:** https://www.lucidchart.com/pages/er-diagrams
- **UML Diagram Guide:** https://www.uml-diagrams.org/

---

**Good luck creating your diagrams! Remember: clarity and professionalism are key for academic reports.** 🎨

