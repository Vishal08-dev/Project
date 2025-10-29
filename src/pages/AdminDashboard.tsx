import { useState, useEffect } from 'react';
import {
  Heart,
  LayoutDashboard,
  Users,
  FileText,
  Droplet,
  BarChart3,
  LogOut,
  Menu,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Loader,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface DashboardStats {
  total_donors: number;
  total_requests: number;
  approved_requests: number;
  pending_requests: number;
}

interface Donor {
  id: number;
  full_name: string;
  blood_group: string;
  email: string;
  city: string;
  status: string;
}

interface BloodRequest {
  id: number;
  name: string;
  blood_group: string;
  units: number;
  hospital_name: string;
  status: string;
}

interface BloodStock {
  id: number;
  blood_group: string;
  units_available: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    total_donors: 0,
    total_requests: 0,
    approved_requests: 0,
    pending_requests: 0,
  });
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);

    if (activeTab === 'dashboard') {
      await loadDashboardData();
    } else if (activeTab === 'donors') {
      await loadDonors();
    } else if (activeTab === 'requests') {
      await loadRequests();
    } else if (activeTab === 'stock') {
      await loadBloodStock();
    }

    setLoading(false);
  };

  const loadDashboardData = async () => {
    const statsResult = await api.admin.getDashboardStats();
    if (statsResult.data) {
      setStats(statsResult.data);
    }

    const donorsResult = await api.admin.getPendingDonors();
    if (donorsResult.data) {
      setDonors(donorsResult.data.donors.slice(0, 3));
    }

    const requestsResult = await api.admin.getPendingRequests();
    if (requestsResult.data) {
      setRequests(requestsResult.data.requests.slice(0, 3));
    }
  };

  const loadDonors = async () => {
    const result = await api.donors.getAll();
    if (result.data) {
      setDonors(result.data.donors);
    }
  };

  const loadRequests = async () => {
    const result = await api.bloodRequests.getAll();
    if (result.data) {
      setRequests(result.data.requests);
    }
  };

  const loadBloodStock = async () => {
    const result = await api.admin.getBloodStock();
    if (result.data) {
      setBloodStock(result.data.stock);
    }
  };

  const handleApproveDonor = async (donorId: number) => {
    const result = await api.donors.approve(donorId);
    if (!result.error) {
      loadData();
    }
  };

  const handleRejectDonor = async (donorId: number) => {
    const result = await api.donors.reject(donorId);
    if (!result.error) {
      loadData();
    }
  };

  const handleApproveRequest = async (requestId: number) => {
    const result = await api.admin.approveRequest(requestId);
    if (!result.error) {
      loadData();
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    const result = await api.admin.rejectRequest(requestId);
    if (!result.error) {
      loadData();
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    navigate('/login');
  };

  const calculatePercentage = (units: number) => {
    const maxUnits = 200;
    return Math.min((units / maxUnits) * 100, 100);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-[#C62828] fill-[#C62828]" />
          <span className="text-2xl font-bold text-[#C62828]">BloodLink</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-[#C62828] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('donors')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'donors'
              ? 'bg-[#C62828] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Donors</span>
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'requests'
              ? 'bg-[#C62828] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">Requests</span>
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'stock'
              ? 'bg-[#C62828] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Droplet className="w-5 h-5" />
          <span className="font-medium">Blood Stock</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'reports'
              ? 'bg-[#C62828] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="font-medium">Reports</span>
        </button>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] to-[#FFF0F0] flex">
      <aside className="hidden lg:block w-64 bg-white shadow-lg fixed h-screen">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg">
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-64">
        <header className="bg-white shadow-md sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-700"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex-1 max-w-2xl mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search donors, requests..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-600">admin@bloodlink.org</p>
                </div>
                <div className="w-10 h-10 bg-[#C62828] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 text-[#C62828] animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
                    <p className="text-gray-600">Monitor and manage blood donation activities</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 text-sm font-medium">Total Donors</h3>
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-800">{stats.total_donors}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 text-sm font-medium">Total Requests</h3>
                        <FileText className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-800">{stats.total_requests}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 text-sm font-medium">Approved</h3>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-800">{stats.approved_requests}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
                        <Clock className="w-8 h-8 text-yellow-600" />
                      </div>
                      <p className="text-3xl font-bold text-gray-800">{stats.pending_requests}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Donor Registrations</h2>
                      <div className="space-y-3">
                        {donors.length > 0 ? donors.map((donor) => (
                          <div key={donor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-semibold text-gray-800">{donor.full_name}</p>
                              <p className="text-sm text-gray-600">{donor.email}</p>
                            </div>
                            <span className="inline-block px-3 py-1 bg-[#C62828] text-white rounded-full text-sm font-medium">
                              {donor.blood_group}
                            </span>
                          </div>
                        )) : (
                          <p className="text-gray-500 text-center py-4">No recent donors</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Blood Requests</h2>
                      <div className="space-y-3">
                        {requests.length > 0 ? requests.map((request) => (
                          <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-semibold text-gray-800">{request.name}</p>
                              <p className="text-sm text-gray-600">{request.hospital_name}</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-3 py-1 bg-[#C62828] text-white rounded-full text-sm font-medium">
                                {request.blood_group}
                              </span>
                              <p className="text-xs text-gray-600 mt-1">{request.units} units</p>
                            </div>
                          </div>
                        )) : (
                          <p className="text-gray-500 text-center py-4">No recent requests</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'donors' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Donor Management</h1>
                    <p className="text-gray-600">Review and approve donor registrations</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Blood Group</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">City</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {donors.length > 0 ? donors.map((donor) => (
                            <tr key={donor.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-800 font-medium">{donor.full_name}</td>
                              <td className="px-6 py-4">
                                <span className="inline-block px-3 py-1 bg-[#C62828] text-white rounded-full text-sm font-medium">
                                  {donor.blood_group}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{donor.email}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{donor.city}</td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                    donor.status === 'approved'
                                      ? 'bg-green-100 text-green-700'
                                      : donor.status === 'rejected'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                >
                                  {donor.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {donor.status === 'pending' && (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleApproveDonor(donor.id)}
                                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                    >
                                      <CheckCircle className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => handleRejectDonor(donor.id)}
                                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                      <XCircle className="w-5 h-5" />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                No donors found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Blood Requests</h1>
                    <p className="text-gray-600">Manage and approve blood requests</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Blood Group</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Units</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hospital</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {requests.length > 0 ? requests.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-800 font-medium">{request.name}</td>
                              <td className="px-6 py-4">
                                <span className="inline-block px-3 py-1 bg-[#C62828] text-white rounded-full text-sm font-medium">
                                  {request.blood_group}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{request.units}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{request.hospital_name}</td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                    request.status === 'approved'
                                      ? 'bg-green-100 text-green-700'
                                      : request.status === 'rejected'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                >
                                  {request.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {request.status === 'pending' && (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleApproveRequest(request.id)}
                                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleRejectRequest(request.id)}
                                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                No blood requests found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stock' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Blood Stock Management</h1>
                    <p className="text-gray-600">Monitor blood availability by type</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {bloodStock.length > 0 ? bloodStock.map((stock) => (
                      <div key={stock.id} className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-[#C62828]">{stock.blood_group}</span>
                          <Droplet className="w-8 h-8 text-[#C62828]" />
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mb-4">{stock.units_available}</p>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div
                            className={`h-3 rounded-full ${
                              calculatePercentage(stock.units_available) >= 70
                                ? 'bg-green-500'
                                : calculatePercentage(stock.units_available) >= 40
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${calculatePercentage(stock.units_available)}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          {calculatePercentage(stock.units_available).toFixed(0)}% capacity
                        </p>
                      </div>
                    )) : (
                      <p className="text-gray-500 col-span-4 text-center py-8">No blood stock data available</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports & Analytics</h1>
                    <p className="text-gray-600">View comprehensive donation statistics</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <BarChart3 className="w-16 h-16 text-[#C62828] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Reports Coming Soon</h3>
                    <p className="text-gray-600">Detailed analytics and reporting features will be available here</p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
