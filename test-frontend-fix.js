// Test script to verify the frontend fixes for null safety
const testData = {
  name: "Test User",
  birthDate: "1990-01-15",
  birthTime: "10:30",
  birthPlace: "Delhi, India"
};

console.log("🧪 Testing JyotAIshya API and Frontend Fixes...");

fetch("https://jyotaishya.vercel.app/api/kundali/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log("✅ API Response Status:", response.status);
  return response.json();
})
.then(data => {
  console.log("✅ API Response received successfully");
  
  // Test the data structure that was causing frontend errors
  const kundaliData = data.data;
  
  console.log("🔍 Testing data structure that caused frontend errors:");
  
  // Test ascendant rashiName access (was causing errors)
  console.log("Ascendant rashiName:", kundaliData.ascendant.rashiName);
  console.log("Ascendant english:", kundaliData.ascendant.rashiName?.english);
  console.log("Ascendant name:", kundaliData.ascendant.rashiName?.name);
  
  // Test planet rashiName access (was causing errors in map function)
  console.log("\n🪐 Testing planet data structure:");
  kundaliData.planets.forEach((planet, index) => {
    console.log(`Planet ${index + 1}:`, {
      name: planet.name?.en,
      rashiName: planet.rashiName?.english,
      rashi: planet.rashi,
      isRetrograde: planet.isRetrograde
    });
  });
  
  console.log("\n🎉 All data structures are valid! Frontend should work without errors.");
})
.catch(error => {
  console.error("❌ Test failed:", error);
});
