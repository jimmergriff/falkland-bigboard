# 🚀 Copy Project to Your Computer — Windows Instructions

## The Easiest Way (Copy-Paste)

Follow these steps exactly:

---

## Step 1: Download the Project Files

I'll provide you with a ZIP file containing everything. 

**Option A: I Email You the ZIP**
- Wait for the ZIP file
- Unzip it to: `C:\Users\Dad\Documents\FalklandTest`
- Skip to Step 3

**Option B: You Download Manually**
- Go to the GitHub/source where the files are
- Click "Download ZIP"
- Unzip to: `C:\Users\Dad\Documents\FalklandTest`
- Skip to Step 3

---

## Step 2: If Copying Manually

If you need to copy files yourself:

### 2A: Create the Folder
1. Open File Explorer
2. Go to: `C:\Users\Dad\Documents`
3. Right-click → New Folder
4. Name it: `FalklandTest`

### 2B: Copy Files
You need these folders:
```
app/
components/
lib/
public/
```

And these files:
```
package.json
tsconfig.json
tailwind.config.ts
postcss.config.js
next.config.ts
.gitignore
.env.example
README.md
SETUP_GUIDE.md
FIREBASE_SETUP.md
PHASE_1_SUMMARY.md
```

Just drag-and-drop them into `C:\Users\Dad\Documents\FalklandTest`

---

## Step 3: Open Command Prompt

1. Press **Windows Key + R**
2. Type: `cmd`
3. Press Enter

You should see a black window with white text.

---

## Step 4: Navigate to Your Project

In the Command Prompt, type:
```
cd C:\Users\Dad\Documents\FalklandTest
```

Press Enter.

You should see:
```
C:\Users\Dad\Documents\FalklandTest>
```

---

## Step 5: Install Node Packages

Type this command:
```
npm install
```

Press Enter and wait (takes 2-5 minutes).

You'll see lots of text downloading packages. **Just wait.**

When it's done, you'll see:
```
added XXX packages in Xs
```

---

## Step 6: Start Your App

Type:
```
npm run dev
```

Press Enter.

You should see something like:
```
▲ Next.js 14.0.0
  - Local:        http://localhost:3000
```

---

## Step 7: Open in Browser

1. Open **Google Chrome** or **Microsoft Edge**
2. Go to: `http://localhost:3000`
3. You should see your **Fantasy Big Board**! 🎉

---

## Done!

Your app is running. Now:
- Click "Owner A" in the top-right
- Go to "Evaluate"
- Rate some players
- See them appear on the Board

---

## To Stop the App

In the Command Prompt:
- Press **Ctrl + C**
- Type **Y** and press Enter

---

## To Start It Again

In Command Prompt:
```
cd C:\Users\Dad\Documents\FalklandTest
npm run dev
```

---

## Troubleshooting

### "npm: command not found"
**Fix:** Install Node.js from https://nodejs.org (LTS version)
- Install it
- Restart your computer
- Try again

### "Port 3000 in use"
**Fix:** Use a different port:
```
npm run dev -- -p 3001
```
Then go to: `http://localhost:3001`

### "Cannot find module"
**Fix:** Make sure you're in the right folder
```
cd C:\Users\Dad\Documents\FalklandTest
npm install
```

---

## Next: Add Firebase (Optional)

Once everything works, follow **FIREBASE_SETUP.md** to:
- Store your ratings permanently
- Share data with your co-owner
- Access from anywhere

---

**That's it!** Questions? I'm here to help. 🏆
