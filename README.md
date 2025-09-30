# 📝 SooMemo - Personal Memo Management App

A modern, full-stack personal memo management application with drag-and-drop functionality, built with React and Node.js.

## ✨ Features

### 🔐 Authentication & Security
- **User Registration & Login**: Secure JWT-based authentication
- **Password Hashing**: bcrypt encryption for password security
- **Input Validation**: Comprehensive client and server-side validation
- **Error Handling**: Detailed validation error messages

### 📝 Memo Management
- **CRUD Operations**: Create, read, update, and delete memos
- **Rich Text Editor**: Clean, intuitive memo editing interface
- **Search Functionality**: Search through titles and content
- **Category Filtering**: Filter memos by categories

### 📂 Category Management
- **Drag & Drop Reordering**: Intuitive category sorting with @dnd-kit
- **Color Coding**: Visual category identification with custom colors
- **Default Category**: Automatic "기본" (Default) category creation
- **Category CRUD**: Full category management capabilities

### 🎨 User Interface
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Beautiful gradient backgrounds and smooth animations
- **Mobile Navigation**: Bottom navigation bar for mobile devices
- **Modal System**: Clean modal dialogs for editing and authentication

### 🚀 Performance & Deployment
- **Production Ready**: Deployed on Railway with PostgreSQL
- **Database Migration**: Automatic table creation and synchronization
- **Environment Configuration**: Separate development and production settings

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **@dnd-kit** - Drag and drop functionality
- **Axios** - HTTP client for API calls
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Sequelize** - SQL ORM
- **PostgreSQL** - Production database
- **SQLite** - Development database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/soomemo.git
cd soomemo
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=5000
```

4. **Run the application**

#### Development Mode (Recommended)
```bash
npm run dev
```
This runs both frontend (port 3000) and backend (port 5000) simultaneously.

#### Individual Services
```bash
# Backend only
npm run server

# Frontend only
npm start
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Usage Guide

### Getting Started
1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Access your account with email and password
3. **Create Memos**: Click the "+" button to create new memos
4. **Organize**: Use categories to organize your memos
5. **Search**: Use the search bar to find specific memos

### Category Management
- **Drag & Drop**: Drag categories by the ⋮⋮ handle to reorder them
- **Add Categories**: Click the "+" button in the sidebar
- **Edit Categories**: Hover over a category and click the edit button
- **Delete Categories**: Hover over a category and click the delete button

### Mobile Experience
- **Bottom Navigation**: Use the bottom navigation bar on mobile
- **Touch-Friendly**: Optimized for touch interactions
- **Responsive Layout**: Adapts to different screen sizes

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Memos
- `GET /api/memos` - Get all memos
- `GET /api/memos/:id` - Get specific memo
- `POST /api/memos` - Create new memo
- `PUT /api/memos/:id` - Update memo
- `DELETE /api/memos/:id` - Delete memo
- `PUT /api/memos/reorder` - Reorder memos

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `PUT /api/categories/reorder` - Reorder categories

## 🗄️ Database Schema

### Users Table
```sql
- id (Primary Key, Auto Increment)
- username (Unique, 3-20 characters)
- email (Unique, Valid email format)
- password (Hashed with bcrypt)
- created_at, updated_at (Timestamps)
```

### Categories Table
```sql
- id (Primary Key, Auto Increment)
- name (Category name)
- color (Hex color code)
- user_id (Foreign Key to Users)
- order (Sort order, default: 0)
- created_at, updated_at (Timestamps)
```

### Memos Table
```sql
- id (Primary Key, Auto Increment)
- title (Memo title)
- content (Memo content)
- user_id (Foreign Key to Users)
- category_id (Foreign Key to Categories)
- order (Sort order, default: 0)
- created_at, updated_at (Timestamps)
```

## 🏗️ Project Structure

```
soomemo/
├── public/                 # Static files
├── src/                   # React source code
│   ├── components/        # React components
│   │   ├── AuthModal.js   # Authentication modal
│   │   ├── CategorySidebar.js # Category management
│   │   ├── MemoEditor.js  # Memo editing
│   │   ├── MemoList.js    # Memo listing
│   │   └── MobileBottomNav.js # Mobile navigation
│   ├── contexts/          # React Context
│   │   └── AuthContext.js # Authentication context
│   ├── services/          # API services
│   │   └── api.js         # API client
│   └── App.js            # Main application
├── server/                # Backend server
│   ├── config/           # Database configuration
│   │   └── database.js   # Sequelize setup
│   ├── models/           # Database models
│   │   ├── User.js       # User model
│   │   ├── Category.js   # Category model
│   │   └── Memo.js       # Memo model
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── categories.js # Category routes
│   │   └── memos.js      # Memo routes
│   ├── middleware/       # Express middleware
│   │   └── auth.js       # JWT authentication
│   └── index.js          # Server entry point
├── package.json          # Dependencies
└── README.md             # This file
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for specific origins
- **SQL Injection Prevention**: Sequelize ORM protection
- **Error Handling**: Secure error messages without data leakage

## 🌐 Deployment

### Railway Deployment
The application is deployed on Railway with the following configuration:

1. **Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: JWT signing secret
   - `NODE_ENV`: production

2. **Database**: PostgreSQL on Railway
3. **Build Process**: Automatic build and deployment
4. **Domain**: https://soomemo-production.up.railway.app

### Local Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Database | SQLite | PostgreSQL |
| Frontend | React Dev Server | Built Static Files |
| Backend | Express Dev Server | Express Production Server |
| Environment | `NODE_ENV=development` | `NODE_ENV=production` |

## 🐛 Troubleshooting

### Common Issues

**Server won't start**
- Check if port 5000 is available
- Verify `.env` file configuration
- Ensure all dependencies are installed with `npm install`

**Database connection errors**
- Verify database configuration
- Check if database file exists (SQLite)
- Ensure PostgreSQL connection string (Production)

**Authentication issues**
- Verify JWT_SECRET is set
- Check token expiration
- Clear localStorage and try again

**Drag and drop not working**
- Ensure @dnd-kit is properly installed
- Check browser compatibility
- Verify touch events on mobile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [@dnd-kit](https://dndkit.com/) - Drag and drop library
- [Sequelize](https://sequelize.org/) - SQL ORM
- [Railway](https://railway.app/) - Deployment platform

---

**Made with ❤️ by [Your Name]**