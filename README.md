# BloodLink - Blood Donation Management System

A complete, production-ready web application for managing blood donations, connecting donors with those in need.

## Features

### Frontend (React + TypeScript + Tailwind CSS)
- 🏠 **Home Page** - Hero section with statistics and call-to-action
- 📝 **Donor Registration** - Complete registration form with validation
- 🩸 **Blood Request System** - Submit and track blood requests
- 🔐 **Authentication** - Secure login for users and admins
- 👤 **User Dashboard** - Donation history and eligibility tracking
- 🛠️ **Admin Dashboard** - Complete management interface
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Clean, medical-themed design

### Backend (Flask + MySQL)
- 🔒 **JWT Authentication** - Secure token-based auth
- 👥 **Donor Management** - Registration, approval, tracking
- 📋 **Request Processing** - Blood request submission and approval
- 📊 **Admin Operations** - Dashboard, statistics, reports
- 🩸 **Blood Stock Management** - Inventory tracking by type
- 🔐 **Secure** - Bcrypt password hashing, CORS protection

## Project Structure

```
project/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main app component
│   └── package.json
│
├── backend/              # Flask API
│   ├── routes/          # API endpoints
│   ├── models.py        # Database models
│   ├── app.py           # Main application
│   ├── init_db.py       # Database initialization
│   ├── schema.sql       # MySQL schema
│   └── requirements.txt # Python dependencies
│
└── README.md            # This file
```

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- MySQL 5.7+

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Backend Setup

See `BACKEND_SETUP.md` for detailed instructions.

**Quick version:**

```bash
# Navigate to backend
cd backend

# Install dependencies
pip3 install -r requirements.txt

# Create database
mysql -u root -p
> CREATE DATABASE blood_donation_db;
> exit

# Configure environment
cp .env.example .env
# Edit .env and set your MySQL password

# Initialize database
python3 init_db.py

# Start server
python3 app.py
```

Backend runs at: `http://localhost:5000`

**Default Admin Credentials:**
- Email: admin@bloodlink.org
- Password: admin123

## Pages Overview

### 1. Home Page
- Hero section with mission statement
- Live statistics (donors, donations, availability)
- About section explaining blood donation importance
- Call-to-action buttons

### 2. Donor Registration
- Comprehensive form with validation
- Blood group selection
- Contact and location information
- Password creation

### 3. Blood Request
- Request form with patient details
- Hospital information
- Blood type and units needed
- Info card with process steps

### 4. Login
- Role-based authentication (User/Admin)
- Email and password
- Redirect to appropriate dashboard

### 5. User Dashboard
- Personal statistics
- Donation history
- Pending requests
- Eligibility status

### 6. Admin Dashboard
- Overview statistics
- Donor approval system
- Blood request management
- Blood stock monitoring
- Reports and analytics

### 7. Contact
- Contact form
- Office information
- Operating hours
- Location details

## API Documentation

Complete API documentation available in `backend/README.md`

### Main Endpoints

- `POST /api/auth/register` - Register donor
- `POST /api/auth/login` - User login
- `GET /api/donors/` - List donors
- `POST /api/blood-requests/` - Create request
- `GET /api/admin/dashboard/stats` - Dashboard data

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **Flask 3.0** - Web framework
- **SQLAlchemy** - ORM
- **MySQL** - Database
- **PyJWT** - Authentication
- **bcrypt** - Password hashing
- **Flask-CORS** - CORS handling

## Design System

### Colors
- Primary: Crimson Red (#C62828)
- Secondary: White (#FFFFFF)
- Accent: Light Gray (#F5F5F5)

### Typography
- Font: System fonts (optimized for readability)
- Clean, modern aesthetic
- Proper hierarchy and spacing

### Components
- Rounded buttons (8-12px border radius)
- Soft shadows and hover effects
- Smooth transitions
- Responsive breakpoints

## Development

### Frontend Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Backend Development

```bash
# Start with auto-reload
python3 app.py

# Run tests
python3 test_api.py

# Initialize/reset database
python3 init_db.py
```

## Testing

### Frontend
- Manual testing via browser
- Check all pages and forms
- Verify responsive design

### Backend
- Use included test suite: `python3 test_api.py`
- Import Postman collection: `BloodLink_API.postman_collection.json`
- Test all CRUD operations

## Database Schema

### Key Tables
1. **donors** - Donor profiles and credentials
2. **blood_requests** - Blood donation requests
3. **donations** - Donation history records
4. **admins** - Admin users
5. **blood_stock** - Blood inventory

See `backend/schema.sql` for complete schema.

## Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- CORS configured for specific origins
- SQL injection prevention via ORM
- Input validation on all forms

## Deployment

### Frontend
- Build: `npm run build`
- Deploy `dist/` folder to hosting service
- Configure environment variables

### Backend
- Use production WSGI server (gunicorn)
- Enable HTTPS
- Set secure environment variables
- Configure proper CORS origins
- Set up database backups

## Troubleshooting

### Frontend Issues
- **Port in use:** Change port in `vite.config.ts`
- **Build fails:** Run `npm install` again
- **Routing errors:** Check React Router configuration

### Backend Issues
- **Database connection:** Verify MySQL is running and credentials are correct
- **Import errors:** Run `pip3 install -r requirements.txt`
- **Port 5000 in use:** Change port in `app.py`

See `backend/README.md` for detailed troubleshooting.

## Future Enhancements

- Real-time notifications
- SMS alerts for urgent requests
- Blood donation camps scheduling
- Mobile app (React Native)
- Advanced analytics and reporting
- Integration with blood banks
- Appointment booking system

## License

Copyright © 2025 BloodLink. All rights reserved.

## Support

For setup assistance:
1. Check `BACKEND_SETUP.md` for backend instructions
2. Review `backend/QUICKSTART.md` for quick setup
3. Import Postman collection for API testing
4. Run test suite to verify installation

## Acknowledgments

Built with modern web technologies to save lives through efficient blood donation management.

---

**Remember:** Every donation saves lives. Thank you for supporting this cause! ❤️
