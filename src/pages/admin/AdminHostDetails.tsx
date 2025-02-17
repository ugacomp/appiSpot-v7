import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Star, Building2, DollarSign, Clock, Shield, Check, Ban, Send } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data with all hosts
const mockHosts = [
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
    verificationStatus: 'verified',
    recentActivity: [
      {
        type: 'booking',
        icon: DollarSign,
        iconColor: 'green',
        title: 'New booking for "Manhattan Meeting Space"',
        timestamp: '2 hours ago'
      },
      {
        type: 'spot_added',
        icon: Building2,
        iconColor: 'blue',
        title: 'Added new spot: "Brooklyn Creative Hub"',
        timestamp: '1 day ago'
      },
      {
        type: 'review',
        icon: Star,
        iconColor: 'yellow',
        title: 'Received 5-star rating for "Central Park View Studio"',
        timestamp: '2 days ago'
      },
      {
        type: 'booking',
        icon: DollarSign,
        iconColor: 'green',
        title: 'Completed booking #1234 - $850 earned',
        timestamp: '3 days ago'
      }
    ],
    messages: [
      {
        sender: 'admin',
        content: "Congratulations on reaching 100+ bookings! Your spaces are performing exceptionally well.",
        timestamp: '1 day ago'
      },
      {
        sender: 'host',
        content: "Thank you! I'm really happy with how things are going. Planning to add two more spaces next month.",
        timestamp: '1 day ago'
      },
      {
        sender: 'admin',
        content: "That's great to hear! Let us know if you need any help with the new listings.",
        timestamp: '1 day ago'
      },
      {
        sender: 'host',
        content: "Will do. By the way, is there any update on the premium host program we discussed?",
        timestamp: '5 hours ago'
      }
    ],
    metrics: {
      revenueGrowth: 25,
      spotGrowth: 2,
      bookingGrowth: 32,
      ratingGrowth: 0.2
    }
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
    verificationStatus: 'pending',
    recentActivity: [
      {
        type: 'spot_added',
        icon: Building2,
        iconColor: 'blue',
        title: 'Added new spot: "Sunset Studio Space"',
        timestamp: '1 day ago'
      },
      {
        type: 'booking',
        icon: DollarSign,
        iconColor: 'green',
        title: 'Received payment for booking #4567',
        timestamp: '2 days ago'
      },
      {
        type: 'verification',
        icon: Shield,
        iconColor: 'yellow',
        title: 'Submitted verification documents',
        timestamp: '3 days ago'
      },
      {
        type: 'review',
        icon: Star,
        iconColor: 'yellow',
        title: 'Received 5-star rating for "Beachside Event Space"',
        timestamp: '4 days ago'
      }
    ],
    messages: [
      {
        sender: 'admin',
        content: "Hi Sarah, we have received your verification documents. We will review them within 24-48 hours.",
        timestamp: '3 days ago'
      },
      {
        sender: 'host',
        content: "Thank you! Looking forward to getting verified and listing more spaces.",
        timestamp: '3 days ago'
      },
      {
        sender: 'admin',
        content: "Your first spot 'Beachside Event Space' is performing really well! Consider adding more photos to showcase the ocean view.",
        timestamp: '5 days ago'
      },
      {
        sender: 'host',
        content: "Great suggestion! I will add more photos this weekend.",
        timestamp: '5 days ago'
      }
    ],
    metrics: {
      revenueGrowth: 18,
      spotGrowth: 1,
      bookingGrowth: 25,
      ratingGrowth: 0.3
    }
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
    verificationStatus: 'rejected',
    recentActivity: [
      {
        type: 'warning',
        icon: Shield,
        iconColor: 'red',
        title: 'Account suspended due to multiple guest complaints',
        timestamp: '2 hours ago'
      },
      {
        type: 'booking',
        icon: DollarSign,
        iconColor: 'red',
        title: 'Booking #789 cancelled by guest',
        timestamp: '1 day ago'
      },
      {
        type: 'review',
        icon: Star,
        iconColor: 'yellow',
        title: 'Received 2-star rating for "Miami Beach Studio"',
        timestamp: '2 days ago'
      },
      {
        type: 'verification',
        icon: Shield,
        iconColor: 'red',
        title: 'Verification documents rejected',
        timestamp: '4 days ago'
      }
    ],
    messages: [
      {
        sender: 'admin',
        content: "Hello Emily, your account has been suspended due to multiple guest complaints regarding cleanliness and communication issues. Please address these concerns to have your account reinstated.",
        timestamp: '2 hours ago'
      },
      {
        sender: 'host',
        content: "I understand the concerns. I've been dealing with some personal issues that affected my hosting. I'm committed to improving and would like to know what steps I need to take to get my account reinstated.",
        timestamp: '1 hour ago'
      },
      {
        sender: 'admin',
        content: "To reinstate your account, you'll need to: 1) Complete our host training program, 2) Update your property's cleaning protocols, and 3) Maintain timely communication with guests. Would you like us to send you the training materials?",
        timestamp: '45 minutes ago'
      },
      {
        sender: 'host',
        content: "Yes, please send the training materials. I want to improve my hosting standards and regain the trust of the platform.",
        timestamp: '30 minutes ago'
      }
    ],
    metrics: {
      revenueGrowth: -45,
      spotGrowth: 0,
      bookingGrowth: -60,
      ratingGrowth: -0.8
    }
  }
];

const AdminHostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const host = mockHosts.find(h => h.id === id);

  if (!host) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/admin/hosts')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Hosts
          </button>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900">Host not found</h2>
            <p className="mt-2 text-gray-600">The host you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'suspend':
        if (window.confirm(`Are you sure you want to suspend ${host.name}?`)) {
          toast.success(`${host.name} has been suspended`);
        }
        break;
      case 'activate':
        toast.success(`${host.name} has been activated`);
        break;
      default:
        break;
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.success(`Message sent to ${host?.name}`);
    setMessage('');
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
          onClick={() => navigate('/admin/hosts')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Hosts
        </button>

        {/* Host Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-[#2DD4BF] flex items-center justify-center">
                <span className="text-white text-2xl font-medium">
                  {host.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{host.name}</h1>
                <p className="text-gray-500">Member since {new Date(host.joinedDate).toLocaleDateString()}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                    host.status === 'active' ? 'bg-green-100 text-green-800' :
                    host.status === 'suspended' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {host.status.charAt(0).toUpperCase() + host.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                    host.verificationStatus === 'verified' ? 'bg-blue-100 text-blue-800' :
                    host.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {host.verificationStatus.charAt(0).toUpperCase() + host.verificationStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <div>
              {host.status === 'active' ? (
                <button
                  onClick={() => handleAction('suspend')}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Ban className="h-5 w-5 inline-block mr-2" />
                  Suspend Host
                </button>
              ) : (
                <button
                  onClick={() => handleAction('activate')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Check className="h-5 w-5 inline-block mr-2" />
                  Activate Host
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{host.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{host.phone}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-gray-900">{host.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Join Date</p>
                <p className="text-gray-900">{new Date(host.joinedDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <DollarSign className="h-5 w-5 text-[#2DD4BF]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">${host.revenue.toLocaleString()}</p>
            <p className="mt-2 text-sm text-green-600">↑ {host.metrics.revenueGrowth}% from last month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Active Spots</h3>
              <Building2 className="h-5 w-5 text-[#2DD4BF]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{host.totalSpots}</p>
            <p className="mt-2 text-sm text-green-600">↑ {host.metrics.spotGrowth} new this month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
              <Clock className="h-5 w-5 text-[#2DD4BF]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{host.totalBookings}</p>
            <p className="mt-2 text-sm text-green-600">↑ {host.metrics.bookingGrowth}% from last month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Rating</h3>
              <Shield className="h-5 w-5 text-[#2DD4BF]" />
            </div>
            <div className="flex items-center">
              {renderStars(host.rating)}
            </div>
            <p className="mt-2 text-sm text-green-600">↑ {host.metrics.ratingGrowth} from last month</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {host.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className={`h-8 w-8 rounded-full bg-${activity.iconColor}-100 flex items-center justify-center`}>
                  <activity.icon className={`h-4 w-4 text-${activity.iconColor}-600`} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Message to Host</h2>
          <form onSubmit={handleMessageSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#2DD4BF] focus:border-[#2DD4BF] resize-none"
                  placeholder={`Write a message to ${host?.name}...`}
                ></textarea>
                <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                  {message.length}/500
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="urgent"
                  className="rounded border-gray-300 text-[#2DD4BF] focus:ring-[#2DD4BF]"
                />
                <label htmlFor="urgent" className="text-sm text-gray-700">
                  Mark as urgent
                </label>
              </div>

              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2DD4BF] hover:bg-[#26b8a5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2DD4BF]"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </button>
            </div>
          </form>

          {/* Message History */}
          <div className="mt-8">
            <h3 className="text-md font-medium text-gray-900 mb-4">Recent Messages</h3>
            <div className="space-y-4">
              {host.messages.map((msg, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`h-8 w-8 rounded-full ${
                    msg.sender === 'admin' ? 'bg-[#2DD4BF]' : 'bg-gray-100'
                  } flex items-center justify-center`}>
                    <span className={`${
                      msg.sender === 'admin' ? 'text-white' : 'text-gray-600'
                    } text-sm font-medium`}>
                      {msg.sender === 'admin' ? 'A' : host.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {msg.sender === 'admin' ? 'Admin' : host.name}
                      </span>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHostDetails;