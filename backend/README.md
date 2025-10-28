# BloodLink Backend API

Flask-based REST API for the Blood Donation Management System.

## Features

- User authentication (Donor & Admin)
- Donor registration and management
- Blood request submission and tracking
- Admin dashboard with approval workflows
- Blood stock management
- JWT-based authentication
- MySQL database with SQLAlchemy ORM

## Prerequisites

- Python 3.8 or higher
- MySQL Server 5.7 or higher
- pip (Python package manager)

## Installation

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure MySQL Database

First, create the database in MySQL:

```sql
CREATE DATABASE blood_donation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Set Up Environment Variables

Copy the example environment file and update it with your MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env` and update the following:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=blood_donation_db

SECRET_KEY=your_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here
```

### 4. Initialize the Database

Run the initialization script to create tables and seed initial data:

```bash
python init_db.py
```

This will:
- Create all database tables
- Create a default admin user
- Initialize blood stock for all blood groups

**Default Admin Credentials:**
- Email: `admin@bloodlink.org`
- Password: `admin123`

⚠️ **IMPORTANT:** Change the admin password after first login!

## Running the Server

Start the Flask development server:

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new donor
- `POST /api/auth/login` - Login (user/admin)
- `GET /api/auth/verify` - Verify JWT token

### Donors

- `GET /api/donors/` - Get all donors
- `GET /api/donors/<id>` - Get donor by ID
- `PUT /api/donors/<id>` - Update donor
- `POST /api/donors/<id>/approve` - Approve donor
- `POST /api/donors/<id>/reject` - Reject donor
- `GET /api/donors/<id>/donations` - Get donor donations
- `POST /api/donors/<id>/donations` - Add donation record
- `GET /api/donors/stats` - Get donor statistics

### Blood Requests

- `POST /api/blood-requests/` - Create blood request
- `GET /api/blood-requests/` - Get all requests
- `GET /api/blood-requests/<id>` - Get request by ID
- `PUT /api/blood-requests/<id>` - Update request
- `DELETE /api/blood-requests/<id>` - Delete request
- `GET /api/blood-requests/donor/<id>` - Get donor's requests

### Admin

- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/donors/pending` - Get pending donors
- `GET /api/admin/requests/pending` - Get pending requests
- `GET /api/admin/blood-stock` - Get blood stock
- `PUT /api/admin/blood-stock/<id>` - Update blood stock
- `POST /api/admin/requests/<id>/approve` - Approve request
- `POST /api/admin/requests/<id>/reject` - Reject request
- `GET /api/admin/reports/monthly` - Get monthly report

## Database Schema

### Tables

1. **donors** - Donor information and credentials
2. **blood_requests** - Blood request records
3. **donations** - Donation history
4. **admins** - Admin users
5. **blood_stock** - Blood inventory by type

## Testing the API

You can test the API using tools like:
- Postman
- curl
- Thunder Client (VS Code extension)

Example request:

```bash
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
```

## Security Notes

- All passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- Admin approval required for donor accounts
- CORS is configured for frontend origins only

## Troubleshooting

### Database Connection Error

If you get a database connection error:
1. Verify MySQL is running
2. Check credentials in `.env` file
3. Ensure the database exists
4. Verify user has proper permissions

### Import Errors

If you get module import errors:
```bash
pip install -r requirements.txt --upgrade
```

### Port Already in Use

If port 5000 is already in use, change it in `app.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=True)
```

## Production Deployment

For production deployment:

1. Set `FLASK_ENV=production` in `.env`
2. Use a production WSGI server (gunicorn, uWSGI)
3. Set strong secret keys
4. Enable HTTPS
5. Use environment variables for sensitive data
6. Set up database backups
7. Configure proper logging

Example with gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## License

Copyright © 2025 BloodLink. All rights reserved.
