# BloodLink - Frontend & Backend Integration Guide

## Overview

The frontend is now fully integrated with the Flask backend API. All data is fetched from and saved to the MySQL database in real-time.

## What's Integrated

### ✅ Frontend Pages Connected to Backend

1. **Donor Registration** - Saves to database, password hashing, validation
2. **Login** - JWT authentication with role-based access
3. **Blood Request** - Creates requests in database
4. **Admin Dashboard** - Real-time data from API:
   - Dashboard stats (total donors, requests, approvals)
   - Donor management with approve/reject
   - Blood request management with approve/reject
   - Blood stock monitoring
   - All data updates instantly when actions are performed

5. **User Dashboard** - (Partially integrated, can be extended)

## Running the Integrated Application

### Step 1: Start the Backend

```bash
cd backend

# Make sure database is set up (only needed once)
python3 init_db.py

# Start Flask server
python3 app.py
```

Backend runs at: **http://localhost:5000**

### Step 2: Start the Frontend

```bash
# In a new terminal, from project root
npm run dev
```

Frontend runs at: **http://localhost:5173**

## Testing the Integration

### 1. Register a New Donor

1. Go to http://localhost:5173/donor-register
2. Fill out the form
3. Click "Register as Donor"
4. Data is saved to MySQL database
5. You'll see success message and redirect to login

### 2. Login as Admin

1. Go to http://localhost:5173/login
2. Use admin credentials:
   - Email: `admin@bloodlink.org`
   - Password: `admin123`
   - Role: Admin
3. Click Login
4. JWT token is stored in localStorage
5. Redirects to Admin Dashboard

### 3. Admin Dashboard Features

**Dashboard Tab:**
- View total donors, requests, approvals, pending items
- See recent donor registrations
- See recent blood requests
- All data is pulled from database in real-time

**Donors Tab:**
- View all registered donors
- See their status (pending/approved/rejected)
- Approve or reject pending donors with one click
- Changes save to database immediately

**Requests Tab:**
- View all blood requests
- See request status
- Approve or reject pending requests
- Blood stock is automatically updated when approved

**Blood Stock Tab:**
- View current inventory for all blood types
- Progress bars show capacity levels
- Color-coded (green = good, yellow = low, red = critical)

### 4. Submit Blood Request

1. Go to http://localhost:5173/request-blood
2. Fill out the form (no login required)
3. Submit request
4. Data saves to database
5. Visible immediately in Admin Dashboard

## API Endpoints Being Used

The frontend makes calls to these backend endpoints:

### Authentication
- `POST /api/auth/register` - Register donor
- `POST /api/auth/login` - Login user/admin
- `GET /api/auth/verify` - Verify JWT token

### Donors
- `GET /api/donors/` - List all donors
- `POST /api/donors/{id}/approve` - Approve donor
- `POST /api/donors/{id}/reject` - Reject donor
- `GET /api/donors/{id}/donations` - Get donation history

### Blood Requests
- `POST /api/blood-requests/` - Create request
- `GET /api/blood-requests/` - List all requests

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/donors/pending` - Pending donors
- `GET /api/admin/requests/pending` - Pending requests
- `GET /api/admin/blood-stock` - Blood inventory
- `POST /api/admin/requests/{id}/approve` - Approve request
- `POST /api/admin/requests/{id}/reject` - Reject request

## Data Flow

```
User Action (Frontend)
    ↓
API Call (src/services/api.ts)
    ↓
Flask Backend (app.py)
    ↓
Database (MySQL)
    ↓
Response to Frontend
    ↓
UI Updates
```

## Authentication Flow

1. User logs in → Frontend sends credentials to `/api/auth/login`
2. Backend validates → Returns JWT token
3. Token stored in `localStorage`
4. All subsequent API calls include token in `Authorization` header
5. Backend validates token for protected routes
6. Logout clears token from localStorage

## Error Handling

The frontend handles:
- Network errors (backend not running)
- Authentication errors (invalid credentials)
- Validation errors (from backend)
- Loading states during API calls
- Empty states (no data available)

All errors are displayed to users with helpful messages.

## State Management

- **Authentication**: Stored in localStorage (token, user data, user type)
- **Dashboard Data**: Fetched on page load and after actions
- **Real-time Updates**: Data refreshes after approve/reject actions
- **Loading States**: Spinners shown during API calls

## Key Features

### 1. Real-Time Data
- All stats update immediately
- Approve/reject actions reflect instantly
- No page refresh needed

### 2. JWT Security
- Token-based authentication
- Protected admin routes
- Auto-logout on token expiration

### 3. Validation
- Frontend form validation
- Backend data validation
- Password hashing (bcrypt)
- SQL injection prevention

### 4. User Experience
- Loading indicators
- Error messages
- Success confirmations
- Smooth transitions

## Troubleshooting

### "Network error. Please check if backend is running"
**Problem**: Frontend can't reach backend
**Solution**: Make sure Flask is running on port 5000

### "Invalid credentials"
**Problem**: Wrong email/password
**Solution**:
- Use admin@bloodlink.org / admin123 for admin
- Or register a new donor first

### "Your account is pending approval"
**Problem**: Donor not approved yet
**Solution**: Login as admin and approve the donor

### Empty data in Admin Dashboard
**Problem**: No data in database
**Solution**: Register some donors and submit blood requests to populate data

## Next Steps

To further enhance the integration:

1. **User Dashboard**: Add real data fetching for logged-in donors
2. **Real-time Notifications**: WebSocket integration
3. **Profile Management**: Edit donor profiles
4. **Donation History**: Track and display donation records
5. **Blood Request Tracking**: Allow donors to track their requests
6. **Advanced Filtering**: Search and filter in admin dashboard
7. **Reports**: Generate PDF reports from admin dashboard

## Development Tips

### Testing with Sample Data

You can use the backend test script to populate sample data:

```bash
cd backend
python3 test_api.py
```

### Viewing API Calls

Open browser DevTools (F12) → Network tab to see all API calls and responses.

### Database Queries

Connect to MySQL to view/modify data directly:

```bash
mysql -u root -p
use blood_donation_db;
SELECT * FROM donors;
SELECT * FROM blood_requests;
```

## Production Deployment

For production:

1. **Backend**:
   - Use gunicorn instead of Flask dev server
   - Enable HTTPS
   - Use environment variables for secrets
   - Set up proper CORS origins

2. **Frontend**:
   - Build: `npm run build`
   - Deploy `dist/` folder
   - Update API_BASE_URL in `src/services/api.ts` to production URL

## Summary

The BloodLink application now has a fully functional frontend-backend integration with:

- ✅ Real-time data fetching
- ✅ JWT authentication
- ✅ CRUD operations
- ✅ Admin approval workflows
- ✅ Blood stock management
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design

All data flows seamlessly between the React frontend and Flask/MySQL backend!
