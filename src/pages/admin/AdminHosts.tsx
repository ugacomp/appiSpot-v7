import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Star, MapPin, Building2, Calendar, ChevronRight } from 'lucide-react';

interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  status: 'active' | 'pending' | 'suspended';
  rating: number;
  totalSpots: number;
  totalBookings: number;
  revenue: number;
  location: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
}

const mockHosts: Host[] = [
  {
    id: 'HOST001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    joinedDate: '2024-01-15',
    status: 'active',
    rating: 4.8,
    totalSpots: 5,
    totalBookings: 127,
    revenue: 15750.00,
    location: 'New York, NY',
    verificationStatus: 'verified'
  },
  {
    id: 'HOST002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 234-5678',
    joinedDate: '2024-01-20',
    status: 'pending',
    rating: 4.5,
    totalSpots: 2,
    totalBookings: 45,
    revenue: 5890.00,
    location: 'Los Angeles, CA',
    verificationStatus: 'pending'
  },
  {
    id: 'HOST003',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    phone: '+1 (555) 345-6789',
    joinedDate: '2024-01-25',
    status: 'active',
    rating: 4.9,
    totalSpots: 8,
    totalBookings: 203,
    revenue: 25430.00,
    location: 'Chicago, IL',
    verificationStatus: 'verified'
  },
  {
    id: 'HOST004',
    name: 'Emily Brown',
    email: 'emily.b@example.com',
    phone: '+1 (555) 456-7890',
    joinedDate: '2024-01-30',
    status: 'suspended',
    rating: 3.7,
    totalSpots: 1,
    totalBookings: 12,
    revenue: 1500.00,
    location: 'Miami, FL',
    verificationStatus: 'rejected'
  },
  {
    id: 'HOST005',
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '+1 (555) 567-8901',
    joinedDate: '2024-02-01',
    status: 'active',
    rating: 4.7,
    totalSpots: 4,
    totalBookings: 89,
    revenue: 11200.00,
    location: 'Seattle, WA',
    verificationStatus: 'verified'
  }
];

const AdminHosts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    verificationStatus: '',
    rating: '',
    joinDate: ''
  });

  const filteredHosts = mockHosts.filter(host => {
    const matchesSearch = 
      host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      host.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      host.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || host.status === filters.status;
    const matchesVerification = !filters.verificationStatus || host.verificationStatus === filters.verificationStatus;
    const matchesRating = !filters.rating || (
      filters.rating === 'high' ? host.rating >= 4.5 :
      filters.rating === 'medium' ? (host.rating >= 4.0 && host.rating < 4.5) :
      host.rating < 4.0
    );

    return matchesSearch && matchesStatus && matchesVerification && matchesRating;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'fill-[#FFD700] text-[#FFD700]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Hosts Management</h1>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search hosts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Hosts</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">1,234</p>
            <p className="mt-1 text-sm text-green-600">↑ 12% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Active Hosts</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">987</p>
            <p className="mt-1 text-sm text-green-600">↑ 8% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Pending Verification</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">45</p>
            <p className="mt-1 text-sm text-yellow-600">↑ 5 new this week</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">4.7</p>
            <p className="mt-1 text-sm text-green-600">↑ 0.2 from last month</p>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification
                </label>
                <select
                  value={filters.verificationStatus}
                  onChange={(e) => setFilters(prev => ({ ...prev, verificationStatus: e.target.value }))}
                  className="w-full border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                >
                  <option value="">All</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                  className="w-full border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                >
                  <option value="">All Ratings</option>
                  <option value="high">High (4.5+)</option>
                  <option value="medium">Medium (4.0-4.4)</option>
                  <option value="low">Low (&lt;4.0)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date
                </label>
                <select
                  value={filters.joinDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, joinDate: e.target.value }))}
                  className="w-full border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                >
                  <option value="">All Time</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Hosts List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Host
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spots
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHosts.map((host) => (
                  <tr key={host.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#2DD4BF] flex items-center justify-center">
                          <span className="text-white font-medium">
                            {host.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{host.name}</div>
                          <div className="text-sm text-gray-500">{host.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {host.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(host.status)}`}>
                        {host.status.charAt(0).toUpperCase() + host.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getVerificationColor(host.verificationStatus)}`}>
                        {host.verificationStatus.charAt(0).toUpperCase() + host.verificationStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(host.rating)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {host.totalSpots} spots
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${host.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/admin/hosts/${host.id}`)}
                        className="text-[#2DD4BF] hover:text-[#26b8a5] transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHosts;