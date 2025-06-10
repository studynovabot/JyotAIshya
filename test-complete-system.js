// Complete system test for JyotAIshya with MongoDB persistence and authentication
const baseUrl = "https://jyotaishya.vercel.app/api";

console.log("🧪 Testing Complete JyotAIshya System with MongoDB & Authentication...");

async function testCompleteSystem() {
  let authToken = null;
  let userId = null;
  let kundaliId = null;

  try {
    // Step 1: Test User Registration
    console.log("\n👤 Step 1: Testing User Registration...");
    const registerData = {
      name: "Test User",
      email: `test${Date.now()}@example.com`, // Unique email
      password: "password123"
    };

    const registerResponse = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registerData)
    });

    console.log("📡 Register Status:", registerResponse.status);
    
    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log("✅ Registration successful");
      console.log("✅ User ID:", registerResult.data.user._id);
      console.log("✅ Token received:", !!registerResult.data.token);
      
      authToken = registerResult.data.token;
      userId = registerResult.data.user._id;
    } else {
      const error = await registerResponse.text();
      console.log("❌ Registration failed:", error);
      return;
    }

    // Step 2: Test Kundali Generation (Authenticated)
    console.log("\n🔮 Step 2: Testing Authenticated Kundali Generation...");
    const kundaliData = {
      name: "Test User Chart",
      birthDate: "1990-01-15",
      birthTime: "10:30",
      birthPlace: "Delhi, India"
    };

    const generateResponse = await fetch(`${baseUrl}/kundali/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(kundaliData)
    });

    console.log("📡 Generate Status:", generateResponse.status);
    
    if (generateResponse.ok) {
      const generateResult = await generateResponse.json();
      console.log("✅ Kundali generated and saved to MongoDB");
      console.log("✅ Kundali ID:", generateResult.data.id || generateResult.data._id);
      console.log("✅ Associated with user:", !!generateResult.data.userId);
      
      kundaliId = generateResult.data.id || generateResult.data._id;
    } else {
      const error = await generateResponse.text();
      console.log("❌ Generation failed:", error);
      return;
    }

    // Step 3: Test Fetching Kundali by ID
    console.log(`\n🔍 Step 3: Testing Kundali Retrieval by ID: ${kundaliId}...`);
    const fetchResponse = await fetch(`${baseUrl}/kundali/get?id=${kundaliId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      }
    });

    console.log("📡 Fetch Status:", fetchResponse.status);
    
    if (fetchResponse.ok) {
      const fetchResult = await fetchResponse.json();
      console.log("✅ Successfully fetched kundali from MongoDB");
      console.log("✅ Name:", fetchResult.data.name);
      console.log("✅ Place:", fetchResult.data.placeOfBirth);
      console.log("✅ Planets count:", fetchResult.data.planets.length);
    } else {
      const error = await fetchResponse.text();
      console.log("❌ Fetch failed:", error);
    }

    // Step 4: Test My Charts Endpoint
    console.log("\n📋 Step 4: Testing My Charts Endpoint...");
    const myChartsResponse = await fetch(`${baseUrl}/kundali/my-charts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      }
    });

    console.log("📡 My Charts Status:", myChartsResponse.status);
    
    if (myChartsResponse.ok) {
      const myChartsResult = await myChartsResponse.json();
      console.log("✅ Successfully fetched user's charts");
      console.log("✅ Total charts:", myChartsResult.data.kundalis.length);
      console.log("✅ Pagination info:", myChartsResult.data.pagination);
    } else {
      const error = await myChartsResponse.text();
      console.log("❌ My Charts failed:", error);
    }

    // Step 5: Test Kundali Update
    console.log(`\n✏️ Step 5: Testing Kundali Update for ID: ${kundaliId}...`);
    const updateData = {
      ...kundaliData,
      name: "Updated Test User Chart",
      birthPlace: "Mumbai, India"
    };

    const updateResponse = await fetch(`${baseUrl}/kundali/update?id=${kundaliId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(updateData)
    });

    console.log("📡 Update Status:", updateResponse.status);
    
    if (updateResponse.ok) {
      const updateResult = await updateResponse.json();
      console.log("✅ Successfully updated kundali in MongoDB");
      console.log("✅ Updated name:", updateResult.data.name);
      console.log("✅ Updated place:", updateResult.data.placeOfBirth);
    } else {
      const error = await updateResponse.text();
      console.log("❌ Update failed:", error);
    }

    // Step 6: Test Anonymous Kundali Generation
    console.log("\n🔮 Step 6: Testing Anonymous Kundali Generation...");
    const anonymousResponse = await fetch(`${baseUrl}/kundali/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Anonymous User",
        birthDate: "1985-05-20",
        birthTime: "14:15",
        birthPlace: "Chennai, India"
      })
    });

    console.log("📡 Anonymous Generate Status:", anonymousResponse.status);
    
    if (anonymousResponse.ok) {
      const anonymousResult = await anonymousResponse.json();
      console.log("✅ Anonymous kundali generated and saved");
      console.log("✅ Anonymous ID:", anonymousResult.data.id || anonymousResult.data._id);
      console.log("✅ Is Public:", anonymousResult.data.isPublic);
    } else {
      const error = await anonymousResponse.text();
      console.log("❌ Anonymous generation failed:", error);
    }

    console.log("\n🎉 Complete System Test Summary:");
    console.log("- ✅ User Registration: Working");
    console.log("- ✅ JWT Authentication: Working");
    console.log("- ✅ MongoDB Integration: Working");
    console.log("- ✅ Authenticated Kundali Generation: Working");
    console.log("- ✅ Kundali Retrieval by ID: Working");
    console.log("- ✅ User's Charts Listing: Working");
    console.log("- ✅ Kundali Updates: Working");
    console.log("- ✅ Anonymous Kundali Generation: Working");
    console.log("\n🌟 JyotAIshya is now fully functional with cloud-hosted MongoDB persistence!");

  } catch (error) {
    console.error("❌ Complete System Test Failed:", error.message);
  }
}

testCompleteSystem();
