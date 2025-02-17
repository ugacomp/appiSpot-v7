import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, User, DollarSign, Building2, Mail, Phone, MessageSquare, CheckCircle, XCircle, AlertCircle, Send } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';

// Mock booking data
const mockBooking = {
  id: 'BK001',
  venue: {
    id: 'V001',
    name: 'Downtown Event Space',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200'
  },
  guest: {
    id: 'G001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567'
  },
  host: {
    id: 'H001',
    name: 'Sarah Wilson',
    email: 'sarah.w@example.com',
    phone: '+1 (555) 987-6543'
  },
  startTime: '2025-02-15T14:00:00',
  endTime: '2025-02-15T18:00:00',
  totalAmount: 450.00,
  status: 'confirmed',
  paymentStatus: 'paid',
  eventType: 'Corporate Event',
  guestCount: 50,
  specialRequests: 'Need projector setup and catering arrangements',
  createdAt: '2025-02-10T09:30:00',
  timeline: [
    {
      time: '2025-02-10T09:30:00',
      type: 'booking_created',
      description: 'Booking request submitted'
    },
    {
      time: '2025-02-10T10:15:00',
      type: 'payment_completed',
      description: 'Payment received'
    },
    {
      time: '2025-02-10T10:30:00',
      type: 'booking_confirmed',
      description: 'Booking confirmed by host'
    }
  ],
  messages: [
    {
      id: 1,
      sender: 'guest',
      content: 'Hi, I have a question about parking arrangements.',
      timestamp: '2025-02-10T11:00:00'
    },
    {
      id: 2,
      sender: 'host',
      content: 'We have dedicated parking spots for up to 20 vehicles.',
      timestamp: '2025-02-10T11:15:00'
    },
    {
      id: 3,
      sender: 'admin',
      content: 'The parking arrangements have been confirmed with the venue.',
      timestamp: '2025-02-10T11:30:00'
    }
  ]
};

const AdminBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    toast.success('Message sent successfully');
    setMessage('');
  };

  const handleStatusChange = (newStatus: string) => {
    toast.success(`Booking status updated to ${newStatus}`);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/admin/bookings')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Bookings
        </button>

        {/* Booking Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Booking #{mockBooking.id}
              </h1>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(mockBooking.status)}`}>
                  {mockBooking.status.charAt(0).toUpperCase() + mockBooking.status.slice(1)}
                </span>
                <span className="text-gray-500">
                  Created on {new Date(mockBooking.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
              {mockBooking.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange('confirmed')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm Booking
                </button>
              )}
              {mockBooking.status !== 'cancelled' && (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Venue Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Venue Information</h2>
              <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                <img
                  src={mockBooking.venue.image}
                  alt={mockBooking.venue.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Building2 className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{mockBooking.venue.name}</p>
                    <p className="text-gray-500">{mockBooking.venue.address}</p>
                    <p className="text-gray-500">
                      {mockBooking.venue.city}, {mockBooking.venue.state} {mockBooking.venue.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(mockBooking.startTime)}
                    </p>
                    <p className="text-gray-500">to</p>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(mockBooking.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Guest Count</p>
                    <p className="font-medium text-gray-900">{mockBooking.guestCount} people</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(mockBooking.totalAmount)}
                    </p>
                    <p className="text-sm text-green-600">Payment {mockBooking.paymentStatus}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Special Requests</p>
                    <p className="font-medium text-gray-900">{mockBooking.specialRequests}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Timeline</h2>
              <div className="space-y-6">
                {mockBooking.timeline.map((event, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-[#2DD4BF] flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guest Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{mockBooking.guest.name}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-900">{mockBooking.guest.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-900">{mockBooking.guest.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Host Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Host Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{mockBooking.host.name}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-900">{mockBooking.host.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-900">{mockBooking.host.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Message</h2>
              <form onSubmit={handleMessageSubmit}>
                <div className="mb-4">
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2DD4BF] focus:ring-[#2DD4BF]"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2DD4BF] hover:bg-[#26b8a5]"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </button>
              </form>

              {/* Message History */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Message History</h3>
                <div className="space-y-4">
                  {mockBooking.messages.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-3">
                      <div className={`h-8 w-8 rounded-full ${
                        msg.sender === 'admin' ? 'bg-[#2DD4BF]' :
                        msg.sender === 'host' ? 'bg-blue-500' :
                        'bg-gray-500'
                      } flex items-center justify-center`}>
                        <span className="text-white text-sm font-medium">
                          {msg.sender[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-900">{msg.content}</p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Booking Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Cancel Booking
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                No, keep it
              </button>
              <button
                onClick={() => {
                  handleStatusChange('cancelled');
                  setShowCancelDialog(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Yes, cancel it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingDetails;