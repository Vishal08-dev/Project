import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_health():
    print("\n=== Testing Health Endpoint ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_register():
    print("\n=== Testing Donor Registration ===")
    data = {
        "fullName": "Test User",
        "age": 25,
        "gender": "male",
        "bloodGroup": "O+",
        "contact": "1234567890",
        "email": "test@example.com",
        "city": "Test City",
        "password": "test123"
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_login_admin():
    print("\n=== Testing Admin Login ===")
    data = {
        "email": "admin@bloodlink.org",
        "password": "admin123",
        "role": "admin"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {json.dumps(result, indent=2)}")
    return result.get('token')

def test_blood_request():
    print("\n=== Testing Blood Request ===")
    data = {
        "name": "Patient Name",
        "contact": "9876543210",
        "bloodGroup": "A+",
        "units": 2,
        "hospitalName": "City Hospital",
        "city": "New York",
        "message": "Urgent requirement"
    }
    response = requests.post(f"{BASE_URL}/blood-requests/", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_get_donors(token):
    print("\n=== Testing Get All Donors ===")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/donors/", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_dashboard_stats(token):
    print("\n=== Testing Dashboard Stats ===")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/admin/dashboard/stats", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    print("========================================")
    print("BloodLink API Test Suite")
    print("========================================")
    print("\nMake sure the Flask server is running on http://localhost:5000")
    print("Press Enter to continue or Ctrl+C to cancel...")
    input()

    try:
        test_health()
        test_register()
        token = test_login_admin()
        test_blood_request()

        if token:
            test_get_donors(token)
            test_dashboard_stats(token)

        print("\n========================================")
        print("All tests completed!")
        print("========================================")

    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to server. Make sure Flask is running.")
    except Exception as e:
        print(f"\nError during testing: {e}")
