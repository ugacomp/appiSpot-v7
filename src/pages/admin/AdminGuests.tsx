import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AdminGuests = () => {
  const navigate = useNavigate();

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

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Guests</h1>

        {/* Placeholder content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Guest details coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminGuests;