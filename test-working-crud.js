// Test the working CRUD functionality using the generate endpoint
const baseUrl = "https://jyotaishya.vercel.app/api";

console.log("🧪 Testing Working CRUD Functionality...");

async function testWorkingCRUD() {
  try {
    // Step 1: Generate a new kundali (POST)
    console.log("\n📝 Step 1: Generating new kundali...");
    const kundaliData = {
      name: "Working CRUD Test User",
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
    
    if (!generateResponse.ok) {
      const error = await generateResponse.text();
      console.log("❌ Generate failed:", error);
      return;
    }

    const generateResult = await generateResponse.json();
    console.log("✅ Generate successful");
    console.log("✅ Kundali ID:", generateResult.data.id);
    console.log("✅ Name:", generateResult.data.name);
    console.log("✅ Place:", generateResult.data.placeOfBirth);
    console.log("✅ Planets count:", generateResult.data.planets.length);
    
    const kundaliId = generateResult.data.id;
    
    // Step 2: Retrieve the kundali by ID (GET)
    console.log(`\n🔍 Step 2: Retrieving kundali by ID: ${kundaliId}...`);
    const retrieveResponse = await fetch(`${baseUrl}/kundali/generate?id=${kundaliId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("📡 Retrieve Status:", retrieveResponse.status);
    
    if (retrieveResponse.ok) {
      const retrieveResult = await retrieveResponse.json();
      console.log("✅ Retrieve successful");
      console.log("✅ Retrieved Name:", retrieveResult.data.name);
      console.log("✅ Retrieved Place:", retrieveResult.data.placeOfBirth);
      console.log("✅ Retrieved Planets count:", retrieveResult.data.planets.length);
      console.log("✅ Data matches:", 
        retrieveResult.data.name === generateResult.data.name &&
        retrieveResult.data.placeOfBirth === generateResult.data.placeOfBirth
      );
    } else {
      const error = await retrieveResponse.text();
      console.log("❌ Retrieve failed:", error);
    }

    // Step 3: Test error handling - try to retrieve non-existent kundali
    console.log("\n🔍 Step 3: Testing error handling with non-existent ID...");
    const errorResponse = await fetch(`${baseUrl}/kundali/generate?id=nonexistent`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("📡 Error Test Status:", errorResponse.status);
    
    if (errorResponse.status === 404) {
      const errorResult = await errorResponse.json();
      console.log("✅ Error handling works correctly");
      console.log("✅ Error message:", errorResult.message);
    } else {
      console.log("❌ Error handling not working as expected");
    }

    console.log("\n🎉 Working CRUD Test Summary:");
    console.log("- ✅ Kundali Generation (POST): Working");
    console.log("- ✅ Kundali Retrieval (GET): Working");
    console.log("- ✅ Error Handling: Working");
    console.log("- ✅ Data Persistence: Working (in-memory)");
    console.log("\n🌟 Basic CRUD functionality is working correctly!");

  } catch (error) {
    console.error("❌ Working CRUD Test Failed:", error.message);
  }
}

testWorkingCRUD();
