import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Droplet,
  Heart,
  Calendar,
  ArrowUp,
  ArrowDown,
  PieChart,
  Activity,
} from 'lucide-react';
import { api } from '../services/api';

interface BloodTypeStats {
  blood_group: string;
  donors_count: number;
  requests_count: number;
  available_units: number;
}

interface TimeSeriesData {
  date: string;
  donations: number;
  requests: number;
}

interface AnalyticsData {
  total_donations_this_month: number;
  total_requests_this_month: number;
  active_donors_count: number;
  critical_blood_types: string[];
  donation_growth: number;
  request_growth: number;
  blood_type_distribution: BloodTypeStats[];
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    total_donations_this_month: 0,
    total_requests_this_month: 0,
    active_donors_count: 0,
    critical_blood_types: [],
    donation_growth: 0,
    request_growth: 0,
    blood_type_distribution: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const result = await api.admin.getDashboardStats();
    if (result.data) {
      const mockAnalytics: AnalyticsData = {
        total_donations_this_month: 145,
        total_requests_this_month: 89,
        active_donors_count: result.data.total_donors || 0,
        critical_blood_types: ['O-', 'AB-', 'B-'],
        donation_growth: 12.5,
        request_growth: -3.2,
        blood_type_distribution: [
          { blood_group: 'A+', donors_count: 120, requests_count: 34, available_units: 145 },
          { blood_group: 'A-', donors_count: 45, requests_count: 12, available_units: 80 },
          { blood_group: 'B+', donors_count: 98, requests_count: 28, available_units: 120 },
          { blood_group: 'B-', donors_count: 32, requests_count: 8, available_units: 60 },
          { blood_group: 'O+', donors_count: 156, requests_count: 45, available_units: 200 },
          { blood_group: 'O-', donors_count: 28, requests_count: 15, available_units: 50 },
          { blood_group: 'AB+', donors_count: 52, requests_count: 18, available_units: 90 },
          { blood_group: 'AB-', donors_count: 18, requests_count: 10, available_units: 40 },
        ],
      };
      setAnalytics(mockAnalytics);
    }
    setLoading(false);
  };

  const StatCard = ({ icon: Icon, label, value, change, trend }: any) => (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#C62828]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{label}</h3>
        <Icon className="w-8 h-8 text-[#C62828]" />
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <div className={`flex items-center space-x-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span className="text-sm font-semibold">{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  );

  const BloodTypeCard = ({ blood_group, donors_count, requests_count, available_units }: BloodTypeStats) => {
    const isCritical = analytics.critical_blood_types.includes(blood_group);
    const utilization = requests_count > 0 ? ((requests_count / (donors_count + requests_count)) * 100).toFixed(1) : 0;

    return (
      <div className={`bg-white rounded-xl shadow-md p-5 border-t-2 ${isCritical ? 'border-t-red-500' : 'border-t-green-500'}`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold text-[#C62828]">{blood_group}</h4>
          <Droplet className={`w-6 h-6 ${isCritical ? 'text-red-500 fill-red-500' : 'text-green-500 fill-green-500'}`} />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">Donors Available</p>
            <div className="flex items-center justify-between">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${Math.min((donors_count / 156) * 100, 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{donors_count}</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">Requests</p>
            <p className="text-lg font-bold text-gray-800">{requests_count}</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">Available Units</p>
            <p className="text-lg font-bold text-gray-800">{available_units} units</p>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-600">
              Utilization Rate: <span className="text-[#C62828] font-bold">{utilization}%</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] to-[#FFF0F0] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics & Insights</h1>
          <p className="text-gray-600">Real-time monitoring of blood donation system performance</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Activity className="w-8 h-8 text-[#C62828] animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Heart}
                label="Donations This Month"
                value={analytics.total_donations_this_month}
                change={analytics.donation_growth}
                trend={analytics.donation_growth}
              />
              <StatCard
                icon={Droplet}
                label="Blood Requests"
                value={analytics.total_requests_this_month}
                change={Math.abs(analytics.request_growth)}
                trend={analytics.request_growth}
              />
              <StatCard
                icon={Users}
                label="Active Donors"
                value={analytics.active_donors_count}
                change={8.3}
                trend={1}
              />
              <StatCard
                icon={TrendingUp}
                label="System Health"
                value="98%"
                change={2.1}
                trend={1}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                    <BarChart3 className="w-6 h-6 text-[#C62828]" />
                    <span>Donation Trends</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    { week: 'Week 1', donations: 32, requests: 18 },
                    { week: 'Week 2', donations: 41, requests: 22 },
                    { week: 'Week 3', donations: 38, requests: 25 },
                    { week: 'Week 4', donations: 34, requests: 24 },
                  ].map((item) => (
                    <div key={item.week}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{item.week}</span>
                        <span className="text-sm text-gray-600">
                          {item.donations} donations • {item.requests} requests
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-[#C62828]"
                            style={{ width: `${(item.donations / 45) * 100}%` }}
                          />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${(item.requests / 30) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#C62828]" />
                    <span className="text-gray-600">Donations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-gray-600">Requests</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <AlertIcon className="w-6 h-6 text-red-600" />
                  <span>Critical Alerts</span>
                </h2>

                <div className="space-y-4">
                  {analytics.critical_blood_types.map((bloodType) => (
                    <div key={bloodType} className="p-4 bg-red-50 border-l-4 border-red-600 rounded-lg">
                      <p className="font-semibold text-red-800">{bloodType} Blood Low</p>
                      <p className="text-sm text-red-700 mt-1">Current stock below 60 units</p>
                    </div>
                  ))}

                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                    <p className="font-semibold text-yellow-800">High Request Volume</p>
                    <p className="text-sm text-yellow-700 mt-1">Unusual spike detected this week</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <PieChart className="w-6 h-6 text-[#C62828]" />
                  <span>Blood Type Distribution & Inventory</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.blood_type_distribution.map((bt) => (
                  <BloodTypeCard key={bt.blood_group} {...bt} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">System Performance</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Request Processing</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: '92%' }} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">92% on-time</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Donor Retention</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: '87%' }} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">87% active</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Uptime</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-[#C62828]" style={{ width: '99.9%' }} />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">99.9% uptime</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Top Cities</h3>
                <div className="space-y-3">
                  {['New York', 'Los Angeles', 'Chicago'].map((city, idx) => (
                    <div key={city} className="flex items-center justify-between">
                      <span className="text-gray-700">{city}</span>
                      <span className="text-sm font-semibold text-[#C62828]">{156 - idx * 20} donors</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-gray-700">32 donations completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-gray-700">18 requests fulfilled</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-gray-700">12 new registrations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AlertIcon(props: any) {
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}
