import React from 'react';
import ProKeralaChart from './ProKeralaChart';

// Test data for Ranveer Singh (05/05/2008, 10 PM IST, Delhi)
// This is approximate data based on typical astrological calculations
const testKundaliData = {
  name: "Ranveer Singh",
  dateOfBirth: "2008-05-05",
  timeOfBirth: "22:00",
  placeOfBirth: "Delhi, India",
  ascendant: {
    longitude: 245.5,
    rashi: 7, // Scorpio (Vrishchik) - typical for evening births
    rashiName: {
      id: "8",
      name: "वृश्चिक",
      english: "Scorpio",
      element: "Water",
      lord: "Mars"
    },
    degree: 25.5
  },
  planets: [
    {
      id: 1,
      name: { en: "Sun", sa: "सूर्य" },
      longitude: 45.2,
      rashi: 1, // Taurus (वृष)
      rashiName: {
        id: "2",
        name: "वृष",
        english: "Taurus",
        element: "Earth",
        lord: "Venus"
      },
      nakshatra: 4,
      nakshatraName: {
        id: 4,
        name: "रोहिणी",
        deity: "Brahma",
        symbol: "Cart",
        ruler: "Moon"
      },
      degree: 15.2,
      isRetrograde: false
    },
    {
      id: 2,
      name: { en: "Moon", sa: "चन्द्र" },
      longitude: 78.5,
      rashi: 2, // Gemini (मिथुन)
      rashiName: {
        id: "3",
        name: "मिथुन",
        english: "Gemini",
        element: "Air",
        lord: "Mercury"
      },
      nakshatra: 7,
      nakshatraName: {
        id: 7,
        name: "पुनर्वसु",
        deity: "Aditi",
        symbol: "Bow",
        ruler: "Jupiter"
      },
      degree: 18.5,
      isRetrograde: false
    },
    {
      id: 3,
      name: { en: "Mars", sa: "मंगल" },
      longitude: 125.8,
      rashi: 4, // Leo (सिंह)
      rashiName: {
        id: "5",
        name: "सिंह",
        english: "Leo",
        element: "Fire",
        lord: "Sun"
      },
      nakshatra: 10,
      nakshatraName: {
        id: 10,
        name: "मघा",
        deity: "Pitrs",
        symbol: "Throne",
        ruler: "Ketu"
      },
      degree: 5.8,
      isRetrograde: false
    },
    {
      id: 4,
      name: { en: "Mercury", sa: "बुध" },
      longitude: 52.3,
      rashi: 1, // Taurus (वृष)
      rashiName: {
        id: "2",
        name: "वृष",
        english: "Taurus",
        element: "Earth",
        lord: "Venus"
      },
      nakshatra: 4,
      nakshatraName: {
        id: 4,
        name: "रोहिणी",
        deity: "Brahma",
        symbol: "Cart",
        ruler: "Moon"
      },
      degree: 22.3,
      isRetrograde: false
    },
    {
      id: 5,
      name: { en: "Jupiter", sa: "गुरु" },
      longitude: 285.7,
      rashi: 9, // Capricorn (मकर)
      rashiName: {
        id: "10",
        name: "मकर",
        english: "Capricorn",
        element: "Earth",
        lord: "Saturn"
      },
      nakshatra: 22,
      nakshatraName: {
        id: 22,
        name: "श्रवण",
        deity: "Vishnu",
        symbol: "Ear",
        ruler: "Moon"
      },
      degree: 15.7,
      isRetrograde: false
    },
    {
      id: 6,
      name: { en: "Venus", sa: "शुक्र" },
      longitude: 25.4,
      rashi: 0, // Aries (मेष)
      rashiName: {
        id: "1",
        name: "मेष",
        english: "Aries",
        element: "Fire",
        lord: "Mars"
      },
      nakshatra: 2,
      nakshatraName: {
        id: 2,
        name: "भरणी",
        deity: "Yama",
        symbol: "Yoni",
        ruler: "Venus"
      },
      degree: 25.4,
      isRetrograde: false
    },
    {
      id: 7,
      name: { en: "Saturn", sa: "शनि" },
      longitude: 155.2,
      rashi: 5, // Virgo (कन्या)
      rashiName: {
        id: "6",
        name: "कन्या",
        english: "Virgo",
        element: "Earth",
        lord: "Mercury"
      },
      nakshatra: 13,
      nakshatraName: {
        id: 13,
        name: "हस्त",
        deity: "Savitar",
        symbol: "Hand",
        ruler: "Moon"
      },
      degree: 5.2,
      isRetrograde: true
    },
    {
      id: 8,
      name: { en: "Rahu", sa: "राहु" },
      longitude: 315.8,
      rashi: 10, // Aquarius (कुंभ)
      rashiName: {
        id: "11",
        name: "कुंभ",
        english: "Aquarius",
        element: "Air",
        lord: "Saturn"
      },
      nakshatra: 25,
      nakshatraName: {
        id: 25,
        name: "पूर्वभाद्रपद",
        deity: "Aja Ekapada",
        symbol: "Sword",
        ruler: "Jupiter"
      },
      degree: 15.8,
      isRetrograde: true
    },
    {
      id: 9,
      name: { en: "Ketu", sa: "केतु" },
      longitude: 135.8,
      rashi: 4, // Leo (सिंह)
      rashiName: {
        id: "5",
        name: "सिंह",
        english: "Leo",
        element: "Fire",
        lord: "Sun"
      },
      nakshatra: 11,
      nakshatraName: {
        id: 11,
        name: "पूर्वफाल्गुनी",
        deity: "Bhaga",
        symbol: "Hammock",
        ruler: "Venus"
      },
      degree: 15.8,
      isRetrograde: true
    }
  ]
};

const TestChart: React.FC = () => {
  return <ProKeralaChart kundaliData={testKundaliData} />;
};

export default TestChart;