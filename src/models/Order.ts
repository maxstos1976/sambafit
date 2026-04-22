import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  nome_produto: { type: String, required: true }, // snapshot
  quantidade: { type: Number, required: true },
  preco_unitario: { type: Number, required: true },
  desconto_unitario: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  selectedSize: String,
  isGiftCard: { type: Boolean, default: false },
  giftCardId: { type: mongoose.Schema.Types.ObjectId, ref: 'GiftCard' }
});

const shippingSchema = new mongoose.Schema({
  address_id: { type: String }, // Can be a reference to an address if implemented
  endereco: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  metodo_envio: { type: String, enum: ['standard', 'express'], default: 'standard' },
  custo_envio: { type: Number, default: 0 },
  codigo_rastreamento: { type: String },
  status_envio: { type: String, default: 'pending' },
  data_envio: { type: Date },
  data_entrega: { type: Date }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  data_pedido: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'processing', 'Ready to Ship', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'pending' 
  },
  valor_total: { type: Number, required: true },
  moeda: { type: String, default: 'EUR' },
  desconto: { type: Number, default: 0 },
  giftCardCode: { type: String },
  metodo_pagamento: { 
    type: String, 
    enum: ['credit_card', 'paypal', 'bizum', 'gift_card'],
    required: true
  },
  status_pagamento: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  codigo_transacao_pagamento: { type: String },
  observacoes: { type: String },
  items: [orderItemSchema],
  shipping: shippingSchema
}, { 
  timestamps: { createdAt: 'data_pedido', updatedAt: 'data_atualizacao' } 
});

export const Order = mongoose.model('Order', orderSchema);
