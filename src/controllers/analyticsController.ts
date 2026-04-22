import { Analytics } from '../models/Analytics.js';
import { Order } from '../models/Order.js';

export const trackEvent = async (req, res) => {
  try {
    const { eventType, productId, sessionId } = req.body;
    const event = new Analytics({
      eventType,
      productId,
      sessionId
    });
    await event.save();
    res.status(201).json({ message: 'Event tracked' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFunnelData = async (req, res) => {
  try {
    const visitors = await Analytics.countDocuments({ eventType: 'visitor' });
    const cartAdds = await Analytics.countDocuments({ eventType: 'cart_add' });
    const checkoutStarts = await Analytics.countDocuments({ eventType: 'checkout_start' });
    const completedPurchases = await Order.countDocuments({ status_pagamento: 'paid' });

    res.json({
      visitors,
      cartAdds,
      checkoutStarts,
      completedPurchases
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getHeatmapData = async (req, res) => {
  try {
    // Aggregate orders by day of week and hour
    const heatmap = await Order.aggregate([
      { $match: { status_pagamento: 'paid' } },
      {
        $project: {
          dayOfWeek: { $dayOfWeek: '$data_pedido' },
          hour: { $hour: '$data_pedido' }
        }
      },
      {
        $group: {
          _id: { dayOfWeek: '$dayOfWeek', hour: '$hour' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          day: '$_id.dayOfWeek',
          hour: '$_id.hour',
          count: 1
        }
      }
    ]);

    res.json(heatmap);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
