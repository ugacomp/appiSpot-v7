import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Calendar, ChevronDown, Building2, Users, CreditCard, Download, Filter } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

// Mock data for revenue stats
const revenueStats = {
  totalRevenue: 1250750.00,
  lastMonthRevenue: 125750.00,
  thisMonthRevenue: 98450.00,
  yearlyRevenue: 876500.00,
  revenueGrowth: 15.3,
  topVenues: [
    { id: 'V001', name: 'Downtown Event Space', revenue: 45000, bookings: 32 },
    { id: 'V002', name: 'Sunset Studio', revenue: 38000, bookings: 28 },
    { id: 'V003', name: 'Central Park View', revenue: 35000, bookings: 25 },
    { id: 'V004', name: 'Rooftop Garden', revenue: 32000, bookings: 22 },
    { id: 'V005', name: 'Historic Ballroom', revenue: 30000, bookings: 20 }
  ],
  monthlyData: [
    { month: 'Jan', revenue: 95000, bookings: 150 },
    { month: 'Feb', revenue: 88000, bookings: 145 },
    { month: 'Mar', revenue: 92000, bookings: 160 },
    { month: 'Apr', revenue: 98000, bookings: 165 },
    { month: 'May', revenue: 105000, bookings: 175 },
    { month: 'Jun', revenue: 112000, bookings: 180 },
    { month: 'Jul', revenue: 118000, bookings: 190 },
    { month: 'Aug', revenue: 125000, bookings: 200 },
    { month: 'Sep', revenue: 122000, bookings: 195 },
    { month: 'Oct', revenue: 128000, bookings: 210 },
    { month: 'Nov', revenue: 132000, bookings: 220 },
    { month: 'Dec', revenue: 135750, bookings: 225 }
  ],
  revenueByCategory: [
    { category: 'Venues', revenue: 450000, percentage: 35 },
    { category: 'Studios', revenue: 320000, percentage: 25 },
    { category: 'Outdoor Spaces', revenue: 250000, percentage: 20 },
    { category: 'Offices', revenue: 180000, percentage: 15 },
    { category: 'Others', revenue: 50750, percentage: 5 }
  ]
};

const AdminRevenue = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTimeframe, setSelectedTimeframe] = useState('yearly');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate max revenue for chart scaling
  const maxRevenue = Math.max(...revenueStats.monthlyData.map(d => d.revenue));

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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive overview of your platform's financial performance
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="relative">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="appearance-none bg-white px-4 py-2 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent"
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>

            <button
              onClick={() => {/* Handle export */}}
              className="flex items-center px-4 py-2 bg-[#2DD4BF] text-white rounded-lg hover:bg-[#26b8a5]"
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                >
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                >
                  <option value="">All Categories</option>
                  <option value="venues">Venues</option>
                  <option value="studios">Studios</option>
                  <option value="outdoor">Outdoor Spaces</option>
                  <option value="offices">Offices</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  className="w-full border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                >
                  <option value="">All Locations</option>
                  <option value="ny">New York</option>
                  <option value="la">Los Angeles</option>
                  <option value="ch">Chicago</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                >
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <DollarSign className="h-5 w-5 text-[#2DD4BF]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueStats.totalRevenue)}</p>
            <p className="mt-2 text-sm text-green-600">↑ Overall earnings</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">This Month</h3>
              <TrendingUp className="h-5 w-5 text-[#2DD4BF]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueStats.thisMonthRevenue)}</p>
            <p className="mt-2 text-sm text-green-600">↑ {revenueStats.revenueGrowth}% from last month</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Last Month</h3>
              <Calendar className="h-5 w-5 text-[#2DD4BF]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueStats.lastMonthRevenue)}</p>
            <p className="mt-2 text-sm text-blue-600">Monthly total</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Yearly Revenue</h3>
              <CreditCard className="h-5 w-5 text-[#2DD4BF]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueStats.yearlyRevenue)}</p>
            <p className="mt-2 text-sm text-purple-600">Year to date</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#2DD4BF] rounded-full"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <span className="text-sm text-gray-600">Bookings</span>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] relative">
              <svg className="w-full h-full" viewBox="0 0 800 300">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 75}
                    x2="800"
                    y2={i * 75}
                    stroke="#E5E7EB"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Revenue line */}
                <path
                  d={`M ${revenueStats.monthlyData.map((d, i) => 
                    `${(i * (800 / 11))},${300 - (d.revenue / maxRevenue * 300)}`
                  ).join(' L ')}`}
                  fill="none"
                  stroke="#2DD4BF"
                  strokeWidth="2"
                />

                {/* Revenue area */}
                <path
                  d={`M 0,300 ${revenueStats.monthlyData.map((d, i) => 
                    `${(i * (800 / 11))},${300 - (d.revenue / maxRevenue * 300)}`
                  ).join(' L ')} L 800,300 Z`}
                  fill="url(#gradient)"
                  opacity="0.1"
                />

                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2DD4BF" />
                    <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                {revenueStats.monthlyData.map((d) => (
                  <span key={d.month}>{d.month}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Category</h2>
            <div className="space-y-4">
              {revenueStats.revenueByCategory.map((category) => (
                <div key={category.category}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">{category.category}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(category.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#2DD4BF] h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{category.percentage}% of total revenue</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Venues */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Venues</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revenueStats.topVenues.map((venue) => (
                  <tr key={venue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-[#2DD4BF] mr-3" />
                        <span className="text-sm font-medium text-gray-900">{venue.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{formatCurrency(venue.revenue)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{venue.bookings} bookings</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">12.5%</span>
                      </div>
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

export default AdminRevenue;