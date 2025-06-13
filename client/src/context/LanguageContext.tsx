import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.kundali': 'Birth Chart',
    'nav.horoscope': 'Horoscope',
    'nav.compatibility': 'Compatibility',
    'nav.muhurta': 'Muhurta',
    
    // Birth Chart Form
    'kundali.title': 'Birth Chart (Kundali)',
    'kundali.subtitle': 'Generate your Vedic astrological birth chart with detailed planetary positions',
    'kundali.name': 'Name',
    'kundali.name.placeholder': 'Enter full name',
    'kundali.dateOfBirth': 'Date of Birth',
    'kundali.timeOfBirth': 'Time of Birth',
    'kundali.placeOfBirth': 'Place of Birth',
    'kundali.placeOfBirth.placeholder': 'Select your birth city',
    'kundali.generate': 'Generate Birth Chart',
    'kundali.update': 'Update Birth Chart',
    'kundali.loading': 'Generating...',
    'kundali.updating': 'Updating...',
    
    // Tabs
    'tab.birthDetails': 'Birth Details',
    'tab.visualChart': 'Visual Chart',
    'tab.chartAnalysis': 'Chart Analysis',
    'tab.planets': 'Planets',
    'tab.houses': 'Houses',
    
    // Chart Labels
    'chart.lagna': 'Lagna',
    'chart.house': 'House',
    'chart.sign': 'Sign',
    'chart.lord': 'Lord',
    'chart.degree': 'Degree',
    'chart.nakshatra': 'Nakshatra',
    'chart.retrograde': 'Retrograde',
    
    // Planets
    'planet.sun': 'Sun',
    'planet.moon': 'Moon',
    'planet.mars': 'Mars',
    'planet.mercury': 'Mercury',
    'planet.jupiter': 'Jupiter',
    'planet.venus': 'Venus',
    'planet.saturn': 'Saturn',
    'planet.rahu': 'Rahu',
    'planet.ketu': 'Ketu',
    
    // Rashis
    'rashi.aries': 'Aries',
    'rashi.taurus': 'Taurus',
    'rashi.gemini': 'Gemini',
    'rashi.cancer': 'Cancer',
    'rashi.leo': 'Leo',
    'rashi.virgo': 'Virgo',
    'rashi.libra': 'Libra',
    'rashi.scorpio': 'Scorpio',
    'rashi.sagittarius': 'Sagittarius',
    'rashi.capricorn': 'Capricorn',
    'rashi.aquarius': 'Aquarius',
    'rashi.pisces': 'Pisces',
    
    // Houses
    'house.1': 'Self (Lagna)',
    'house.2': 'Wealth (Dhana)',
    'house.3': 'Siblings (Sahaja)',
    'house.4': 'Happiness (Sukha)',
    'house.5': 'Children (Putra)',
    'house.6': 'Enemies (Ripu)',
    'house.7': 'Marriage (Yuvati)',
    'house.8': 'Longevity (Randhra)',
    'house.9': 'Fortune (Dharma)',
    'house.10': 'Career (Karma)',
    'house.11': 'Gains (Labha)',
    'house.12': 'Loss (Vyaya)',
    
    // Errors
    'error.required': 'This field is required',
    'error.invalidDate': 'Please enter a valid date',
    'error.invalidTime': 'Please enter a valid time',
    'error.network': 'Network error. Please check your connection and try again.',
    'error.calculation': 'Error in astrological calculations. Please try again.',
    
    // Success Messages
    'success.generated': 'Birth chart generated successfully',
    'success.updated': 'Birth chart updated successfully',
    
    // Language Toggle
    'language.switch': 'हिंदी में देखें',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.kundali': 'जन्म कुंडली',
    'nav.horoscope': 'राशिफल',
    'nav.compatibility': 'मिलान',
    'nav.muhurta': 'मुहूर्त',
    
    // Birth Chart Form
    'kundali.title': 'जन्म कुंडली',
    'kundali.subtitle': 'अपनी वैदिक ज्योतिषीय जन्म कुंडली विस्तृत ग्रह स्थितियों के साथ बनाएं',
    'kundali.name': 'नाम',
    'kundali.name.placeholder': 'पूरा नाम दर्ज करें',
    'kundali.dateOfBirth': 'जन्म तिथि',
    'kundali.timeOfBirth': 'जन्म समय',
    'kundali.placeOfBirth': 'जन्म स्थान',
    'kundali.placeOfBirth.placeholder': 'अपना जन्म शहर चुनें',
    'kundali.generate': 'जन्म कुंडली बनाएं',
    'kundali.update': 'जन्म कुंडली अपडेट करें',
    'kundali.loading': 'बना रहे हैं...',
    'kundali.updating': 'अपडेट कर रहे हैं...',
    
    // Tabs
    'tab.birthDetails': 'जन्म विवरण',
    'tab.visualChart': 'कुंडली चार्ट',
    'tab.chartAnalysis': 'कुंडली विश्लेषण',
    'tab.planets': 'ग्रह',
    'tab.houses': 'भाव',
    
    // Chart Labels
    'chart.lagna': 'लग्न',
    'chart.house': 'भाव',
    'chart.sign': 'राशि',
    'chart.lord': 'स्वामी',
    'chart.degree': 'अंश',
    'chart.nakshatra': 'नक्षत्र',
    'chart.retrograde': 'वक्री',
    
    // Planets
    'planet.sun': 'सूर्य',
    'planet.moon': 'चंद्र',
    'planet.mars': 'मंगल',
    'planet.mercury': 'बुध',
    'planet.jupiter': 'गुरु',
    'planet.venus': 'शुक्र',
    'planet.saturn': 'शनि',
    'planet.rahu': 'राहु',
    'planet.ketu': 'केतु',
    
    // Rashis
    'rashi.aries': 'मेष',
    'rashi.taurus': 'वृषभ',
    'rashi.gemini': 'मिथुन',
    'rashi.cancer': 'कर्क',
    'rashi.leo': 'सिंह',
    'rashi.virgo': 'कन्या',
    'rashi.libra': 'तुला',
    'rashi.scorpio': 'वृश्चिक',
    'rashi.sagittarius': 'धनु',
    'rashi.capricorn': 'मकर',
    'rashi.aquarius': 'कुंभ',
    'rashi.pisces': 'मीन',
    
    // Houses
    'house.1': 'तनु भाव (लग्न)',
    'house.2': 'धन भाव',
    'house.3': 'सहज भाव',
    'house.4': 'सुख भाव',
    'house.5': 'पुत्र भाव',
    'house.6': 'रिपु भाव',
    'house.7': 'युवति भाव',
    'house.8': 'रंध्र भाव',
    'house.9': 'धर्म भाव',
    'house.10': 'कर्म भाव',
    'house.11': 'लाभ भाव',
    'house.12': 'व्यय भाव',
    
    // Errors
    'error.required': 'यह फील्ड आवश्यक है',
    'error.invalidDate': 'कृपया एक वैध तिथि दर्ज करें',
    'error.invalidTime': 'कृपया एक वैध समय दर्ज करें',
    'error.network': 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।',
    'error.calculation': 'ज्योतिषीय गणना में त्रुटि। कृपया पुनः प्रयास करें।',
    
    // Success Messages
    'success.generated': 'जन्म कुंडली सफलतापूर्वक बनाई गई',
    'success.updated': 'जन्म कुंडली सफलतापूर्वक अपडेट की गई',
    
    // Language Toggle
    'language.switch': 'View in English',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};