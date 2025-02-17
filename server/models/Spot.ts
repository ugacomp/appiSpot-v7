import mongoose from 'mongoose';

export interface ISpot extends mongoose.Document {
  hostId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: number;
  pricePerHour: number;
  squareFootage?: number;
  type: string;
  amenities: string[];
  features: {
    parking: boolean;
    wifi: boolean;
    accessibility: boolean;
    kitchen: boolean;
    soundSystem: boolean;
    restrooms: boolean;
  };
  rules?: string;
  status: string;
  featuredImage?: string;
  galleryImages?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const spotSchema = new mongoose.Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Host ID is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be longer than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot be longer than 2000 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^\d{5}(-\d{4})?$/.test(v);
      },
      message: 'Please enter a valid ZIP code'
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Price per hour is required'],
    min: [0, 'Price cannot be negative']
  },
  squareFootage: {
    type: Number,
    min: [0, 'Square footage cannot be negative']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: {
      values: [
        'venue',
        'studio',
        'office',
        'outdoor',
        'restaurant',
        'gym',
        'party',
        'wedding',
        'other'
      ],
      message: '{VALUE} is not a valid spot type'
    }
  },
  amenities: [String],
  features: {
    parking: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    accessibility: { type: Boolean, default: false },
    kitchen: { type: Boolean, default: false },
    soundSystem: { type: Boolean, default: false },
    restrooms: { type: Boolean, default: false }
  },
  rules: {
    type: String,
    maxlength: [1000, 'Rules cannot be longer than 1000 characters']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  featuredImage: String,
  galleryImages: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for bookings
spotSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'spotId'
});

// Indexes for common queries
spotSchema.index({ city: 1, state: 1 });
spotSchema.index({ type: 1 });
spotSchema.index({ hostId: 1 });
spotSchema.index({ status: 1 });
spotSchema.index({ pricePerHour: 1 });
spotSchema.index({ capacity: 1 });
spotSchema.index({ 
  name: 'text',
  description: 'text',
  city: 'text',
  state: 'text'
}, {
  weights: {
    name: 10,
    city: 5,
    state: 5,
    description: 1
  }
});

export const Spot = mongoose.model<ISpot>('Spot', spotSchema);