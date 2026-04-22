import { runSeed } from '../services/seedService.js';

export const seedDatabase = async (req, res) => {
  try {
    const count = await runSeed();
    res.status(200).json({ 
      message: 'Database seeded successfully', 
      count 
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      message: 'Error seeding database', 
      error: error.message 
    });
  }
};
