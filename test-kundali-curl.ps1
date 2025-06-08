# PowerShell script to test Kundali API endpoint
$API_BASE = "https://jyotaishya-nabtzaeyk-ranveer-singh-rajputs-projects.vercel.app"

Write-Host "🔮 Testing Kundali Generation API..." -ForegroundColor Cyan

# Test data
$testData = @{
    name = "Test User"
    birthDate = "1990-05-15"
    birthTime = "14:30"
    birthPlace = "New Delhi, India"
} | ConvertTo-Json

Write-Host "📤 Sending request to: $API_BASE/api/kundali/generate" -ForegroundColor Yellow
Write-Host "📋 Request data: $testData" -ForegroundColor Yellow

try {
    # Make the API call
    $response = Invoke-RestMethod -Uri "$API_BASE/api/kundali/generate" -Method POST -Body $testData -ContentType "application/json" -TimeoutSec 30
    
    Write-Host "✅ Kundali generation successful!" -ForegroundColor Green
    Write-Host "📊 Response summary:" -ForegroundColor Green
    Write-Host "  Success: $($response.success)" -ForegroundColor White
    Write-Host "  Name: $($response.data.name)" -ForegroundColor White
    Write-Host "  Ascendant: $($response.data.ascendant.rashiName.english)" -ForegroundColor White
    Write-Host "  Planets Count: $($response.data.planets.Count)" -ForegroundColor White
    Write-Host "  Message: $($response.message)" -ForegroundColor White
    
    # Test specific astrological data
    Write-Host "`n🌟 Astrological Details:" -ForegroundColor Magenta
    Write-Host "  Birth Place: $($response.data.placeOfBirth)" -ForegroundColor White
    Write-Host "  Coordinates: $($response.data.coordinates.latitude), $($response.data.coordinates.longitude)" -ForegroundColor White
    Write-Host "  Ayanamsa: $($response.data.ayanamsa)" -ForegroundColor White
    
    # Check doshas
    Write-Host "`n🔍 Dosha Analysis:" -ForegroundColor Red
    Write-Host "  Manglik: $($response.data.doshas.manglik.present)" -ForegroundColor White
    Write-Host "  Kaal Sarp: $($response.data.doshas.kaalSarp.present)" -ForegroundColor White
    Write-Host "  Sade Sati: $($response.data.doshas.sadeSati.present)" -ForegroundColor White
    
    # Check dasha periods
    Write-Host "`n⏰ Current Dasha:" -ForegroundColor Blue
    Write-Host "  Planet: $($response.data.dashaPeriods.currentDasha.planet.en)" -ForegroundColor White
    Write-Host "  Remaining Years: $($response.data.dashaPeriods.currentDasha.remainingYears)" -ForegroundColor White
    
    Write-Host "`n🎉 All tests passed! Kundali generation is working correctly." -ForegroundColor Green
    
} catch {
    Write-Host "❌ Kundali generation failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception.ToString())" -ForegroundColor Red
}
