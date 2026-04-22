import { Newsletter } from '../models/Newsletter.js';

export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    const subscription = await Newsletter.create({ email });
    res.status(201).json({ message: 'Subscribed successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
