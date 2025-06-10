// Test script to verify the complete CRUD workflow for kundali operations
const testData = {
  name: "CRUD Test User",
  birthDate: "1990-01-15",
  birthTime: "10:30",
  birthPlace: "Delhi, India"
};

console.log("🧪 Testing Complete CRUD Workflow for JyotAIshya...");

async function testCompleteWorkflow() {
  try {
    // Step 1: Generate a new kundali (POST)
    console.log("\n📝 Step 1: Generating new kundali...");
    const generateResponse = await fetch("https://jyotaishya.vercel.app/api/kundali/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testData)
    });

    if (!generateResponse.ok) {
      throw new Error(`Generate failed: ${generateResponse.status}`);
    }

    const generateData = await generateResponse.json();
    console.log("✅ Generate Status:", generateResponse.status);
    console.log("✅ Generated kundali ID:", generateData.data.id || generateData.data._id);
    
    const kundaliId = generateData.data.id || generateData.data._id;
    
    if (!kundaliId) {
      throw new Error("No kundali ID returned from generate endpoint");
    }

    // Step 2: Fetch the kundali by ID (GET)
    console.log(`\n🔍 Step 2: Fetching kundali by ID: ${kundaliId}...`);
    const fetchResponse = await fetch(`https://jyotaishya.vercel.app/api/kundali/get?id=${kundaliId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("📡 Fetch Status:", fetchResponse.status);
    
    if (fetchResponse.ok) {
      const fetchData = await fetchResponse.json();
      console.log("✅ Successfully fetched kundali");
      console.log("✅ Fetched name:", fetchData.data.name);
      console.log("✅ Fetched place:", fetchData.data.placeOfBirth);
    } else {
      console.log("❌ Fetch failed:", await fetchResponse.text());
    }

    // Step 3: Update the kundali (PUT)
    console.log(`\n✏️ Step 3: Updating kundali ID: ${kundaliId}...`);
    const updateData = {
      ...testData,
      name: "Updated CRUD Test User",
      birthPlace: "Mumbai, India"
    };

    const updateResponse = await fetch(`https://jyotaishya.vercel.app/api/kundali/update?id=${kundaliId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateData)
    });

    console.log("📡 Update Status:", updateResponse.status);
    
    if (updateResponse.ok) {
      const updateResponseData = await updateResponse.json();
      console.log("✅ Successfully updated kundali");
      console.log("✅ Updated name:", updateResponseData.data.name);
      console.log("✅ Updated place:", updateResponseData.data.placeOfBirth);
    } else {
      console.log("❌ Update failed:", await updateResponse.text());
    }

    console.log("\n🎉 CRUD Workflow Test Complete!");
    console.log("📊 Summary:");
    console.log("- POST /api/kundali/generate: ✅ Working");
    console.log(`- GET /api/kundali/${kundaliId}: ${fetchResponse.ok ? '✅ Working' : '❌ Failed'}`);
    console.log(`- PUT /api/kundali/${kundaliId}: ${updateResponse.ok ? '✅ Working' : '❌ Failed'}`);

  } catch (error) {
    console.error("❌ CRUD Workflow Test Failed:", error.message);
  }
}

testCompleteWorkflow();
