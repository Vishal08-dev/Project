# BloodLink Backend - Quick Start Guide

This guide will help you set up and run the BloodLink backend API in minutes.

## Prerequisites

Before you begin, make sure you have:
- Python 3.8+ installed
- MySQL Server 5.7+ installed and running
- MySQL root password (or user with database creation privileges)

## Quick Setup (5 minutes)

### Step 1: Create MySQL Database

Open MySQL command line or workbench and run:

```sql
CREATE DATABASE blood_donation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Configure Database Connection

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and set your MySQL password:
   ```env
   DB_PASSWORD=your_mysql_password_here
   ```

   **That's the only thing you need to change!** All other settings have sensible defaults.

### Step 3: Install Dependencies

Run one of these commands based on your system:

**Linux/Mac:**
```bash
pip3 install -r requirements.txt
```

**Windows:**
```bash
pip install -r requirements.txt
```

**Or use the setup script (Linux/Mac only):**
```bash
chmod +x setup.sh
./setup.sh
```

### Step 4: Initialize Database

Run the initialization script to create tables and seed data:

```bash
python3 init_db.py
```

or on Windows:
```bash
python init_db.py
```

This will:
- Create all necessary tables
- Create a default admin user
- Initialize blood stock for all blood groups

**Default Admin Credentials:**
- Email: `admin@bloodlink.org`
- Password: `admin123`

### Step 5: Start the Server

```bash
python3 app.py
```

or on Windows:
```bash
python app.py
```

The API will be running at: **http://localhost:5000**

## Verify Installation

Open your browser or use curl to test:

```bash
curl http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

## Test the API

Run the test suite to verify all endpoints:

```bash
python3 test_api.py
```

## Common Issues

### Issue: "Access denied for user"
**Solution:** Check your MySQL password in `.env` file

### Issue: "Unknown database"
**Solution:** Make sure you created the database in Step 1

### Issue: "Module not found"
**Solution:** Run `pip3 install -r requirements.txt` again

### Issue: "Port 5000 already in use"
**Solution:** Stop other services using port 5000, or change the port in `app.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=True)
```

## API Endpoints Overview

### Public Endpoints
- `POST /api/auth/register` - Register new donor
- `POST /api/auth/login` - Login
- `POST /api/blood-requests/` - Submit blood request

### Authenticated Endpoints (Require JWT token)
- `GET /api/donors/` - List all donors (Admin)
- `GET /api/admin/dashboard/stats` - Dashboard stats (Admin)
- `GET /api/donors/<id>/donations` - Get donation history (User)

## Next Steps

1. **Change Admin Password:** Login to the admin dashboard and change the default password
2. **Test Registration:** Try registering a donor through the API or frontend
3. **Review API Documentation:** Check `README.md` for complete API reference
4. **Connect Frontend:** Update frontend `.env` with API URL

## API Documentation

For complete API documentation with all endpoints and request/response examples, see the main `README.md` file.

## Production Deployment

For production, remember to:
1. Change all default passwords and secret keys
2. Set `FLASK_ENV=production`
3. Use a production WSGI server (gunicorn)
4. Enable HTTPS
5. Set up database backups
6. Configure proper CORS origins

## Getting Help

If you encounter any issues:
1. Check the error message in the terminal
2. Verify MySQL is running: `mysql -u root -p`
3. Check the logs in the terminal where Flask is running
4. Review the `README.md` for detailed troubleshooting

## Summary of Commands

```bash
# Setup
cd backend
cp .env.example .env
# Edit .env with your MySQL password
pip3 install -r requirements.txt
python3 init_db.py

# Run
python3 app.py

# Test
python3 test_api.py
```

**That's it! You're ready to go!** 🚀
