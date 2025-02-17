import React from 'react';
import { Users, Shield, Clock, Map } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">About appiSpot</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            We're revolutionizing the way people find and book unique spaces for their events and activities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-16">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center group hover:scale-105 transition-transform duration-300">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-[#2DD4BF] mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Community First</h3>
            <p className="text-sm sm:text-base text-gray-600">Bringing people together through shared spaces</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center group hover:scale-105 transition-transform duration-300">
            <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-[#2DD4BF] mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Secure Booking</h3>
            <p className="text-sm sm:text-base text-gray-600">Safe and secure transactions for peace of mind</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center group hover:scale-105 transition-transform duration-300">
            <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-[#2DD4BF] mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Flexible Hours</h3>
            <p className="text-sm sm:text-base text-gray-600">Book spaces by the hour, on your schedule</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center group hover:scale-105 transition-transform duration-300">
            <Map className="h-10 w-10 sm:h-12 sm:w-12 text-[#2DD4BF] mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Local Spaces</h3>
            <p className="text-sm sm:text-base text-gray-600">Discover unique venues in your area</p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#2DD4BF] rounded-full"></div>
            <div className="pl-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Mission</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                At appiSpot, we believe that every space has potential and every gathering deserves the perfect venue. 
                Our mission is to connect space owners with people who need them, creating opportunities for meaningful 
                experiences and community connections. Whether you're hosting a workshop, celebration, or meeting, 
                we're here to help you find the ideal spot.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#2DD4BF]">
              <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-sm text-gray-600">
                We're constantly evolving our platform to make space discovery and booking seamless.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#2DD4BF]">
              <h3 className="font-semibold text-gray-900 mb-2">Trust</h3>
              <p className="text-sm text-gray-600">
                Building reliable connections between hosts and guests is our top priority.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#2DD4BF]">
              <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-sm text-gray-600">
                We foster meaningful connections and shared experiences through our platform.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#2DD4BF]">
              <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-sm text-gray-600">
                Making unique spaces available to everyone, whenever they need them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;