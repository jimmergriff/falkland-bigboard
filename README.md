# 🏆 Fantasy Big Board

A collaborative fantasy football ranking application where two co-owners independently evaluate players, combine their opinions into a shared big board, and get real-time recommendations during draft day.

## ✨ Features (Phase 1)

- **Independent Player Evaluation** — Each owner rates players 1-5 without influencing the other
- **Consensus Ranking** — Automatically combines ratings into a unified ranking
- **Live Big Board** — Real-time updates as evaluations are saved
- **Smart Filters** — Sort by position, rank, consensus, disagreement, and Falkland comparison
- **Player Details** — See full evaluation history and comparison metrics
- **Dashboards** — View "Our Guys," "Disagreements," "Risers," and more

## 🚀 Quick Start

### 1. Setup Firebase (Free)

1. Go to https://console.firebase.google.com
2. Create a new project (name it anything, e.g., "Fantasy Big Board")
3. Accept all defaults and wait for project creation
4. Go to Project Settings (gear icon)
5. Copy these values:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### 2. Clone & Configure

```bash
# Copy the project (or download as zip)
cd fantasy-big-board

# Create environment file
cp .env.example .env.local
# OR create .env.local with these lines:
# NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
# NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Install dependencies
npm install

# Run development server
npm run dev
```

3. Open http://localhost:3000 in your browser

### 3. Start Using

1. **Select Owner** — Choose "Owner A" or "Owner B" from the navigation bar
2. **Evaluate Players** — Go to "Evaluate" and rate players using the card interface
3. **View Rankings** — Head to "Board" to see the live Big Board
4. **Check Insights** — Go to "Dashboards" to see strategic summaries

## 📊 How It Works

### The Big Board Algorithm

```
Our Rank Score = (45% × Falkland Model) + (40% × Owner Consensus) + (15% × Owner Agreement)
```

Where:
- **Falkland Model** = Baseline expert ranking (doesn't change)
- **Owner Consensus** = Average of both owners' ratings (0-100)
- **Owner Agreement** = How close the two ratings are (0-100)

All weights are configurable in the app settings (coming in Phase 2).

### Real-Time Updates

The app uses React state management (Zustand) for instant updates. As soon as one owner saves an evaluation, the Big Board recalculates and refreshes — no page reload needed.

**Phase 2 will add Firebase Realtime Database so both owners see updates live across browser tabs.**

## 🎮 Workflow

### Before Draft

1. **Owner A** goes to `/evaluate` and rates all players
2. **Owner B** goes to `/evaluate` (on a different browser/window) and rates all players independently
3. Both check `/dashboards` to:
   - See consensus ("Our Guys")
   - Identify disagreements ("⚔️ Biggest Disagreements")
   - Find value ("🚀 Biggest Risers" vs Falkland)
   - Spot potential ("📈 Highest Potential")

### During Draft

- **Phase 2/3 feature** — When draft starts, a live draft dashboard will show:
  - Available players ranked by our Big Board
  - Real-time updates as players are picked
  - Recommended next picks

## 🏗️ Project Structure

```
fantasy-big-board/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Big Board (home)
│   ├── evaluate/           # Player evaluation page
│   ├── dashboards/         # Insights & analytics
│   ├── player/[id]/        # Player detail page
│   └── globals.css
├── components/
│   ├── Navigation.tsx      # Top nav bar
│   ├── BigBoard.tsx        # Ranking table
│   └── PlayerEvaluationCard.tsx  # Rating interface
├── lib/
│   ├── firebase.ts         # Firebase config
│   ├── store.ts            # Zustand state management
│   ├── types.ts            # TypeScript types
│   └── sampleData.ts       # Demo players
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 📈 What's Coming (Phases 2-6)

### Phase 2 — Real-Time Sync
- Firebase Realtime Database integration
- Both owners see updates live
- No more page refreshes

### Phase 3 — Advanced Consensus
- Configurable algorithm weights
- More sophisticated scoring
- Historical rank tracking

### Phase 4 — Draft Mode
- Live league sync with ESPN/Sleeper/Yahoo
- Real-time draft picks
- Smart recommendations based on team needs

### Phase 5 — More Dashboards
- "Highest Potential" rankings
- "Bust Concerns" highlights
- Position-specific analysis

### Phase 6 — External Data
- Current ADP (Average Draft Position)
- Expert rankings comparison
- Injury updates
- Live projections

## 🔧 Customization

### Import Your Own Players

Replace `/lib/sampleData.ts` with your own player data:

```typescript
export const samplePlayers: Player[] = [
  {
    id: '1',
    name: 'Player Name',
    position: 'QB', // QB, RB, WR, TE, K, DST
    team: 'NFL Team',
    falklandRank: 1,
    falklandScore: 95.5,
    upside: 98,
    dynastyRank: 1,
    seasonRank: 1,
    bustRisk: 1, // 1-5
    sos: 3, // 1-5
  },
  // ... more players
];
```

### Change Algorithm Weights

In Phase 2, you'll be able to adjust weights in-app. For now, edit `lib/store.ts`:

```typescript
weights: {
  falklandWeight: 45,  // ← Change this
  consensusWeight: 40, // ← Or this
  agreementWeight: 15, // ← Or this
},
```

## 📱 Features by Page

### 🏆 Big Board (`/`)
- Sortable rankings table
- Position filters
- Consensus/agreement metrics
- Click any player for details

### 📝 Evaluate (`/evaluate`)
- Swipe-style card interface
- 1-5 star ratings
- Potential rating
- Keep/Trade/Cut status
- Reason tags
- Optional notes
- Progress tracking

### 📊 Dashboards (`/dashboards`)
- ❤️ Our Guys (high consensus)
- ⚔️ Biggest Disagreements (owner conflicts)
- 🚀 Biggest Risers (vs Falkland)
- 📉 Biggest Fallers (vs Falkland)
- 💎 Sleepers (undervalued)

### 👤 Player Detail (`/player/:id`)
- Full player stats
- Falkland comparison
- Each owner's evaluation
- Consensus analysis
- Agreement metrics

## 🌐 Deployment (Free)

### Option 1: Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

Your app will be live at `projectname.firebaseapp.com`

### Option 2: Vercel
```bash
npm install -g vercel
vercel
```

Your app will be live at `your-app.vercel.app`

### Option 3: Netlify
```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

## 🐛 Troubleshooting

**"Players not loading"**
- Check that `sampleData.ts` is imported in `app/page.tsx`
- Verify Firebase config in `lib/firebase.ts`

**"Nothing happens when I rate players"**
- Make sure you selected an owner in the nav bar
- Check browser console for errors (F12)

**"Big Board not updating"**
- Phase 1 uses local state — refresh the page manually
- Phase 2 will add real-time updates

## 📝 License

MIT

## 🤝 Contributing

This is a working prototype. To extend it:

1. Add your player data to `lib/sampleData.ts`
2. Customize weights in `lib/store.ts`
3. Deploy and start evaluating!

---

**Ready to build your big board? Start at http://localhost:3000** 🚀
