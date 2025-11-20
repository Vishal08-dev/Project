import { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Droplet,
  Users,
  Filter,
  X,
  Check,
  Phone,
  Mail,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../services/api';

interface Donor {
  id: number;
  full_name: string;
  blood_group: string;
  email: string;
  contact: string;
  city: string;
  status: string;
  last_donation_date?: string;
}

interface SearchFilters {
  bloodGroup: string;
  city: string;
  availability: string;
}

export default function DonorSearch() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    bloodGroup: '',
    city: '',
    availability: 'all',
  });

  useEffect(() => {
    loadDonors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, donors]);

  const loadDonors = async () => {
    setLoading(true);
    const result = await api.donors.getAll();
    if (result.data) {
      const approvedDonors = result.data.donors.filter((d: any) => d.status === 'approved');
      setDonors(approvedDonors);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let result = donors;

    if (searchTerm) {
      result = result.filter((d) =>
        d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.contact.includes(searchTerm)
      );
    }

    if (filters.bloodGroup) {
      result = result.filter((d) => d.blood_group === filters.bloodGroup);
    }

    if (filters.city) {
      result = result.filter((d) =>
        d.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    setFilteredDonors(result);
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const DonorCard = ({ donor }: { donor: Donor }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-l-4 border-[#C62828]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{donor.full_name}</h3>
          <p className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
            <MapPin className="w-4 h-4" />
            <span>{donor.city}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block px-4 py-2 bg-[#C62828] text-white rounded-full font-bold text-lg">
            {donor.blood_group}
          </span>
        </div>
      </div>

      <div className="space-y-3 my-4">
        <div className="flex items-center space-x-3">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">{donor.email}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">{donor.contact}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-600">Verified</span>
        </div>
        <button className="px-4 py-2 bg-[#C62828] text-white rounded-lg hover:bg-[#a02020] transition-colors text-sm font-medium">
          Request Blood
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 bg-gradient-to-br from-[#FFE5E5] to-[#FFF0F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Donors</h1>
            <p className="text-gray-600">Search and connect with verified blood donors in your area</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:border-transparent"
                />
              </div>

              <div>
                <select
                  value={filters.bloodGroup}
                  onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:border-transparent"
                >
                  <option value="">All Blood Groups</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-700">Filters</span>
              </button>
            </div>

            {showFilters && (
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      placeholder="Enter city name..."
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <select
                      value={filters.availability}
                      onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:border-transparent"
                    >
                      <option value="all">All Donors</option>
                      <option value="available">Available Now</option>
                      <option value="soon">Available Soon</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 font-medium">
              Found <span className="text-[#C62828] font-bold">{filteredDonors.length}</span> donors
            </p>
            {(searchTerm || filters.bloodGroup || filters.city) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ bloodGroup: '', city: '', availability: 'all' });
                }}
                className="flex items-center space-x-2 text-sm text-[#C62828] hover:text-[#a02020] transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-[#C62828] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading donors...</p>
              </div>
            </div>
          ) : filteredDonors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonors.map((donor) => (
                <DonorCard key={donor.id} donor={donor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Donors Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ bloodGroup: '', city: '', availability: 'all' });
                }}
                className="px-6 py-3 bg-[#C62828] text-white rounded-lg hover:bg-[#a02020] transition-colors font-medium"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
