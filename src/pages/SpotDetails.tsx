import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Users, Star, Building2, Calendar, Clock, Shield, Wifi, Car, Coffee, Music, Accessibility, File as Toilet, X, DollarSign, Menu } from 'lucide-react';
import { getSpot } from '../lib/spots';
import { formatCurrency } from '../utils/format';
import toast from 'react-hot-toast';
import ImageCarousel from '../components/ImageCarousel';
import ImageViewer from '../components/ImageViewer';
import type { Spot } from '../lib/database.types';

interface TimeInputs {
  hours: string;
  minutes: string;
}

interface Spot {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  capacity: number;
  price_per_hour: number;
  type: string;
  features: {
    parking: boolean;
    wifi: boolean;
    accessibility: boolean;
    kitchen: boolean;
    sound_system: boolean;
    restrooms: boolean;
  };
  amenities: string[];
  rules: string;
  featured_image: string | null;
  square_footage: number;
  rating: number;
  gallery_images?: string[];
  opening_hours?: {
    [key: string]: string;
  };
}

const SpotDetails = () => {
  const { id } = useParams();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [startTime, setStartTime] = useState<TimeInputs>({ hours: '', minutes: '' });
  const [endTime, setEndTime] = useState<TimeInputs>({ hours: '', minutes: '' });
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [guestCount, setGuestCount] = useState('');
  const [eventType, setEventType] = useState('');
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const openingHours = {
    'Sunday': '10:00:00 - 18:00:00',
    'Monday': '10:00:00 - 18:00:00',
    'Tuesday': '10:00:00 - 18:00:00',
    'Wednesday': '10:00:00 - 18:00:00',
    'Thursday': '10:00:00 - 18:00:00',
    'Friday': '10:00:00 - 18:00:00',
    'Saturday': '10:00:00 - 18:00:00'
  };

  const recommendedFor = [
    'Birthday Party',
    'Gathering',
    'Baby Shower',
    'Wellness'
  ];

  const spotRules = [
    'No Smoking',
    'No Alcohol',
    'No Drugs',
    'No Littering',
    'No Sleeping in Vehicle',
    'No Selling of Alcohol',
    'No Overcrowding'
  ];

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const allImages = useMemo(() => {
    if (!spot) return [];
    return [
      spot.featured_image,
      ...(spot.gallery_images || [])
    ].filter((img): img is string => Boolean(img));
  }, [spot]);

  useEffect(() => {
    fetchSpotDetails();
  }, [id]);

  const fetchSpotDetails = async () => {
    try {
      const data = await getSpot(id!);
      setSpot({
        ...data,
        rating: 5
      });
    } catch (error: any) {
      toast.error('Error loading spot details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = useCallback((rating: number) => {
    return (
      <div className="flex">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 sm:h-5 sm:w-5 fill-[#FFD700] text-[#FFD700]" />
        ))}
      </div>
    );
  }, []);

  const calculateTotalCost = useMemo(() => {
    if (!spot || !startTime.hours || !startTime.minutes || !endTime.hours || !endTime.minutes) {
      return null;
    }

    const startDate = new Date();
    startDate.setHours(parseInt(startTime.hours), parseInt(startTime.minutes), 0);

    const endDate = new Date();
    endDate.setHours(parseInt(endTime.hours), parseInt(endTime.minutes), 0);

    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const durationInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const totalCost = spot.price_per_hour * durationInHours;

    return Math.round(totalCost * 100) / 100;
  }, [spot, startTime.hours, startTime.minutes, endTime.hours, endTime.minutes]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Booking functionality coming soon!');
  };

  const tabs = ['Overview', 'Rules & Info', 'Reviews', 'Host Details', 'Cancellation Policy'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2DD4BF]"></div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Spot not found</h2>
          <p className="mt-2 text-gray-600">The spot you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="px-0 sm:px-6 lg:px-8 pt-0 sm:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            <div className="lg:col-span-8 h-[300px] sm:h-[400px] lg:h-[500px]">
              <img
                src={spot?.featured_image || "https://images.unsplash.com/photo-1497366216548-37526070297c"}
                alt="Main"
                className="w-full h-full object-cover sm:rounded-lg cursor-pointer"
                onClick={() => {
                  setSelectedImageIndex(0);
                  setShowImageViewer(true);
                }}
              />
            </div>
            
            <div className="lg:col-span-4 hidden lg:grid grid-cols-1 gap-2">
              {spot?.gallery_images?.slice(0, 2).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-[246px] object-cover rounded-lg cursor-pointer"
                  onClick={() => {
                    setSelectedImageIndex(index + 1);
                    setShowImageViewer(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg lg:hidden z-20">
          <button
            onClick={() => setShowMobileBooking(!showMobileBooking)}
            className="w-full bg-[#2DD4BF] text-white py-3 rounded-md font-medium flex items-center justify-center space-x-2"
          >
            <span>{showMobileBooking ? 'Hide Booking Form' : 'Book Now'}</span>
            <span className="font-bold">{formatCurrency(spot?.price_per_hour || 0)}/hr</span>
          </button>
        </div>

        {showMobileBooking && (
          <div className="fixed inset-0 bg-white z-30 lg:hidden overflow-y-auto">
            <div className="p-4">
              <button
                onClick={() => setShowMobileBooking(false)}
                className="absolute top-4 right-4 p-2"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="pt-8">
                <div className="bg-white rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-2xl font-bold text-[#2DD4BF]">
                      {formatCurrency(spot.price_per_hour)}<span className="text-sm font-normal">/hour</span>
                    </div>
                    {renderStars(spot.rating)}
                  </div>

                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check in</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start time</label>
                        <input
                          type="time"
                          value={`${startTime.hours}:${startTime.minutes}`}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            setStartTime({ hours, minutes });
                          }}
                          className="w-full border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End time</label>
                        <input
                          type="time"
                          value={`${endTime.hours}:${endTime.minutes}`}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            setEndTime({ hours, minutes });
                          }}
                          className="w-full border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guests ({spot.capacity} max)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={spot.capacity}
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        What are you planning for?
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                        required
                      >
                        <option value="">Select event type</option>
                        <option value="wedding">Wedding</option>
                        <option value="baby_shower">Baby Shower</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {calculateTotalCost !== null && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Total amount</span>
                          <span className="font-bold text-[#2DD4BF]">{formatCurrency(calculateTotalCost)}</span>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#2DD4BF] text-white py-3 rounded-md hover:bg-[#26b8a5] transition-colors font-medium"
                    >
                      Book a Spot
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 mt-4 sm:mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
              <nav className="flex space-x-8 whitespace-nowrap py-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-[#2DD4BF] text-[#2DD4BF]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{spot.name}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 text-[#2DD4BF] mr-1" />
                    <span>{`${spot.city}, ${spot.state}`}</span>
                  </div>
                  <div className="flex items-center">
                    {renderStars(spot.rating)}
                    <span className="ml-1 text-gray-600">(20 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-[#2DD4BF] flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">GS</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">George Samuel</h3>
                    <p className="text-gray-600">Host since 2023</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Check in</h4>
                    <p className="mt-1 text-lg font-semibold">10:00 AM</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Check out</h4>
                    <p className="mt-1 text-lg font-semibold">12:00 PM</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Capacity</h4>
                    <p className="mt-1 text-lg font-semibold">{spot.capacity} guests</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Size</h4>
                    <p className="mt-1 text-lg font-semibold">{spot.square_footage} sq ft</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About this spot</h2>
                <p className="text-gray-600 whitespace-pre-line">{spot.description}</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What the spot is recommended for?</h2>
                <ul className="space-y-2">
                  {recommendedFor.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-[#2DD4BF] rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What are the rules for the spot?</h2>
                <ul className="space-y-2">
                  {spotRules.map((rule, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-[#2DD4BF] rounded-full mr-3"></span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">When are we open?</h2>
                <div className="space-y-2">
                  {Object.entries(openingHours).map(([day, hours]) => {
                    const [start, end] = hours.split(' - ');
                    return (
                      <div key={day} className="flex justify-between items-center text-gray-600">
                        <span className="font-medium">{day}</span>
                        <span>{formatTime(start)} - {formatTime(end)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6">
                  {Object.entries(spot.features).map(([key, enabled]) => {
                    if (!enabled) return null;
                    const Icon = {
                      wifi: Wifi,
                      parking: Car,
                      kitchen: Coffee,
                      sound_system: Music,
                      accessibility: Accessibility,
                      restrooms: Toilet
                    }[key];
                    return (
                      <div key={key} className="flex items-center space-x-3">
                        {Icon && <Icon className="h-5 w-5 text-[#2DD4BF]" />}
                        <span className="text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                      </div>
                    );
                  })}
                  {spot.amenities?.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-[#2DD4BF]" />
                      <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">House Rules</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-[#2DD4BF] mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Cancellation policy</h3>
                      <p className="text-gray-600 text-sm">Free cancellation up to 24 hours before check-in</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-[#2DD4BF] mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">House rules</h3>
                      <ul className="text-gray-600 text-sm space-y-2 mt-2">
                        <li>• No smoking</li>
                        <li>• No parties or events without prior approval</li>
                        <li>• Quiet hours from 10:00 PM to 7:00 AM</li>
                        <li>• Clean up after your event</li>
                        {spot.rules && <li>• {spot.rules}</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-[88px]">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-2xl font-bold text-[#2DD4BF]">
                      {formatCurrency(spot.price_per_hour)}<span className="text-sm font-normal">/hour</span>
                    </div>
                    {renderStars(spot.rating)}
                  </div>

                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check in</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start time</label>
                        <input
                          type="time"
                          value={`${startTime.hours}:${startTime.minutes}`}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            setStartTime({ hours, minutes });
                          }}
                          className="w-full border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End time</label>
                        <input
                          type="time"
                          value={`${endTime.hours}:${endTime.minutes}`}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            setEndTime({ hours, minutes });
                          }}
                          className="w-full border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guests ({spot.capacity} max)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={spot.capacity}
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        What are you planning for?
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full border-gray-300 rounded-md focus:ring-[#2DD4BF] focus:border-[#2DD4BF]"
                        required
                      >
                        <option value="">Select event type</option>
                        <option value="wedding">Wedding</option>
                        <option value="baby_shower">Baby Shower</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {calculateTotalCost !== null && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Total amount</span>
                          <span className="font-bold text-[#2DD4BF]">{formatCurrency(calculateTotalCost)}</span>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#2DD4BF] text-white py-3 rounded-md hover:bg-[#26b8a5] transition-colors font-medium"
                    >
                      Book a Spot
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImageViewer && (
        <ImageViewer
          images={allImages}
          initialIndex={selectedImageIndex}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
  );
};

export default SpotDetails;