export interface City {
  id: string;
  name: string;
  nameHindi: string;
  state: string;
  stateHindi: string;
  country: string;
  countryHindi: string;
  latitude: number;
  longitude: number;
  timezone: number;
}

export const INDIAN_CITIES: City[] = [
  // Major Cities
  { id: 'delhi', name: 'Delhi', nameHindi: 'दिल्ली', state: 'Delhi', stateHindi: 'दिल्ली', country: 'India', countryHindi: 'भारत', latitude: 28.7041, longitude: 77.1025, timezone: 5.5 },
  { id: 'mumbai', name: 'Mumbai', nameHindi: 'मुंबई', state: 'Maharashtra', stateHindi: 'महाराष्ट्र', country: 'India', countryHindi: 'भारत', latitude: 19.0760, longitude: 72.8777, timezone: 5.5 },
  { id: 'kolkata', name: 'Kolkata', nameHindi: 'कोलकाता', state: 'West Bengal', stateHindi: 'पश्चिम बंगाल', country: 'India', countryHindi: 'भारत', latitude: 22.5726, longitude: 88.3639, timezone: 5.5 },
  { id: 'chennai', name: 'Chennai', nameHindi: 'चेन्नई', state: 'Tamil Nadu', stateHindi: 'तमिल नाडु', country: 'India', countryHindi: 'भारत', latitude: 13.0827, longitude: 80.2707, timezone: 5.5 },
  { id: 'bangalore', name: 'Bangalore', nameHindi: 'बैंगलोर', state: 'Karnataka', stateHindi: 'कर्नाटक', country: 'India', countryHindi: 'भारत', latitude: 12.9716, longitude: 77.5946, timezone: 5.5 },
  { id: 'hyderabad', name: 'Hyderabad', nameHindi: 'हैदराबाद', state: 'Telangana', stateHindi: 'तेलंगाना', country: 'India', countryHindi: 'भारत', latitude: 17.3850, longitude: 78.4867, timezone: 5.5 },
  { id: 'ahmedabad', name: 'Ahmedabad', nameHindi: 'अहमदाबाद', state: 'Gujarat', stateHindi: 'गुजरात', country: 'India', countryHindi: 'भारत', latitude: 23.0225, longitude: 72.5714, timezone: 5.5 },
  { id: 'pune', name: 'Pune', nameHindi: 'पुणे', state: 'Maharashtra', stateHindi: 'महाराष्ट्र', country: 'India', countryHindi: 'भारत', latitude: 18.5204, longitude: 73.8567, timezone: 5.5 },
  { id: 'jaipur', name: 'Jaipur', nameHindi: 'जयपुर', state: 'Rajasthan', stateHindi: 'राजस्थान', country: 'India', countryHindi: 'भारत', latitude: 26.9124, longitude: 75.7873, timezone: 5.5 },
  { id: 'lucknow', name: 'Lucknow', nameHindi: 'लखनऊ', state: 'Uttar Pradesh', stateHindi: 'उत्तर प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 26.8467, longitude: 80.9462, timezone: 5.5 },
  
  // State Capitals
  { id: 'agartala', name: 'Agartala', nameHindi: 'अगरतला', state: 'Tripura', stateHindi: 'त्रिपुरा', country: 'India', countryHindi: 'भारत', latitude: 23.8315, longitude: 91.2868, timezone: 5.5 },
  { id: 'aizawl', name: 'Aizawl', nameHindi: 'आइजोल', state: 'Mizoram', stateHindi: 'मिजोरम', country: 'India', countryHindi: 'भारत', latitude: 23.7307, longitude: 92.7173, timezone: 5.5 },
  { id: 'amaravati', name: 'Amaravati', nameHindi: 'अमरावती', state: 'Andhra Pradesh', stateHindi: 'आंध्र प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 16.5062, longitude: 80.6480, timezone: 5.5 },
  { id: 'bhopal', name: 'Bhopal', nameHindi: 'भोपाल', state: 'Madhya Pradesh', stateHindi: 'मध्य प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 23.2599, longitude: 77.4126, timezone: 5.5 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', nameHindi: 'भुवनेश्वर', state: 'Odisha', stateHindi: 'ओडिशा', country: 'India', countryHindi: 'भारत', latitude: 20.2961, longitude: 85.8245, timezone: 5.5 },
  { id: 'chandigarh', name: 'Chandigarh', nameHindi: 'चंडीगढ़', state: 'Chandigarh', stateHindi: 'चंडीगढ़', country: 'India', countryHindi: 'भारत', latitude: 30.7333, longitude: 76.7794, timezone: 5.5 },
  { id: 'dehradun', name: 'Dehradun', nameHindi: 'देहरादून', state: 'Uttarakhand', stateHindi: 'उत्तराखंड', country: 'India', countryHindi: 'भारत', latitude: 30.3165, longitude: 78.0322, timezone: 5.5 },
  { id: 'dispur', name: 'Dispur', nameHindi: 'दिसपुर', state: 'Assam', stateHindi: 'असम', country: 'India', countryHindi: 'भारत', latitude: 26.1445, longitude: 91.7898, timezone: 5.5 },
  { id: 'gandhinagar', name: 'Gandhinagar', nameHindi: 'गांधीनगर', state: 'Gujarat', stateHindi: 'गुजरात', country: 'India', countryHindi: 'भारत', latitude: 23.2156, longitude: 72.6369, timezone: 5.5 },
  { id: 'gangtok', name: 'Gangtok', nameHindi: 'गंगटोक', state: 'Sikkim', stateHindi: 'सिक्किम', country: 'India', countryHindi: 'भारत', latitude: 27.3389, longitude: 88.6065, timezone: 5.5 },
  { id: 'imphal', name: 'Imphal', nameHindi: 'इंफाल', state: 'Manipur', stateHindi: 'मणिपुर', country: 'India', countryHindi: 'भारत', latitude: 24.8170, longitude: 93.9368, timezone: 5.5 },
  { id: 'itanagar', name: 'Itanagar', nameHindi: 'ईटानगर', state: 'Arunachal Pradesh', stateHindi: 'अरुणाचल प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 27.0844, longitude: 93.6053, timezone: 5.5 },
  { id: 'kohima', name: 'Kohima', nameHindi: 'कोहिमा', state: 'Nagaland', stateHindi: 'नागालैंड', country: 'India', countryHindi: 'भारत', latitude: 25.6751, longitude: 94.1086, timezone: 5.5 },
  { id: 'panaji', name: 'Panaji', nameHindi: 'पणजी', state: 'Goa', stateHindi: 'गोवा', country: 'India', countryHindi: 'भारत', latitude: 15.4909, longitude: 73.8278, timezone: 5.5 },
  { id: 'patna', name: 'Patna', nameHindi: 'पटना', state: 'Bihar', stateHindi: 'बिहार', country: 'India', countryHindi: 'भारत', latitude: 25.5941, longitude: 85.1376, timezone: 5.5 },
  { id: 'raipur', name: 'Raipur', nameHindi: 'रायपुर', state: 'Chhattisgarh', stateHindi: 'छत्तीसगढ़', country: 'India', countryHindi: 'भारत', latitude: 21.2514, longitude: 81.6296, timezone: 5.5 },
  { id: 'ranchi', name: 'Ranchi', nameHindi: 'रांची', state: 'Jharkhand', stateHindi: 'झारखंड', country: 'India', countryHindi: 'भारत', latitude: 23.3441, longitude: 85.3096, timezone: 5.5 },
  { id: 'shillong', name: 'Shillong', nameHindi: 'शिलांग', state: 'Meghalaya', stateHindi: 'मेघालय', country: 'India', countryHindi: 'भारत', latitude: 25.5788, longitude: 91.8933, timezone: 5.5 },
  { id: 'shimla', name: 'Shimla', nameHindi: 'शिमला', state: 'Himachal Pradesh', stateHindi: 'हिमाचल प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 31.1048, longitude: 77.1734, timezone: 5.5 },
  { id: 'srinagar', name: 'Srinagar', nameHindi: 'श्रीनगर', state: 'Jammu and Kashmir', stateHindi: 'जम्मू और कश्मीर', country: 'India', countryHindi: 'भारत', latitude: 34.0837, longitude: 74.7973, timezone: 5.5 },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', nameHindi: 'तिरुवनंतपुरम', state: 'Kerala', stateHindi: 'केरल', country: 'India', countryHindi: 'भारत', latitude: 8.5241, longitude: 76.9366, timezone: 5.5 },
  
  // Major Cities by Population
  { id: 'agra', name: 'Agra', nameHindi: 'आगरा', state: 'Uttar Pradesh', stateHindi: 'उत्तर प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 27.1767, longitude: 78.0081, timezone: 5.5 },
  { id: 'allahabad', name: 'Allahabad', nameHindi: 'इलाहाबाद', state: 'Uttar Pradesh', stateHindi: 'उत्तर प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 25.4358, longitude: 81.8463, timezone: 5.5 },
  { id: 'amritsar', name: 'Amritsar', nameHindi: 'अमृतसर', state: 'Punjab', stateHindi: 'पंजाब', country: 'India', countryHindi: 'भारत', latitude: 31.6340, longitude: 74.8723, timezone: 5.5 },
  { id: 'aurangabad', name: 'Aurangabad', nameHindi: 'औरंगाबाद', state: 'Maharashtra', stateHindi: 'महाराष्ट्र', country: 'India', countryHindi: 'भारत', latitude: 19.8762, longitude: 75.3433, timezone: 5.5 },
  { id: 'bareilly', name: 'Bareilly', nameHindi: 'बरेली', state: 'Uttar Pradesh', stateHindi: 'उत्तर प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 28.3670, longitude: 79.4304, timezone: 5.5 },
  { id: 'coimbatore', name: 'Coimbatore', nameHindi: 'कोयंबटूर', state: 'Tamil Nadu', stateHindi: 'तमिल नाडु', country: 'India', countryHindi: 'भारत', latitude: 11.0168, longitude: 76.9558, timezone: 5.5 },
  { id: 'faridabad', name: 'Faridabad', nameHindi: 'फरीदाबाद', state: 'Haryana', stateHindi: 'हरियाणा', country: 'India', countryHindi: 'भारत', latitude: 28.4089, longitude: 77.3178, timezone: 5.5 },
  { id: 'ghaziabad', name: 'Ghaziabad', nameHindi: 'गाजियाबाद', state: 'Uttar Pradesh', stateHindi: 'उत्तर प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 28.6692, longitude: 77.4538, timezone: 5.5 },
  { id: 'gurgaon', name: 'Gurgaon', nameHindi: 'गुड़गांव', state: 'Haryana', stateHindi: 'हरियाणा', country: 'India', countryHindi: 'भारत', latitude: 28.4595, longitude: 77.0266, timezone: 5.5 },
  { id: 'guwahati', name: 'Guwahati', nameHindi: 'गुवाहाटी', state: 'Assam', stateHindi: 'असम', country: 'India', countryHindi: 'भारत', latitude: 26.1445, longitude: 91.7362, timezone: 5.5 },
  { id: 'gwalior', name: 'Gwalior', nameHindi: 'ग्वालियर', state: 'Madhya Pradesh', stateHindi: 'मध्य प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 26.2183, longitude: 78.1828, timezone: 5.5 },
  { id: 'hubli', name: 'Hubli', nameHindi: 'हुबली', state: 'Karnataka', stateHindi: 'कर्नाटक', country: 'India', countryHindi: 'भारत', latitude: 15.3647, longitude: 75.1240, timezone: 5.5 },
  { id: 'indore', name: 'Indore', nameHindi: 'इंदौर', state: 'Madhya Pradesh', stateHindi: 'मध्य प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 22.7196, longitude: 75.8577, timezone: 5.5 },
  { id: 'jabalpur', name: 'Jabalpur', nameHindi: 'जबलपुर', state: 'Madhya Pradesh', stateHindi: 'मध्य प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 23.1815, longitude: 79.9864, timezone: 5.5 },
  { id: 'jamshedpur', name: 'Jamshedpur', nameHindi: 'जमशेदपुर', state: 'Jharkhand', stateHindi: 'झारखंड', country: 'India', countryHindi: 'भारत', latitude: 22.8046, longitude: 86.2029, timezone: 5.5 },
  { id: 'jodhpur', name: 'Jodhpur', nameHindi: 'जोधपुर', state: 'Rajasthan', stateHindi: 'राजस्थान', country: 'India', countryHindi: 'भारत', latitude: 26.2389, longitude: 73.0243, timezone: 5.5 },
  { id: 'kanpur', name: 'Kanpur', nameHindi: 'कानपुर', state: 'Uttar Pradesh', stateHindi: 'उत्तर प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 26.4499, longitude: 80.3319, timezone: 5.5 },
  { id: 'kochi', name: 'Kochi', nameHindi: 'कोच्चि', state: 'Kerala', stateHindi: 'केरल', country: 'India', countryHindi: 'भारत', latitude: 9.9312, longitude: 76.2673, timezone: 5.5 },
  { id: 'kota', name: 'Kota', nameHindi: 'कोटा', state: 'Rajasthan', stateHindi: 'राजस्थान', country: 'India', countryHindi: 'भारत', latitude: 25.2138, longitude: 75.8648, timezone: 5.5 },
  { id: 'ludhiana', name: 'Ludhiana', nameHindi: 'लुधियाना', state: 'Punjab', stateHindi: 'पंजाब', country: 'India', countryHindi: 'भारत', latitude: 30.9010, longitude: 75.8573, timezone: 5.5 },
  { id: 'madurai', name: 'Madurai', nameHindi: 'मदुरै', state: 'Tamil Nadu', stateHindi: 'तमिल नाडु', country: 'India', countryHindi: 'भारत', latitude: 9.9252, longitude: 78.1198, timezone: 5.5 },
  { id: 'mangalore', name: 'Mangalore', nameHindi: 'मंगलौर', state: 'Karnataka', stateHindi: 'कर्नाटक', country: 'India', countryHindi: 'भारत', latitude: 12.9141, longitude: 74.8560, timezone: 5.5 },
  { id: 'meerut', name: 'Meerut', nameHindi: 'मेरठ', state: 'Uttar Pradesh', stateHindi: 'उत्तर प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 28.9845, longitude: 77.7064, timezone: 5.5 },
  { id: 'moradabad', name: 'Moradabad', nameHindi: 'मुरादाबाद', state: 'Uttar Pradesh', stateHindi: 'उत्तर प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 28.8386, longitude: 78.7733, timezone: 5.5 },
  { id: 'mysore', name: 'Mysore', nameHindi: 'मैसूर', state: 'Karnataka', stateHindi: 'कर्नाटक', country: 'India', countryHindi: 'भारत', latitude: 12.2958, longitude: 76.6394, timezone: 5.5 },
  { id: 'nagpur', name: 'Nagpur', nameHindi: 'नागपुर', state: 'Maharashtra', stateHindi: 'महाराष्ट्र', country: 'India', countryHindi: 'भारत', latitude: 21.1458, longitude: 79.0882, timezone: 5.5 },
  { id: 'nashik', name: 'Nashik', nameHindi: 'नासिक', state: 'Maharashtra', stateHindi: 'महाराष्ट्र', country: 'India', countryHindi: 'भारत', latitude: 19.9975, longitude: 73.7898, timezone: 5.5 },
  { id: 'noida', name: 'Noida', nameHindi: 'नोएडा', state: 'Uttar Pradesh', stateHindi: 'उत्तर प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 28.5355, longitude: 77.3910, timezone: 5.5 },
  { id: 'rajkot', name: 'Rajkot', nameHindi: 'राजकोट', state: 'Gujarat', stateHindi: 'गुजरात', country: 'India', countryHindi: 'भारत', latitude: 22.3039, longitude: 70.8022, timezone: 5.5 },
  { id: 'salem', name: 'Salem', nameHindi: 'सेलम', state: 'Tamil Nadu', stateHindi: 'तमिल नाडु', country: 'India', countryHindi: 'भारत', latitude: 11.6643, longitude: 78.1460, timezone: 5.5 },
  { id: 'solapur', name: 'Solapur', nameHindi: 'सोलापुर', state: 'Maharashtra', stateHindi: 'महाराष्ट्र', country: 'India', countryHindi: 'भारत', latitude: 17.6599, longitude: 75.9064, timezone: 5.5 },
  { id: 'surat', name: 'Surat', nameHindi: 'सूरत', state: 'Gujarat', stateHindi: 'गुजरात', country: 'India', countryHindi: 'भारत', latitude: 21.1702, longitude: 72.8311, timezone: 5.5 },
  { id: 'thane', name: 'Thane', nameHindi: 'ठाणे', state: 'Maharashtra', stateHindi: 'महाराष्ट्र', country: 'India', countryHindi: 'भारत', latitude: 19.2183, longitude: 72.9781, timezone: 5.5 },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli', nameHindi: 'तिरुचिरापल्ली', state: 'Tamil Nadu', stateHindi: 'तमिल नाडु', country: 'India', countryHindi: 'भारत', latitude: 10.7905, longitude: 78.7047, timezone: 5.5 },
  { id: 'udaipur', name: 'Udaipur', nameHindi: 'उदयपुर', state: 'Rajasthan', stateHindi: 'राजस्थान', country: 'India', countryHindi: 'भारत', latitude: 24.5854, longitude: 73.7125, timezone: 5.5 },
  { id: 'vadodara', name: 'Vadodara', nameHindi: 'वडोदरा', state: 'Gujarat', stateHindi: 'गुजरात', country: 'India', countryHindi: 'भारत', latitude: 22.3072, longitude: 73.1812, timezone: 5.5 },
  { id: 'varanasi', name: 'Varanasi', nameHindi: 'वाराणसी', state: 'Uttar Pradesh', stateHindi: 'उत्तर प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 25.3176, longitude: 82.9739, timezone: 5.5 },
  { id: 'vijayawada', name: 'Vijayawada', nameHindi: 'विजयवाड़ा', state: 'Andhra Pradesh', stateHindi: 'आंध्र प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 16.5062, longitude: 80.6480, timezone: 5.5 },
  { id: 'visakhapatnam', name: 'Visakhapatnam', nameHindi: 'विशाखापत्तनम', state: 'Andhra Pradesh', stateHindi: 'आंध्र प्रदेश', country: 'India', countryHindi: 'भारत', latitude: 17.6868, longitude: 83.2185, timezone: 5.5 },
  { id: 'warangal', name: 'Warangal', nameHindi: 'वारंगल', state: 'Telangana', stateHindi: 'तेलंगाना', country: 'India', countryHindi: 'भारत', latitude: 17.9689, longitude: 79.5941, timezone: 5.5 },
];

export const INTERNATIONAL_CITIES: City[] = [
  // Major International Cities
  { id: 'new_york', name: 'New York', nameHindi: 'न्यूयॉर्क', state: 'New York', stateHindi: 'न्यूयॉर्क', country: 'USA', countryHindi: 'अमेरिका', latitude: 40.7128, longitude: -74.0060, timezone: -5 },
  { id: 'london', name: 'London', nameHindi: 'लंदन', state: 'England', stateHindi: 'इंग्लैंड', country: 'UK', countryHindi: 'यूके', latitude: 51.5074, longitude: -0.1278, timezone: 0 },
  { id: 'tokyo', name: 'Tokyo', nameHindi: 'टोक्यो', state: 'Tokyo', stateHindi: 'टोक्यो', country: 'Japan', countryHindi: 'जापान', latitude: 35.6762, longitude: 139.6503, timezone: 9 },
  { id: 'sydney', name: 'Sydney', nameHindi: 'सिडनी', state: 'New South Wales', stateHindi: 'न्यू साउथ वेल्स', country: 'Australia', countryHindi: 'ऑस्ट्रेलिया', latitude: -33.8688, longitude: 151.2093, timezone: 10 },
  { id: 'paris', name: 'Paris', nameHindi: 'पेरिस', state: 'Île-de-France', stateHindi: 'इले-डी-फ्रांस', country: 'France', countryHindi: 'फ्रांस', latitude: 48.8566, longitude: 2.3522, timezone: 1 },
  { id: 'berlin', name: 'Berlin', nameHindi: 'बर्लिन', state: 'Berlin', stateHindi: 'बर्लिन', country: 'Germany', countryHindi: 'जर्मनी', latitude: 52.5200, longitude: 13.4050, timezone: 1 },
  { id: 'moscow', name: 'Moscow', nameHindi: 'मास्को', state: 'Moscow', stateHindi: 'मास्को', country: 'Russia', countryHindi: 'रूस', latitude: 55.7558, longitude: 37.6173, timezone: 3 },
  { id: 'dubai', name: 'Dubai', nameHindi: 'दुबई', state: 'Dubai', stateHindi: 'दुबई', country: 'UAE', countryHindi: 'यूएई', latitude: 25.2048, longitude: 55.2708, timezone: 4 },
  { id: 'singapore', name: 'Singapore', nameHindi: 'सिंगापुर', state: 'Singapore', stateHindi: 'सिंगापुर', country: 'Singapore', countryHindi: 'सिंगापुर', latitude: 1.3521, longitude: 103.8198, timezone: 8 },
  { id: 'toronto', name: 'Toronto', nameHindi: 'टोरंटो', state: 'Ontario', stateHindi: 'ओंटारियो', country: 'Canada', countryHindi: 'कनाडा', latitude: 43.6532, longitude: -79.3832, timezone: -5 },
];

export const ALL_CITIES = [...INDIAN_CITIES, ...INTERNATIONAL_CITIES];

export const getCityById = (id: string): City | undefined => {
  return ALL_CITIES.find(city => city.id === id);
};

export const searchCities = (query: string, language: 'en' | 'hi' = 'en'): City[] => {
  const searchTerm = query.toLowerCase();
  return ALL_CITIES.filter(city => {
    const name = language === 'hi' ? city.nameHindi : city.name;
    const state = language === 'hi' ? city.stateHindi : city.state;
    const country = language === 'hi' ? city.countryHindi : city.country;
    
    return name.toLowerCase().includes(searchTerm) ||
           state.toLowerCase().includes(searchTerm) ||
           country.toLowerCase().includes(searchTerm);
  });
};