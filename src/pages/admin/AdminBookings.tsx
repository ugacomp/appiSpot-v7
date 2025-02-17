import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Filter, ArrowLeft, MoreVertical, Eye, Check, Ban, RefreshCcw, X } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  spot: {
    name: string;
    host: {
      name: string;
    };
  };
  guest: {
    name: string;
  };
  date: string;
  time: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded' | 'upcoming' | 'paused';
}

const ITEMS_PER_PAGE = 8;

const mockBookings: Booking[] = [
  {
    id: 'BK001',
    spot: {
      name: 'Modern Office Space',
      host: {
        name: 'David Chen'
      }
    },
    guest: {
      name: 'Michael Brown'
    },
    date: 'Mar 1, 2025',
    time: '15:00 - 23:00',
    amount: 747.00,
    status: 'refunded'
  },
  {
    id: 'BK002',
    spot: {
      name: 'Historic Ballroom',
      host: {
        name: 'Sarah Wilson'
      }
    },
    guest: {
      name: 'James Johnson'
    },
    date: 'Jan 31, 2025',
    time: '18:00 - 18:00',
    amount: 448.00,
    status: 'completed'
  },
  {
    id: 'BK003',
    spot: {
      name: 'Downtown Event Space',
      host: {
        name: 'Michael Lee'
      }
    },
    guest: {
      name: 'Emma Wilson'
    },
    date: 'Jan 31, 2025',
    time: '19:00 - 16:00',
    amount: 449.00,
    status: 'completed'
  },
  {
    id: 'BK004',
    spot: {
      name: 'Modern Office Space',
      host: {
        name: 'David Chen'
      }
    },
    guest: {
      name: 'John Smith'
    },
    date: 'Jan 31, 2025',
    time: '10:00 - 13:00',
    amount: 485.00,
    status: 'paused'
  },
  {
    id: 'BK005',
    spot: {
      name: 'Historic Ballroom',
      host: {
        name: 'Sarah Wilson'
      }
    },
    guest: {
      name: 'Sarah Davis'
    },
    date: 'Jan 31, 2025',
    time: '11:00 - 16:00',
    amount: 360.00,
    status: 'upcoming'
  },
  {
    id: 'BK006',
    spot: {
      name: 'Modern Office Space',
      host: {
        name: 'David Chen'
      }
    },
    guest: {
      name: 'James Johnson'
    },
    date: 'Jan 30, 2025',
    time: '15:00 - 23:00',
    amount: 927.00,
    status: 'pending'
  },
  {
    id: 'BK007',
    spot: {
      name: 'Historic Ballroom',
      host: {
        name: 'Sarah Wilson'
      }
    },
    guest: {
      name: 'James Johnson'
    },
    date: 'Feb 9, 2025',
    time: '12:00 - 13:00',
    amount: 991.00,
    status: 'pending'
  },
  {
    id: 'BK008',
    spot: {
      name: 'Modern Office Space',
      host: {
        name: 'David Chen'
      }
    },
    guest: {
      name: 'Michael Brown'
    },
    date: 'Feb 9, 2025',
    time: '18:00 - 13:00',
    amount: 798.00,
    status: 'completed'
  },
  {
    id: 'BK009',
    spot: {
      name: 'Downtown Event Space',
      host: {
        name: 'Michael Lee'
      }
    },
    guest: {
      name: 'John Smith'
    },
    date: 'Feb 9, 2025',
    time: '10:00 - 13:00',
    amount: 743.00,
    status: 'pending'
  }
];

const AdminBookings = ({ type }: { type?: 'upcoming' | 'past' }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
  });

  const handleAction = (action: string, bookingId: string) => {
    switch (action) {
      case 'view':
        navigate(`/admin/bookings/${bookingId}`);
        break;
      case 'approve':
        toast.success('Booking approved successfully');
        break;
      case 'pause':
        toast.success('Booking paused successfully');
        break;
      case 'cancel':
        if (window.confirm('Are you sure you want to cancel this booking?')) {
          toast.success('Booking cancelled successfully');
        }
        break;
      case 'refund':
        if (window.confirm('Are you sure you want to refund this booking?')) {
          toast.success('Refund initiated successfully');
        }
        break;
      default:
        break;
    }
    setActiveDropdown(null);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.actions-dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const filteredBookings = useMemo(() => {
    return mockBookings.filter(booking => {
      const matchesSearch = 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.spot.host.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filters.status || booking.status === filters.status;
      
      if (type === 'upcoming') {
        return booking.status === 'upcoming' || booking.status === 'pending';
      } else if (type === 'past') {
        return ['completed', 'cancelled', 'refunded'].includes(booking.status);
      }

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filters, type]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPageNumbers = useCallback(() => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }, [totalPages]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-2xl font-bold text-gray-900">
            {type === 'upcoming' ? 'Upcoming Bookings' : 
             type === 'past' ? 'Past Bookings' : 
             'All Bookings'}
          </h1>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
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

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                >
                  <option value="">All</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full border-gray-300 rounded-lg focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-[12%] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="w-[18%] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Spot
                  </th>
                  <th className="w-[15%] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Host
                  </th>
                  <th className="w-[15%] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="w-[15%] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="w-[10%] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="w-[10%] px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-[5%] px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBookings.map((booking) => (
                  <tr 
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-base font-medium text-[#2DD4BF]">
                      {booking.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-base text-gray-900">
                      {booking.spot.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-base text-gray-900">
                      {booking.spot.host.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-base text-gray-900">
                      {booking.guest.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                      <div className="text-base">{booking.date}</div>
                      <div className="text-sm">{booking.time}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-base text-gray-900">
                      {formatCurrency(booking.amount)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-base font-medium">
                      <div className="relative actions-dropdown">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === booking.id ? null : booking.id);
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        
                        {activeDropdown === booking.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction('view', booking.id);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye className="h-4 w-4 mr-3" />
                                View Details
                              </button>
                              {booking.status !== 'completed' && (
                                <>
                                  {(booking.status === 'pending' || booking.status === 'paused') && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAction('approve', booking.id);
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <Check className="h-4 w-4 mr-3" />
                                      Approve
                                    </button>
                                  )}
                                  {booking.status !== 'paused' && booking.status !== 'cancelled' && booking.status !== 'refunded' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAction('pause', booking.id);
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <Ban className="h-4 w-4 mr-3" />
                                      Pause
                                    </button>
                                  )}
                                  {booking.status !== 'refunded' && booking.status !== 'cancelled' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAction('refund', booking.id);
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <RefreshCcw className="h-4 w-4 mr-3" />
                                      Refund
                                    </button>
                                  )}
                                  {booking.status !== 'cancelled' && booking.status !== 'refunded' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAction('cancel', booking.id);
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                      <X className="h-4 w-4 mr-3" />
                                      Cancel
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white px-8 py-4 flex items-center justify-center border-t border-gray-200">
            <div className="flex-1 flex justify-center sm:hidden">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
            
            <div className="hidden sm:flex sm:items-center sm:space-x-6">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredBookings.length)}
                </span>{' '}
                of <span className="font-medium">{filteredBookings.length}</span> results
              </p>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm" aria-label="Pagination">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'z-10 bg-[#2DD4BF] border-[#2DD4BF] text-white hover:bg-[#26b8a5]'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;