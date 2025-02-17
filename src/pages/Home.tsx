import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, MapPin, Users, Star, Building2, Warehouse, Briefcase, Music, Sun, Coffee, PartyPopper, Dumbbell, Utensils, Gift, Church, HeartHandshake, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSpots } from '../lib/spots';
import { formatCurrency } from '../utils/format';
import CategorySlider from '../components/CategorySlider';
import toast from 'react-hot-toast';
import type { Spot } from '../lib/database.types';

interface Spot {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  capacity: number;
  price_per_hour: number;
  type: string;
  featured_image: string | null;
  square_footage: number | null;
  rating: number;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const cities = [
  'Select city',
  'Andover',
  'Ansonia',
  'Ashford',
  'Avon',
  'Barkhamsted',
  'Beacon Falls',
  'Berlin',
  'Bethany',
  'Bethel',
  'Bethlehem',
  'Bloomfield',
  'Bolton',
  'Bozrah',
  'Branford',
  'Bridgeport',
  'Bridgewater'
];

const categories = [
  {
    id: 'party',
    name: 'Party Venues',
    description: 'Perfect for celebrations and gatherings',
    icon: PartyPopper,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'gym',
    name: 'Gyms',
    description: 'Fitness and training spaces',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'picnic',
    name: 'Picnic Areas',
    description: 'Outdoor dining and relaxation',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'bridal_shower',
    name: 'Bridal Shower',
    description: 'Elegant celebration spaces',
    icon: Gift,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'wedding',
    name: 'Wedding Reception',
    description: 'Romantic wedding venues',
    icon: Church,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'fundraiser',
    name: 'Fundraiser',
    description: 'Spaces for charitable events',
    icon: HeartHandshake,
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'venue',
    name: 'Venues',
    description: 'Perfect for events and gatherings',
    icon: Warehouse,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'office',
    name: 'Office Spaces',
    description: 'Professional workspaces',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'studio',
    name: 'Studios',
    description: 'Creative and recording spaces',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'outdoor',
    name: 'Outdoor Spaces',
    description: 'Open-air locations',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'restaurant',
    name: 'Restaurants',
    description: 'Dining and entertainment',
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
  },
];

const Home = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return today;
  });
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (eventRef.current && !eventRef.current.contains(event.target as Node)) {
        setShowEventDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSpots = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSpots();
      const formattedSpots = data.map(spot => ({
        ...spot,
        rating: 5,
        square_footage: spot.squareFootage || Math.floor(Math.random() * (1000 - 100 + 1) + 100)
      }));
      setSpots(formattedSpots);
    } catch (error) {
      // Error is already handled by the spots service
      setSpots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = Array(42).fill(null);
    
    for (let i = 0; i < daysInMonth; i++) {
      days[i + startingDay] = i + 1;
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth);
    date.setDate(day);
    setSelectedDate(date.toISOString().split('T')[0]);
    setShowDatePicker(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (selectedDate) searchParams.append('date', selectedDate);
    if (location && location !== 'Select city') searchParams.append('location', location);
    if (eventType) searchParams.append('type', eventType);
    
    return `/explore?${searchParams.toString()}`;
  };

  const renderStars = useCallback((rating: number) => {
    return (
      <div className="flex">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
        ))}
      </div>
    );
  }, []);

  const handleLocationSelect = (city: string) => {
    setLocation(city);
    setShowLocationDropdown(false);
  };

  const handleEventSelect = (type: string) => {
    setEventType(type);
    setShowEventDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2048")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative h-full flex flex-col justify-center py-12 sm:py-16">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 max-w-4xl">
              Find the Perfect Spot for Your Next Event
            </h1>
            <p className="text-lg sm:text-xl text-white mb-8 sm:mb-12 lg:mb-16 max-w-2xl">
              Discover unique venues for parties, weddings, festivals, and more
            </p>
            
            <div className="bg-white rounded-lg shadow-lg w-full max-w-[64rem] mx-auto">
              <div className="flex flex-col lg:flex-row">
                <div ref={locationRef} className="flex-1 p-4 border-b lg:border-b-0 lg:border-r border-gray-200 relative min-w-[200px]">
                  <div className="text-base font-semibold text-gray-700 mb-2">Where?</div>
                  <div 
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    className="relative cursor-pointer"
                  >
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-[#2DD4BF] flex-shrink-0" />
                      <input
                        type="text"
                        readOnly
                        placeholder="Select city"
                        value={location}
                        className="w-full border-0 pl-2 focus:ring-0 text-gray-900 placeholder-gray-500 font-medium text-base cursor-pointer bg-transparent"
                      />
                      <ChevronRight className="h-4 w-4 text-[#2DD4BF] transform rotate-90 flex-shrink-0" />
                    </div>
                  </div>
                  
                  {showLocationDropdown && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {cities.map((city) => (
                        <div
                          key={city}
                          onClick={() => handleLocationSelect(city)}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-base text-gray-700"
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div ref={eventRef} className="flex-1 p-4 border-b lg:border-b-0 lg:border-r border-gray-200 relative min-w-[200px]">
                  <div className="text-base font-semibold text-gray-700 mb-2">What are you planning?</div>
                  <div 
                    onClick={() => setShowEventDropdown(!showEventDropdown)}
                    className="relative cursor-pointer"
                  >
                    <div className="flex items-center">
                      <PartyPopper className="h-5 w-5 text-[#2DD4BF] flex-shrink-0" />
                      <input
                        type="text"
                        readOnly
                        placeholder="Select event"
                        value={eventType ? eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''}
                        className="w-full border-0 pl-2 focus:ring-0 text-gray-900 placeholder-gray-500 font-medium text-base cursor-pointer bg-transparent"
                      />
                      <ChevronRight className="h-4 w-4 text-[#2DD4BF] transform rotate-90 flex-shrink-0" />
                    </div>
                  </div>
                  
                  {showEventDropdown && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {[
                        'baby_shower',
                        'barbecue',
                        'birthday_party',
                        'bridal_shower',
                        'concert',
                        'engagement_party',
                        'fundraiser',
                        'gathering',
                        'graduation_party',
                        'gym',
                        'office',
                        'outdoor',
                        'outdoor_dinner',
                        'party',
                        'picnic',
                        'restaurant',
                        'studio',
                        'venue',
                        'video_shoot',
                        'wedding',
                        'wedding_reception',
                        'wellness'
                      ].map((type) => (
                        <div
                          key={type}
                          onClick={() => handleEventSelect(type)}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-base text-gray-700"
                        >
                          {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 p-4 border-b lg:border-b-0 lg:border-r border-gray-200 min-w-[200px]">
                  <div className="text-base font-semibold text-gray-700 mb-2">When?</div>
                  <div className="relative">
                    <div 
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center cursor-pointer"
                    >
                      <Calendar className="h-5 w-5 text-[#2DD4BF] flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Select date"
                        value={selectedDate ? formatDate(selectedDate) : ''}
                        readOnly
                        className="w-full border-0 pl-2 focus:ring-0 text-gray-900 placeholder-gray-500 font-medium text-base cursor-pointer"
                      />
                      {selectedDate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate('');
                          }}
                          className="ml-2 text-[#2DD4BF] hover:text-[#26b8a5] flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    {showDatePicker && (
                      <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg z-50 w-[280px] sm:w-[300px]">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <button
                              onClick={handlePrevMonth}
                              className="p-1 hover:bg-gray-100 rounded-full"
                            >
                              <ChevronLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            
                            <div className="text-sm font-medium text-gray-900">
                              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </div>
                            
                            <button
                              onClick={handleNextMonth}
                              className="p-1 hover:bg-gray-100 rounded-full"
                            >
                              <ChevronRight className="h-5 w-5 text-gray-600" />
                            </button>
                          </div>

                          <div>
                            <div className="grid grid-cols-7 mb-2">
                              {DAYS.map(day => (
                                <div key={day} className="text-xs font-medium text-gray-500 text-center">
                                  {day}
                                </div>
                              ))}
                            </div>
                            
                            <div className="grid grid-cols-7 gap-px bg-gray-200">
                              {getDaysInMonth(currentMonth).map((day, index) => {
                                if (!day) return <div key={index} className="bg-white p-2" />;
                                
                                const date = new Date(currentMonth);
                                date.setDate(day as number);
                                const isDisabled = isDateDisabled(date);
                                const isSelected = selectedDate && 
                                  new Date(selectedDate).getDate() === day && 
                                  new Date(selectedDate).getMonth() === currentMonth.getMonth() &&
                                  new Date(selectedDate).getFullYear() === currentMonth.getFullYear();

                                return (
                                  <button
                                    key={index}
                                    onClick={() => !isDisabled && handleDateSelect(day as number)}
                                    disabled={isDisabled}
                                    className={`
                                      bg-white p-2 text-sm text-center
                                      ${isDisabled 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'hover:bg-gray-50 cursor-pointer'}
                                      ${isSelected
                                        ? 'bg-[#2DD4BF] text-white hover:bg-[#2DD4BF]'
                                        : ''}
                                    `}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 flex items-center">
                  <Link
                    to={handleSearch()}
                    className="w-full lg:w-auto bg-[#2DD4BF] text-white px-8 py-3 rounded-md hover:bg-[#26b8a5] transition-colors flex items-center justify-center space-x-2 font-medium text-base whitespace-nowrap"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">Featured Spots</h2>
          <Link
            to="/explore"
            className="text-[#2DD4BF] hover:text-[#26b8a5] font-medium"
          >
            View all spots →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                <div className="bg-white p-4 rounded-b-lg">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : spots.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No spots available</h3>
            <p className="text-gray-600">Be the first to list your spot!</p>
            <Link
              to="/list-spot"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2DD4BF] hover:bg-[#26b8a5]"
            >
              List Your Spot
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {spots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <Link to={`/spots/${spot.id}`} className="block relative w-full h-48">
                  <img
                    src={spot.featured_image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"}
                    alt={spot.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300" />
                </Link>

                <div className="p-4">
                  <div className="flex items-start gap-1 text-[#2DD4BF] mb-2">
                    <MapPin className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{spot.city}</span>
                  </div>

                  {renderStars(spot.rating)}

                  <div className="mt-3 space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{spot.square_footage} sq. ft.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">Max. Attendees: {spot.capacity}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xl font-bold text-[#2DD4BF]">
                      {formatCurrency(spot.price_per_hour)}<span className="text-sm font-normal">/hr</span>
                    </div>
                    <Link
                      to={`/spots/${spot.id}`}
                      className="px-4 py-2 bg-[#2DD4BF] text-white rounded-md hover:bg-[#26b8a5] transition-colors"
                    >
                      BOOK NOW
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Explore by Category</h2>
            <p className="text-base sm:text-lg text-gray-600">Find the perfect space for any occasion</p>
          </div>

          <div className="relative pb-8">
            <CategorySlider categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;