import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['visitor', 'cart_add', 'checkout_start']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  sessionId: String
}, {
  timestamps: true
});

// Index for efficient querying by date
analyticsSchema.index({ eventType: 1, timestamp: -1 });

export const Analytics = mongoose.model('Analytics', analyticsSchema);
