import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
  spotId: mongoose.Types.ObjectId;
  guestId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  status: string;
  paymentIntentId?: string;
  eventType: string;
  guestCount: number;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new mongoose.Schema({
  spotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spot',
    required: [true, 'Spot ID is required']
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Guest ID is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled', 'completed', 'payment_failed'],
      message: '{VALUE} is not a valid booking status'
    },
    default: 'pending'
  },
  paymentIntentId: String,
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: {
      values: [
        'wedding',
        'birthday',
        'corporate',
        'party',
        'meeting',
        'workshop',
        'photoshoot',
        'other'
      ],
      message: '{VALUE} is not a valid event type'
    }
  },
  guestCount: {
    type: Number,
    required: [true, 'Guest count is required'],
    min: [1, 'Guest count must be at least 1']
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot be longer than 500 characters']
  },
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

// Validate end time is after start time
bookingSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    next(new Error('End time must be after start time'));
  }
  next();
});

// Indexes for common queries
bookingSchema.index({ spotId: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ guestId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);