const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  auth: {
    register: async (data: {
      fullName: string;
      age: number;
      gender: string;
      bloodGroup: string;
      contact: string;
      email: string;
      city: string;
      password: string;
    }): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Registration failed' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    login: async (email: string, password: string, role: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role }),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Login failed' };
        }
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('userType', result.type);
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
    },

    getCurrentUser: () => {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    },

    getUserType: () => {
      return localStorage.getItem('userType');
    },
  },

  bloodRequests: {
    create: async (data: {
      name: string;
      contact: string;
      bloodGroup: string;
      units: number;
      hospitalName: string;
      city: string;
      message?: string;
    }): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/blood-requests/`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Request creation failed' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    getAll: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/blood-requests/`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to fetch requests' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    getDonorRequests: async (donorId: number): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/blood-requests/donor/${donorId}`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to fetch requests' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },
  },

  donors: {
    getAll: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/donors/`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to fetch donors' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    getById: async (id: number): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/donors/${id}`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to fetch donor' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    getDonations: async (donorId: number): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/donors/${donorId}/donations`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to fetch donations' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    approve: async (donorId: number): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/donors/${donorId}/approve`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to approve donor' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    reject: async (donorId: number): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/donors/${donorId}/reject`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to reject donor' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    getStats: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/donors/stats`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to fetch stats' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },
  },

  admin: {
    getDashboardStats: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to fetch stats' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    getPendingDonors: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/donors/pending`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to fetch pending donors' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    getPendingRequests: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/requests/pending`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to fetch pending requests' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    getBloodStock: async (): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/blood-stock`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to fetch blood stock' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    approveRequest: async (requestId: number): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/requests/${requestId}/approve`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to approve request' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },

    rejectRequest: async (requestId: number): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/requests/${requestId}/reject`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          return { error: result.error || 'Failed to reject request' };
        }
        return { data: result };
      } catch (error) {
        return { error: 'Network error. Please check if backend is running.' };
      }
    },
  },
};
