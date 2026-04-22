import mongoose from 'mongoose';

const giftCardSchema = new mongoose.Schema({
  code: { type: String, unique: true, sparse: true }, // Sparse because drafts might not have a code yet
  value: { type: Number, required: true },
  balance: { type: Number, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientName: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  recipientWhatsApp: { type: String },
  message: { type: String },
  isScheduled: { type: Boolean, default: false },
  scheduledDate: { type: Date },
  status: { type: String, enum: ['draft', 'active', 'used', 'expired', 'blocked'], default: 'draft' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  expiryDate: { type: Date },
}, { timestamps: true });

export const GiftCard = mongoose.model('GiftCard', giftCardSchema);
