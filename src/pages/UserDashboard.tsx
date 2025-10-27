import { useState } from 'react';
import { Heart, User, LogOut, Clock, CheckCircle, Activity, Calendar, Droplet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userName] = useState('John Doe');

  const donations = [
    { id: 1, date: '2025-09-15', location: 'City Hospital', status: 'Completed', units: 1 },
    { id: 2, date: '2025-06-10', location: 'Medical Center', status: 'Completed', units: 1 },
    { id: 3, date: '2025-03-20', location: 'Community Clinic', status: 'Completed', units: 1 },
  ];

  const requests = [
    { id: 1, date: '2025-10-20', bloodGroup: 'A+', status: 'Pending', hospital: 'General Hospital' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] to-[#FFF0F0]">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-[#C62828] fill-[#C62828]" />
              <span className="text-2xl font-bold text-[#C62828]">BloodLink</span>
            </Link>

            <div className="flex items-center space-x-6">
              <Link
                to="/user-dashboard"
                className="font-medium text-[#C62828]"
              >
                Dashboard
              </Link>
              <button className="font-medium text-gray-700 hover:text-[#C62828] transition-colors">
                Profile
              </button>
              <button className="font-medium text-gray-700 hover:text-[#C62828] transition-colors">
                Request History
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-[#C62828] transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[#C62828] to-[#8B0000] rounded-2xl p-8 mb-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
            <p className="text-gray-100">Thank you for being a life-saver</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Donations</p>
                  <h3 className="text-3xl font-bold text-gray-800">3</h3>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <Droplet className="w-7 h-7 text-green-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Last donation: Sep 15, 2025</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Pending Requests</p>
                  <h3 className="text-3xl font-bold text-gray-800">1</h3>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Submitted: Oct 20, 2025</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Eligibility Status</p>
                  <h3 className="text-lg font-bold text-green-600">Eligible</h3>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Next eligible: Dec 15, 2025</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Donation History</h2>
                <Activity className="w-6 h-6 text-[#C62828]" />
              </div>

              <div className="space-y-4">
                {donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{donation.location}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{donation.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {donation.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{donation.units} unit</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Blood Requests</h2>
                <Droplet className="w-6 h-6 text-[#C62828]" />
              </div>

              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{request.hospital}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{request.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        {request.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{request.bloodGroup}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-[#C62828] border-2 border-[#C62828] rounded-lg font-semibold hover:bg-[#C62828] hover:text-white transition-colors">
              Update Profile
            </button>
            <Link
              to="/request-blood"
              className="px-8 py-3 bg-[#C62828] text-white rounded-lg font-semibold hover:bg-[#a02020] transition-colors text-center"
            >
              New Blood Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
