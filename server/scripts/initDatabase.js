import { connectDB, disconnectDB } from '../config/database.js';
import { User, Kundali, Horoscope } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize database with sample data
 */
async function initDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    
    console.log('🧹 Cleaning existing data...');
    // Clear existing data (be careful in production!)
    await User.deleteMany({});
    await Kundali.deleteMany({});
    await Horoscope.deleteMany({});
    
    console.log('👤 Creating sample users...');
    
    // Create sample users
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        dateOfBirth: new Date('1990-05-15'),
        placeOfBirth: 'New Delhi, India',
        timeOfBirth: '14:30',
        preferences: {
          language: 'en',
          notifications: {
            email: true,
            dailyHoroscope: true
          }
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        dateOfBirth: new Date('1985-08-22'),
        placeOfBirth: 'Mumbai, India',
        timeOfBirth: '09:15',
        preferences: {
          language: 'hi',
          notifications: {
            email: true,
            weeklyHoroscope: true
          }
        }
      },
      {
        name: 'राम शर्मा',
        email: 'ram@example.com',
        password: 'password123',
        dateOfBirth: new Date('1988-12-10'),
        placeOfBirth: 'Varanasi, India',
        timeOfBirth: '06:45',
        preferences: {
          language: 'hi',
          notifications: {
            email: true,
            dailyHoroscope: true,
            weeklyHoroscope: true
          }
        }
      }
    ];
    
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} sample users`);
    
    console.log('📊 Creating sample kundalis...');
    
    // Create sample kundalis
    const sampleKundalis = [
      {
        userId: createdUsers[0]._id,
        name: 'John Doe',
        dateOfBirth: new Date('1990-05-15'),
        timeOfBirth: '14:30',
        placeOfBirth: 'New Delhi, India',
        coordinates: {
          latitude: 28.6139,
          longitude: 77.2090
        },
        ascendant: {
          sign: 'Leo',
          degree: 15.5,
          signLord: 'Sun',
          nakshatra: 'Magha'
        },
        planets: [
          {
            name: 'Sun',
            sign: 'Taurus',
            house: 10,
            degree: 24.5,
            nakshatra: 'Mrigashira',
            nakshatraPada: 2,
            isRetrograde: false,
            signLord: 'Venus'
          },
          {
            name: 'Moon',
            sign: 'Cancer',
            house: 12,
            degree: 8.3,
            nakshatra: 'Pushya',
            nakshatraPada: 1,
            isRetrograde: false,
            signLord: 'Moon'
          },
          {
            name: 'Mars',
            sign: 'Aries',
            house: 9,
            degree: 12.7,
            nakshatra: 'Ashwini',
            nakshatraPada: 3,
            isRetrograde: false,
            signLord: 'Mars'
          }
        ],
        houses: [
          {
            number: 1,
            sign: 'Leo',
            signLord: 'Sun',
            degree: 15.5,
            planets: []
          },
          {
            number: 2,
            sign: 'Virgo',
            signLord: 'Mercury',
            degree: 45.5,
            planets: []
          }
        ],
        isPublic: true,
        tags: ['sample', 'demo']
      }
    ];
    
    const createdKundalis = await Kundali.insertMany(sampleKundalis);
    console.log(`✅ Created ${createdKundalis.length} sample kundalis`);
    
    console.log('🌟 Creating sample horoscopes...');
    
    // Create sample horoscopes for today
    const zodiacSigns = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    
    const sampleHoroscopes = zodiacSigns.map(sign => ({
      sign,
      date: new Date(),
      type: 'daily',
      content: {
        general: `Today is a favorable day for ${sign}. Focus on your goals and maintain positive energy.`,
        love: 'Romance is in the air. Express your feelings openly.',
        career: 'Professional opportunities may present themselves.',
        health: 'Take care of your physical and mental well-being.',
        finance: 'Be cautious with financial decisions.',
        family: 'Spend quality time with loved ones.'
      },
      ratings: {
        overall: Math.floor(Math.random() * 5) + 1,
        love: Math.floor(Math.random() * 5) + 1,
        career: Math.floor(Math.random() * 5) + 1,
        health: Math.floor(Math.random() * 5) + 1,
        finance: Math.floor(Math.random() * 5) + 1
      },
      luckyNumbers: [Math.floor(Math.random() * 100) + 1, Math.floor(Math.random() * 100) + 1],
      luckyColors: ['Blue', 'Green'],
      luckyGems: ['Ruby', 'Emerald'],
      isActive: true,
      source: 'ai_generated'
    }));
    
    const createdHoroscopes = await Horoscope.insertMany(sampleHoroscopes);
    console.log(`✅ Created ${createdHoroscopes.length} sample horoscopes`);
    
    console.log('📈 Database initialization completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Kundalis: ${createdKundalis.length}`);
    console.log(`   Horoscopes: ${createdHoroscopes.length}`);
    
    console.log('\n🔑 Sample login credentials:');
    console.log('   Email: john@example.com, Password: password123');
    console.log('   Email: jane@example.com, Password: password123');
    console.log('   Email: ram@example.com, Password: password123');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await disconnectDB();
  }
}

/**
 * Clear all data from database
 */
async function clearDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    
    console.log('🧹 Clearing all data...');
    await User.deleteMany({});
    await Kundali.deleteMany({});
    await Horoscope.deleteMany({});
    
    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await disconnectDB();
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'init') {
  initDatabase();
} else if (command === 'clear') {
  clearDatabase();
} else {
  console.log('Usage:');
  console.log('  node initDatabase.js init  - Initialize database with sample data');
  console.log('  node initDatabase.js clear - Clear all data from database');
}
