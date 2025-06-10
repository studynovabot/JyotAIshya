// Test the 404 fix for the complete user workflow
const baseUrl = "https://jyotaishya.vercel.app/api";

console.log("🧪 Testing 404 Fix - Complete User Workflow...");

async function test404Fix() {
  try {
    // Step 1: Generate a new kundali (POST)
    console.log("\n📝 Step 1: Generating new kundali...");
    const kundaliData = {
      name: "404 Fix Test User",
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
    console.log("✅ Generation successful");
    console.log("✅ Kundali ID:", generateResult.data.id);
    console.log("✅ Name:", generateResult.data.name);
    console.log("✅ Place:", generateResult.data.placeOfBirth);
    
    const kundaliId = generateResult.data.id;
    
    // Step 2: Test the exact pattern that was failing in the browser
    console.log(`\n🔍 Step 2: Testing the exact failing pattern: GET /api/kundali/${kundaliId}...`);
    const directResponse = await fetch(`${baseUrl}/kundali/${kundaliId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("📡 Direct GET Status:", directResponse.status);
    
    if (directResponse.ok) {
      const directResult = await directResponse.json();
      console.log("✅ Direct GET successful!");
      console.log("✅ Retrieved Name:", directResult.data.name);
      console.log("✅ Retrieved Place:", directResult.data.placeOfBirth);
      console.log("✅ Data integrity check:", 
        directResult.data.name === generateResult.data.name &&
        directResult.data.placeOfBirth === generateResult.data.placeOfBirth
      );
    } else {
      const error = await directResponse.text();
      console.log("❌ Direct GET failed:", error);
      
      // If direct pattern fails, test the alternative pattern
      console.log(`\n🔄 Testing alternative pattern: GET /api/kundali/generate?id=${kundaliId}...`);
      const altResponse = await fetch(`${baseUrl}/kundali/generate?id=${kundaliId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      console.log("📡 Alternative GET Status:", altResponse.status);
      
      if (altResponse.ok) {
        const altResult = await altResponse.json();
        console.log("✅ Alternative GET successful!");
        console.log("✅ Retrieved Name:", altResult.data.name);
      } else {
        const altError = await altResponse.text();
        console.log("❌ Alternative GET also failed:", altError);
      }
    }

    // Step 3: Test frontend workflow simulation
    console.log("\n📱 Step 3: Simulating frontend workflow...");
    console.log("Frontend would:");
    console.log("1. Generate kundali ✅");
    console.log("2. Get ID from response ✅");
    console.log("3. Navigate to /kundali?id=" + kundaliId);
    console.log("4. Make GET request to retrieve data");
    
    if (directResponse.ok) {
      console.log("5. Display kundali without errors ✅");
      console.log("\n🎉 SUCCESS: Complete user workflow should work without 404 errors!");
    } else {
      console.log("5. Show error message ❌");
      console.log("\n⚠️ ISSUE: User workflow still has problems");
    }

    console.log("\n📊 Test Summary:");
    console.log(`- POST /api/kundali/generate: ${generateResponse.ok ? '✅' : '❌'}`);
    console.log(`- GET /api/kundali/${kundaliId}: ${directResponse.ok ? '✅' : '❌'}`);
    console.log(`- User workflow: ${directResponse.ok ? '✅ Fixed' : '❌ Still broken'}`);

  } catch (error) {
    console.error("❌ 404 Fix Test Failed:", error.message);
  }
}

test404Fix();
