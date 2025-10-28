# BloodLink - Complete Backend Setup Guide

## Overview

This document provides complete instructions for setting up and running the Flask backend API for the Blood Donation Management System.

## Project Structure

```
backend/
├── app.py                          # Main Flask application
├── config.py                       # Configuration settings
├── models.py                       # Database models (SQLAlchemy)
├── init_db.py                      # Database initialization script
├── requirements.txt                # Python dependencies
├── .env.example                    # Environment variables template
├── schema.sql                      # MySQL database schema
├── test_api.py                     # API test suite
├── setup.sh                        # Automated setup script (Linux/Mac)
├── README.md                       # Detailed documentation
├── QUICKSTART.md                   # Quick start guide
├── BloodLink_API.postman_collection.json  # Postman collection
└── routes/                         # API route handlers
    ├── __init__.py
    ├── auth.py                     # Authentication endpoints
    ├── donors.py                   # Donor management endpoints
    ├── blood_requests.py           # Blood request endpoints
    └── admin.py                    # Admin dashboard endpoints
```

## Technology Stack

- **Framework:** Flask 3.0.0
- **Database:** MySQL 5.7+
- **ORM:** SQLAlchemy
- **Authentication:** JWT (PyJWT)
- **Password Hashing:** bcrypt
- **CORS:** Flask-CORS

## Database Schema

### Tables

1. **donors** - Stores donor information
   - Personal details (name, age, gender, blood group)
   - Contact information (email, phone, city)
   - Authentication (hashed password)
   - Status (pending, approved, rejected)
   - Donation history tracking

2. **blood_requests** - Blood donation requests
   - Patient/requester information
   - Blood requirements (type, units)
   - Hospital details
   - Status tracking (pending, approved, rejected)

3. **donations** - Donation records
   - Links to donors
   - Donation date and location
   - Units donated
   - Status

4. **admins** - Admin users
   - Login credentials
   - Access control

5. **blood_stock** - Blood inventory
   - Available units by blood type
   - Reserved units
   - Last updated timestamp

## Setup Instructions

### Quick Setup (Recommended)

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE blood_donation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Configure Environment**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and set DB_PASSWORD to your MySQL password
   ```

3. **Install Dependencies**
   ```bash
   pip3 install -r requirements.txt
   ```

4. **Initialize Database**
   ```bash
   python3 init_db.py
   ```

5. **Start Server**
   ```bash
   python3 app.py
   ```

Server runs at: `http://localhost:5000`

### Alternative: Using SQL Schema File

If you prefer to set up the database manually:

```bash
mysql -u root -p < schema.sql
```

Then proceed with steps 2-5 above.

## API Endpoints

### Authentication (`/api/auth/`)
- `POST /register` - Register new donor
- `POST /login` - User/admin login
- `GET /verify` - Verify JWT token

### Donors (`/api/donors/`)
- `GET /` - List all donors
- `GET /<id>` - Get donor details
- `PUT /<id>` - Update donor
- `POST /<id>/approve` - Approve donor
- `POST /<id>/reject` - Reject donor
- `GET /<id>/donations` - Get donation history
- `POST /<id>/donations` - Record donation
- `GET /stats` - Get donor statistics

### Blood Requests (`/api/blood-requests/`)
- `POST /` - Create request
- `GET /` - List all requests
- `GET /<id>` - Get request details
- `PUT /<id>` - Update request
- `DELETE /<id>` - Delete request
- `GET /donor/<id>` - Get donor's requests

### Admin (`/api/admin/`)
- `GET /dashboard/stats` - Dashboard statistics
- `GET /donors/pending` - Pending donor approvals
- `GET /requests/pending` - Pending blood requests
- `GET /blood-stock` - Blood inventory
- `PUT /blood-stock/<id>` - Update stock
- `POST /requests/<id>/approve` - Approve request
- `POST /requests/<id>/reject` - Reject request
- `GET /reports/monthly` - Monthly report

## Default Credentials

**Admin Account:**
- Email: `admin@bloodlink.org`
- Password: `admin123`

⚠️ **IMPORTANT:** Change this password immediately after first login!

## Testing the API

### Using the Test Script
```bash
python3 test_api.py
```

### Using Postman
Import `BloodLink_API.postman_collection.json` into Postman for a complete collection of API requests.

### Using curl
```bash
# Health check
curl http://localhost:5000/api/health

# Register donor
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "age": 25,
    "gender": "male",
    "bloodGroup": "O+",
    "contact": "1234567890",
    "email": "john@example.com",
    "city": "New York",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bloodlink.org",
    "password": "admin123",
    "role": "admin"
  }'
```

## Configuration Options

Edit `.env` file to configure:

```env
# Database
DB_HOST=localhost          # MySQL host
DB_PORT=3306              # MySQL port
DB_USER=root              # MySQL username
DB_PASSWORD=yourpassword  # MySQL password (REQUIRED)
DB_NAME=blood_donation_db # Database name

# Flask
SECRET_KEY=your_secret    # Flask secret key
JWT_SECRET_KEY=jwt_secret # JWT signing key

# Server
PORT=5000                 # Server port
HOST=0.0.0.0             # Server host
```

## Security Features

- **Password Hashing:** All passwords encrypted with bcrypt
- **JWT Authentication:** Secure token-based auth with 24-hour expiry
- **CORS Protection:** Only configured origins allowed
- **SQL Injection Prevention:** SQLAlchemy ORM with parameterized queries
- **Input Validation:** All inputs validated before processing

## Troubleshooting

### Connection Error
**Problem:** Can't connect to MySQL
**Solution:**
- Verify MySQL is running: `systemctl status mysql` (Linux) or check Services (Windows)
- Check credentials in `.env`
- Ensure port 3306 is not blocked

### Import Errors
**Problem:** Module not found
**Solution:** `pip3 install -r requirements.txt --upgrade`

### Database Already Exists
**Problem:** "Database already exists" error
**Solution:** This is fine! Just run `python3 init_db.py` to initialize tables

### Port 5000 in Use
**Problem:** Port already occupied
**Solution:** Change port in `app.py` or stop conflicting service

## Production Deployment

For production use:

1. **Environment**
   ```env
   FLASK_ENV=production
   ```

2. **WSGI Server**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

3. **Security Checklist**
   - [ ] Change all default passwords
   - [ ] Generate strong SECRET_KEY and JWT_SECRET_KEY
   - [ ] Enable HTTPS
   - [ ] Configure firewall
   - [ ] Set up database backups
   - [ ] Configure proper CORS origins
   - [ ] Set up logging and monitoring
   - [ ] Use environment variables for secrets

## Development Tips

1. **Enable Debug Mode**
   Already enabled in `app.py` for development

2. **View Logs**
   All requests and errors logged to console

3. **Database Changes**
   After model changes, recreate tables:
   ```bash
   python3 init_db.py
   ```

4. **API Testing**
   Use the included test suite or Postman collection

## Support

For issues or questions:
1. Check the error message in terminal
2. Review `README.md` for detailed documentation
3. Verify database connection and credentials
4. Check `QUICKSTART.md` for common solutions

## Summary

The backend API is now ready to:
- ✅ Handle donor registrations
- ✅ Process blood requests
- ✅ Manage admin operations
- ✅ Track blood inventory
- ✅ Generate reports
- ✅ Authenticate users with JWT

**Next Step:** Configure the frontend to connect to this API at `http://localhost:5000`
