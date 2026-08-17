# 🚀 Fantasy Big Board — Setup Guide

This guide walks you through setting up the app from scratch and deploying it live for free.

## Step 1: Create a Firebase Project (5 minutes)

### 1.1 Go to Firebase Console
- Open https://console.firebase.google.com
- Click "Create a project" (or use an existing one)
- Name it "Fantasy Big Board" (or whatever you want)
- Accept terms and click "Continue"
- Turn off Google Analytics (not needed for this) and click "Create project"

### 1.2 Get Your Firebase Credentials
- Click the Settings icon (⚙️) in the top-left
- Click "Project Settings"
- Scroll down to "Your apps" section
- Look for a Web app (if none exists, click "Add app" → "Web")
- Copy this code block:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

**Keep this handy.** You'll paste these values in Step 3.

---

## Step 2: Download & Setup Project

### 2.1 Get the Code
Either:
- **Option A:** Download as ZIP from GitHub/wherever you got this
- **Option B:** Clone with git:
  ```bash
  git clone <repo-url> fantasy-big-board
  cd fantasy-big-board
  ```

### 2.2 Install Node.js (if you don't have it)
- Go to https://nodejs.org
- Download the LTS version
- Install and verify with:
  ```bash
  node --version
  npm --version
  ```

### 2.3 Install Dependencies
```bash
npm install
```

This downloads all the code libraries. Takes 2-3 minutes.

---

## Step 3: Add Your Firebase Credentials

### 3.1 Create `.env.local` File
In your project folder (same level as `package.json`), create a new file called `.env.local`

**Windows:** Right-click → New File → Type the name
**Mac/Linux:** `touch .env.local`

### 3.2 Paste Your Credentials
Open `.env.local` and paste:

```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

**Replace `YOUR_...` with the actual values from Step 1.2**

Save the file.

---

## Step 4: Run Locally

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

Open **http://localhost:3000** in your browser. You should see the Big Board! 🎉

---

## Step 5: Test It Out

### 5.1 Add Some Ratings

1. Click "Owner A" in the nav bar
2. Go to "Evaluate"
3. Rate a few players (give them 5 stars!)
4. Click "Save Evaluation"
5. Advance to the next player

### 5.2 Switch Owners

1. Click "Owner B" in the nav bar
2. Go to "Evaluate" again
3. Rate the same players differently (maybe 3-4 stars?)
4. Save

### 5.3 See the Consensus

1. Go back to "Board"
2. You should see both ratings and the consensus score updating
3. Click a player to see the full details

---

## Step 6: Deploy (Make It Live)

### Option A: Firebase Hosting (Recommended, Easiest)

#### 6.1 Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### 6.2 Login to Firebase
```bash
firebase login
```

This opens your browser. Click "Allow" to authenticate.

#### 6.3 Initialize Hosting
```bash
firebase init hosting
```

Follow the prompts:
- Select your project (the one you created in Step 1)
- Public directory: `.next` (NOT `public`)
- Configure as SPA: `N`
- Overwrite? `N` (skip if .firebaserc exists)

#### 6.4 Build & Deploy
```bash
npm run build
firebase deploy
```

Your app will be live at:
```
https://your-project-id.firebaseapp.com
```

Share this link with your co-owner!

---

### Option B: Vercel (Also Easy)

#### 6.1 Create Vercel Account
- Go to https://vercel.com
- Click "Sign up"
- Use GitHub, GitLab, or email

#### 6.2 Deploy
```bash
npm install -g vercel
vercel
```

Follow prompts. It'll ask:
- Project name? Press Enter
- Scope? Press Enter
- Link to existing project? No
- Build command? Press Enter
- Output directory? Press Enter

Your app will be live at `your-app.vercel.app`

---

### Option C: Netlify

#### 6.1 Create Netlify Account
- Go to https://app.netlify.com
- Sign up with GitHub or email

#### 6.2 Deploy
```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

Your app will be live at `your-app.netlify.app`

---

## Step 7: Access on Multiple Devices

### Both Owners on Separate Browsers/Tabs
1. Owner A opens: https://your-app.firebaseapp.com
2. Owner B opens the SAME link in a different browser/tab
3. Owner A clicks "Owner A" in the nav
4. Owner B clicks "Owner B" in the nav
5. Both can evaluate independently!

**Real-time sync coming in Phase 2** — for now, refresh the page to see the other owner's updates.

---

## Step 8: Add Your Own Player Data

### 8.1 Get Your Player Data
- Export from your fantasy league
- Or use the sample players included

### 8.2 Format as CSV/JSON
Your data should have columns:
```
name, position, team, falklandRank, falklandScore, upside, dynastyRank, seasonRank, bustRisk, sos
```

### 8.3 Add to sampleData.ts
Edit `lib/sampleData.ts` and replace the sample players with yours:

```typescript
export const samplePlayers: Player[] = [
  {
    id: '1',
    name: 'Jahmyr Gibbs',
    position: 'RB',
    team: 'DET',
    falklandRank: 1,
    falklandScore: 98.5,
    upside: 98,
    dynastyRank: 1,
    seasonRank: 1,
    bustRisk: 1,
    sos: 3,
  },
  // Add more players here
];
```

---

## Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org

### "Firebase config not working"
- Check `.env.local` exists and has correct values
- Restart dev server (`Ctrl+C`, then `npm run dev`)

### "Port 3000 already in use"
- Use a different port:
  ```bash
  npm run dev -- -p 3001
  ```

### "Players not showing up"
- Check browser console (F12 → Console tab)
- Look for red errors

### "Owner B's ratings don't show up"
- Phase 1 uses local state. Refresh the page.
- Phase 2 will add real-time sync across browsers.

---

## Next Steps

1. **Customize the player list** (Step 8)
2. **Invite your co-owner** to the live URL
3. **Rate players** independently
4. **Check the dashboards** to find disagreements and value

---

## Phase 2 Coming Soon

- ✅ Real-time sync (no more page refreshes)
- ✅ Live draft integration (ESPN, Sleeper, Yahoo)
- ✅ Configurable algorithm weights
- ✅ Historical ranking tracking
- ✅ Mobile optimization

---

**Questions?** Check the main README.md or reach out!
