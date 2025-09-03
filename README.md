# Sobeys Wheel (React Native + Firebase)

A demo mobile app implementing a **server-authoritative “Sobeys Wheel” game**.  
Built with **React Native (TypeScript)** and **Firebase (Firestore, Functions, Auth, Emulator Suite)**.  
This project was created as a **48-hour take-home assignment**.

---

##  Requirements Coverage

- ✅ **8 segments** loaded from Firestore config
- ✅ **Server-authoritative spin** (Cloud Function decides result)
- ✅ **Wheel animation** matches server result
- ✅ **Spins saved** in Firestore (id, prize, timestamp)
- ✅ **History screen** with past spins
- ✅ **Cooldown** enforced by server (client only shows countdown)
- ✅ **Local dev** with Firebase Emulator Suite + seed script
- ✅ **Security rules** restrict writes from client

---

## Setup & Run

### 1. Prerequisites
- Node.js 18+
- Yarn or npm
- Firebase CLI:
  ```bash
    npm install -g firebase-tools
    firebase login
  ```
- Xcode (iOS) / Android Studio (Android)

### 2. Install dependencies
#### Frontend
```bash
  cd frontend
  npm install
```

#### Firebase functions
```bash
  cd ../firebase/functions
  npm install
```
### 3. Start Firebase emulators
```bash
  cd ../
  npx firebase-tools emulators:start --project demo-sobeys-wheel
```
Ports:
- Firestore: 8080
- Functions: 5001
- Auth: 9099
- Emulator UI: 4000

### 4. Seed Firestore config
```bash
  npm run seed
```
This writes a document at wheelConfig/config with:
- 8 segments
- labels, prizes, weights
- cooldown (default: 60s)

### 5. Run React Native app
In a new terminal:
```bash
  cd ../../frontend
  npm run start
```
Then in another terminal:
```bash
  npm run ios   # for iOS simulator
  # or
  npm run android  # for Android emulator
```
---
## Cloud Functions

### spinWheel
#### Input
```ts
  {
    clientRequestId: string
  }
```
#### Output
```ts
  // Success
  {
    status: 'OK';
    spinId: string;
    segmentIndex: number;
    prize: Prize;
    label: string;
    timestamp: number;
    remainingMs: number;
  }

  // Cooldown
  {
    status: "COOLDOWN";
    remainingMs: number;
  }
```
#### Behavior:
- Idempotent by clientRequestId
- Weighted random (crypto RNG)
- Cooldown enforced on server
- Spin written under `users/{userId}/spins/{spinId}`

### getHistory
- Returns last 50 spins for the user, normalized with timestamps in epoch ms.

### getCooldown
- Returns current cooldown state for the signed-in user, used at mount time to disable the spin button immediately.
---
## Firestore Security Rules
- `wheelConfig/*` → read allowed, write denied
- `users/{userId}/spins/{spinId}` → read only by owner, write denied

All spins must be created by the Cloud Function.

---
## Frontend Screens
- `Wheel` → Spin button, wheel animation, reward modal
- `History` → Past spins, pull-to-refresh
- `Settings` → Screen with login/sign-out buttons, information about the app
- `Auth` → Placeholder login/sign-out screen (no real auth implemented, just simulates opening WebView to Sobeys `login/sign-out` page

---
## Assumptions & Trade-offs
- Anonymous auth only (for simplicity)
- Config always has 8 segments (validated at runtime)
- Client never writes spins — only Cloud Function
- Cooldown enforced via server timestamps (prevents cheating by device time)
- Error codes mapped to user-friendly messages

---

## Demo Walkthrough
1. Launch the app
- The user is automatically signed in with Firebase Anonymous Auth.
- The session persists: even after restarting the app, the user remains signed in.
- If the app’s storage is fully cleared, a new anonymous account is created.
2.	Spin the Wheel
- The main screen shows an animated 8-segment wheel loaded from Firestore.
- When tapping Spin:
  - The client calls the spinWheel Cloud Function.
  - The server selects a segment (weighted random) and returns the result.
  - The wheel smoothly animates and stops exactly on the chosen segment.
  - A Reward Modal is displayed with prize details.
3.	Cooldown enforcement
- After a spin, the Spin button is automatically disabled and displays:
`Next spin in {N}s`
- This means the user cannot tap the button at all while the cooldown is active.
- This approach differs from the assignment’s UX hint (where cooldown was detected only after tapping). It provides a clearer user experience: the timer is visible immediately, without “surprise” error messages.
4. History screen
- A separate tab lists the user’s past spins.
- Each entry shows: timestamp, label, and prize.
- The history updates in real time via Firestore onSnapshot.
- Pull-to-refresh is also supported through React Query refetch.
5. Cross-platform consistency
- iOS and Android behave the same: spin animation, cooldown, anonymous auth, and history are synchronized through Firebase.
- Cooldown is always calculated on the server, which prevents users from bypassing limits by changing their device time.
