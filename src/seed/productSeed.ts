import { runSeed } from '../services/seedService.js';
import connectDB from '../config/db.js';

const seedData = async () => {
  try {
    await connectDB();
    const count = await runSeed();
    console.log(`${count} products seeded successfully!`);
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
