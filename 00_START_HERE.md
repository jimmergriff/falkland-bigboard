# ⚡ QUICK START — Read This First

**5 minutes to get your Fantasy Big Board running.**

---

## What You're Getting

✅ **173 Fantasy Players** from your Excel file  
✅ **All Stats:** Rankings, bye weeks, QB info, offensive line analysis  
✅ **Evaluation System:** Rate players independently with your co-owner  
✅ **Live Big Board:** See rankings update in real-time  
✅ **Dashboards:** "Our Guys," "Disagreements," "Risers," etc.  

**Cost:** $0 forever  
**Setup Time:** 10 minutes  
**Technical Skill Needed:** None (just copy-paste)  

---

## The 3-Step Setup

### STEP 1: Copy Files to Your Computer (2 minutes)

**Your target folder:** `C:\Users\Dad\Documents\FalklandTest`

I'll give you a ZIP file with everything. Just:
1. Unzip it
2. Move everything to `C:\Users\Dad\Documents\FalklandTest`

**Done!**

---

### STEP 2: Install Requirements (5 minutes)

**Install Node.js** (one-time, forever):
1. Go to: https://nodejs.org
2. Download: **LTS version** (left button)
3. Install it (keep clicking Next)
4. Restart your computer

---

### STEP 3: Run It (2 minutes)

**Open Command Prompt:**
1. Press Windows Key + R
2. Type `cmd` and press Enter

**In the Command Prompt, type:**
```
cd C:\Users\Dad\Documents\FalklandTest
npm install
npm run dev
```

**Wait for this message:**
```
▲ Next.js 14.0.0
  - Local:        http://localhost:3000
```

**Open your browser:**
- Go to: http://localhost:3000
- 🎉 Your app is running!

---

## Try It Out

1. Click **"Owner A"** in top-right
2. Click **"Evaluate"**
3. **Rate a player** (give them 5 stars)
4. Click **"Save Evaluation"**
5. Go back to **"Board"** — see your rating!

---

## Optional: Store Data Permanently (Firebase)

Right now, ratings disappear when you refresh. To make them permanent:

1. Go to: https://console.firebase.google.com (sign in with your Google account)
2. Create a new project
3. Copy your Firebase credentials
4. Open `C:\Users\Dad\Documents\FalklandTest\.env.local`
5. Paste the credentials
6. Restart `npm run dev`

**Done!** Data now saves forever.

Full instructions: Read **FIREBASE_SETUP.md**

---

## File Guide

| File | What It Is |
|------|-----------|
| **WINDOWS_COPY_INSTRUCTIONS.md** | Step-by-step copy instructions |
| **FIREBASE_SETUP.md** | How to connect Firebase (optional) |
| **FOLDER_STRUCTURE.md** | What folders/files you need |
| **README.md** | Full feature overview |
| **SETUP_GUIDE.md** | Detailed setup walkthrough |

---

## Troubleshooting

### "npm: command not found"
→ Install Node.js from https://nodejs.org

### "Port 3000 already in use"
→ Use a different port: `npm run dev -- -p 3001`

### "Players not showing"
→ Make sure `lib/enrichedPlayers.ts` exists in your folder

### "Nothing works"
→ Restart everything:
   - Press Ctrl+C to stop the app
   - Close Command Prompt
   - Open a new Command Prompt
   - Run: `npm run dev`

---

## Your Data

**173 Fantasy Players** including:
- Falkland rankings & scores
- Upside index, dynasty rank, season rank
- Bye weeks, projected QB starters
- **Offensive line analysis** (Sharp rank, avg rank, notes)
- Bust risk, strength of schedule

All searchable and filterable by position.

---

## What's Next?

### For Using the App:
1. ✅ Setup (this doc)
2. ✅ Copy files
3. ✅ Run `npm install && npm run dev`
4. ✅ Rate players
5. ✅ Check dashboards
6. ✅ Share with co-owner

### For Adding Firebase:
1. Read **FIREBASE_SETUP.md**
2. Create Firebase project
3. Add credentials to `.env.local`
4. Restart app
5. Data persists & syncs

### For Deploying Live:
1. Read **README.md** (Deployment section)
2. Deploy to Firebase Hosting, Vercel, or Netlify
3. Share the live URL with your co-owner

---

## Questions?

**Most common questions:**

**Q: Do I need to pay?**  
A: No. Everything is free. Firebase free tier is more than enough.

**Q: Can my co-owner see my ratings?**  
A: Yes, if you add Firebase. Without it, you need to sync manually.

**Q: Will I lose my ratings if I close the app?**  
A: Yes, unless you add Firebase. Then they save forever.

**Q: Can I add more players?**  
A: Yes! Just update `lib/enrichedPlayers.ts` with new data.

**Q: Does this work on my phone?**  
A: Yes, if you deploy to Firebase/Vercel/Netlify. Locally it's computer-only.

---

## The Command Cheat Sheet

```bash
# Copy to your folder
cd C:\Users\Dad\Documents\FalklandTest

# First time setup
npm install

# Start the app
npm run dev

# Stop the app
Ctrl + C

# Use different port
npm run dev -- -p 3001

# Build for production
npm run build
```

---

## You're Ready! 🚀

1. **Get the ZIP file** (I'll send it)
2. **Extract to:** C:\Users\Dad\Documents\FalklandTest
3. **Open Command Prompt**
4. **Run:** `cd C:\Users\Dad\Documents\FalklandTest && npm install && npm run dev`
5. **Go to:** http://localhost:3000

**That's it.** Your Fantasy Big Board is live. 🏆

---

**Next Steps:**
- Copy files
- Run npm install
- Start the app
- Rate some players
- Check the dashboards

Questions? I'm here! 🎉
