# 🚀 Base Mini-App Deployment Guide

## Overview
This Events Mini App is ready for deployment as a Base/Farcaster mini-app. Follow these steps to deploy and integrate with the Base ecosystem.

---

## 📋 Prerequisites

- GitHub account
- Vercel account (or similar hosting: Netlify, Cloudflare Pages)
- Domain name (optional but recommended)

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"
   - Your app will be live at: `https://your-app.vercel.app`

3. **Custom Domain (Optional)**
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option 2: Netlify

1. **Deploy via Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag the project folder to "Sites"
   - Your app will be live instantly

2. **Or via GitHub**
   - Connect GitHub repository
   - Configure build settings:
     - Build command: (leave empty)
     - Publish directory: `.`
   - Deploy

### Option 3: GitHub Pages

1. **Create Repository**
   - Create a new public GitHub repository

2. **Push Code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/` (root)
   - Save

---

## 🎯 Farcaster Frame Integration

### Update Meta Tags

After deployment, update `index.html` with your actual URL:

```html
<meta property="fc:frame:image" content="https://YOUR-DOMAIN.com/preview.png" />
<meta property="og:image" content="https://YOUR-DOMAIN.com/preview.png" />
```

### Create Preview Image

Create a 1200x630px preview image:
- Name it `preview.png`
- Place in root directory
- Should show: App name, description, and key features

### Register as Farcaster Frame

1. **Visit Warpcast**
   - Share your deployed URL in a cast
   - The Frame will automatically be detected

2. **Test the Frame**
   - Cast the URL
   - Click to interact
   - Verify all buttons work

---

## 🔗 Base Network Integration (Future Enhancement)

To fully integrate with Base network, you'll need:

### 1. Add Wallet Connection

Install dependencies (requires Node.js setup):
```bash
npm install wagmi viem @rainbow-me/rainbowkit
```

### 2. Smart Contract Integration

For on-chain event registration:
- Deploy smart contract on Base
- Update app to interact with contract
- Add transaction signing

### 3. IPFS for Event Data

Store event data on IPFS:
- Use Pinata or NFT.Storage
- Update event creation to pin to IPFS
- Store IPFS hashes on-chain

---

## 🔧 Configuration Updates

### Update frame.json

```json
{
  "homeUrl": "https://YOUR-ACTUAL-DOMAIN.com",
  "imageUrl": "https://YOUR-ACTUAL-DOMAIN.com/preview.png"
}
```

### Update Admin Mode

In `app.js`, set admin mode:
```javascript
const IS_ADMIN = false; // Set to true for admin features
```

---

## ✅ Post-Deployment Checklist

- [ ] App deployed and accessible via HTTPS
- [ ] Meta tags updated with actual URLs
- [ ] Preview image created and uploaded
- [ ] Tested in Warpcast as Frame
- [ ] All features working (Events, Calendar, Profile)
- [ ] Mobile responsive design verified
- [ ] Share functionality tested
- [ ] localStorage persistence working

---

## 🎨 Customization Tips

1. **Branding**
   - Update colors in `styles.css`
   - Change app title in `index.html`
   - Add your logo

2. **Features**
   - Enable/disable admin mode
   - Customize event categories
   - Add more filters

3. **Integration**
   - Add wallet connection for Base
   - Integrate Farcaster user data
   - Add NFT gating for events

---

## 🐛 Troubleshooting

**Frame not showing in Warpcast?**
- Verify HTTPS is enabled
- Check meta tags are correct
- Ensure preview image is accessible

**LocalStorage not persisting?**
- Check browser privacy settings
- Verify HTTPS connection
- Test in different browsers

**Filters not working?**
- Clear localStorage: `localStorage.clear()`
- Refresh page
- Check console for errors

---

## 📱 Next Steps for Base Integration

1. **Add Farcaster Auth**
   - Install `@farcaster/auth-kit`
   - Replace mock user data with real Farcaster profiles

2. **Connect Base Wallet**
   - Install RainbowKit
   - Add "Connect Wallet" button
   - Show Base address in profile

3. **On-Chain Features**
   - Deploy event registry contract on Base
   - Add transaction signing
   - Store registrations on-chain

4. **Token Gating**
   - Check NFT ownership
   - Require Base tokens for premium events
   - Add attestations via EAS

---

## 🌟 Resources

- [Farcaster Frames Documentation](https://docs.farcaster.xyz/reference/frames/spec)
- [Base Documentation](https://docs.base.org)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [RainbowKit Setup](https://www.rainbowkit.com/docs/installation)

---

## 🎉 Your App is Ready!

The mini-app is now fully functional and ready for Base/Farcaster integration. Deploy it, share it, and start building your community!

For questions or issues, check the console logs and verify all configurations are correct.
