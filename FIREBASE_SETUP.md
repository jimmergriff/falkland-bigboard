# 🚀 Simple Setup Guide — For Non-Technical People

Your Fantasy Big Board is ready to use with **173 players** from your Excel file, plus OL analysis, bye weeks, QB info, and more.

This guide explains how to set it up in plain English.

---

## What You Have

✅ **Your app** with:
- 173 fantasy players (your Excel data)
- All stats: Falkland rankings, upside, dynasty rank, etc.
- **NEW:** Offensive line data, bye weeks, QB starters
- Evaluation interface for you and your friend
- Real-time Big Board

---

## Step 1: Download Everything (2 minutes)

You have two options:

### Option A: I Email It To You
I'll send you a ZIP file with everything. 
- Unzip it to a folder on your computer
- Go to Step 2

### Option B: Clone from GitHub
(Only if you use Git — skip if Option A is easier)

---

## Step 2: Install Node.js (5 minutes, one-time)

**Why?** Your computer needs this to run the app.

1. Go to: https://nodejs.org
2. Click **"Download LTS"** (green button, left side)
3. Install it (just keep clicking "Next" → "Install")
4. Restart your computer

**Test it worked:**
- Open Command Prompt or Terminal
- Type: `node --version`
- Should show something like `v18.0.0`

---

## Step 3: Run Your App (5 minutes)

1. **Open Command Prompt or Terminal**
   - Windows: Search "cmd"
   - Mac: Search "Terminal"

2. **Go to your app folder:**
   ```
   cd C:\Users\YourName\Downloads\fantasy-big-board
   ```
   (Replace with wherever you saved it)

3. **Install dependencies (first time only):**
   ```
   npm install
   ```
   This takes ~2 minutes. Just wait.

4. **Start the app:**
   ```
   npm run dev
   ```

5. **Open in browser:**
   - Go to: http://localhost:3000
   - You should see your Big Board! 🎉

---

## Step 4: Test It (5 minutes)

1. **Select Owner A** (click in top-right nav)
2. **Go to "Evaluate"**
3. **Rate a player** (give them 5 stars)
4. **Click "Save Evaluation"**
5. **Go back to "Board"** — you should see the rating updated!
6. **Repeat** with "Owner B" and rate differently

---

## Step 5: Add Firebase (Store Your Data) — Optional

Right now, your ratings only save in your browser. If you refresh, they're gone.

**To make them permanent:**

### 5A: Create Firebase Account (Free)

1. Go to: https://console.firebase.google.com
2. Click **"Create a project"**
3. Name it "Fantasy Big Board"
4. Turn off Google Analytics (not needed)
5. Click **"Create project"** and wait

### 5B: Get Your Credentials

1. In Firebase, click the ⚙️ (Settings) icon
2. Click **"Project Settings"**
3. Scroll down to **"Your apps"**
4. Look for the **Web app code**
5. Copy these 6 values:
   ```
   apiKey
   authDomain
   projectId
   storageBucket
   messagingSenderId
   appId
   ```

### 5C: Add to Your App

1. Find `.env.local` in your app folder (if it doesn't exist, create it)
2. Paste this, replacing `YOUR_...` with the values you copied:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_apiKey
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_authDomain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_projectId
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_storageBucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_messagingSenderId
   NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_appId
   ```

3. **Save the file**

### 5D: Restart Your App

- Stop the app: Press `Ctrl+C` in the terminal
- Start again: `npm run dev`

**That's it!** Your ratings now save permanently in Firebase (Google's cloud).

---

## Step 6: Share with Your Co-Owner (5 minutes)

### If You Only Use It Locally (No Firebase):
1. Your friend opens their command prompt
2. Runs `npm install` and `npm run dev`
3. They access it at http://localhost:3000 on their computer
4. **Problem:** You can't see each other's ratings in real-time
5. **Solution:** Manual sync (you tell each other your ratings)

### If You Use Firebase:
1. You both access: http://localhost:3000 (or deploy to live URL)
2. Owner A rates players
3. Owner B rates same players
4. **You see each other's ratings automatically** (because Firebase syncs)

---

## Step 7: Deploy Live (Optional, 5 minutes)

Want to access from anywhere? Deploy it.

### Firebase Hosting (Free, Easiest):

1. **Install Firebase CLI:**
   ```
   npm install -g firebase-tools
   ```

2. **Login:**
   ```
   firebase login
   ```
   (Opens browser, click "Allow")

3. **Setup hosting:**
   ```
   firebase init hosting
   ```
   When it asks questions:
   - Select your Firebase project
   - Public directory: `.next`
   - Single-page app? No

4. **Deploy:**
   ```
   npm run build
   firebase deploy
   ```

5. **Done!** Your app is live at:
   ```
   https://your-project-id.firebaseapp.com
   ```

   Share this link with your co-owner!

---

## Troubleshooting

### "npm: command not found"
**Solution:** Install Node.js (Step 2). Then restart your computer.

### "Port 3000 already in use"
**Solution:** Use a different port:
```
npm run dev -- -p 3001
```

### "Cannot find module"
**Solution:** Run `npm install` again

### "Players not showing up"
**Solution:** 
- Check that `enrichedPlayers.ts` exists in `/lib/` folder
- Restart the app: `Ctrl+C` then `npm run dev`

### "Firebase not working"
**Solution:**
- Double-check your `.env.local` file has the right values
- Make sure there are no extra spaces or quotes
- Restart the app

---

## Your Data Is Rich Now

Your player data now includes:

| Field | Example |
|-------|---------|
| Falkland Rank | #1 |
| Falkland Score | 1056.25 |
| Upside Index | 100 |
| Bust Risk | 1/5 |
| Bye Week | Week 6 |
| QB Starter | Jared Goff |
| OL Rank (Sharp) | #14 |
| OL Rank (Avg) | #13.6 |
| OL Notes | "Significant changes, retooling year" |

When you click a player on the Big Board, you'll see **all this data** plus **both owners' evaluations**.

---

## Next Steps

1. ✅ Run the app locally
2. ✅ Rate some players (both of you)
3. ✅ Check the "Board" and "Dashboards"
4. ✅ Add Firebase when you're ready (optional)
5. ✅ Deploy live (optional)

---

## Questions?

- **"How do I update player data?"**
  - Edit `lib/enrichedPlayers.ts` or ask me to add your new Excel file

- **"Can I add more stats?"**
  - Yes! Send me your data and I'll add it

- **"Will this cost money?"**
  - No. Firebase free tier is enough for 2 people

- **"What if there's a bug?"**
  - It's a working prototype. Minor issues may happen. Just refresh the page or restart the app.

---

**Ready? Open your terminal and run:**
```bash
npm install
npm run dev
```

Then go to http://localhost:3000

Your Fantasy Big Board is ready! 🏆
