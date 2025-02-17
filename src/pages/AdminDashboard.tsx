import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, TrendingUp, ChevronDown, Clock, Building2, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Mock data for today's bookings
const todaysBookings = [
  {
    id: 'BK001',
    venueName: 'Downtown Event Space',
    time: '10:00 AM - 2:00 PM',
    guestName: 'John Smith',
    amount: 450.00,
    status: 'confirmed'
  },
  {
    id: 'BK002',
    venueName: 'Sunset Studio',
    time: '3:00 PM - 7:00 PM',
    guestName: 'Sarah Johnson',
    amount: 320.00,
    status: 'pending'
  },
  {
    id: 'BK003',
    venueName: 'Central Park View',
    time: '6:00 PM - 10:00 PM',
    guestName: 'Michael Brown',
    amount: 580.00,
    status: 'confirmed'
  },
  {
    id: 'BK004',
    venueName: 'Rooftop Garden',
    time: '12:00 PM - 4:00 PM',
    guestName: 'Emily Davis',
    amount: 490.00,
    status: 'confirmed'
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [currentDate.getFullYear(), currentDate.getFullYear() - 1];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  // Revenue and performance stats
  const venueStats = [
    {
      title: 'Venues Booked Today',
      value: '156',
      icon: Building2,
      change: 12.5,
      changeText: 'Up from yesterday',
      color: 'bg-purple-500',
      gradient: 'from-purple-500/10 to-purple-500/5',
      onClick: () => navigate('/admin/bookings')
    },
    {
      title: 'Revenue Last Month',
      value: formatCurrency(125750),
      icon: DollarSign,
      change: 8.2,
      changeText: 'vs previous month',
      color: 'bg-blue-500',
      gradient: 'from-blue-500/10 to-blue-500/5',
      onClick: () => navigate('/admin/revenue')
    },
    {
      title: 'Revenue This Month',
      value: formatCurrency(98450),
      icon: DollarSign,
      change: 15.3,
      changeText: 'Projected increase',
      color: 'bg-green-500',
      gradient: 'from-green-500/10 to-green-500/5',
      onClick: () => navigate('/admin/revenue')
    },
    {
      title: 'Host Payouts Last Month',
      value: formatCurrency(100600),
      icon: CreditCard,
      change: 7.8,
      changeText: 'vs previous month',
      color: 'bg-orange-500',
      gradient: 'from-orange-500/10 to-orange-500/5',
      onClick: () => navigate('/admin/revenue')
    },
    {
      title: 'Host Payouts This Month',
      value: formatCurrency(78760),
      icon: CreditCard,
      change: 14.2,
      changeText: 'Projected increase',
      color: 'bg-pink-500',
      gradient: 'from-pink-500/10 to-pink-500/5',
      onClick: () => navigate('/admin/revenue')
    }
  ];

  // Management stats
  const managementStats = [
    {
      title: 'Total Bookings',
      value: '40,689',
      change: 8.5,
      changeText: 'Up from yesterday',
      icon: Calendar,
      onClick: () => navigate('/admin/bookings'),
      gradient: 'from-indigo-500/10 to-indigo-500/5'
    },
    {
      title: 'Total Hosts',
      value: '10,293',
      change: 1.3,
      changeText: 'Up from past week',
      icon: Users,
      onClick: () => navigate('/admin/hosts'),
      gradient: 'from-cyan-500/10 to-cyan-500/5'
    },
    {
      title: 'Total Guests',
      value: '10,293',
      change: 1.3,
      changeText: 'Up from past week',
      icon: Users,
      onClick: () => navigate('/admin/guests'),
      gradient: 'from-teal-500/10 to-teal-500/5'
    },
    {
      title: 'Upcoming Bookings',
      value: '10,293',
      change: 1.3,
      changeText: 'Up from past week',
      icon: Clock,
      onClick: () => navigate('/admin/bookings/upcoming'),
      gradient: 'from-emerald-500/10 to-emerald-500/5'
    },
    {
      title: 'Past Bookings',
      value: '10,293',
      change: 1.3,
      changeText: 'Up from past week',
      icon: Clock,
      onClick: () => navigate('/admin/bookings/past'),
      gradient: 'from-rose-500/10 to-rose-500/5'
    }
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateRevenueData = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    return Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      revenue: Math.floor(Math.random() * 75000) + 25000,
    }));
  };

  const [revenueData, setRevenueData] = useState(generateRevenueData());

  useEffect(() => {
    setRevenueData(generateRevenueData());
  }, [selectedMonth, selectedYear]);

  const bookingsData = {
    completed: 32,
    upcoming: 41,
    cancelled: 27,
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome Back, Admin
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Here's what's happening with your venues today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {formatDate(new Date())}
              </span>
              <button 
                onClick={() => navigate('/admin/settings')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Revenue Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {venueStats.map((stat, index) => (
              <div
                key={index}
                onClick={stat.onClick}
                className={`relative overflow-hidden bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${stat.onClick ? 'cursor-pointer' : ''}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-40 pointer-events-none`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">{stat.title}</span>
                    <div className={`w-10 h-10 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center ${stat.onClick ? 'group-hover:scale-110 transition-transform duration-300' : ''}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">{stat.change}%</span>
                    <span className="text-gray-500 ml-1">{stat.changeText}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Management Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Management Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {managementStats.map((stat, index) => (
              <div
                key={index}
                onClick={stat.onClick}
                className="relative overflow-hidden bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">{stat.title}</span>
                    <div className="w-10 h-10 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-[#2DD4BF] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">{stat.change}%</span>
                    <span className="text-gray-500 ml-1">{stat.changeText}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Bookings Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today's Venue Bookings</h2>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="text-[#2DD4BF] hover:text-[#26b8a5] text-sm font-medium flex items-center"
            >
              View all bookings
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todaysBookings.map((booking) => (
                    <tr 
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-[#2DD4BF] mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {booking.venueName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">
                            {booking.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {booking.guestName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(booking.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/bookings/${booking.id}`);
                          }}
                          className="text-[#2DD4BF] hover:text-[#26b8a5]"
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div 
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/admin/revenue')}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-[#2DD4BF]">{formatCurrency(240800)}</span>
                  <span className="ml-2 text-sm text-gray-500">USD</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="appearance-none bg-gray-50 px-4 py-2 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="appearance-none bg-gray-50 px-4 py-2 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="h-[300px] relative">
              <svg className="w-full h-full" viewBox="0 0 800 300">
                {[0, 1, 2, 3].map((i) => (
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
                
                <path
                  d={`M ${revenueData.map((d, i) => `${(i * (800 / (revenueData.length - 1)))},${300 - (d.revenue / 100000 * 300)}`).join(' L ')}`}
                  fill="none"
                  stroke="#2DD4BF"
                  strokeWidth="2"
                />
                
                <path
                  d={`M 0,300 ${revenueData.map((d, i) => `${(i * (800 / (revenueData.length - 1)))},${300 - (d.revenue / 100000 * 300)}`).join(' L ')} L 800,300 Z`}
                  fill="url(#gradient)"
                  opacity="0.1"
                />
                
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2DD4BF" />
                    <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                {revenueData.map((d, i) => (
                  <span key={i} className={i % 2 === 0 ? 'block' : 'hidden sm:block'}>
                    {d.day}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bookings Chart */}
          <div 
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/admin/bookings')}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Distribution</h2>
            <div className="relative h-[300px]">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#2DD4BF"
                  strokeWidth="20"
                  strokeDasharray={`${bookingsData.completed * 2.51} ${200 - bookingsData.completed * 2.51}`}
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="20"
                  strokeDasharray={`${bookingsData.upcoming * 2.51} ${200 - bookingsData.upcoming * 2.51}`}
                  strokeDashoffset={-bookingsData.completed * 2.51}
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="20"
                  strokeDasharray={`${bookingsData.cancelled * 2.51} ${200 - bookingsData.cancelled * 2.51}`}
                  strokeDashoffset={-(bookingsData.completed + bookingsData.upcoming) * 2.51}
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            
            <div className="flex flex-col space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#2DD4BF] mr-2"></div>
                  <span className="text-sm">Completed</span>
                </div>
                <span className="font-medium">{bookingsData.completed}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#A855F7] mr-2"></div>
                  <span className="text-sm">Upcoming</span>
                </div>
                <span className="font-medium">{bookingsData.upcoming}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#9CA3AF] mr-2"></div>
                  <span className="text-sm">Cancelled</span>
                </div>
                <span className="font-medium">{bookingsData.cancelled}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;