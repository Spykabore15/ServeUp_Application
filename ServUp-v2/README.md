# ServUp v2.0 - Restaurant Chain Management System

## 🎯 Project Overview

ServUp v2.0 is a modern, full-stack web application for managing restaurant chain operations. This version is a complete rebuild with professional technologies and real database integration.

## 📚 Technology Stack

### Backend
- **Node.js** + **Express.js** - Server and API
- **PostgreSQL** - Relational database
- **Sequelize** - ORM (Object-Relational Mapping)
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Pinia** - State management
- **Vue Router** - Navigation
- **Axios** - HTTP client
- **Chart.js** - Data visualization

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

### AI Assistant
- **OpenAI API** / **LangChain** - Intelligent chatbot

## 🏗️ Project Structure

```
ServUp-v2/
├── backend/          # Node.js Express API server
│   ├── config/       # Configuration files
│   ├── controllers/  # Business logic
│   ├── database/     # Migrations and seeders
│   ├── middleware/   # Express middleware
│   ├── models/       # Sequelize models
│   ├── routes/       # API routes
│   ├── services/     # External services
│   ├── validators/   # Input validation
│   └── server.js     # Entry point
├── frontend/         # Vue.js single-page application
│   ├── public/       # Static assets
│   └── src/          # Vue source code
│       ├── assets/   # Images, styles
│       ├── components/ # Reusable components
│       ├── router/   # Vue Router config
│       ├── services/ # API clients
│       ├── store/    # Pinia stores
│       ├── views/    # Page components
│       ├── App.vue   # Root component
│       └── main.js   # Entry point
├── documentation/    # Project documentation
└── docker-compose.yml # Docker configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker** and **Docker Compose** (for database)
- **PostgreSQL** (v16 or higher) - if not using Docker

### Quick Start (Recommended) ⚡

```bash
# 1. Start database
docker-compose up -d

# 2. Install all dependencies (first time only)
npm run install:all

# 3. Run database migrations (first time only)
npm run db:migrate

# 4. Seed database with test data (first time only)
npm run db:seed

# 5. Start both frontend and backend together!
npm run dev
```

That's it! 🎉
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

### Manual Setup (Alternative)

If you prefer to run servers separately:

#### 1. Setup Database with Docker

Start PostgreSQL and pgAdmin:

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL** on `localhost:5432`
- **pgAdmin** on `http://localhost:5050`

pgAdmin credentials:
- Email: `admin@servup.com`
- Password: `admin123`

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
copy env.example .env
# Edit .env with your settings

# Run database migrations
npm run db:migrate

# Seed database with test data
npm run db:seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

Test the API: `http://localhost:5000/api/health`

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 👥 User Roles & Test Accounts

The system supports 4 user roles with different permission levels:

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Administrateur** | `admin` | `admin123` | Full system access |
| **Responsable Stocks** | `responsable_stocks` | `stock123` | Products, suppliers, reports |
| **Responsable Employés** | `responsable_employes` | `hr123` | Employees, reports |
| **Employé** | `employe` | `emp123` | Read-only dashboard and orders |

## 📦 Available Scripts

### Root Directory (ServUp-v2/)

```bash
npm run dev            # 🚀 Start both backend and frontend together
npm run dev:backend    # Start only backend
npm run dev:frontend   # Start only frontend
npm run install:all    # Install dependencies for root, backend, and frontend
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed database with test data
npm run db:reset       # Reset database (drop, migrate, seed)
```

### Backend (backend/)

```bash
npm start           # Start production server
npm run dev         # Start development server with nodemon
npm test            # Run tests
npm run db:migrate  # Run database migrations
npm run db:seed     # Seed database with test data
npm run db:reset    # Reset database (drop, migrate, seed)
```

### Frontend (frontend/)

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔧 Database Management

### Using Docker & pgAdmin

1. Open `http://localhost:5050` in your browser
2. Login with credentials above
3. Add a new server:
   - Name: `ServUp Local`
   - Host: `postgres` (Docker network name)
   - Port: `5432`
   - Username: `postgres`
   - Password: `servup_password_2024`
   - Database: `servup_db`

### Using Command Line

```bash
# Access PostgreSQL container
docker exec -it servup_postgres psql -U postgres -d servup_db

# Run SQL commands
SELECT * FROM users;
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Products (Stock Management)
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Employees
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

*(More endpoints will be documented as they are implemented)*

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js
```

## 📝 Development Progress

- [x] Project structure created
- [x] Backend initialization
- [x] Frontend initialization (Vue 3 + Vite)
- [x] Database schema design
- [x] Docker setup
- [ ] Database models and migrations
- [ ] Authentication system
- [ ] CRUD operations
- [ ] AI assistant integration
- [ ] Final documentation

## 🤝 Contributing

This is an academic project. For any questions or suggestions, please contact the development team.

## 📄 License

This project is for educational purposes only.

## 📞 Support

For technical issues or questions:
- Check the documentation in `/documentation`
- Review the database schema: `/documentation/database-schema.md`
- Contact: servup.support@example.com

---

**Built with ❤️ for learning and professional development**

Last Updated: November 21, 2025
