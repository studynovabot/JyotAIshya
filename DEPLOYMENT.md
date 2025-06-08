# JyotAIshya Vercel Deployment Guide

## 🚀 Full-Stack Serverless Deployment

This guide explains how to deploy the complete JyotAIshya application to Vercel with serverless backend functions.

## 📁 Project Structure

```
JyotAIshya/
├── api/                          # Vercel Serverless Functions
│   ├── health.js                 # Health check endpoint
│   ├── index.js                  # API root endpoint
│   ├── kundali/
│   │   ├── generate.js           # Main kundali generation
│   │   ├── dosha-check.js        # Dosha analysis
│   │   └── dasha.js              # Dasha calculation
│   ├── compatibility/
│   │   └── match.js              # Compatibility matching
│   ├── horoscope/
│   │   └── daily.js              # Daily horoscope
│   └── package.json              # API dependencies
├── client/                       # React Frontend
│   ├── src/
│   ├── dist/                     # Build output
│   └── package.json
├── server/                       # Original server (for reference)
│   └── utils/
│       └── astroCalculationsNew.js  # Shared calculation logic
├── vercel.json                   # Vercel configuration
└── DEPLOYMENT.md                 # This file
```

## 🔧 API Endpoints

Once deployed, the following endpoints will be available:

### Health & Info
- `GET /api/health` - Health check
- `GET /api/` - API information

### Kundali Services
- `POST /api/kundali/generate` - Generate complete birth chart
- `POST /api/kundali/dosha-check` - Check for doshas
- `POST /api/kundali/dasha` - Calculate dasha periods

### Compatibility
- `POST /api/compatibility/match` - Calculate compatibility

### Horoscope
- `GET /api/horoscope/daily?rashi=aries` - Daily horoscope

## 📋 Deployment Steps

### 1. Prepare for Deployment

Ensure all files are committed:
```bash
git add .
git commit -m "Add serverless API functions for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set build settings (should auto-detect)
# - Deploy
```

#### Option B: GitHub Integration
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Import the project
4. Deploy automatically

### 3. Verify Deployment

After deployment, test these URLs (replace `your-app.vercel.app`):

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Kundali generation
curl -X POST https://your-app.vercel.app/api/kundali/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "birthDate": "1990-05-15",
    "birthTime": "14:30",
    "birthPlace": "New Delhi, India"
  }'
```

## 🔍 Testing

### Local Testing
```bash
# Test serverless functions locally
node test-serverless.js

# Test specific function
node -e "
import('./api/health.js').then(({default: handler}) => {
  const req = {method: 'GET', headers: {}};
  const res = {
    setHeader: () => {},
    status: (code) => ({json: (data) => console.log(data)}),
    json: (data) => console.log(data)
  };
  handler(req, res);
})
"
```

### Production Testing
```bash
# Test deployed API
curl https://jyotaishya.vercel.app/api/health
```

## 🌟 Features

### ✅ Fully Serverless
- No server maintenance required
- Automatic scaling
- Global edge deployment
- 99.99% uptime

### ✅ Complete Astrological Calculations
- Accurate planetary positions
- Traditional Vedic calculations
- Dosha analysis (Manglik, Kaal Sarp, Sade Sati)
- Dasha period calculations
- Compatibility matching

### ✅ Production Ready
- CORS configured for all origins
- Error handling and fallbacks
- Proper HTTP status codes
- JSON API responses

## 🔧 Configuration

### Environment Variables
Set these in Vercel dashboard if needed:
- `NODE_ENV=production` (automatically set)

### Custom Domain
1. Go to Vercel dashboard
2. Project Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

## 🐛 Troubleshooting

### Common Issues

1. **Import Errors**
   - Ensure all imports use `.js` extensions
   - Check file paths are correct

2. **CORS Issues**
   - CORS is configured for all origins (`*`)
   - Check browser console for specific errors

3. **Function Timeouts**
   - Functions have 30-second timeout
   - Complex calculations should complete within this limit

4. **Cold Starts**
   - First request may be slower (cold start)
   - Subsequent requests will be faster

### Debug Steps
1. Check Vercel function logs in dashboard
2. Test individual endpoints
3. Verify API responses match expected format

## 📈 Performance

- **Cold Start**: ~1-3 seconds
- **Warm Response**: ~100-500ms
- **Concurrent Users**: Unlimited (auto-scaling)
- **Global CDN**: Edge locations worldwide

## 🔒 Security

- HTTPS enforced
- No sensitive data stored
- Stateless functions
- Input validation on all endpoints

## 📞 Support

For deployment issues:
1. Check Vercel dashboard logs
2. Test endpoints individually
3. Verify frontend API calls match new structure

The application is now fully cloud-hosted and accessible 24/7! 🎉
