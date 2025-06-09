#!/usr/bin/env node

/**
 * Simple verification script to test the deployed API
 * This establishes a baseline that the backend functionality works
 */

import { spawn } from 'child_process';

console.log('🚀 JyotAIshya Integration Verification');
console.log('=' .repeat(50));

// Test 1: Verify deployed API works
console.log('\n📡 Testing Deployed API...');
console.log('Testing: https://jyotaishya-nabtzaeyk-ranveer-singh-rajputs-projects.vercel.app/api/kundali/generate');

const testData = {
  name: "Verification Test",
  birthDate: "1990-05-15", 
  birthTime: "14:30",
  birthPlace: "New Delhi, India"
};

// Use PowerShell to test the API
const psCommand = `
$body = @{
  name = '${testData.name}'
  birthDate = '${testData.birthDate}'
  birthTime = '${testData.birthTime}'
  birthPlace = '${testData.birthPlace}'
} | ConvertTo-Json

try {
  $response = Invoke-RestMethod -Uri 'https://jyotaishya-nabtzaeyk-ranveer-singh-rajputs-projects.vercel.app/api/kundali/generate' -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 30
  
  if ($response.success) {
    Write-Host '✅ DEPLOYED API: WORKING'
    Write-Host "   Name: $($response.data.name)"
    Write-Host "   Planets: $($response.data.planets.Count)"
    Write-Host "   Ascendant: $($response.data.ascendant.rashiName.english)"
    Write-Host "   Message: $($response.message)"
  } else {
    Write-Host '❌ DEPLOYED API: FAILED'
    Write-Host "   Error: $($response.message)"
  }
} catch {
  Write-Host '❌ DEPLOYED API: ERROR'
  Write-Host "   Error: $($_.Exception.Message)"
}
`;

const ps = spawn('powershell', ['-Command', psCommand], { stdio: 'inherit' });

ps.on('close', (code) => {
  console.log('\n🔍 Local Server Status Check...');
  
  // Test 2: Check if local servers are accessible
  const checkServers = `
Write-Host 'Checking local servers...'

# Check backend
try {
  $backendResponse = Invoke-WebRequest -Uri 'http://localhost:3002' -TimeoutSec 5 -UseBasicParsing
  Write-Host '✅ BACKEND (3002): ACCESSIBLE'
} catch {
  Write-Host '❌ BACKEND (3002): NOT ACCESSIBLE'
  Write-Host "   Error: $($_.Exception.Message)"
}

# Check frontend  
try {
  $frontendResponse = Invoke-WebRequest -Uri 'http://localhost:5173' -TimeoutSec 5 -UseBasicParsing
  Write-Host '✅ FRONTEND (5173): ACCESSIBLE'
} catch {
  Write-Host '❌ FRONTEND (5173): NOT ACCESSIBLE'
  Write-Host "   Error: $($_.Exception.Message)"
}

# Check if ports are listening
Write-Host ''
Write-Host 'Port Status:'
$ports = @(3002, 5173)
foreach ($port in $ports) {
  $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
  if ($connection.TcpTestSucceeded) {
    Write-Host "✅ Port $port: LISTENING"
  } else {
    Write-Host "❌ Port $port: NOT LISTENING"
  }
}
`;

  const psCheck = spawn('powershell', ['-Command', checkServers], { stdio: 'inherit' });
  
  psCheck.on('close', (checkCode) => {
    console.log('\n📋 Next Steps:');
    console.log('1. If deployed API works but local servers are not accessible:');
    console.log('   → Restart servers: cd server && node index.js');
    console.log('   → Restart frontend: cd client && npm run dev');
    console.log('');
    console.log('2. If local servers are accessible:');
    console.log('   → Open browser to: http://localhost:5173');
    console.log('   → Follow manual testing guide in MANUAL_TESTING_GUIDE.md');
    console.log('');
    console.log('3. If deployed API works:');
    console.log('   → Backend functionality is confirmed working');
    console.log('   → Focus on frontend-backend communication');
    console.log('');
    console.log('🎯 Recommended: Manual browser testing at http://localhost:5173');
  });
});
