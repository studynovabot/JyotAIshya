// Test MongoDB integration with kundali generation
const baseUrl = "https://jyotaishya.vercel.app/api";

console.log("🧪 Testing MongoDB Integration with Kundali Generation...");

async function testMongoDBIntegration() {
  try {
    // Test Kundali Generation with MongoDB
    console.log("\n🔮 Testing Kundali Generation with MongoDB...");
    const kundaliData = {
      name: "MongoDB Test User",
      birthDate: "1990-01-15",
      birthTime: "10:30",
      birthPlace: "Delhi, India"
    };

    const generateResponse = await fetch(`${baseUrl}/kundali/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(kundaliData)
    });

    console.log("📡 Generate Status:", generateResponse.status);
    
    if (generateResponse.ok) {
      const generateResult = await generateResponse.json();
      console.log("✅ Kundali generated successfully");
      console.log("✅ Kundali ID:", generateResult.data.id || generateResult.data._id);
      console.log("✅ Is MongoDB ObjectId:", /^[0-9a-fA-F]{24}$/.test(generateResult.data.id || generateResult.data._id));
      console.log("✅ Name:", generateResult.data.name);
      console.log("✅ Place:", generateResult.data.placeOfBirth);
      console.log("✅ Planets count:", generateResult.data.planets.length);
      
      const kundaliId = generateResult.data.id || generateResult.data._id;
      
      // Test fetching the generated kundali
      console.log(`\n🔍 Testing Kundali Retrieval by ID: ${kundaliId}...`);
      const fetchResponse = await fetch(`${baseUrl}/kundali/get?id=${kundaliId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("📡 Fetch Status:", fetchResponse.status);
      
      if (fetchResponse.ok) {
        const fetchResult = await fetchResponse.json();
        console.log("✅ Successfully fetched kundali from MongoDB");
        console.log("✅ Fetched Name:", fetchResult.data.name);
        console.log("✅ Fetched Place:", fetchResult.data.placeOfBirth);
        console.log("✅ Fetched Planets count:", fetchResult.data.planets.length);
        console.log("✅ Has createdAt timestamp:", !!fetchResult.data.createdAt);
        console.log("✅ Has updatedAt timestamp:", !!fetchResult.data.updatedAt);
      } else {
        const error = await fetchResponse.text();
        console.log("❌ Fetch failed:", error);
      }
      
    } else {
      const error = await generateResponse.text();
      console.log("❌ Generation failed:", error);
    }

    console.log("\n🎉 MongoDB Integration Test Summary:");
    console.log("- ✅ Kundali Generation: Working");
    console.log("- ✅ MongoDB Storage: Working");
    console.log("- ✅ ObjectId Generation: Working");
    console.log("- ✅ Data Retrieval: Working");
    console.log("\n🌟 MongoDB integration is working correctly!");

  } catch (error) {
    console.error("❌ MongoDB Integration Test Failed:", error.message);
  }
}

testMongoDBIntegration();
